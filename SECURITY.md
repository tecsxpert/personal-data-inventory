# SECURITY.md — Tool-46 Personal Data Inventory
**AI Developer 3 | Sprint: 14 April – 9 May 2026**

---

## Executive Summary

Tool-46 implements a defence-in-depth security strategy across all layers of the stack. Key controls include:

- **JWT Role-Based Access Control** (Spring Security) — all Java backend endpoints require a valid JWT; ADMIN / MANAGER / VIEWER roles enforced via `@PreAuthorize`.
- **Input Sanitisation** (Flask middleware) — HTML tags are stripped; prompt-injection patterns trigger HTTP 400 before reaching the AI model.
- **Rate Limiting** (flask-limiter) — 30 req/min globally, 10 req/min on `/generate-report`; breaches return HTTP 429 with `retry_after`.
- **Security Headers** (flask-talisman) — `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, Content Security Policy applied to all AI service responses.
- **PII Logging Filter** — emails and phone numbers are masked in all log output.
- **Zero Critical/High OWASP ZAP findings** confirmed after Day 12 remediation.

---

## 1. OWASP Top 10 Risks & Mitigations

### 1.1 Broken Object Level Authorization (BOLA)
- **Attack Scenario:** A logged-in user changes the ID in `GET /api/inventory/{id}` to access another user's personal data records.
- **Mitigation:** Service layer verifies authenticated user ownership before returning any resource. Spring Security `@PreAuthorize("@ownershipCheck.verify(#id, authentication)")` applied to sensitive endpoints.

### 1.2 Cryptographic Failures
- **Attack Scenario:** JWT secrets or passwords stored in plain text; database breach exposes credentials.
- **Mitigation:** BCrypt used for password hashing. JWT signed with HS256 key loaded from `${JWT_SECRET}` env variable. All production traffic over TLS.

### 1.3 Injection (SQL & Prompt)
- **Attack Scenario:** Attacker inputs SQL in a search field, or crafts "jailbreak" prompts via the AI panel to extract system prompt or bypass model constraints.
- **Mitigation:** JPA/Hibernate with parameterised queries prevents SQL injection. Flask `before_request` middleware strips HTML and rejects 10 prompt-injection patterns with HTTP 400.

### 1.4 Insecure Design (Rate Limit Exhaustion)
- **Attack Scenario:** Automated scripts spam `/generate-report`, exhausting the Groq free-tier quota and causing denial of service.
- **Mitigation:** `flask-limiter` enforces 10 req/min on `/generate-report` and 30 req/min globally. Java backend can add `BucketFilter` for additional throttling.

### 1.5 Security Misconfiguration
- **Attack Scenario:** Default credentials remain active; stack traces leaked to end users reveal implementation details.
- **Mitigation:** Spring Boot `@ControllerAdvice` returns generic JSON error bodies (no stack traces). All services require authentication. Flask-Talisman sets security headers. No default credentials in any service.

---

## 2. Tool-Specific Threat Model

### 2.1 Prompt Injection in AI Analysis
- **Attack Vector:** Malicious instructions embedded within data fields processed by `/describe`, `/recommend`, or `/categorise`.
- **Damage Potential:** High — AI could leak system prompts or generate harmful recommendations.
- **Mitigation:** `before_request` middleware in `app.py` matches 10 injection-pattern regexes and returns HTTP 400. System prompts use defensive framing ("Return ONLY valid JSON…").
- **Status:** ✅ RESOLVED

### 2.2 PII Leakage in AI Logs
- **Attack Vector:** Sensitive personal data logged in plain text during AI processing.
- **Damage Potential:** Medium — PII accessible to anyone with log access.
- **Mitigation:** `PIIFilter` in `app.py` masks email addresses and phone numbers in all log records before output.
- **Status:** ✅ RESOLVED

### 2.3 JWT Token Theft (XSS / Session Hijacking)
- **Attack Vector:** Stealing JWT from localStorage via XSS attack.
- **Damage Potential:** High — full account takeover.
- **Mitigation:** Flask-Talisman enforces strict CSP (`script-src 'self'`). Frontend should store JWT in `HttpOnly` cookies (recommended post-sprint). Spring Security validates token on every request.
- **Status:** ✅ MITIGATED (CSP in place; HttpOnly cookie migration planned post-sprint)

### 2.4 ChromaDB Data Leakage
- **Attack Vector:** Unauthorized access to ChromaDB instance exposes indexed document chunks.
- **Damage Potential:** Medium — internal knowledge base exposed.
- **Mitigation:** ChromaDB runs inside the Docker internal network only; not exposed on any external port. No ChromaDB authentication required internally (acceptable for MVP).
- **Status:** ✅ MITIGATED (network isolation)

### 2.5 Groq API Key Exposure
- **Attack Vector:** API key committed to GitHub or exposed in logs.
- **Damage Potential:** High — Groq quota exhausted; financial liability if paid tier.
- **Mitigation:** Key stored only in `.env` (gitignored). `PIIFilter` prevents key appearing in logs. `.env.example` contains placeholder only.
- **Status:** ✅ RESOLVED

---

## 3. Security Test Log

### Week 1 — Day 5
| Test | Result |
|------|--------|
| Empty input on all POST endpoints | ✅ PASS (HTTP 400) |
| SQL injection patterns (`'; DROP TABLE…`) | ✅ PASS (no crash, AI handles as text) |
| Prompt injection — "ignore previous instructions" | ✅ PASS (HTTP 400) |
| Prompt injection — "jailbreak" | ✅ PASS (HTTP 400) |
| HTML sanitisation — `<script>` stripped | ✅ PASS |

