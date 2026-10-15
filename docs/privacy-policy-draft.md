# Rankora Privacy, Data Rights & Audit Governance

Rankora is designed around developer consent, transparent algorithms, and user sovereignty over their professional data.

---

## 1. Principles of Data Collection
- **Least Privilege Access**: We only request public read scopes (or user-approved specific metadata) from integrations such as GitHub and Codeforces.
- **Token Security**: OAuth access tokens are encrypted at rest using AES-GCM-256 and rotated periodically.
- **Never Selling Scores**: We do not sell rankings, nor do we permit employers or sponsors to pay for score boosts or artificial visibility.

---

## 2. Developer Privacy Controls
1. **Public vs. Private Profiles**: Developers may switch their profile between `Public` (discoverable on leaderboards) and `Private` (accessible only via personal shared links).
2. **Compensation Range Privacy**: Market compensation benchmark views are **private by default**. They are never displayed on public cards unless explicitly enabled by the user.
3. **Private Repository Scanning**: Verification can be executed via local CLI agent without transferring source code to Rankora servers.

---

## 3. Data Portability & The Right to be Forgotten (GDPR & CCPA)
- **Instant Data Export**: Download complete records via `GET /api/v1/privacy/export` including raw signals, normalized evidence items, snapshots, and audit logs.
- **Account Deletion**: Complete purging of all personally identifiable records and disassociation of ranking snapshots via `DELETE /api/v1/privacy/account`.

---

## 4. Appeals & Tamper-Evident Score Audit
- If a developer believes an automated integration incorrectly parsed commit ownership or contest ratings, they can submit an appeal through the built-in dispute resolution flow.
- Every score calculation is recorded with algorithm version, timestamp, and immutable evidence references.
