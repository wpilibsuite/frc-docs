# Custom Struct and Protobuf Serialization

NetworkTables supports serialization of complex data types using Struct and Protobuf encoding formats. While many WPILib classes include built-in serializers, teams can create custom serializers for their own data types to send them over NetworkTables or log them with DataLog.

## When to Use Custom Serialization

Custom serialization is useful when you want to:

* Send custom data types over NetworkTables to dashboards or coprocessors
* Log custom data types with :doc:`DataLog </docs/software/telemetry/datalog>` or :doc:`Epilogue </docs/software/telemetry/robot-telemetry-with-annotations>`
* Create efficient binary representations of your data structures
* Maintain type safety when communicating complex data

## Struct vs Protobuf

**Struct serialization** is designed for fixed-size data structures and provides the fastest and most compact encoding. Use struct serialization when:

* Your data type has a fixed size (no variable-length strings or arrays)
* Performance and compact size are priorities
* You have simple data structures with primitive types

**Protobuf serialization** offers more flexibility for variable-size data. Use protobuf serialization when:

* Your data type contains variable-length fields (strings, arrays, lists)
* You need forward/backward compatibility
* You have nested or complex data structures

## Implementing Struct Serialization

To implement struct serialization for a custom type, you need to:

1. Make your class implement the ``StructSerializable`` interface
2. Create a ``Struct`` implementation class
3. Add a static ``struct`` field to your class

### Example: Custom Robot State

Here's a complete example of a custom ``RobotState`` class with struct serialization:

