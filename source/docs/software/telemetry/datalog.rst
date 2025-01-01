# On-Robot Telemetry Recording Into Data Logs

By default, no telemetry data is recorded (saved) on the robot. The ``DataLogManager`` class provides a convenient wrapper around the lower-level ``DataLog`` class for on-robot recording of telemetry data into data logs.  The WPILib data logs are binary for size and speed reasons.  In general, the data log facilities provided by WPILib have minimal overhead to robot code, as all file I/O is performed on a separate thread--the log operation consists of mainly a mutex acquisition and copying the data.

## Structure of Data Logs

Similar to NetworkTables, data logs have the concept of entries with string identifiers (keys) with a specified data type.  Unlike NetworkTables, the data type cannot be changed after the entry is created, and entries also have metadata--an arbitrary (but typically JSON) string that can be used to convey additional information about the entry such as the data source or data schema.  Also unlike NetworkTables, data log operation is unidirectional--the ``DataLog`` class can only write data logs (it does not support read-back of written values) and the ``DataLogReader`` class can only read data logs (it does not support changing values in the data log).

Data logs consist of a series of timestamped records.  Control records allow starting, finishing, or changing the metadata of entries, and data records record data value changes.  Timestamps are stored in integer microseconds; when running on the RoboRIO, the FPGA timestamp is used (the same timestamp returned by ``Timer.getFPGATimestamp()``).

.. note:: For more information on the details of the data log file format, see the [WPILib Data Log File Format Specification](https://github.com/wpilibsuite/allwpilib/blob/main/wpiutil/doc/datalog.adoc).

## Standard Data Logging using DataLogManager

The ``DataLogManager`` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/DataLogManager.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_data_log_manager.html), :external:py:class:`Python <wpilib.DataLogManager>`) provides a centralized data log that provides automatic data log file management.  It automatically cleans up old files when disk space is low and renames the file based either on current date/time or (if available) competition match number.  The data file will be saved to a USB flash drive in a folder called ``logs`` if one is attached, or to ``/home/lvuser/logs`` otherwise.

.. note:: USB flash drives need to be formatted as FAT32 to work with the roboRIO.  NTFS or exFAT formatted drives will not work. Flash drives of 32GB or smaller are recommended, as Windows doesn't format drives larger then 32GB with FAT32.

Log files are initially named ``FRC_TBD_{random}.wpilog`` until the DS connects.  After the DS connects, the log file is renamed to ``FRC_yyyyMMdd_HHmmss.wpilog`` (where the date/time is UTC).  If the :term:`FMS` is connected and provides a match number, the log file is renamed to ``FRC_yyyyMMdd_HHmmss_{event}_{match}.wpilog``.

On startup, all existing log files where a DS has not been connected will be deleted.  If there is less than 50 MB of free space on the target storage, ``FRC_`` log files are deleted (oldest to newest) until there is 50 MB free OR there are 10 files remaining.

The most basic usage of DataLogManager only requires a single line of code (typically this would be called from ``Robot`` constructor). This will record all NetworkTables changes to the data log.

.. tab-set-code::

    ```java
    import edu.wpi.first.wpilibj.DataLogManager;
    // Starts recording to data log
    DataLogManager.start();
    ```

    ```c++
    #include "frc/DataLogManager.h"
    // Starts recording to data log
    frc::DataLogManager::Start();
    ```

    ```python
    from wpilib import DataLogManager
    DataLogManager.start()
    ```

DataLogManager provides a convenience function (``DataLogManager.log()``) for logging of text messages to the ``messages`` entry in the data log. The message is also printed to standard output, so this can be a replacement for ``System.out.println()``.

DataLogManager also records the current roboRIO system time (in UTC) to the data log every ~5 seconds to the ``systemTime`` entry in the data log.  This can be used to (roughly) synchronize the data log with other records such as DS logs or match video.

For custom logging, the managed ``DataLog`` can be accessed via ``DataLogManager.getLog()``.

### Logging Joystick Data

DataLogManager by default does not record joystick data.  The ``DriverStation`` class provides support for logging of DS control and joystick data via the ``startDataLog()`` function:

.. tab-set-code::

    ```java
    import edu.wpi.first.wpilibj.DataLogManager;
    import edu.wpi.first.wpilibj.DriverStation;
    // Starts recording to data log
    DataLogManager.start();
    // Record both DS control and joystick data
    DriverStation.startDataLog(DataLogManager.getLog());
    // (alternatively) Record only DS control data
    DriverStation.startDataLog(DataLogManager.getLog(), false);
    ```

    ```c++
    #include "frc/DataLogManager.h"
    #include "frc/DriverStation.h"
    // Starts recording to data log
    frc::DataLogManager::Start();
    // Record both DS control and joystick data
    DriverStation::StartDataLog(DataLogManager::GetLog());
    // (alternatively) Record only DS control data
    DriverStation::StartDataLog(DataLogManager::GetLog(), false);
    ```

    ```python
    from wpilib import DataLogManager, DriverStation
    # Starts recording to data log
    DataLogManager.start()
    # Record both DS control and joystick data
    DriverStation.startDataLog(DataLogManager.getLog())
    # (alternatively) Record only DS control data
    DriverStation.startDataLog(DataLogManager.getLog(), False)
    ```

## Custom Data Logging using DataLog

The ``DataLog`` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/util/datalog/DataLog.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classwpi_1_1log_1_1_data_log.html), :external:py:class:`Python <wpiutil.log.DataLog>`) and its associated LogEntry classes (e.g. ``BooleanLogEntry``, ``DoubleLogEntry``, etc) provides low-level access for writing data logs.

.. note:: Unlike NetworkTables, there is no change checking performed.  **Every** call to a ``LogEntry.append()`` function will result in a record being written to the data log.  Checking for changes and only appending to the log when necessary is the responsibility of the caller.

The LogEntry classes can be used in conjunction with DataLogManager to record values only to a data log and not to NetworkTables:

.. tab-set-code::

    ```java
    import edu.wpi.first.util.datalog.BooleanLogEntry;
    import edu.wpi.first.util.datalog.DataLog;
    import edu.wpi.first.util.datalog.DoubleLogEntry;
    import edu.wpi.first.util.datalog.StringLogEntry;
    import edu.wpi.first.wpilibj.DataLogManager;
    BooleanLogEntry myBooleanLog;
    DoubleLogEntry myDoubleLog;
    StringLogEntry myStringLog;

    public Robot() {
      // Starts recording to data log
      DataLogManager.start();
      // Set up custom log entries
      DataLog log = DataLogManager.getLog();
      myBooleanLog = new BooleanLogEntry(log, "/my/boolean");
      myDoubleLog = new DoubleLogEntry(log, "/my/double");
      myStringLog = new StringLogEntry(log, "/my/string");
    }
    public void teleopPeriodic() {
      if (...) {
        // Only log when necessary
        myBooleanLog.append(true);
        myDoubleLog.append(3.5);
        myStringLog.append("wow!");
      }
    }
    ```

    ```c++
    #include "frc/DataLogManager.h"
    #include "wpi/DataLog.h"
    wpi::log::BooleanLogEntry myBooleanLog;
    wpi::log::DoubleLogEntry myDoubleLog;
    wpi::log::StringLogEntry myStringLog;
    Robot() {
      // Starts recording to data log
      frc::DataLogManager::Start();
      // Set up custom log entries
      wpi::log::DataLog& log = frc::DataLogManager::GetLog();
      myBooleanLog = wpi::log::BooleanLogEntry(log, "/my/boolean");
      myDoubleLog = wpi::log::DoubleLogEntry(log, "/my/double");
      myStringLog = wpi::log::StringLogEntry(log, "/my/string");
    }
    void TeleopPeriodic() {
      if (...) {
        // Only log when necessary
        myBooleanLog.Append(true);
        myDoubleLog.Append(3.5);
        myStringLog.Append("wow!");
      }
    }
    ```

    ```python
    from wpilib import DataLogManager, TimedRobot
    from wpiutil.log import (
        DataLog,
        BooleanLogEntry,
        DoubleLogEntry,
        StringLogEntry,
    )
   class MyRobot(TimedRobot):
        def robotInit(self):
            # Starts recording to data log
            DataLogManager.start()
            # Set up custom log entries
            log = DataLogManager.getLog()
            self.myBooleanLog = BooleanLogEntry(log, "/my/boolean")
            self.myDoubleLog = DoubleLogEntry(log, "/my/double")
            self.myStringLog = StringLogEntry(log, "/my/string")
        def teleopPeriodic(self):
            if ...:
                # Only log when necessary
                self.myBooleanLog.append(True)
                self.myDoubleLog.append(3.5)
                self.myStringLog.append("wow!")
    ```

