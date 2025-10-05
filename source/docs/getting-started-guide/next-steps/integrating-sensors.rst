.. include:: <isonum.txt>

# Integrating Sensors

Sensors provide critical feedback about your robot's state and environment. This page introduces common sensors and how to integrate them into your robot code.

## Why Use Sensors?

Sensors enable your robot to:

- Know its position and orientation
- Detect objects and game pieces
- Measure speed and acceleration
- Determine if mechanisms are in position
- Navigate autonomously

## Common FRC Sensors

### Encoders

**Purpose**: Measure rotation of wheels, arms, or other mechanisms

**Types**:
- Quadrature encoders (relative position)
- Absolute encoders (fixed position reference)
- Through-bore encoders (direct shaft mounting)

**Use Cases**:
- Measuring drive distance
- Arm position control
- Velocity measurement

**Learn More**: :doc:`/docs/hardware/sensors/encoders-hardware`

### Gyroscopes

**Purpose**: Measure robot rotation and orientation

**Common Models**:
- NavX (Kauai Labs)
- Pigeon 2.0 (CTRE)
- ADIS16470 IMU (Analog Devices)

**Use Cases**:
- Maintaining straight driving
- Turning to specific angles
- Field-relative driving
- Pose estimation

**Learn More**: :doc:`/docs/hardware/sensors/gyros-hardware`

### Limit Switches

**Purpose**: Detect when mechanism reaches end of travel

**Types**:
- Mechanical switches
- Magnetic reed switches
- Optical sensors

**Use Cases**:
- Homing mechanisms to known position
- Preventing over-travel
- Detecting game piece presence

**Learn More**: :doc:`/docs/hardware/sensors/proximity-switches`

### Distance Sensors

**Purpose**: Measure distance to objects

**Types**:
- Ultrasonic sensors
- Time-of-flight (ToF) sensors
- LIDAR

**Use Cases**:
- Object detection
- Collision avoidance
- Precise positioning

**Learn More**: :doc:`/docs/hardware/sensors/lidar`

### Vision Cameras

**Purpose**: Identify and locate visual targets

**Common Solutions**:
- Limelight
- PhotonVision
- Custom OpenCV

**Use Cases**:
- AprilTag detection
- Retroreflective target tracking
- Game piece detection
- Full-field localization

**Learn More**: :doc:`/docs/getting-started-guide/building-your-robot/vision-options`

## Basic Sensor Integration

### Reading a Digital Input

.. tab-set::
   .. tab-item:: Java

      .. code-block:: java

         import edu.wpi.first.wpilibj.DigitalInput;

         private final DigitalInput limitSwitch = new DigitalInput(0);

         public boolean isAtLimit() {
           return !limitSwitch.get(); // Often inverted
         }

   .. tab-item:: C++

      .. code-block:: cpp

         #include <frc/DigitalInput.h>

         frc::DigitalInput m_limitSwitch{0};

         bool IsAtLimit() {
           return !m_limitSwitch.Get(); // Often inverted
         }

   .. tab-item:: Python

      .. code-block:: python

         from wpilib import DigitalInput

         self.limitSwitch = DigitalInput(0)

         def isAtLimit(self) -> bool:
             return not self.limitSwitch.get()  # Often inverted

### Reading an Encoder

.. tab-set::
   .. tab-item:: Java

      .. code-block:: java

         import edu.wpi.first.wpilibj.Encoder;

         private final Encoder encoder = new Encoder(0, 1);

         public DriveSubsystem() {
           encoder.setDistancePerPulse(0.1);  // Adjust for your robot
         }

         public double getDistance() {
           return encoder.getDistance();
         }

   .. tab-item:: C++

      .. code-block:: cpp

         #include <frc/Encoder.h>

         frc::Encoder m_encoder{0, 1};

         DriveSubsystem() {
           m_encoder.SetDistancePerPulse(0.1);  // Adjust for your robot
         }

         double GetDistance() {
           return m_encoder.GetDistance();
         }

   .. tab-item:: Python

      .. code-block:: python

         from wpilib import Encoder

         self.encoder = Encoder(0, 1)
         self.encoder.setDistancePerPulse(0.1)  # Adjust for your robot

         def getDistance(self) -> float:
             return self.encoder.getDistance()

### Reading a Gyroscope

.. tab-set::
   .. tab-item:: Java

      .. code-block:: java

         import com.kauailabs.navx.frc.AHRS;
         import edu.wpi.first.wpilibj.SPI;

         private final AHRS gyro = new AHRS(SPI.Port.kMXP);

         public void resetGyro() {
           gyro.reset();
         }

         public double getHeading() {
           return gyro.getAngle();
         }

   .. tab-item:: C++

      .. code-block:: cpp

         #include <AHRS.h>

         AHRS m_gyro{frc::SPI::Port::kMXP};

         void ResetGyro() {
           m_gyro.Reset();
         }

         double GetHeading() {
           return m_gyro.GetAngle();
         }

   .. tab-item:: Python

      .. code-block:: python

         from navx import AHRS

         self.gyro = AHRS.create_spi()

         def resetGyro(self):
             self.gyro.reset()

         def getHeading(self) -> float:
             return self.gyro.getAngle()

## Sensor Best Practices

### Calibration

- Zero sensors when robot initializes
- Allow gyros time to calibrate on startup
- Account for sensor drift over time

### Filtering

- Use moving averages for noisy sensors
- Apply deadbands to eliminate jitter
- Consider WPILib's ``LinearFilter`` class

### Error Handling

- Check if sensor is connected
- Handle sensor failures gracefully
- Log sensor data for debugging

## Next Steps

- Learn about command scheduling to use sensor data in commands
- Explore basic PID tuning to use sensors for closed-loop control
- Read :doc:`/docs/user-manual/hardware-interfaces/index` for advanced sensor topics
- See :doc:`/docs/software/commandbased/command-scheduler` for command scheduling details
- See :doc:`/docs/software/advanced-controls/introduction/introduction-to-pid` for PID control

## Additional Resources

- :doc:`/docs/hardware/sensors/index` - Complete sensor hardware documentation
- :doc:`/docs/software/hardware-apis/sensors/index` - Sensor programming APIs
- Vendor documentation for specific sensors
