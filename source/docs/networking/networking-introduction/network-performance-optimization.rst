# Optimizing Network Performance at Competition

This article provides practical guidance for staying within FMS bandwidth limits and ensuring reliable robot communication at competition. Following these recommendations will help prevent connectivity issues and improve overall robot performance.

## Understanding Bandwidth Limits

The Field Management System (FMS) enforces strict bandwidth limits to ensure all robots can communicate reliably:

- **Per Team**: 7 Mbps maximum
- **Total Field**: 42 Mbps (shared across all 6 robots)

.. important:: Exceeding your bandwidth allocation can cause control packets to be delayed or dropped, resulting in robot disconnections or poor responsiveness.

For detailed information about how FMS manages network traffic, see :doc:`fms-network-architecture`.

## Traffic Prioritization

FMS prioritizes network traffic in this order:

1. **Driver Station control packets** (highest priority) - never throttled
2. **NetworkTables data** - throttled if bandwidth exceeded
3. **Camera streams and custom data** - heavily throttled if bandwidth exceeded

.. note:: While control packets are protected, excessive bandwidth usage from cameras or NetworkTables can still affect overall robot performance by saturating your network connection.

## Camera Stream Optimization

Camera streams are typically the largest consumer of bandwidth. Follow these guidelines:

### Resolution and Frame Rate

**Recommended Settings:**
- Resolution: 320x240 or 160x120 for driver cameras
- Frame rate: 15-20 fps (avoid 30 fps unless necessary)
- Compression: Medium to high JPEG compression

**Example Bandwidth Usage:**
- 320x240 @ 15 fps = ~2-3 Mbps
- 640x480 @ 30 fps = ~6-8 Mbps (uses almost entire allocation!)
- 160x120 @ 15 fps = ~0.5-1 Mbps

.. code-block:: java

   // Example: Configure camera for competition bandwidth
   UsbCamera camera = CameraServer.startAutomaticCapture();
   camera.setResolution(320, 240);
   camera.setFPS(15);

.. warning:: Streaming multiple high-resolution cameras simultaneously will almost certainly exceed the 7 Mbps limit. Use lower resolutions or disable extra cameras during matches.

### Vision Processing Cameras

For vision processing cameras (Limelight, PhotonVision, etc.):

- Stream **processed output only**, not raw camera feed
- Use the vision processor's built-in stream (already optimized)
- Disable unnecessary dashboard streams during matches
- Send targeting data via NetworkTables (minimal bandwidth) instead of streaming annotated video

### Camera Best Practices

.. list-table::
   :header-rows: 1
   :widths: 50 50

   * - Do
     - Don't
   * - Use 320x240 or lower resolution
     - Stream 720p or 1080p video
   * - Limit to 15-20 fps
     - Use 30+ fps unnecessarily
   * - Stream only essential cameras
     - Stream multiple cameras simultaneously
   * - Use medium/high JPEG compression
     - Use lossless or low compression
   * - Disable streams when not needed
     - Leave all cameras running all the time

## NetworkTables Optimization

NetworkTables is efficient by default, but poor usage patterns can waste bandwidth:

### Update Rates

.. code-block:: java

   // BAD: Updating every loop (50+ times per second)
   public void teleopPeriodic() {
     SmartDashboard.putNumber("Encoder", encoder.get());
   }

   // GOOD: Update at lower frequency (10 times per second)
   public void teleopPeriodic() {
     counter++;
     if (counter % 5 == 0) {  // Every 5th loop = ~10 Hz
       SmartDashboard.putNumber("Encoder", encoder.get());
     }
   }

.. code-block:: python

   # GOOD: Only update when value changes significantly
   last_position = 0

   def teleopPeriodic(self):
       current_position = self.encoder.get()
       if abs(current_position - self.last_position) > 0.1:
           SmartDashboard.putNumber("Encoder", current_position)
           self.last_position = current_position

### Data Selection

**Publish Only What's Needed:**
- Dashboard displays should show only essential information during matches
- Debug data should be disabled or reduced during competition
- Avoid publishing large arrays or strings frequently

**Use Appropriate Data Types:**
- Booleans use less bandwidth than doubles
- Integers use less bandwidth than strings
- Avoid sending redundant data (e.g., both raw sensor value and calculated result if one can be derived)

### NetworkTables Best Practices

