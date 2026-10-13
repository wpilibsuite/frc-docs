# Quick Start for Returning Teams

This checklist is for returning FRC teams preparing an existing robot or
project for the 2027 season. FTC teams moving to Systemcore for the first time
should begin with :doc:`New to WPILib </docs/zero-to-robot/new-to-wpilib>`.

Follow the sections in order. Keep the robot disabled until you reach the
supported-wheel test.

## Review Changes and Save Your Project

1. Read the :doc:`2027 changelog
   </docs/yearly-overview/yearly-changelog>`, :doc:`known issues
   </docs/yearly-overview/known-issues>`, and :doc:`removed features
   </docs/yearly-overview/removed-features>` before changing the robot.
2. Make a backup or version-control checkpoint of last season's project.

**Before continuing:** keep a copy of the original project that you can reopen
without the migration changes.

## Update the Control System and Programming Environment

1. :doc:`Update or image Systemcore
   </docs/zero-to-robot/step-3/imaging-your-systemcore>` for the current
   season.
2. Update the firmware on and :doc:`program the VH-109 radios
   </docs/zero-to-robot/step-3/radio-programming>`.
3. :doc:`Install the FIRST Driver Station
   </docs/zero-to-robot/step-2/first-driver-station-installation>`.
4. Set up the environment for your language:

   - **Java or C++:** :doc:`install WPILib
     </docs/zero-to-robot/step-2/wpilib-setup>`.
   - **Python:** :doc:`install or update RobotPy
     </docs/zero-to-robot/step-2/python-setup>`. Install the WPILib desktop
     environment too if you want its VS Code setup and tools.
   - **Blocks:** choose either the OnBot or desktop path in :doc:`Step 2
     </docs/zero-to-robot/step-2/index>`.
   - **LabVIEW:** choose OnBot or desktop LabVIEW in Step 2. Detailed
     Systemcore setup instructions are still being completed.

**Before continuing:** Systemcore has the expected OS version, the radio is
configured, and your programming environment and Driver Station open.

## Import and Build the Project

1. Open last season's project:

   - **Java or C++:** use :doc:`Import a Robot Project
     </docs/software/vscode-overview/importing-last-years-robot-code>`.
   - **Python:** open the existing project folder, update its dependencies,
     and run ``robotpy sync``.
   - **OnBot languages:** create or open the project using the Systemcore
     editor. Detailed migration instructions will be added as the 2027
     software is finalized.

2. :doc:`Update third-party libraries
   </docs/software/vscode-overview/3rd-party-libraries>`, then build the
   project and address changes identified in the changelog.

**Before continuing:** the migrated project builds without errors and its
motor-controller assignments match the robot's wiring.

## Deploy and Test

1. Deploy using the instructions for your language in :doc:`Step 4
   </docs/zero-to-robot/step-4/index>`.
2. Test with the drivetrain safely supported, following
   :doc:`Running Your Test Program
   </docs/zero-to-robot/step-4/running-test-program>`.
3. Confirm forward motion, steering, and stopping on disable before returning
   the robot to service.

**Optional:** use :doc:`robot simulation
</docs/software/wpilib-tools/robot-simulation/introduction>` to check behavior
before hardware testing when your project and vendor libraries support it.

**Finished:** the updated project deploys, Driver Station reports running code,
and the drivetrain passes its supported-wheel tests.
