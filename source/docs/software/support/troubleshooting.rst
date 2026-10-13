# Troubleshooting

Use this page when setting up, programming, or testing a robot with Systemcore.
Find the section below that matches the symptom you see. This page focuses on
Systemcore connectivity, programming tools, deployment, and robot-code issues.

For detailed hardware checks, follow the
:doc:`FRC wiring reference </docs/zero-to-robot/step-1/intro-to-frc-robot-wiring>`
or `FTC Docs <https://ftc-docs.firstinspires.org/en/latest/>`_, using the guide
that matches your control system.

Start at the top of this sequence and stop when a check fails:

1. **Power:** Systemcore and radio status lights are on and the Driver Station
   reports a plausible battery voltage.
2. **Network:** the laptop can reach ``robot.local`` over USB or the robot
   network.
3. **Communication:** the Driver Station communication indicator is green.
4. **Code:** the Driver Station robot-code indicator is green.
5. **Input:** the controller appears in the USB/controller view and its axes
   move.
6. **Output:** the robot is enabled and the configured motor channels match
   the wiring.

The first failed check identifies which section below to investigate. Change
one thing at a time, then repeat the check. Keep the robot disabled while
checking connections or code; perform motor tests with the drive wheels
supported off the floor.

.. rubric:: Power & Wiring Issues

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Systemcore does not power on
      :class-card: sw-card-err

      Turn robot power off and disconnect the battery. Confirm the power cable
      matches the Systemcore revision, polarity is correct, connectors are
      fully seated, and Systemcore is not connected through a VRM. Do not
      reconnect power if a cable is hot or damaged.

      **Check again:** Systemcore should boot normally. If it still does not,
      return to :doc:`the Step 1 power checks
      </docs/zero-to-robot/step-1/index>` before testing communication.

   .. grid-item-card:: robot.local does not open
      :class-card: sw-card-err

      Confirm the Power LED is solid green, then try a data-capable USB cable
      and the USB IP address listed in
      :doc:`Connecting to Systemcore </docs/zero-to-robot/step-1/index>`. On Alpha hardware, connect LINK
      only after Systemcore has booted normally.

      **Check again:** open the web interface using the USB IP address. If that
      works but ``robot.local`` does not, investigate name resolution and the
      network connection before changing robot code.

.. rubric:: Install Issues

.. grid:: 1
   :gutter: 3

   .. grid-item-card:: WPILib VS Code won't open or commands are missing
      :link: /docs/zero-to-robot/step-2/index
      :link-type: doc
      :class-card: sw-card-shared

      Confirm you're launching the **WPILib** VS Code shortcut, not the
      system VS Code install. Re-run the installer if the WPILib icon
      doesn't appear in the activity bar.

      **Check again:** open the command palette and type *WPILib*. Its commands
      should appear before you create or deploy a project.

.. rubric:: Radio & Configuration Issues

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Can't reach radio.local
      :link: /docs/zero-to-robot/step-3/radio-programming
      :link-type: doc
      :class-card: sw-card-frc

      Check radio power and the computer's connection to the radio first.
      Follow the radio guide's troubleshooting sequence for network, mDNS,
      and firewall checks.

      **Check again:** the radio configuration page should open before you
      change its team number or network settings.

   .. grid-item-card:: Systemcore update won't finish
      :link: /docs/zero-to-robot/step-3/imaging-your-systemcore
      :link-type: doc
      :class-card: sw-card-shared

      On Wi-Fi, Systemcore reboots as part of the update; reconnect and refresh
      the page. On USB, look for the success message.

      **Check again:** reopen the web interface and confirm the installed OS
      version. If it still shows the previous version, follow the imaging
      guide before attempting another update.

.. rubric:: Code & Drive Issues

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: "No Robot Communication"
      :class-card: sw-card-err

      Verify Systemcore and radio power first. Connect directly over USB and
      try ``robot.local``. If USB works, investigate the radio, Wi-Fi, team
      number, and firewall instead of redeploying code.

      **Check again:** Driver Station should report robot communication.
      Only investigate code deployment once communication is working.

   .. grid-item-card:: "No Robot Code"
      :class-card: sw-card-err

      Communication works, but no user program is running. Deploy from
      your programming environment, then inspect the deploy output and Driver
      Station log for the first error. Fix that error before deploying again.

      **Check again:** Driver Station should report both communication and
      running robot code while the robot remains disabled.

   .. grid-item-card:: Robot does not move
      :class-card: sw-card-err

      Confirm the robot-code and joystick indicators are green. Safely elevate
      the drivetrain, verify axes in the Driver Station USB/controller view,
      then compare the PWM ports or CAN IDs in code with the physical wiring.

      **Check again:** follow the :doc:`first-enable procedure
      </docs/zero-to-robot/step-4/running-test-program>` with small inputs.
      Verify the expected motors respond and stop on disable.

   .. grid-item-card:: Robot moves in wrong direction
      :class-card: sw-card-err

      Disable the robot and invert the affected drivetrain side in code. Do not
      swap motor power leads as a substitute for correct software configuration.

      **Check again:** repeat the forward and steering tests with small inputs
      and the wheels off the floor. Disable before making another change.

.. rubric:: Still Stuck?

Record the first failed check, the connection method, and the exact error
message. Include what changed and whether the same test works over USB.
Use that information when asking for help.


.. card:: Support Resources
   :link: support-resources
   :link-type: doc
   :class-card: sw-card-shared

   Community forums and additional documentation for FRC and FTC teams.

.. seealso::

   :doc:`Driver Station errors and warnings
   </docs/software/firstdriverstation/first-driver-station-errors-warnings>`
   and :doc:`Driver Station logs
   </docs/software/firstdriverstation/first-driver-station-log-viewer>`
   provide more detail when the basic checks do not identify the problem.
