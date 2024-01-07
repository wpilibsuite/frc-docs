Intro to Autonomous
===================

Most years, each match begins with an autonomous period where the robot operates under pre-programmed instructions without user intervention. In most games teams often want to move their robot around the field during this period in order to score points. In order to assist teams approaching this for the first time, this guide provides a high level overview of how to get started with autonomous navigation.

What Will the Robot Do?
-----------------------
Before you can think about writing any code, you need to figure out what you want to have the robot try to do. Some questions you may ask to help determine this:

- Where will the robot start? Check the rules to see where your robot must start the match. Are there any features of the field that you can align with or measure off of to ensure consistent placement of your robot?
- What will your alliance partners do? Will your alliance partners want to start in the same place or do the same things you want to? Consider having one or more alternative autos that you could select as a backup plan. You can use :ref:`Sendable Chooser<docs/software/dashboards/smartdashboard/choosing-an-autonomous-program-from-smartdashboard:Choosing an Autonomous Program>` for C++/Java or the `Auto Selector string with different cases in LabVIEW <https://forums.ni.com/t5/FIRST-Robotics-Competition/Autonomous-Timed-Movement-Tutorial/ta-p/3732667?profile.language=en>`__ to create multiple autonomous modes and choose them from the dashboard prior to each match.
- Where should the robot end autonomous? If you've got extra time, it's often beneficial to use it to position your robot in an advantgeous location to get a jump start on your first objective in teleop.

Tracking Robot Position
-----------------------
Before determining which approach to take and how to proceed, we need to review the fundamental concept crucial to both approaches: determining and tracking the robot's position.
Some ways to track robot position when navigating around the field include:

- Time - The most simplistic method of measuring robot position is to execute movements for fixed periods of time. Sensors aren't required, so it's applicable to any robot design; however, it doesn't actually measure anything related to the movement occurring. This means the actual amount of movement may vary depending on battery voltage, wheel slippage, or other robot changes that increase or decrease friction (resulting in the robot moving faster or slower than expected).
- Sensors - To get more accurate performance than timed movements, teams can use sensors to make measurements. These :ref:`sensors<docs/hardware/sensors/sensor-overview-hardware:Sensor Overview - Hardware>` fall into two main categories:

  - Internal sensors - These sensors measure movement of the robot or robot parts but do not use references from outside the robot. These sensors remove many of the sources of error compared to a time measurement but are still susceptible to things like wheel slip or sensor drift. Two primary types of internal sensors teams use for tracking robot position are:

    - :ref:`Encoders<docs/hardware/sensors/encoders-hardware:Encoders - Hardware>` - measure the rotation of shafts (in this case, by extension, wheels). Encoders can track straight-line position, and somewhat track turns (many robot drivetrains experience wheel slip during turns reducing encoder reliability).
    - :ref:`Gyroscopes<docs/hardware/sensors/gyros-hardware:Gyroscopes - Hardware>` - track angular position (more specifically, they track angular speed which can be integrated to return angular position). Many gyros also have built-in accelerometers (the combination of one or more gyros and accelerometers in a single unit is commonly called an Inertial Measurement Unit or IMU) which can technically track position through double integration of acceleration measurements, but the double integration amplifies noise, typically making this measurement too noisy for FIRST Robotics Competition use.

  Many teams find internal sensors reliable enough for general navigation but may move to external sensors when precision is needed, usually for scoring tasks.

  - External sensors - External sensors directly measure the world around the robot. Combined with pre-existing knowledge about the field, they can be used to determine where the robot is located. External sensors include :ref:`cameras<docs/software/vision-processing/index:Vision Processing>` and distance measuring sensors such as :ref:`Laser rangefinders (LIDAR)<docs/hardware/sensors/lidar:LIDAR - Hardware>`, :ref:`IR Rangefinders<docs/hardware/sensors/triangulating-rangefinders:Triangulating Rangefinders>`, and :ref:`Ultrasonic sensors<docs/hardware/sensors/ultrasonics-hardware:Ultrasonics - Hardware>`. Teams often use external sensors when they need to be in a precise location and/or orientation relative to the field, such as for scoring tasks, though they do not have to be limited to this application.

Choose an Approach
------------------
Two common approaches to autonomous robot navigation are:

- Individual Movements - break the movement down into smaller individual pieces (generally straight paths and in-place turns, but occasionally single arcs), develop code to complete each individual piece (ideally with parameters for things like distance or angle for code re-use), then string those pieces together into a complete routine.
- Path Planning - use path-planning to generate a smooth path in one or more pieces, each of which may contain multiple arcs (or straight runs).

