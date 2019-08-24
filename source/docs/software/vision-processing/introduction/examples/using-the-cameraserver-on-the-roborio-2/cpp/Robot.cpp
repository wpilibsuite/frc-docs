/*----------------------------------------------------------------------------*/
/* Copyright (c) 2017-2018 FIRST. All Rights Reserved.                        */
/* Open Source Software - may be modified and shared by FRC teams. The code   */
/* must be accompanied by the FIRST BSD license file in the root directory of */
/* the project.                                                               */
/*----------------------------------------------------------------------------*/

#include "Robot.h"

#include <iostream>
#include <cameraserver/CameraServer.h>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/core/core.hpp>

void VisionThread() {
    cs::UsbCamera camera = frc::CameraServer::GetInstance()->StartAutomaticCapture();
    camera.SetResolution(640, 480);
    cs::CvSink cvSink = frc::CameraServer::GetInstance()->GetVideo();
    cs::CvSource outputStreamStd = frc::CameraServer::GetInstance()->PutVideo("Gray", 640, 480);
    cv::Mat source;
    cv::Mat output;
    
    while(true) {
        if (cvSink.GrabFrame(source) == 0) {
            continue;
        }
        cvtColor(source, output, cv::COLOR_BGR2GRAY);
        outputStreamStd.PutFrame(output);
    }
}

void Robot::RobotInit() {
    std::thread visionThread(VisionThread);
    visionThread.detach();
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
