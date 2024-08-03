Choosing a Dashboard
====================

A dashboard is a program used to retrieve and display information about the operation of your robot.  There are two main types of dashboards that teams may need: driver and programmer dashboards.  Some dashboards will try to accommodate both purposes.

Driver Dashboard
----------------

During competition the drive team will use this dashboard to get information from the robot.  It should focus on conveying key information instantly.  This is often best accomplished by using large, colorful, and easy to understand visual elements.  Most teams will also use this dashboard to select their autonomous routine.

Take caution to carefully consider what *needs* to be on this dashboard and if there is another better way of communicating that information.  Any members of the drive team (especially the driver) looking at the dashboard takes their focus away from the match.  Using :ref:`LEDs <docs/software/hardware-apis/misc/addressable-leds:Addressable LEDs>` to indicate the state of your robot is a good example of a way to communicate useful information to the driver without having to take their eyes off the robot.

Programming Dashboard
---------------------

This dashboard is designed for debugging code and analyzing data from the robot. It supports the monitoring of a wide variety of information simultaneously, prioritizing function and utility over simplicity or ease of use. This functionality often includes complex data visualization and graphing across extended periods. In scenarios where there is an overwhelming amount of data to review, real-time analysis becomes challenging. The capability to examine past data and replay it proves to be extremely beneficial. While some dashboards may log data transmitted to them, :ref:`on-robot telemetry <docs/software/telemetry/datalog:On-Robot Telemetry Recording Into Data Logs>` using the ``DataLog`` class simplifies the process.

Specific Dashboards (oldest to newest)
--------------------------------------

.. note:: SmartDashboard and Shuffleboard have a long history of aiding FRC teams. However, they do not have a person to maintain them so are not receiving bug fixes or improvements. Notably, Shuffleboard may experience performance issues on some machines under certain scenarios.  PRs from external contributors will be reviewed.

:ref:`LabVIEW Dashboard <docs/software/dashboards/labview-dashboard/index:LabVIEW Dashboard>` (Driver / Programming) - easy to use and provides a lot of features straight out of the box like: camera streams, autonomous selection, and joystick feedback.  It can be customized using LabVIEW by creating a new Dashboard project.  While it :ref:`can be used <docs/software/dashboards/labview-dashboard/using-the-labview-dashboard-with-c++-java-code:Using the LabVIEW Dashboard with C++, Java, or Python Code>` by Java or C++ teams, they generally prefer SmartDashboard or Shuffleboard which can be customized in their respective language.

:ref:`SmartDashboard <docs/software/dashboards/smartdashboard/index:SmartDashboard>` (Driver) - simple and efficient dashboard that uses relatively few computer resources.  It does not have the fancy look or some of the features Shuffleboard has, but it displays network tables data with a variety of widgets without bogging down the driver station computer.

:ref:`Shuffleboard <docs/software/dashboards/shuffleboard/index:Shuffleboard>` (Driver) - straightforward and easily customizable dashboard. It displays network tables data using a variety of widgets that can be positioned and controlled with robot code. It includes many extra features like: tabs, recording / playback, and advanced custom widgets.

:ref:`Glass <docs/software/dashboards/glass/index:Glass>` (Programming) - robot data visualization tool. Its GUI is extremely similar to that of the :ref:`Simulation GUI <docs/software/wpilib-tools/robot-simulation/simulation-gui:Simulation Specific User Interface Elements>`. In its current state, it is meant to be used as a programmer's tool rather than a proper dashboard in a competition environment, with a focus on high performance real time plotting.

:ref:`AdvantageScope <docs/software/dashboards/advantagescope:AdvantageScope>` (Programming) - robot diagnostics, log review/analysis, and data visualization application.  It reads the WPILib Data Log (``.wpilog``) and Driver Station Log (``.dslog`` / ``.dsevents``) file formats, plus live robot data viewing.

Third Party Dashboards
----------------------

`FRC Web Components <https://github.com/frc-web-components/frc-web-components>`__ (Driver) - A web-based dashboard that can be installed as a standalone application, or as a JavaScript package for custom dashboard solutions.

`Elastic <https://github.com/Gold872/elastic-dashboard>`__ (Driver) - simple and modern Shuffleboard alternative made by Team 353. It is meant to serve as a dashboard for competition but can also be used for testing.  It features draggable and resizable card widgets.

`QFRCDashboard <https://github.com/binex-dsk/QFRCDashboard>`__ (Driver) - described as reliable, high-performance, low-footprint dashboard.  QFRCDashboard has been specifically designed to use as few resources as possible.