### Week 2 — Day 7 (ZAP Baseline Scan)
| Finding | Severity | Action |
|---------|----------|--------|
| Missing X-Content-Type-Options | Medium | Resolved Day 8 via flask-talisman |
| Missing X-Frame-Options | Medium | Resolved Day 8 via flask-talisman |
| Information exposure (stack traces) | Low | Resolved via @ControllerAdvice |

### Week 2 — Day 8 (ZAP Fixes)
- **flask-talisman** integrated; all security headers verified.
- Re-scan: zero Medium+ findings remaining.

### Week 2 — Day 9 (PII Audit)
- `PIIFilter` implemented; emails and phone numbers masked in all log output.
- Review of prompt templates: no raw PII passed to Groq API context.
- **Result:** No PII leakage detected in logs or prompts.

### Week 2 — Day 10 (Security Sign-off)
| Check | Status |
|-------|--------|
| JWT enforcement on all Java endpoints | ✅ Verified |
| Rate limiting (30 req/min default) | ✅ Verified |
| Rate limiting (10 req/min /generate-report) | ✅ Verified |
| Prompt injection rejection | ✅ Verified |
| **AI Developer 3 Week 2 sign-off** | ✅ SIGNED OFF |

### Week 3 — Day 11 (ZAP Active Scan)
- Full OWASP ZAP active scan completed.
- **Findings:** Zero Critical, Zero High. One Medium (CSP refinement needed).

### Week 3 — Day 12 (Final ZAP Fixes)
- CSP `default-src 'self'` configured via flask-talisman.
- Re-scan: **Zero Critical / Zero High** confirmed.

### Week 3 — Day 13 (Full Stack Security Test)
| Scenario | Expected | Result |
|----------|----------|--------|
| API call without JWT (Java backend) | HTTP 401 | ✅ PASS |
| API call with wrong role (Java backend) | HTTP 403 | ✅ PASS |
| XSS in text field → AI service | HTML stripped, no reflection | ✅ PASS |
| Rate limit breach on /generate-report | HTTP 429 + retry_after | ✅ PASS |
| Prompt injection attempt | HTTP 400 | ✅ PASS |

### Week 3 — Day 14 (Final Summary)
- All Week 1–3 tests passing.
- `test_security.py` — 18 tests, 100% pass rate (run with `pytest -v`).
- Zero P1/P2 security bugs remaining.

---

## 4. Residual Risks

| Risk | Level | Decision |
|------|-------|----------|
| JWT stored in localStorage (XSS risk) | Low | Accepted for MVP; HttpOnly cookie migration planned post-sprint |
| ChromaDB unauthenticated (internal only) | Low | Accepted for MVP; authentication planned post-sprint |
| Groq free-tier outages | Low | Fallback template responses implemented in all AI routes |

---

## 5. Final Security Checklist

- [x] No hardcoded secrets in any file (env vars only)
- [x] `.env` in `.gitignore` — never committed
- [x] All Groq calls wrapped in try-except with fallback
- [x] Input sanitisation middleware active on all POST endpoints
- [x] flask-limiter: 30/min default, 10/min on /generate-report
- [x] flask-talisman: X-Content-Type-Options, X-Frame-Options, CSP
- [x] PII logging filter applied
- [x] Zero ZAP Critical/High findings
- [x] 18 security tests passing (pytest)
- [x] AiServiceClient.java: 10s timeout, graceful null on error
- [x] SECURITY.md reviewed and approved by all team members

**Team Sign-off:**
- AI Developer 3: ✅ Approved — 9 May 2026
- AI Developer 1: ✅ Approved — 9 May 2026
- AI Developer 2: ✅ Approved — 9 May 2026
- Java Developer 1: ✅ Approved — 9 May 2026
- Java Developer 2: ✅ Approved — 9 May 2026
- Java Developer 3: ✅ Approved — 9 May 2026
- Security Reviewer: ✅ Approved — 9 May 2026

---

## 6. Demo Day Security Talking Points

1. **JWT RBAC** — Every Java API endpoint requires a valid JWT. Demonstrating 401 without token live.
2. **Rate Limiting** — `flask-limiter` blocks IPs exceeding 30 req/min (10 on reports). Demonstrating 429 response.
3. **Input Sanitisation** — HTML stripped; 10 prompt-injection patterns blocked with HTTP 400. Demonstrating live 400 on injection attempt.
4. **OWASP ZAP** — Zero Critical/High findings confirmed. Security headers (X-Content-Type-Options, X-Frame-Options, CSP) applied on all AI service responses.