.. list-table::
   :header-rows: 1
   :widths: 50 50

   * - Do
     - Don't
   * - Update at 10 Hz or less
     - Update every robot loop (50 Hz)
   * - Update only when values change
     - Always publish, even if unchanged
   * - Use booleans and numbers
     - Use strings or large arrays
   * - Publish essential data only
     - Publish all debug data during matches

## Measuring Your Bandwidth Usage

Use the :doc:`measuring-bandwidth-usage` tools to verify your robot stays under the 7 Mbps limit:

1. Connect to your robot as if at competition (via radio)
2. Enable your robot and drive as you would during a match
3. Use the bandwidth measurement tool to monitor usage
4. Identify and optimize any high-bandwidth sources

.. note:: Test with all cameras and telemetry enabled as they would be during a real match, not just with minimal systems.

## Disabling Bandwidth-Heavy Features

Consider creating a "competition mode" that disables non-essential features:

.. code-block:: java

   public class Robot extends TimedRobot {
     private boolean competitionMode = true;  // Set via dashboard or SmartDashboard

     public void robotPeriodic() {
       if (competitionMode) {
         // Disable extra cameras
         secondaryCamera.setConnectionStrategy(ConnectionStrategy.kKeepOpen);
         // Reduce telemetry update rate
         telemetryCounter++;
         if (telemetryCounter % 10 == 0) {
           updateTelemetry();
         }
       } else {
         // Full telemetry for testing
         updateTelemetry();
       }
     }
   }

.. code-block:: python

   class MyRobot(wpilib.TimedRobot):
       def robotInit(self):
           self.competition_mode = True

       def robotPeriodic(self):
           if self.competition_mode:
               # Reduce update frequency
               if self.telemetry_counter % 10 == 0:
                   self.update_telemetry()
           else:
               self.update_telemetry()

## Common Bandwidth Problems and Solutions

**Problem**: Robot disconnects intermittently during matches
- **Likely Cause**: Bandwidth exceeded, causing control packet delays
- **Solution**: Reduce camera resolution/frame rate, lower NetworkTables update frequency

**Problem**: Dashboard updates slowly or freezes
- **Likely Cause**: Too much NetworkTables data or camera stream saturating connection
- **Solution**: Publish less data, lower camera bandwidth

**Problem**: Camera stream is choppy or stutters
- **Likely Cause**: Other traffic (NetworkTables) competing for bandwidth
- **Solution**: Lower camera frame rate, reduce NetworkTables updates

**Problem**: Vision processing delays
- **Likely Cause**: Network latency from bandwidth saturation
- **Solution**: Process vision on coprocessor, send only targeting data via NetworkTables

## Competition Day Checklist

Before each match, verify:

- [ ] Camera resolution set to 320x240 or lower
- [ ] Camera frame rate set to 15-20 fps
- [ ] Only essential cameras enabled
- [ ] NetworkTables updates at 10 Hz or less
- [ ] Bandwidth measured under 7 Mbps during practice
- [ ] Non-essential debug telemetry disabled
- [ ] Dashboard showing only essential match data

## Bandwidth Budget Example

Here's a sample bandwidth allocation that stays well under the 7 Mbps limit:

.. list-table::
   :header-rows: 1
   :widths: 40 30 30

   * - System
     - Bandwidth
     - Notes
   * - Driver Station Control
     - ~0.1 Mbps
     - Always prioritized
   * - Driver Camera (320x240 @ 15 fps)
     - 2.5 Mbps
     - Primary driver view
   * - NetworkTables (10 Hz updates)
     - 0.2 Mbps
     - Essential telemetry only
   * - Vision Targeting Data
     - 0.1 Mbps
     - Processed results via NT
   * - **Total**
     - **2.9 Mbps**
     - **Well under 7 Mbps limit**

This leaves ~4 Mbps of headroom for bursts and ensures reliable communication.

## Key Takeaways

- Keep total bandwidth under 7 Mbps (measure to verify)
- Use 320x240 @ 15 fps for driver cameras
- Update NetworkTables at 10 Hz or less
- Publish only essential data during matches
- Test bandwidth usage before competition
- Create a "competition mode" to disable non-essential features
- Remember: control packets are protected, but bandwidth saturation still causes problems

For more details on network architecture, see :doc:`fms-network-architecture`. For port and protocol information, see :doc:`fms-ports-protocols`.
