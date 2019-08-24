/*----------------------------------------------------------------------------*/
/* Copyright (c) 2017-2018 FIRST. All Rights Reserved.                        */
/* Open Source Software - may be modified and shared by FRC teams. The code   */
/* must be accompanied by the FIRST BSD license file in the root directory of */
/* the project.                                                               */
/*----------------------------------------------------------------------------*/

#include "Robot.h"

#include <iostream>
#include <cameraserver/CameraServer.h>

void Robot::RobotInit() {
    // Creates UsbCamera and MjpegServer [1] and connects them
    frc::CameraServer::GetInstance()->StartAutomaticCapture();

     // Creates the CvSink and connects it to the UsbCamera
    cs::CvSink cvSink = frc::CameraServer::GetInstance()->GetVideo();

    // Creates the CvSource and MjpegServer [2] and connects them
    cs::CvSource outputStream = frc::CameraServer::GetInstance()->PutVideo("Blur", 640, 480);
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
