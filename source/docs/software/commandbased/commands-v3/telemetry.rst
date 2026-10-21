# Telemetry with Commands

The commands library provides built-in support for telemetry and logging. This allows you to monitor the state of your commands and mechanisms in real time, which is invaluable for debugging unexpected cancellations, priority conflicts, stuck commands, and mode-transition cleanup.

## Protobuf Serialization

The ``Scheduler`` and its running commands can be serialized using Google Protocol Buffers (Protobuf). This is the primary way that command state is sent to external tools like AdvantageScope or the WPILib Dashboards.

The ``Scheduler`` implements the ``ProtobufSerializable`` interface, which means it can be sent over NetworkTables and logged using the ``ProtobufLogEntry`` API or :doc:`Epilogue <../../telemetry/robot-telemetry-with-annotations>` if assigned to a field in a logged class.

Scheduler state is a snapshot. It answers questions like "which commands are running right now?" and "which mechanisms do they require?" Scheduler events are a timeline. They answer questions like "why did this command stop?" and "what interrupted it?" In practice, teams often want both.

## Scheduler Events

The ``Scheduler`` emits events whenever something significant happens, such as a command being scheduled, mounted, yielding, completing, or being canceled. You can register an event listener to respond to these events via ``Scheduler.getDefault().addEventListener(Consumer<SchedulerEvent>)``.

Event listeners run as part of scheduler processing, so they should be short and nonblocking. Logging a small message is fine. Doing expensive formatting, file loading, network calls, or long calculations in an event listener can delay the scheduler just like expensive command code can.

### Event Types

All events implement the ``SchedulerEvent`` interface and include a ``timestampMicros()`` (measured in microseconds since robot start).

*   **Scheduled**: A command was added to the scheduler's "pending" set. This happens when a trigger is activated, a default command is queued, or ``Scheduler.schedule()`` is called manually.
*   **Mounted**: A running command's coroutine has been mounted and is about to execute until it yields or completes. This occurs every scheduler cycle for each running command.
*   **Yielded**: A running command called ``coroutine.yield()`` (or another yielding method like ``wait()``). It will remain in the running set and resume in the next cycle.
*   **Completed**: A command finished its execution naturally (the ``run()`` method returned).
*   **CompletedWithError**: A command encountered an unhandled exception. The event includes the ``Throwable`` error that caused the failure. An event listener can log this event, but the error will still be thrown and cause the program to crash.
*   **Interrupted**: A command was interrupted by another command. This event includes the ``interrupter`` command that caused the interruption.
*   **Canceled**: A command was removed from the scheduler without finishing naturally. This happens due to an interruption, a manual ``Scheduler.cancel()`` call, or because its enclosing scope exited.

### Event Ordering and Co-occurrence

Events often occur in specific sequences or together within the same scheduler cycle:

*   **Interruption and Cancellation**: When a command is interrupted, an ``Interrupted`` event is emitted immediately before the ``Canceled`` event.
*   **Initial Run**: When a command starts for the first time, you will see a ``Scheduled`` event, followed by a ``Mounted`` event when the command first gets CPU time.
*   **Natural Completion**: A command that finishes naturally will emit a ``Completed`` event. It does **not** emit a ``Canceled`` event.
*   **Errors**: If a command throws an exception, it emits a ``CompletedWithError`` event and is removed from the scheduler. It does **not** emit a ``Canceled`` event.

Do not treat every ``Canceled`` event as a bug. Commands are canceled when they are interrupted by newer or higher-priority commands, when their enclosing scope exits, when a ``whileTrue`` binding goes false, or when user code cancels them manually. The surrounding events and the command requirements usually tell you which case happened.

