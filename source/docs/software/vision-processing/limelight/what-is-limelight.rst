What is Limelight?
=========================================
The Limelight is a purpose-built smart camera used for running vision processing pipelines.
Limelight supports tracking visual targets such as AprilTags, retro-reflectors, and tracking / classifying objects through its Neural Network pieplines.
With only a few lines of code, teams can begin tracking vision targets.


Getting Started with Limelight
--------------------------------------------------------
To see more detailed instructions and full robot code examples using Limelight, visit the `official Limelight Docs <https://docs.limelightvision.io/>`__.

When you first power on the Limelight, it will need to be configured with your team number.

Head to [http://limelight.local:5801](http://limelight.local:5801) to go to the Limelight Configuration panel.

.. note::  If the Limelight is unable to connect, you may need to use the [Limelight Finder Tool](https://limelightvision.io/pages/downloads) to find its IP address.

Navigate to the "Settings" tab on the left side of the interface.

Enter your team number and press the "Update Team Number" button. You will need to power-cycle the robot after this.


Giving the Limelight a static IP address
--------------------------------------------------------
Limelight recommends that you configure it with a static IP to decrease boot time and increase reliability on actual FRC fields.

Navigate to the "Settings" tab on the left side of the interface.

- Change your "IP Assignment" to static.
- Set your Limelight's IP address to `10.TE.AM.11`
- Set the Netmask to `255.255.255.0`.
- Set the Gateway to `10.TE.AM.1`.
- Click the "Update" button.
- Make sure your roboRIO has the following static IP address: `10.TE.AM.2`
- Power-cycle your robot.
- You will now be able to access your config panel at `10.TE.AM.11:5801`, and your camera stream at `10.TE.AM.11:5800``
  
Basic Vision Example (AprilTags via Limelight)
--------------------------------------------------------
Limelight uses NetworkTables to push data to the roboRIO, but you first need to configure a pipeline for it to track.
If you are tracking multiple tags at once, you may need to use the [JSON Dump](https://docs.limelightvision.io/docs/docs-limelight/apis/json-dump-specification) instead.

Head to your LimeLight's configuration panel to get started.

- Input Tab - Change "Pipeline Type" to "Fiducial Markers"
- Standard Tab - Make sure "family" is set to "AprilTag Classic 16h5"
- Input Tab - Set "Black Level" to zero
- Input Tab - Set "Gain" to 15
- Input Tab - Reduce exposure to reduce motion blur. Stop reducing once tracking reliability decreases.
- Standard Tab - If would like to increase your framerate, increase the "Detector Downscale"
- Input Tab - For increased range and/or accuracy, increase the capture resolution.
- If you're seeing spurious tag detections, add the ID's you want to track to the "filter" control or increase the "Quality Threshold" value.
- You've configured your first pipeline! You'll be able to retrieve `tx` (the horizontal offset), `ty` (the vertical offset), and `ta` (the target area, or how much of the vision area the target is taking up)
- The Limelight can also predict where it is in 3D space, by using the `botpose` entry from NetworkTables. See [the 3D AprilTags docs on the Limelight website](https://docs.limelightvision.io/docs/docs-limelight/pipeline-apriltag/apriltag-3d) for more information.  

To retrieve targeting data from the Limelight, you will need to query NetworkTables:

.. tabs::

    .. tab:: Java

        .. code-block:: java
            import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
            import edu.wpi.first.networktables.NetworkTable;
            import edu.wpi.first.networktables.NetworkTableEntry;
            import edu.wpi.first.networktables.NetworkTableInstance;

            NetworkTable table = NetworkTableInstance.getDefault().getTable("limelight");
            NetworkTableEntry tx = table.getEntry("tx");
            NetworkTableEntry ty = table.getEntry("ty");
            NetworkTableEntry ta = table.getEntry("ta");

            //read values periodically
            double x = tx.getDouble(0.0);
            double y = ty.getDouble(0.0);
            double area = ta.getDouble(0.0);

            //post to smart dashboard periodically
            SmartDashboard.putNumber("LimelightX", x);
            SmartDashboard.putNumber("LimelightY", y);
            SmartDashboard.putNumber("LimelightArea", area);

    .. tab:: C++

        .. code-block:: c++
            include "frc/smartdashboard/Smartdashboard.h"
            include "networktables/NetworkTable.h"
            include "networktables/NetworkTableInstance.h"


            std::shared_ptr<NetworkTable> table = nt::NetworkTableInstance::GetDefault().GetTable("limelight");
            double targetOffsetAngle_Horizontal = table->GetNumber("tx",0.0);
            double targetOffsetAngle_Vertical = table->GetNumber("ty",0.0);
            double targetArea = table->GetNumber("ta",0.0);
            double targetSkew = table->GetNumber("ts",0.0);

    .. tab:: Python

        .. code-block:: python

            from networktables import NetworkTables

            table = NetworkTables.getTable("limelight")
            tx = table.getNumber('tx', None)
            ty = table.getNumber('ty', None)
            ta = table.getNumber('ta', None)
            ts = table.getNumber('ts', None)