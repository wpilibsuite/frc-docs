Using Multiple Cameras
======================

Switching the Driver Views
--------------------------

If you're interested in just switching what the driver sees, and are using SmartDashboard, the SmartDashboard CameraServer Stream Viewer has an option ("Selected Camera Path") that reads the given :term:`NetworkTables` key and changes the "Camera Choice" to that value (displaying that camera). The robot code then just needs to set the :term:`NetworkTables` key to the correct camera name. Assuming "Selected Camera Path" is set to "CameraSelection", the following code uses the joystick 1 trigger button state to show camera1 and camera2.

.. tabs::

    .. code-tab:: java

       UsbCamera camera1;
       UsbCamera camera2;
       Joystick joy1 = new Joystick(0);
       NetworkTableEntry cameraSelection;

       @Override
       public void robotInit() {
           camera1 = CameraServer.startAutomaticCapture(0);
           camera2 = CameraServer.startAutomaticCapture(1);

           cameraSelection = NetworkTableInstance.getDefault().getTable("").getEntry("CameraSelection");
       }

       @Override
       public void teleopPeriodic() {
           if (joy1.getTriggerPressed()) {
               System.out.println("Setting camera 2");
               cameraSelection.setString(camera2.getName());
           } else if (joy1.getTriggerReleased()) {
               System.out.println("Setting camera 1");
               cameraSelection.setString(camera1.getName());
           }
       }

    .. code-tab:: c++

       cs::UsbCamera camera1;
       cs::UsbCamera camera2;
       frc::Joystick joy1{0};

       nt::NetworkTableEntry cameraSelection;

       void RobotInit() override {
         camera1 = frc::CameraServer::StartAutomaticCapture(0);
         camera2 = frc::CameraServer::StartAutomaticCapture(1);

         cameraSelection = nt::NetworkTableInstance::GetDefault().GetTable("")->GetEntry("CameraSelection");
       }

       void TeleopPeriodic() override {
         if (joy1.GetTriggerPressed()) {
           std::cout << "Setting Camera 2" << std::endl;
           cameraSelection.SetString(camera2.GetName());
         } else if (joy1.GetTriggerReleased()) {
           std::cout << "Setting Camera 1" << std::endl;
           cameraSelection.SetString(camera1.GetName());
         }
       }

If you're using some other dashboard, you can change the camera used by the camera server dynamically. If you open a stream viewer nominally to camera1, the robot code will change the stream contents to either camera1 or camera2 based on the joystick trigger.

.. tabs::

    .. code-tab:: java

       UsbCamera camera1;
       UsbCamera camera2;
       VideoSink server;
       Joystick joy1 = new Joystick(0);

       @Override
       public void robotInit() {
           camera1 = CameraServer.startAutomaticCapture(0);
           camera2 = CameraServer.startAutomaticCapture(1);
           server = CameraServer.getServer();
       }

       @Override
       public void teleopPeriodic() {
           if (joy1.getTriggerPressed()) {
               System.out.println("Setting camera 2");
               server.setSource(camera2);
           } else if (joy1.getTriggerReleased()) {
               System.out.println("Setting camera 1");
               server.setSource(camera1);
           }
       }

    .. code-tab:: c++

       cs::UsbCamera camera1;
       cs::UsbCamera camera2;
       cs::VideoSink server;
       frc::Joystick joy1{0};
       bool prevTrigger = false;

       void RobotInit() override {
         camera1 = frc::CameraServer::StartAutomaticCapture(0);
         camera2 = frc::CameraServer::StartAutomaticCapture(1);
         server = frc::CameraServer::GetServer();
       }

       void TeleopPeriodic() override {
         if (joy1.GetTrigger() && !prevTrigger) {
           std::cout << "Setting Camera 2" << std::endl;
           server.SetSource(camera2);
         } else if (!joy1.GetTrigger() && prevTrigger) {
           std::cout << "Setting Camera 1" << std::endl;
           server.SetSource(camera1);
         }
         prevTrigger = joy1.GetTrigger();
       }

Keeping Streams Open
--------------------

By default, the cscore library is pretty aggressive in turning off cameras not in use. What this means is that when you switch cameras, it may disconnect from the camera not in use, so switching back will have some delay as it reconnects to the camera. To keep both camera connections open, use the ``SetConnectionStrategy()`` method to tell the library to keep the streams open, even if you aren't using them.

.. tabs::

    .. code-tab:: java

       UsbCamera camera1;
       UsbCamera camera2;
       VideoSink server;
       Joystick joy1 = new Joystick(0);

       @Override
       public void robotInit() {
           camera1 = CameraServer.startAutomaticCapture(0);
           camera2 = CameraServer.startAutomaticCapture(1);
           server = CameraServer.getServer();

           camera1.setConnectionStrategy(ConnectionStrategy.kKeepOpen);
           camera2.setConnectionStrategy(ConnectionStrategy.kKeepOpen);
       }

       @Override
       public void teleopPeriodic() {
           if (joy1.getTriggerPressed()) {
               System.out.println("Setting camera 2");
               server.setSource(camera2);
           } else if (joy1.getTriggerReleased()) {
               System.out.println("Setting camera 1");
               server.setSource(camera1);
           }
       }

    .. code-tab:: c++

       cs::UsbCamera camera1;
       cs::UsbCamera camera2;
       cs::VideoSink server;
       frc::Joystick joy1{0};
       bool prevTrigger = false;
       void RobotInit() override {
         camera1 = frc::CameraServer::StartAutomaticCapture(0);
         camera2 = frc::CameraServer::StartAutomaticCapture(1);
         server = frc::CameraServer::GetServer();
         camera1.SetConnectionStrategy(cs::VideoSource::ConnectionStrategy::kConnectionKeepOpen);
         camera2.SetConnectionStrategy(cs::VideoSource::ConnectionStrategy::kConnectionKeepOpen);
       }

       void TeleopPeriodic() override {
         if (joy1.GetTrigger() && !prevTrigger) {
           std::cout << "Setting Camera 2" << std::endl;
           server.SetSource(camera2);
         } else if (!joy1.GetTrigger() && prevTrigger) {
           std::cout << "Setting Camera 1" << std::endl;
           server.SetSource(camera1);
         }
         prevTrigger = joy1.GetTrigger();
       }

.. note::
    If both cameras are USB, you may run into USB bandwidth limitations with higher resolutions, as in all of these cases the roboRIO is going to be streaming data from both cameras to the roboRIO simultaneously (for a short period in options 1 and 2, and continuously in option 3). It is theoretically possible for the library to avoid this simultaneity in the option 2 case (only), but this is not currently implemented.

    Different cameras report bandwidth usage differently. The library will tell you if you're hitting the limit; you'll get this error message:

    .. code-block:: text

        could not start streaming due to USB bandwidth limitations;
        try a lower resolution or a different pixel format
        (VIDIOC_STREAMON: No space left on device)

    If you're using Option 3 it will give you this error during ``RobotInit()``. Thus you should just try your desired resolution and adjusting as necessary until you both don't get that error and don't exceed the radio bandwidth limitations.
