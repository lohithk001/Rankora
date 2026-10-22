import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createRateLimiter } from '../internal/middleware/rateLimiter.js';
import { extractAuthUser, requireAuth, requireOwnership } from '../internal/middleware/auth.js';

describe('Rankora Backend Security & Row-Level Authorization Tests', () => {
  test('Rate Limiter allows requests under threshold and blocks on exceed', () => {
    const limiter = createRateLimiter({
      windowMs: 60 * 1000,
      max: 3,
      message: 'Rate limit test exceeded'
    });

    const mockReq = {
      headers: { 'x-forwarded-for': '192.168.1.100' },
      socket: { remoteAddress: '192.168.1.100' }
    };

    let nextCalls = 0;
    const mockNext = () => { nextCalls++; };

    let lastStatus = 200;
    let lastBody = null;
    const mockRes = {
      setHeader: () => {},
      status: (code) => {
        lastStatus = code;
        return {
          json: (body) => { lastBody = body; }
        };
      }
    };

    // 1st, 2nd, 3rd requests should pass
    limiter(mockReq, mockRes, mockNext);
    limiter(mockReq, mockRes, mockNext);
    limiter(mockReq, mockRes, mockNext);
    assert.strictEqual(nextCalls, 3);

    // 4th request must be rejected with 429
    limiter(mockReq, mockRes, mockNext);
    assert.strictEqual(lastStatus, 429);
    assert.strictEqual(lastBody.error.code, 'RATE_LIMIT_EXCEEDED');
  });

  test('extractAuthUser correctly extracts Bearer token and Clerk headers', () => {
    const req1 = { headers: { authorization: 'Bearer user_test_123' }, socket: {} };
    extractAuthUser(req1, {}, () => {});
    assert.deepStrictEqual(req1.auth, { userId: 'user_test_123' });

    const req2 = { headers: { 'x-clerk-user-id': 'clerk_usr_456' }, socket: {} };
    extractAuthUser(req2, {}, () => {});
    assert.deepStrictEqual(req2.auth, { userId: 'clerk_usr_456' });

    const req3 = { headers: {}, socket: {} };
    extractAuthUser(req3, {}, () => {});
    assert.strictEqual(req3.auth, null);
  });

  test('requireAuth rejects unauthenticated requests with 401', () => {
    const req = { auth: null };
    let status = null;
    let jsonBody = null;
    const res = {
      status: (c) => {
        status = c;
        return { json: (b) => { jsonBody = b; } };
      }
    };
    let nextCalled = false;

    requireAuth(req, res, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(status, 401);
    assert.strictEqual(jsonBody.error.code, 'UNAUTHORIZED');
  });

  test('requireOwnership blocks access when user attempts to act on someone else\'s profile', () => {
    const req = {
      auth: { userId: 'user_alice' },
      body: { clerkUserId: 'user_bob' }
    };
    let status = null;
    let jsonBody = null;
    const res = {
      status: (c) => {
        status = c;
        return { json: (b) => { jsonBody = b; } };
      }
    };
    let nextCalled = false;

    const ownershipMiddleware = requireOwnership(r => r.body.clerkUserId);
    ownershipMiddleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(status, 403);
    assert.strictEqual(jsonBody.error.code, 'FORBIDDEN');
  });

  test('requireOwnership allows access when user acts on their own profile', () => {
    const req = {
      auth: { userId: 'user_alice' },
      body: { clerkUserId: 'user_alice' }
    };
    let nextCalled = false;

    const ownershipMiddleware = requireOwnership(r => r.body.clerkUserId);
    ownershipMiddleware(req, {}, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
  });
});
