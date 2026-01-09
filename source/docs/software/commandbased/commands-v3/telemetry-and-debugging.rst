# Telemetry and Debugging

.. todo::
   This article covers using v3's telemetry features and debugging tools to understand and troubleshoot robot behavior. Good telemetry is essential for rapid iteration during competition.

## Telemetry Features

.. todo::
   Overview of telemetry features in v3. Cover:
   - Telemetry API and Epilogue compatibility (protobuf serialization)
   - Mechanism state visibility
   - Scheduler events: Detail the subtypes of `SchedulerEvent` and when they are emitted. Add event listeners to listen for them.
   - Command lifecycle events
   - Priority and interruption logging
   - How telemetry integrates with the scheduler

## Data Logging and Analysis

.. todo::
   Explain how v3 telemetry works with data logging and analysis tools. Cover:
   - Protobuf serialization for telemetry data
   - Integration with AdvantageScope for post-match analysis
   - Tracking command lifetimes and triggering events
   - Live or post-match analysis workflows
   - Publishing Mechanism state to Network Tables
   - Best practices for data logging

## Debugging Techniques

.. todo::
   Provide techniques for debugging v3 command-based code. Cover:
   - Using telemetry data to diagnose issues
   - Logging command lifecycle events
   - Tracing command execution flow
   - Debugging priority conflicts
   - Debugging requirement conflicts
   - Debugging trigger bindings that don't fire
   - Debugging commands that don't end/interrupt properly
   - Using simulation for debugging
   - Breakpoint debugging in IDEs (only in simulation or unit tests, not on running robots)
   - Common debugging patterns and workflows

## Logging Best Practices

.. todo::
   Explain best practices for logging in v3 projects. Cover:
   - What to log and when to log it
   - Logging levels and appropriate usage
   - WPILib DataLog integration
   - Logging command execution and state transitions
   - Logging Mechanism state and sensor readings
   - Logging errors and exceptions
   - Performance impact of logging
   - Log analysis tools and workflows
   - Competition-ready logging strategies (what to enable/disable)
   - Example logging patterns for commands and mechanisms