.. tab-set::

    .. tab-item:: Java
       :sync: Java

       First, define your custom class and make it implement ``StructSerializable``:

       ```java
       package frc.robot;

       import edu.wpi.first.util.struct.StructSerializable;

       public class RobotState implements StructSerializable {
         public static final RobotStateStruct struct = new RobotStateStruct();

         public double xPosition;
         public double yPosition;
         public double angle;
         public boolean isEnabled;

         public RobotState() {
           this(0.0, 0.0, 0.0, false);
         }

         public RobotState(double xPosition, double yPosition, double angle, boolean isEnabled) {
           this.xPosition = xPosition;
           this.yPosition = yPosition;
           this.angle = angle;
           this.isEnabled = isEnabled;
         }
       }
       ```

       Next, create the ``Struct`` implementation:

       ```java
       package frc.robot;

       import edu.wpi.first.util.struct.Struct;
       import java.nio.ByteBuffer;

       public class RobotStateStruct implements Struct<RobotState> {
         @Override
         public Class<RobotState> getTypeClass() {
           return RobotState.class;
         }

         @Override
         public String getTypeName() {
           return "RobotState";
         }

         @Override
         public int getSize() {
           // 3 doubles (8 bytes each) + 1 boolean (1 byte) = 25 bytes
           return Struct.kSizeDouble * 3 + Struct.kSizeBool;
         }

         @Override
         public String getSchema() {
           // Describe the structure of the data
           return "double x;double y;double angle;bool enabled";
         }

         @Override
         public RobotState unpack(ByteBuffer bb) {
           // Read data from ByteBuffer in the same order as pack()
           double x = bb.getDouble();
           double y = bb.getDouble();
           double angle = bb.getDouble();
           boolean enabled = bb.get() != 0;
           return new RobotState(x, y, angle, enabled);
         }

         @Override
         public void pack(ByteBuffer bb, RobotState value) {
           // Write data to ByteBuffer in the same order as unpack()
           bb.putDouble(value.xPosition);
           bb.putDouble(value.yPosition);
           bb.putDouble(value.angle);
           bb.put((byte) (value.isEnabled ? 1 : 0));
         }
       }
       ```

       Finally, use it with NetworkTables:

       ```java
       import edu.wpi.first.networktables.NetworkTableInstance;
       import edu.wpi.first.networktables.StructPublisher;
       import edu.wpi.first.networktables.StructTopic;

       public class Robot extends TimedRobot {
         private StructTopic<RobotState> stateTopic;
         private StructPublisher<RobotState> statePublisher;

         @Override
         public void robotInit() {
           // Get a struct topic and publisher
           stateTopic = NetworkTableInstance.getDefault()
               .getStructTopic("robot_state", RobotState.struct);
           statePublisher = stateTopic.publish();
         }

         @Override
         public void robotPeriodic() {
           // Publish the current robot state
           RobotState state = new RobotState(
               drivetrain.getX(),
               drivetrain.getY(),
               drivetrain.getAngle(),
               isEnabled()
           );
           statePublisher.set(state);
         }
       }
       ```

    .. tab-item:: C++
       :sync: C++

       First, define your custom struct:

       ```cpp
       #pragma once

       #include <wpi/struct/Struct.h>

       struct RobotState {
         double xPosition;
         double yPosition;
         double angle;
         bool isEnabled;
       };

       // Declare the struct template specialization
       template <>
       struct wpi::Struct<RobotState> {
         static constexpr std::string_view GetTypeName() { return "RobotState"; }
         static constexpr size_t GetSize() {
           return 3 * sizeof(double) + sizeof(bool);
         }
         static constexpr std::string_view GetSchema() {
           return "double x;double y;double angle;bool enabled";
         }

         static RobotState Unpack(std::span<const uint8_t> data);
         static void Pack(std::span<uint8_t> data, const RobotState& value);
       };
       ```

       Implement the Pack and Unpack functions:

       ```cpp
       #include "RobotState.h"
       #include <wpi/struct/Struct.h>

       RobotState wpi::Struct<RobotState>::Unpack(std::span<const uint8_t> data) {
         wpi::UnpackHelper helper{data};
         return RobotState{
           helper.Unpack<double>(),  // xPosition
           helper.Unpack<double>(),  // yPosition
           helper.Unpack<double>(),  // angle
           helper.Unpack<bool>()     // isEnabled
         };
       }

       void wpi::Struct<RobotState>::Pack(std::span<uint8_t> data, const RobotState& value) {
         wpi::PackHelper helper{data};
         helper.Pack(value.xPosition);
         helper.Pack(value.yPosition);
         helper.Pack(value.angle);
         helper.Pack(value.isEnabled);
       }
       ```

       Use it with NetworkTables:

       ```cpp
       #include <frc/TimedRobot.h>
       #include <networktables/NetworkTableInstance.h>
       #include <networktables/StructTopic.h>
       #include "RobotState.h"

       class Robot : public frc::TimedRobot {
        public:
         void RobotInit() override {
           auto inst = nt::NetworkTableInstance::GetDefault();
           m_stateTopic = inst.GetStructTopic<RobotState>("robot_state");
           m_statePublisher = m_stateTopic.Publish();
         }

         void RobotPeriodic() override {
           RobotState state{
             m_drivetrain.GetX(),
             m_drivetrain.GetY(),
             m_drivetrain.GetAngle(),
             IsEnabled()
           };
           m_statePublisher.Set(state);
         }

        private:
         nt::StructTopic<RobotState> m_stateTopic;
         nt::StructPublisher<RobotState> m_statePublisher;
       };
       ```

    .. tab-item:: Python
       :sync: Python

       Define your custom struct using the ``make_wpistruct`` decorator with a dataclass:

       ```python
       import dataclasses
       import wpiutil.wpistruct

       @wpiutil.wpistruct.make_wpistruct
       @dataclasses.dataclass
       class RobotState:
           x_position: float
           y_position: float
           angle: float
           is_enabled: bool
       ```

       Use it with NetworkTables:

       ```python
       from ntcore import NetworkTableInstance

       class MyRobot:
           def robotInit(self):
               # Get a struct topic and publisher
               inst = NetworkTableInstance.getDefault()
               self.state_topic = inst.getStructTopic("robot_state", RobotState)
               self.state_publisher = self.state_topic.publish()

           def robotPeriodic(self):
               # Publish the current robot state
               state = RobotState(
                   x_position=self.drivetrain.get_x(),
                   y_position=self.drivetrain.get_y(),
                   angle=self.drivetrain.get_angle(),
                   is_enabled=self.isEnabled()
               )
               self.state_publisher.set(state)
       ```

