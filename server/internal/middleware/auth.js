/**
 * Row-Level Authentication & Authorization Middleware
 * Enforces ownership checks to prevent unauthorized access or mutation of user records.
 */

export function extractAuthUser(req, res, next) {
  const authHeader = req.headers.authorization;
  const clerkHeader = req.headers['x-clerk-user-id'];

  let userId = null;

  if (clerkHeader && typeof clerkHeader === 'string') {
    userId = clerkHeader.trim();
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace(/^Bearer\s+/, '').trim();
    // In production with Clerk, token is a JWT with sub claim.
    // If token has 3 parts (header.payload.signature), decode payload safely:
    if (token.includes('.')) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
          const payload = JSON.parse(payloadJson);
          userId = payload.sub || payload.userId || token;
        }
      } catch {
        userId = token;
      }
    } else {
      userId = token;
    }
  }

  req.auth = userId ? { userId } : null;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please sign in to perform this operation.'
      }
    });
  }
  next();
}

/**
 * Row-Level Authorization: verify that the caller is the owner of the requested resource.
 * targetExtractor is a function: (req) => targetUserId
 */
export function requireOwnership(targetExtractor) {
  return (req, res, next) => {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.'
        }
      });
    }

    const targetUserId = targetExtractor(req);
    if (!targetUserId) {
      return res.status(400).json({
        error: {
          code: 'BAD_REQUEST',
          message: 'Unable to resolve target resource owner.'
        }
      });
    }

    if (req.auth.userId !== targetUserId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Row-level access denied. You do not have permission to access or modify another user\'s profile or data.'
        }
      });
    }

    next();
  };
}
