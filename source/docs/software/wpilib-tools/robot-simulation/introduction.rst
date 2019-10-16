Introduction to Robot Simulation
================================

Often a team may want to test their code without having an actual robot available. WPILib provides teams with the ability to simulate the robot's Hardware Abstraction Layer (HAL) using simple gradle commands.

Enabling Desktop Support
------------------------

Use of the Desktop Simulator requires Desktop Support to be enabled. This can be done by checking the "Enable Desktop Support Checkbox" when creating your robot project or by running "WPILib: Change Desktop Support Enabled Setting" from the Visual Studio Code command palette. If none of the already listed options work, please `report a bug <https://github.com/wpilibsuite/allwpilib/issues>`__.

.. image:: images/vscode-desktop-support.png
   :alt: Enabling desktop support through VSCode


.. image:: images/vscode-desktop-support-manual.png
   :alt: Manually enabling desktop support through VSCode command-palette

Desktop support can also be enabled by manually editing your ``build.gradle`` file located at the root of your robot project. Simply change ``includeDesktopSupport = false`` to ``includeDesktopSupport = true``

.. code-block:: text

   def includeDesktopSupport = true

.. important:: It is important to note that enabling desktop/simulation support can have unintended consequences. Not all vendors will support this option, and code that uses their libraries may even crash when attempting to run simulation!

If at any point in time you want to disable Desktop Support, simply re-run the "WPILib: Change Desktop Support Enabled Setting" from the command palette.

Additional C++ Dependency
^^^^^^^^^^^^^^^^^^^^^^^^^

C++ robot simulation requires that a native compiler to be installed. For Windows, this would be Visual Studio 2019 (**not** VSCode). This can be downloaded from `Microsoft's website <https://visualstudio.microsoft.com/vs/>`__.

Running Robot Simulation
------------------------

Basic robot simulation can be run using VSCode. This can be done without using any commands by using VSCode's command palette.

.. image:: images/vscode-run-simulation.png
   :alt: Running robot simulation through VSCode

Your console output in Visual Studio Code should look like the below. However, teams probably will want to actually *test* their code versus just running the simulation. This can be done using :doc:`WPILib's Simulation GUI <simulation-gui>`.

.. code-block:: console

   ********** Robot program starting **********
   Default disabledInit() method... Override me!
   Default disabledPeriodic() method... Override me!
   Default robotPeriodic() method... Override me!

.. important:: Simulation can also be run outside of VSCode using ``./gradlew simulateJava``. It's important to note that C++ simulation is not available through command-line at this time.
