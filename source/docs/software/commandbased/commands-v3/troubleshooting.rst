# Troubleshooting Commands v3

.. todo::
   This article covers common mistakes and their fixes when working with Commands v3. This serves as a quick reference for debugging common issues.

## Common Mistakes and Fixes

.. todo::
   **Forgetting yield():**
   - Symptom: robot freezes, becomes unresponsive
   - Fix: add ``coroutine.yield()`` in every loop

   **Using v2 and v3 together:**
   - Symptom: import errors, scheduler conflicts
   - Fix: choose one framework per project

   **Calling yield() in synchronized blocks:**
   - Symptom: exceptions, deadlocks
   - Fix: restructure code to avoid locks or use different synchronization

   **Wrong package imports:**
   - Symptom: cannot find Mechanism, Coroutine classes
   - Fix: use ``org.wpilib.commands3`` not ``commands2``

## Debugging Tips

.. todo::
   Provide general debugging guidance. Cover:
   - Using telemetry to track command lifecycle
   - Print debugging for command flow
   - Common error messages and their meaning
   - Using simulation for debugging
