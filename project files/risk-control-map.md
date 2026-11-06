# Risk-Control Map and Quality Evidence Template

## 1. Risk-control map

| Failure / actor | Risk judgment | Control / effort | Residual risk |
|---|---|---|---|
| Shared quantity overwritten (lost update)<br>**Actor:** family members updating the stock | **Likelihood:** ? (plausible in busy households; no observation yet)<br>**Impact:** medium (duplicate purchase or skipped item)<br>**Detection:** hard (no error shown)<br>**Recovery:** easy once noticed | Make updates relative and atomic (increment or decrement in the database), or use a version check that rejects stale writes. Test two concurrent updates on one item.<br>**Type:** design change plus test<br>**Effort:** estimate (moderate) | Conflicting edits with different intent still need a rule. The shopper bears any shortage. |
| Barcode not captured, or a different code read<br>**Actor:** person adding groceries, who believes the item is recorded | **Likelihood:** ? (depends on lighting, angle, camera)<br>**Impact:** low to medium (item missing from the view)<br>**Detection:** moderate if the app gives a clear result; hard if it fails silently<br>**Recovery:** easy once the failure is known | Show an explicit success or failure message after each scan, with the scanned code and name visible. Keep manual name entry as a fallback. Test with sample barcodes.<br>**Type:** non-test (feedback design) plus test<br>**Effort:** estimate (low) | A wrong but plausible code the user does not check still passes. The shopper bears any shortage. |
| Final quantity below zero accepted (rule enforced only in frontend or not atomic)<br>**Actor:** household member reading the stock level | Likelihood: low (single direct API requests are rejected when current + delta < 0; concurrent requests not yet tested)<br>Impact: medium (shown quantity hides a shortage)<br>Detection: hard<br>Recovery: easy once noticed | Enforce the rule in the backend and the database (conditional update or check constraint). Test boundary values 0 and -1 directly against the API, and two concurrent decrements of the last unit.<br>**Type:** test plus code review of enforcement<br>**Effort:** estimate (low) | Two removals arriving at the same time can both read the same quantity and both pass the check. The single-request result does not cover this. The shopper bears any shortage. |
| Duplicate or misapplied operation after a lost response (retry)<br>**Actor:** person adding or using items, who sees the wrong count | **Likelihood:** ? (depends on network and server stability)<br>**Impact:** medium to high for relative operations (add, use); low for absolute ones (set to value)<br>**Detection:** hard (the duplicate looks legitimate)<br>**Recovery:** moderate (cause is hidden) | Send a client-generated request ID with each write; the backend ignores repeated IDs (idempotency). Show "not saved" and "saved, response lost" as different states. Test by dropping the response in a proxy and retrying.<br>**Type:** design change plus test<br>**Effort:** estimate (moderate) | If the client does not know the database state before the retry, the outcome stays ambiguous until checked. The household bears any miscount. |
| No authentication or authorization<br>**Actor:** household members, and anyone who can reach the server | **Likelihood:** depends on network reach (low on home network only; higher if reachable from the internet)<br>**Impact:** high (privacy exposure; data can be altered)<br>**Detection:** hard (app looks normal)<br>**Recovery:** moderate (restore from a known-good state, if one exists) | Non-test scope decision: document which network can reach the server, restrict access to it (home network or VPN), and record why authentication is out of scope. Verify reachability from outside the network.<br>**Type:** non-test (scope decision and network restriction) plus verification<br>**Effort:** estimate (low to moderate) | Anyone on the network, or with the address, can still act. The household accepts this risk by choice and bears any exposure. |

Notes:
- "?" means unknown. Estimates are to be checked with the team.
- Every row needs a control. At least one control should be non-test (the barcode feedback and the access scope decision already are).
- Residual risk names the failure the control does not cover, and who would bear it.

Guidance:
- **Failure:** a plausible mechanism and consequence. Do not record one that has only been observed; observations go in section 2.
- **Affected actor:** the person or role harmed.
- **Likelihood:** the conditions under which the failure could occur, and the evidence that they are plausible. Use "?" if unknown.
- **Impact:** who is harmed and how seriously.
- **Detection:** how long the failure could go unnoticed while consequences accumulate.
- **Recovery:** how hard it would be to restore service, correct the result, or compensate the person.
- **Selected control:** prevent, detect, contain, or recover. Include at least one non-test control across the map (rows 2 and 5 already do).
- **Control effort:** the cost to design, execute and maintain it, including the other work it displaces.
- **Residual risk:** the failure the control does not cover, and the actor who would bear it.
---

## 2. Priority behavior for testing

Select one row from the map. Write it as a testable claim, not a general statement.

- **Row # from the map:** 3 - Final quantity below zero accepted 
- **Affected actor:** household member updating the stock level
- **Behavior (observable, with a condition):** A request that makaes the final updated quantity a negative value (current quantity + delta is below zero) is rejected, and the quantity is reverted to the original value.
- **Initial conditions / state:** an item with a known  strictly positive stored quantity (gretaer than 0)
- **Inputs:** direct API requests with delta values as in the table below
- **Expected result and its oracle:** the table below. Oracle: the team's rule that quantities cannot be negative.

| Current quantity | Delta | Expected response | Expected stored quantity |
|---|---|---|---|
| 1 | -1 | accepted | 0 |
| 2 | -1 | accepted | 1 |
| 2 | -2 | accepted | 0 |
| 2 | -3 | rejected | 2 |
| 0 | -1 | rejected | 0 |

- **Open cases for the team to decide:** non-integer deltas, if the API accepts them. Record the decision as part of the oracle.
- **Smallest sufficient boundary:** integration (API plus database), because the rule may be enforced only in the frontend
- **Side effects to check (absence matters too):** no other item changes; no history entry is created for a rejected request
- **Deliberate defect that the check should catch:** remove the backend check; the quantity-2, delta -3 case would store -1, and that case must fail
- **Check that exposes the defect (result):** to be recorded after running it
- **Repeatability:** isolated test database, reset to the stated quantity before each case
- **What this check still misses:** concurrent updates of the same item can affect this check. It means that this check is related to another check, which is the one that guarantees no lost updates

---

## 3. Review decision

- **Claim under review:** Quantities never go below zero, enforced by the backend.
- **Scope examined:** the decrement path only; not the scan path or the UI.
- **Counterexample tried:** two decrements of the last unit sent at the same time.
- **Risk if the claim is wrong:** a shown count hides a shortage.
- **Evidence supporting the expectation, and where the expectation came from:** the team's stated rule (quantity never negative).
- **Decision:** not yet made. Options: approve, revise, narrow, seek context.
- **Reason for the decision:**
- **Condition that would reopen the decision:** a direct API request succeeds with a negative result.

---

## 4. AI provenance

- **AI used in this project?** ____________________
- **What AI produced:**
- **Where AI output was checked against an independent basis** (agreed rule, team decision, trusted reference). Shared AI assumptions do not count as independent checks.
- **Corrections or rejections made, and why:**
- **If no AI was used:** state non-use explicitly.

---