Individual Movements
^^^^^^^^^^^^^^^^^^^^
Using individual movements generally starts by developing individual code routines to drive straight for a desired distance (both forwards and backwards) and turn to desired angles (both left and right). Then for each desired path, you can break it down into these three basic building blocks. There are generally two control approaches used when writing those building blocks:

- Bang-Bang Control – Bang-bang control has two states, typically on (though this does not need to be "full speed") and off. Simply turn the motors on at a specified value and periodically check whether an end condition has been met. Once the end condition has been reached, stop the motors. This method typically results in significant overshoot of the target when used for position/angle.

.. tip:: Remember, the Timed and Command templates, as well as the LabVIEW Teleop VI contain loops around the XXPeriodic functions already. Users should not place long running loops like this inside these functions, instead consider the XXPeriodic method as one iteration of the loop.

- :ref:`PID Control<docs/software/advanced-controls/introduction/index:Advanced Controls Introduction>` – PID control sets the output dynamically based on the error (and potentially error accumulation and rate of change of error). At a very basic level, you can think of it like a car approaching a stop sign – generally it stops gradually, moving slower as it gets closer to the target.

Path Planning
^^^^^^^^^^^^^
This approach generally starts by tuning a control loop(s) on the robot (generally velocity control) to enable it to follow an arbitrary path. Then, for each path you want to drive, you break the path down into "waypoints" you want the robot to drive through and use them to generate a full path.

.. tip:: Detail on the WPILib tools that help with this are in the :ref:`docs/software/advanced-controls/trajectories/index:Trajectory Generation and Following with WPILib` and a step-by-step tutorial can be found in the :ref:`docs/software/pathplanning/trajectory-tutorial/index:Trajectory Tutorial`. LabVIEW users can use `this library <https://www.chiefdelphi.com/t/v2-00-of-lv-trajectory-miscellaneous-control-state-space-control-library-release/397258/8>`__ for similar functionality.

Putting it Together
-------------------
Once that you've decided on your approach and looked at the path you are trying to drive, those building blocks must be put together. The process for doing so depends on the language and framework you are using for your robot code:

- LabVIEW or Timed Robot Auto Init – The most basic method of assembling an auto routine is writing each building block as a method or VI with a loop inside and assembling/calling them sequentially. In LabVIEW this can be done by using a Sequence Structure. In C++ or Java, it can be done by calling your building blocks, in order, from the AutoInit() method. While this approach is the simplest, it can have significant downside (at least in C++/Java). Structuring your code like this in C++/Java makes it more difficult to add other functions to the code while the robot is driving; because your code is running in a loop trying to complete the current "building block" routine, it can't be doing other things in parallel. LabVIEW is a bit different as the design of LabVIEW code is inherently parallel.
- LabVIEW or Timed Robot State Machine – If you want your code to be more flexible about running other behaviors at the same time it is driving, consider a "state machine." You can read up on state machines in plenty of places on the internet. For the purposes of a simple FIRST Robotics Competition autonomous they generally consist of the following:

  - A state variable – This keeps track of the current state.
  - Conditional/Branched code – A "switch" (or case structure in LabVIEW), or series of "if" statements, inside the AutoPeriodic() method based on the state variable that describes what to do in each state.

    - The code inside each branch should generally perform an action (such as setting motors to some speed) and then test whether criteria has been reached to move to a new state. In simple autonomous state machines, flow generally only moves forward (advancing when the target distance or angle has been reached). In more complex state machines flow can jump around and does not necessarily proceed linearly.
    - Make each branch a "building block", setting motor speeds and checking if the target has been reached before advancing to the next state, use the overall loop around the AutoPeriodic() method from the framework instead of writing your own loop.

- Command-based framework – In the Command-based framework the framework has constructed a type of state machine for you. Each building block is a command where the Init() and/or Execute() method(s) command the motors and the IsFinished() method evaluates whether the target has been reached. When using more advanced controls you may end up using things like the PIDCommand or RamseteCommand which may handle some of this logic for you. To assemble the building blocks together into a routine, use CommandGroups. `Converting a Simple Autonomous Program to Command-Based <https://docs.wpilib.org/en/2021/docs/software/old-commandbased/basics/convert-simple-auto-command-auto.html>`__ uses the "old command based" library, but the principles described should be applicable to either "new" or "old" Command-based frameworks (though some syntax may vary).
