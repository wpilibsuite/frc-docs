Input/Output Safety Mechanisms Built into the `FRC` Control System
============================================================================

roboRIO Control System
^^^^^^^^^^^^^^^^^^^^^^

There are multiple safety mechanisms on the robot that handle input / output operations while it is powered on.

Robot side: there are multiple hardware and software components involved. Outputs of the RoboRIO (e.g. :term:`PWM` s) are controlled by the :term:`FPGA` hardware. :term:`NetComm` is a software daemon that talks to the DS, the FPGA, and the user program. Inside of the user process \(the team\’s robot program\), there\’s a NetComm :term:`DLL` component that talks to the FPGA, CAN, and the NetComm daemon. And of course there are CAN motor controllers on the CAN bus.

- The FPGA has a system :term:`watchdog`. This watchdog will time out and force a “disable” of PWM motor outputs if NetComm hasn\’t told it it\’s received an enable packet in the last 125 `ms`.
- The NetComm DLL in the user process will send a disable broadcast message on the CAN network and then stop sending keep-alive CAN messages after the disabled system watchdog signal is read back from the FPGA \(this is checked on a 20 `ms` loop\). REV pneumatics and motor controllers will stop immediately upon receipt of the disable broadcast. They also stop if no keep-alive is received for 100 `ms` \(pneumatics\) or 220 `ms` \(motor controllers\).
- The PWM disable works by sending a single idle pulse to the motor controller at the start of the next 20 `ms` PWM cycle after the disable condition is set, and following that, stopping output on the PWM signal line.
- When NetComm receives a control packet from the DS with enable set to true, it will immediately enable motors \(and restart the FPGA watchdog timer\).
- A count of watchdog expiration events is sent by NetComm to the DS, so this data is in the DS log.

Software Side:

- The DS sends a control packet to the robot every 20 `ms`. This is on a high-priority timed loop. Other loops in the DS, including the joystick and GUI loops, run at lower priority. What this means is that under poor CPU conditions or rendering delays \(e.g. large amounts of console output\), it\’s possible for the DS to have internal delay between disable being clicked, a key being hit, or joystick inputs being read to those changes being reflected in the control packets being sent to the robot.
- Control \(DS->Robot\) and status \(Robot->DS\) packets have an embedded sequence number. The DS uses these to compute round-trip-time and packet loss. A status packet that\’s returned is marked as “lost” if the RTT is greater than ~250 ms. This does not mean it was actually missing \(no response received\). The DS does keep a separate count of truly missing \(e.g. no response\) packets and disables \(starts sending control packets with enable=false\) after ~10 drops occur \(so I think this works out to ~450 ms, assuming it\’s 250+10*20\).
- High CPU / GUI delays result in the DS continuing to send packets with enable=true for a period of time until that loop is notified a disable occurs.

Known Issues / Potential Fault Conditions:
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

- There is no upper limit to control lag. As long as packets keep arriving, they may be several seconds delayed from the DS, so a disable command from the DS would take the same amount of time to be reflected in robot operation. Once it\’s delayed, all controls, including disable/estop, will be delayed. We\’ve all seen delays increase either slowly or quickly\–the robot was controllable until it\’s suddenly much more laggy, or even been laggy from the start.
- Packet buffering / wifi retransmits of control packets result in sporadic enable packets making it to the robot after some delay. The watchdog would disable after 125 `ms`, but a single enable packet would re-enable motors for another 125 `ms` at a time.
