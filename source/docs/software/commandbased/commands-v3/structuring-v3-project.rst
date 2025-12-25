# Structuring a Commands v3 Project

.. todo::
   This article provides guidance on how to organize a robot code project using Commands v3. Good project structure makes code easier to understand, maintain, and test. This article should help teams establish clean patterns early in their v3 adoption.

## Project Structure Overview

.. todo::
   Describe the recommended file and package organization for v3 projects. Cover:
   - Top-level package structure
   - Where Mechanisms should live (mechanisms/ directory with subdirectories per mechanism)
   - Where command functions/classes should be organized
   - Organization of constants and configuration
   - Separation of concerns between different code areas
   - Example directory tree: Autos.java, ControllerBindings.java, Main.java, Robot.java, mechanisms/ (with subdirectories per mechanism like drive/ containing DriveConstants.java and Drive.java, elevator/ containing ElevatorConstants.java and Elevator.java)

## Robot.java and Controller Bindings

.. todo::
   Explain the organization of Robot.java and controller bindings. Cover:
   - Robot.java is the main organization point (not using RobotContainer pattern)
   - Mechanism instantiation and initialization in Robot.java
   - ControllerBindings.java for organizing button bindings
   - Autos.java for autonomous routine organization
   - Controller/joystick setup
   - Patterns for clean organization without RobotContainer

## Robot.java Setup

.. todo::
   Explain the Robot.java class and v3-specific setup. Cover:
   - Required v3 initialization in robotInit()
   - Periodic methods and what should go in them
   - How v3 uses the scheduler in periodic loops
   - Autonomous vs. teleop initialization
   - Test mode setup for v3
   - What should NOT go in Robot.java (antipatterns)
   - Example Robot.java structure for v3

## Command Organization Strategies

.. todo::
   Describe different approaches to organizing command code. Cover:
   - Commands as factory methods on Mechanisms
   - Commands as standalone functions in command files
   - Commands organized by robot function (intake, shooter, etc.)
   - Commands organized by autonomous routine
   - Reusable command utilities and helpers
   - Trade-offs of different organizational approaches
   - Recommendations for small vs. large codebases
   - Examples of each organizational strategy

## Constants and Configuration

.. todo::
   Explain how to organize constants, configuration, and tuning values. Cover:
   - Where constants should live (Constants.java, separate config classes, etc.)
   - Organizing constants by Mechanism vs. by type
   - Physical constants vs. tuning parameters
   - Using preferences/network tables for live tuning
   - Version control and constants
   - Robot-specific vs. shared constants (multiple robots)
   - Type safety and units for constants
   - Example constants organization patterns

