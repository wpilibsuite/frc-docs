# Structuring a Commands v3 Project

.. todo::
   This article provides guidance on how to organize a robot code project using Commands v3. Good project structure makes code easier to understand, maintain, and test. This article should help teams establish clean patterns early in their v3 adoption.

## Project Structure Overview

.. todo::
   Describe the recommended file and package organization for v3 projects. Cover:
   - Top-level package structure
   - Where Mechanisms should live
   - Where command functions/classes should be organized
   - Organization of constants and configuration
   - Separation of concerns between different code areas
   - How v3 structure differs from v2 structure
   - Example directory tree showing recommended organization

## RobotContainer Design

.. todo::
   Explain the role and design of the RobotContainer class. Cover:
   - What RobotContainer is responsible for in v3
   - How to structure RobotContainer for maintainability
   - Mechanism instantiation and initialization
   - Controller/joystick setup
   - Button binding organization
   - Autonomous routine selection
   - Patterns for large RobotContainer classes (splitting into methods or subclasses)
   - Example RobotContainer structure (describe sections, not full implementation)

## Robot.java Setup

.. todo::
   Explain the Robot.java class and v3-specific setup. Cover:
   - Required v3 initialization in robotInit()
   - Periodic methods and what should go in them
   - How v3 uses the scheduler in periodic loops
   - Autonomous vs. teleop initialization
   - Test mode setup for v3
   - Simulation support hooks
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

## Testing Structure

.. todo::
   Describe how to structure test code for v3 projects. Cover:
   - Where test files should live relative to main code
   - Unit test organization (per-Mechanism, per-command, etc.)
   - Integration test organization
   - Test utilities and fixtures
   - Mocking Mechanisms and hardware for command tests
   - Simulation test setup
   - CI/CD integration considerations
   - Example test directory structure