```java
import org.wpilib.command3.Scheduler;
import org.wpilib.command3.SchedulerEvent;

Scheduler.getDefault().addEventListener(event -> {
  if (event instanceof SchedulerEvent.Scheduled e) {
    System.out.println("Command " + e.command().name() + " was scheduled");
  } else if (event instanceof SchedulerEvent.Mounted e) {
    // Mounted events occur every cycle - we might not want to log them all!
    // System.out.println("Command " + e.command().name() + " mounted");
  } else if (event instanceof SchedulerEvent.Yielded e) {
    // System.out.println("Command " + e.command().name() + " yielded");
  } else if (event instanceof SchedulerEvent.Completed e) {
    System.out.println("Command " + e.command().name() + " completed naturally");
  } else if (event instanceof SchedulerEvent.CompletedWithError e) {
    System.err.println("Command " + e.command().name() + " failed with error: " + e.error());
  } else if (event instanceof SchedulerEvent.Interrupted e) {
    System.out.println("Command " + e.command().name() + " was interrupted by " + e.interrupter().name());
  } else if (event instanceof SchedulerEvent.Canceled e) {
    System.out.println("Command " + e.command().name() + " was canceled");
  }
});
```

## Data Logging

While printing to the console is useful for quick debugging, it is not recommended for persistent storage or deep analysis. For these cases, you should use the standard WPILib data logging APIs to save telemetry to a ``.wpilog`` file on the robot.

### Logging Scheduler Events

You can log individual scheduler events to a data log using a ``StringLogEntry``. This is particularly useful for tracking the exact sequence of command lifecycle events during a match. The event stream is often the fastest way to explain a command that "randomly stopped": look for an ``Interrupted`` event, then inspect the interrupter command and the mechanisms both commands required.

.. tab-set::

  .. tab-item:: Manual Data Logging
    :sync: datalog

    ```java
    import org.wpilib.command3.Scheduler;
    import org.wpilib.command3.SchedulerEvent;
    import org.wpilib.datalog.StringLogEntry;
    import org.wpilib.system.DataLogManager;

    // Create a log entry for scheduler events
    StringLogEntry eventLog = new StringLogEntry(DataLogManager.getLog(), "SchedulerEvents");

    // Register a listener to log every event
    Scheduler.getDefault().addEventListener(event -> {
      // Log the string representation of the event
      eventLog.append(event.toString());
    });
    ```

### Logging Scheduler State

Because the ``Scheduler`` class implements ``ProtobufSerializable``, you can log the entire state of the scheduler, including running commands and their mechanisms, using a ``ProtobufLogEntry``. This allows tools like AdvantageScope to visualize the state of the command scheduler over time. Epilogue supports logging protobuf-serializable objects, so storing the scheduler object in a field in the ``Robot`` class is an easy way to get automatic logging.

Because the scheduler state changes every loop cycle, you should append the current state to the log or call ``Epilogue.update`` in  ``robotPeriodic`` to ensure telemetry is always updated.

.. tab-set::

  .. tab-item:: Epilogue
    :sync: epilogue

    ```java
    import org.wpilib.command3.Scheduler;
    import org.wpilib.epilogue.Epilogue;
    import org.wpilib.epilogue.Logged;
    import org.wpilib.framework.TimedRobot;

    @Logged
    public class Robot extends TimedRobot {
      private final Scheduler scheduler = Scheduler.getDefault();

      @Override
      public void robotPeriodic() {
        // Run the scheduler
        scheduler.run();

        // Update telemetry
        Epilogue.update(this);
      }
    }
    ```

  .. tab-item:: Manual Data Logging
    :sync: datalog

    ```java
    import org.wpilib.command3.Scheduler;
    import org.wpilib.datalog.ProtobufLogEntry;
    import org.wpilib.system.DataLogManager;
    import org.wpilib.framework.TimedRobot;

    public class Robot extends TimedRobot {
      // Create a log entry for the scheduler state
      private final ProtobufLogEntry<Scheduler> schedulerLog =
          ProtobufLogEntry.create(DataLogManager.getLog(), "Scheduler", Scheduler.proto);

      @Override
      public void robotPeriodic() {
        // Run the scheduler
        Scheduler.getDefault().run();

        // Log the current state of the scheduler
        schedulerLog.append(Scheduler.getDefault());
      }
    }
    ```
