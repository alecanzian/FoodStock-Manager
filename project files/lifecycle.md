# Checkpoint B: Lifecycle of the Food Stock Manager

## 1. SDLC
The Agile workflow is best operable for this type of project.
1. **Enter:** a need is noticed ("what's missing?") and recorded as a claim.
2. **Build:** a minimal shared stock list with scan (subtract) and restock (add), protected against lost updates.
3. **Test**: internal use and unite testing for reliability.
4. **Release:** the minimal version is given to the family, who all read and change the same list.
5. **Learn:** observe whether the list is checked before shopping and kept up to date, then revise the claim.

## 2. Fit
| Uncertainty | Risk | Implication |
|---|---|---|
| Problem: does the communication gap really cause forgotten or duplicate purchases? | High | Get user evidence early, before building the full system. |
| Solution: does the design handle simultaneous writes correctly (no lost updates, no negative quantity)? | Medium | Test as a separate technical experiment (race-condition test). |
| Delivery: no external dependency identified. The app runs on the family's devices and a shared store the team controls. Revisit if hosting or a third-party service is added. | Low | No action now. |
| Environment: will devices reach the shared store reliably? | Low for now | Monitor, do not build against it yet. |

**Choice: iterative and incremental.** The biggest unknown is the problem itself, so the first increment is the smallest useful list. It is revised by how the family uses it (iterative), and new capabilities are added only once it shows value (incremental). Plan-driven fits poorly because it commits to features before the problem is confirmed.

## 3. Flow (L06)
- **Item traced:** one shopping need, from the moment an item runs out to the moment the shared view shows it as restocked.
- **Entry:** the item is consumed or known to be low.
- **Completion boundary:** the item is bought and the shared view is updated. Lead time is measured between these two events only.
- **Active work:** scanning and restocking, which is short.
- **Waiting:** the time between running out and someone learning it is gone, plus the time until the next shopping trip. This is the hidden waiting the claim describes.
- **Handoffs:** from the person who uses the item to the person who shops. Each handoff moves context ("what is missing?") that can be lost, causing questions and rework.
- **Guardrail:** pair lead time with forgotten items and duplicate purchases, so a faster list is not counted as success if it causes new errors.

## 4. Feedback (L07)
**TO DO**

# Observations
Minimum Value Product MVP
Define team rules for writing code, review changes, documentation
Define the steps in you development lifecycle(QA, review, etc)