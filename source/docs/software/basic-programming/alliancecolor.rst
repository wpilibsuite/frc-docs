# Get Alliance Color

The ``DriverStation`` class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/DriverStation.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classfrc_1_1_driver_station.html), :py:class:`Python <robotpy:wpilib.DriverStation>`) has many useful features for getting data from the Driver Station computer.  One of the most important features is ``getAlliance`` (Java & Python) / ``GetAlliance`` (C++).

Note that there are three cases: red, blue, and no color yet.  It is important that code handles the third case correctly because the alliance color will not be available until the Driver Station connects.  In particular, code should not assume that the alliance color will be available during constructor methods or `robotInit`, but it should be available by the time `autoInit` or `teleopInit` is called.  FMS will set the alliance color automatically; when not connected to FMS, the alliance color can be set from the Driver Station (see :ref:`"Team Station" on the Operation Tab <docs/software/driverstation/driver-station:Operation Tab>`).

## Getting your Alliance Color and Doing an Action

.. tab-set-code::

  ```java
  Optional<Alliance> ally = DriverStation.getAlliance();
  if (ally.isPresent()) {
      if (ally.get() == Alliance.Red) {
          <RED ACTION>
      }
      if (ally.get() == Alliance.Blue) {
          <BLUE ACTION>
      }
  }
  else {
      <NO COLOR YET ACTION>
  }
  ```

  ```c++
  using frc::DriverStation::Alliance;
  if (auto ally = frc::DriverStation::GetAlliance()) {
      if (ally.value() == Alliance::kRed) {
          <RED ACTION>
      }
      if (ally.value() == Alliance::kBlue) {
          <BLUE ACTION>
      }
  }
  else {
      <NO COLOR YET ACTION>
  }
  ```

  ```Python
  from wpilib import DriverStation
  ally = DriverStation.getAlliance()
  if ally is not None:
      if ally == DriverStation.Alliance.kRed:
          <RED ACTION>
      elif ally == DriverStation.Alliance.kBlue:
          <BLUE ACTION>
  else:
      <NO COLOR YET ACTION>
  ```

