/*----------------------------------------------------------------------------*/
/* Copyright (c) 2017-2018 FIRST. All Rights Reserved.                        */
/* Open Source Software - may be modified and shared by FRC teams. The code   */
/* must be accompanied by the FIRST BSD license file in the root directory of */
/* the project.                                                               */
/*----------------------------------------------------------------------------*/

#include "Robot.h"

#include <iostream>
#include <cscore.h>

void Robot::RobotInit() {   
     // Creates UsbCamera and MjpegServer [1] and connects them
    cs::UsbCamera usbCamera("USB Camera 0", 0);
    cs::MjpegServer mjpegServer1("serve_USB Camera 0", 1181);
    mjpegServer1.SetSource(usbCamera);

    // Creates the CvSink and connects it to the UsbCamera
    cs::CvSink cvSink("opencv_USB Camera 0");
    cvSink.SetSource(usbCamera);

    // Creates the CvSource and MjpegServer [2] and connects them
    cs::CvSource outputStream("Blur", cs::VideoMode::kMJPEG, 640, 480, 30);
    cs::MjpegServer mjpegServer2("serve_Blur", 1182);
    mjpegServer2.SetSource(outputStream);
}


void Robot::RobotPeriodic() {}

void Robot::AutonomousInit() {
}

void Robot::AutonomousPeriodic() {
}

void Robot::TeleopInit() {}

void Robot::TeleopPeriodic() {}

void Robot::TestPeriodic() {}

#ifndef RUNNING_FRC_TESTS
int main() { return frc::StartRobot<Robot>(); }
#endif
