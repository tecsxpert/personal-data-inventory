# SECURITY.md - Tool-46 Personal Data Inventory

## 1. OWASP Top 10 Risks & Mitigations (Day 1)

### 1.1 Broken Object Level Authorization (BOLA)
*   **Attack Scenario:** A logged-in user changes the ID in a `GET /api/inventory/{id}` request to access another user's personal data records.
*   **Mitigation:** Implement checks in the service layer to ensure the authenticated user has ownership or appropriate permissions for the requested resource ID.

### 1.2 Cryptographic Failures
*   **Attack Scenario:** Sensitive PII (Personally Identifiable Information) or JWT secrets are stored in plain text or using weak hashing algorithms, allowing attackers to compromise data if the database is breached.
*   **Mitigation:** Use BCrypt for password hashing and ensure all sensitive data transmission is over TLS. Use strong, environment-variable-backed secrets for JWT signing.

### 1.3 Injection (SQL and Prompt Injection)
*   **Attack Scenario:** An attacker inputs malicious SQL in a search field or crafted "jailbreak" prompts in the AI interaction panels to bypass constraints or extract data from the LLM context.
*   **Mitigation:** Use JPA/Hibernate for SQL injection prevention. Implement input sanitization middleware in the AI service to detect and block common prompt injection patterns.

### 1.4 Insecure Design
*   **Attack Scenario:** Lack of rate limiting on the `/generate-report` endpoint allows an attacker to spam the AI service, exhausting Groq API credits and causing a denial of service (DoS).
*   **Mitigation:** Implement `flask-limiter` on the AI service and Spring Security rate limiting (if applicable) to throttle requests based on IP and user identity.

### 1.5 Security Misconfiguration
*   **Attack Scenario:** Default credentials are left active, or sensitive error messages (stack traces) are exposed to the end-user, revealing backend implementation details.
*   **Mitigation:** Use `@ControllerAdvice` to provide generic error responses. Ensure all services (Redis, PostgreSQL) require authentication and are not exposed to the public internet.

---

## 2. Tool-Specific Security Threats (Day 2)

### 2.1 Prompt Injection in AI Analysis
*   **Attack Vector:** Malicious instructions embedded within data fields processed by the `/describe` or `/recommend` endpoints.
*   **Damage Potential:** High - could lead to the AI leaking system prompts or providing malicious advice.
*   **Mitigation Plan:** Strict input sanitization in `app.py` middleware and robust system prompt design.

### 2.2 PII Leakage in AI Logs
*   **Attack Vector:** Sensitive personal data being logged in plain text by the Flask or Spring Boot services during AI processing.
*   **Damage Potential:** Medium - exposure of PII to anyone with access to logs.
*   **Mitigation Plan:** Implement a logging filter to mask PII or disable logging of request bodies in production.

## 3. Security Test Logs
*   **Week 1 (Day 5):**
    *   **Empty Input:** PASSED
    *   **SQL Injection Patterns:** PASSED
    *   **Prompt Injection Detection:** PASSED
    *   **HTML Sanitization:** PASSED
*   **Week 2 (Day 7 - Baseline Scan):**
    *   **Missing Security Headers:** Identified (Resolved Day 8)
    *   **Information Exposure:** Minimal (Stack traces suppressed)
    *   **Input Validation:** Robust on AI endpoints
*   **Week 2 (Day 8 - ZAP Fixes):**
    *   **Flask-Talisman Integrated:** Added X-Content-Type-Options, X-Frame-Options, and more.
    *   **Baseline Scan Re-run:** Security headers verified.
*   **Week 2 (Day 9 - PII Audit):**
    *   **Logging Filter:** Implemented `PIIFilter` to mask emails/phones in logs.
    *   **Audit Result:** No raw personal data found in automated logs or prompts.
*   **Week 2 (Day 10 - Security Sign-off):**
    *   **JWT Enforcement:** Verified by Java/Frontend team (integrated with Flask).
    *   **Rate Limiting:** Verified 30 req/min (default) and 10 req/min (/generate-report).
    *   **Injection Rejection:** Verified SQLi and Prompt Injection patterns are rejected.
    *   **Sign-off:** AI Developer 3 confirms Week 2 security requirements met.
*   **Week 3 (Day 11 - Active Scan):**
    *   **Full ZAP Active Scan:** COMPLETED.
    *   **Findings:** Zero Critical/High findings. Medium findings related to CSP (Handled Day 12).
*   **Week 3 (Day 12 - Final ZAP Fixes):**
    *   **Flask-Talisman Refinement:** CSP configured for production-readiness.
    *   **Re-scan:** Zero High/Critical findings confirmed.
*   **Week 3 (Day 13 - Full Stack Security Test):**
    *   **401 Unauthorized:** Verified for requests without tokens.
    *   **403 Forbidden:** Verified for incorrect role access.
    *   **XSS/Injection:** All AI endpoints reject malicious payloads.
    *   **Rate Limiting (429):** Verified throttling on /generate-report.
*   **Week 3 (Day 14 - Final Summary):**
    *   **Executive Summary:** Tool-46 implements multi-layered security including JWT RBAC, input sanitization, rate limiting, and secure headers.
    *   **Residual Risks:** Minor risks documented in Section 2 (PII in logs handled by filtering).
    *   **Team Sign-off:** AI Developer 3, Java Devs 1-3, Security Reviewer.
*   **Final Sign-off (Day 15 - Security Checklist):**
    *   **All PRs Reviewed:** COMPLETED (Security-first approach).
    *   **No Hardcoded Secrets:** COMPLETED (Using .env and ${ENV_VAR}).
    *   **All Tests Passing:** COMPLETED (100% pass rate in test_security.py).
    *   **ZAP Clean:** COMPLETED (Zero Critical/High findings).
    *   **Final Sign-off:** All 7 members acknowledge security readiness. Verified by Security Reviewer.

### 2.3 JWT Token Theft (XSS/Session Hijacking)
*   **Attack Vector:** Stealing the JWT from local storage via a Cross-Site Scripting (XSS) attack.
*   **Damage Potential:** High - full account takeover.
*   **Mitigation Plan:** Use `HttpOnly` and `Secure` cookies for JWT storage if possible, or implement strict Content Security Policy (CSP) headers.

### 2.4 Vector Database (ChromaDB) Data Leakage
*   **Attack Vector:** Unauthorized access to the ChromaDB instance, allowing retrieval of indexed document chunks.
*   **Damage Potential:** Medium - exposure of the internal knowledge base used for RAG.
*   **Mitigation Plan:** Ensure ChromaDB is only accessible via the internal network and requires authentication.

### 2.5 API Rate Limit Exhaustion (Groq)
*   **Attack Vector:** Automated scripts flooding the AI endpoints to reach the Groq free tier limit.
*   **Damage Potential:** Low (Service Disruption) - legitimate users cannot use AI features.
*   **Mitigation Plan:** Implement 30 req/min limit globally and 10 req/min for expensive report generation.



