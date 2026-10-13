# Get Alliance Color

The ``MatchState`` class ([Java](https://github.wpilib.org/allwpilib/docs/beta/java/org/wpilib/driverstation/MatchState.html), [C++](https://github.wpilib.org/allwpilib/docs/beta/cpp/classwpi_1_1_match_state.html), :py:class:`Python <robotpy:wpilib.MatchState>`) has many useful features for getting data from the Driver Station about the current state of the match.  One of the most important features is ``getAlliance`` (Java) / ``GetAlliance`` (C++) / ``get_alliance`` (Python).

Note that there are three cases: red, blue, and no color yet.  It is important that code handles the third case correctly because the alliance color will not be available until the Driver Station connects.  In particular, code should not assume that the alliance color will be available during constructor methods, but it should be available by the time `autoInit` or `teleopInit` is called.  FMS will set the alliance color automatically; when not connected to FMS, the alliance color can be set from the Driver Station (see :ref:`"Team Station" on the Settings Tab <docs/software/firstdriverstation/first-driver-station-introduction:settings tab>`).

## Getting your Alliance Color and Doing an Action

.. tab-set-code::

  ```java
  Optional<Alliance> ally = MatchState.getAlliance();
  if (ally.isPresent()) {
      if (ally.get() == Alliance.RED) {
          <RED ACTION>
      }
      if (ally.get() == Alliance.BLUE) {
          <BLUE ACTION>
      }
  }
  else {
      <NO COLOR YET ACTION>
  }
  ```

  ```c++
  if (auto ally = wpi::MatchState::GetAlliance()) {
      if (ally.value() == wpi::Alliance::RED) {
          <RED ACTION>
      }
      if (ally.value() == wpi::Alliance::BLUE) {
          <BLUE ACTION>
      }
  }
  else {
      <NO COLOR YET ACTION>
  }
  ```

  ```Python
  from wpilib import MatchState
  ally = MatchState.get_alliance()
  if ally is not None:
      if ally == MatchState.Alliance.RED:
          <RED ACTION>
      elif ally == MatchState.Alliance.BLUE:
          <BLUE ACTION>
  else:
      <NO COLOR YET ACTION>
  ```