## Implementing Protobuf Serialization

.. note:: Protobuf serialization is not currently supported in Python. Python users should use struct serialization for custom data types.

Protobuf serialization requires defining a ``.proto`` file and generating code from it. This is more complex but handles variable-sized data.

### Example: Custom Target Information

.. tab-set::

    .. tab-item:: Java
       :sync: Java

       First, create a ``.proto`` file (e.g., ``target_info.proto``):

       ```protobuf
       syntax = "proto3";

       package frc.robot;

       message ProtobufTargetInfo {
         double distance = 1;
         double angle = 2;
         string target_name = 3;
         bool is_valid = 4;
       }
       ```

       Use the protobuf compiler (``protoc``) to generate Java code from the ``.proto`` file. Consult the [Protocol Buffers documentation](https://protobuf.dev) for details.

       Then implement the ``Protobuf`` interface:

       ```java
       package frc.robot;

       import edu.wpi.first.util.protobuf.Protobuf;
       import frc.robot.proto.ProtobufTargetInfo;
       import us.hebi.quickbuf.ProtoMessage;

       public class TargetInfoProto implements Protobuf<TargetInfo, ProtobufTargetInfo> {
         @Override
         public Class<TargetInfo> getTypeClass() {
           return TargetInfo.class;
         }

         @Override
         public ProtoMessage<?> createMessage() {
           return ProtobufTargetInfo.newInstance();
         }

         @Override
         public TargetInfo unpack(ProtobufTargetInfo msg) {
           return new TargetInfo(
               msg.getDistance(),
               msg.getAngle(),
               msg.getTargetName().toString(),
               msg.getIsValid()
           );
         }

         @Override
         public void pack(ProtobufTargetInfo msg, TargetInfo value) {
           msg.setDistance(value.distance)
              .setAngle(value.angle)
              .setTargetName(value.targetName)
              .setIsValid(value.isValid);
         }
       }
       ```

       Create your ``TargetInfo`` class:

       ```java
       package frc.robot;

       import edu.wpi.first.util.protobuf.ProtobufSerializable;

       public class TargetInfo implements ProtobufSerializable {
         public static final TargetInfoProto proto = new TargetInfoProto();

         public double distance;
         public double angle;
         public String targetName;
         public boolean isValid;

         public TargetInfo(double distance, double angle, String targetName, boolean isValid) {
           this.distance = distance;
           this.angle = angle;
           this.targetName = targetName;
           this.isValid = isValid;
         }
       }
       ```

       Use it with NetworkTables:

       ```java
       import edu.wpi.first.networktables.NetworkTableInstance;
       import edu.wpi.first.networktables.ProtobufPublisher;
       import edu.wpi.first.networktables.ProtobufTopic;

       // In your robot class
       ProtobufTopic<TargetInfo> targetTopic =
           NetworkTableInstance.getDefault()
               .getProtobufTopic("vision/target", TargetInfo.proto);
       ProtobufPublisher<TargetInfo> targetPublisher = targetTopic.publish();

       // Publish target information
       TargetInfo target = new TargetInfo(2.5, 15.3, "High Goal", true);
       targetPublisher.set(target);
       ```

    .. tab-item:: C++
       :sync: C++

       C++ protobuf implementation follows a similar pattern:

       Create your ``.proto`` file:

       ```protobuf
       syntax = "proto3";

       package frc.robot;

       message ProtobufTargetInfo {
         double distance = 1;
         double angle = 2;
         string target_name = 3;
         bool is_valid = 4;
       }
       ```

       Generate C++ code using ``protoc``, then use it with NetworkTables:

       ```cpp
       #include <networktables/NetworkTableInstance.h>
       #include <networktables/ProtobufTopic.h>
       #include "TargetInfo.pb.h"

       // In your robot class
       auto inst = nt::NetworkTableInstance::GetDefault();
       auto targetTopic = inst.GetProtobufTopic<frc::robot::ProtobufTargetInfo>("vision/target");
       auto targetPublisher = targetTopic.Publish();

       // Publish target information
       frc::robot::ProtobufTargetInfo target;
       target.set_distance(2.5);
       target.set_angle(15.3);
       target.set_target_name("High Goal");
       target.set_is_valid(true);
       targetPublisher.Set(target);
       ```

## Important Considerations

### Struct Serialization

* **Fixed Size**: All struct fields must have a fixed size. You cannot use variable-length strings or arrays.
* **Byte Order**: Data is serialized in the order specified in ``pack()`` and must be deserialized in the same order in ``unpack()``.
* **Alignment**: Be mindful of data alignment when calculating struct sizes.
* **Schema String**: The schema string should accurately describe your data structure for debugging and introspection.

### Protobuf Serialization

* **Proto File**: You must create a ``.proto`` file and generate code using the protobuf compiler.
* **Dependencies**: Ensure protobuf dependencies are properly configured in your build system.
* **Version Compatibility**: Protobuf provides better forward/backward compatibility than struct serialization.
* **Variable Size**: Protobuf handles variable-length data automatically but has more overhead than struct.

## Using Custom Serialization with DataLog

Both struct and protobuf serialized types can be logged with DataLog:

.. tab-set::

    .. tab-item:: Java
       :sync: Java

       ```java
       import edu.wpi.first.util.datalog.DataLog;
       import edu.wpi.first.util.datalog.StructLogEntry;

       // Create a struct log entry
       DataLog log = DataLogManager.getLog();
       StructLogEntry<RobotState> stateLogger =
           StructLogEntry.create(log, "robot_state", RobotState.struct);

       // Log data
       RobotState state = new RobotState(1.0, 2.0, 90.0, true);
       stateLogger.append(state);
       ```

    .. tab-item:: C++
       :sync: C++

       ```cpp
       #include <wpi/DataLog.h>
       #include <wpi/struct/StructLogEntry.h>

       // Create a struct log entry
       wpi::log::DataLog& log = frc::DataLogManager::GetLog();
       wpi::log::StructLogEntry<RobotState> stateLogger{log, "robot_state"};

       // Log data
       RobotState state{1.0, 2.0, 90.0, true};
       stateLogger.Append(state);
       ```

    .. tab-item:: Python
       :sync: Python

       ```python
       from wpiutil.log import DataLogManager, StructLogEntry

       # Create a struct log entry
       log = DataLogManager.getLog()
       state_logger = StructLogEntry.create(log, "robot_state", RobotState)

       # Log data
       state = RobotState(x_position=1.0, y_position=2.0, angle=90.0, is_enabled=True)
       state_logger.append(state)
       ```

## Using Custom Serialization with Epilogue

Custom serialized types can be automatically logged using :doc:`Epilogue annotations </docs/software/telemetry/robot-telemetry-with-annotations>`:

.. tab-set::

    .. tab-item:: Java
       :sync: Java

       ```java
       import edu.wpi.first.epilogue.Logged;
       import edu.wpi.first.epilogue.Epilogue;

       @Logged
       public class Drivetrain {
         private RobotState m_state = new RobotState();

         public RobotState getState() {
           return m_state;
         }

         // Epilogue will automatically log the RobotState using struct serialization
       }
       ```

    .. tab-item:: Python
       :sync: Python

       ```python
       from wpilib import TimedRobot

       class Drivetrain:
           def __init__(self):
               self.state = RobotState(x_position=0.0, y_position=0.0, angle=0.0, is_enabled=False)

           def get_state(self):
               return self.state

           # Epilogue will automatically log the RobotState using struct serialization
       ```

For Epilogue to recognize your custom type, ensure your class implements ``StructSerializable`` or ``ProtobufSerializable`` and has a static ``struct`` or ``proto`` field (Java), or is decorated with ``@wpiutil.wpistruct.make_wpistruct`` (Python).

## Additional Resources

* [WPILib Struct API Documentation](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/util/struct/Struct.html)
* [WPILib Protobuf API Documentation](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/util/protobuf/Protobuf.html)
* [Protocol Buffers Documentation](https://protobuf.dev)
* [NetworkTables Topics Documentation](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/networktables/NetworkTable.html)
