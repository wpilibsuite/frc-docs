Path Planning
=============

Path Planning is the process of creating and following trajectories. These paths use the WPILib trajectory APIs for generation and a :ref:`Ramsete Controller <docs/software/advanced-controls/trajectories/ramsete:Ramsete Controller>` for following. This section highlights the process of characterizing your robot for system identification, trajectory following and usage of PathWeaver. Users may also want to read the :ref:`generic trajectory following documents <docs/software/advanced-controls/trajectories/index:Trajectory Generation and Following with WPILib>` for additional information about the API and non-commandbased usage.

Notice on Swerve Support
------------------------

Swerve support in path following has a couple of limitations that teams need to be aware of:

- WPILib currently does not support swerve in simulation, please see `this <https://github.com/wpilibsuite/allwpilib/pull/3374>`__ pull request.

- SysID only supports tuning the swerve heading using a General Mechanism project and does not regularly support module velocity data. A workaround is to lock the module's heading into place. This can be done via blocking module rotation using something like a block of wood.

- Pathweaver and Trajectory following currently do not incorporate independent heading. Path following using the WPILib trajectory framework on swerve will be the same as a DifferentialDrive robot.

We are sorry for the inconvenience.

.. toctree::
   :maxdepth: 2

   system-identification/index
   trajectory-tutorial/index
   pathweaver/index
