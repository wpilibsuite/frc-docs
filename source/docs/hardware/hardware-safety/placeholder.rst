Placeholder for Safety Writeup
==============================

.. Note:: From a Chief Delphi `thread reply <https://www.chiefdelphi.com/t/severe-100-packet-loss/428031/139?u=peter_johnson/>`_ by WPILib Developer Peter Johnson.

I/O Safety
-----------

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

Vendor Components:
^^^^^^^^^^^^^^^^^^

- CTRE uses a custom approach that reads the disable indicator on NetComm and stops motors within 100 `ms` of a disable.

Potential Improvements:
^^^^^^^^^^^^^^^^^^^^^^^

- NetComm \(and the control protocol\) does not currently have a mechanism to detect delayed control packets. \(If it gets a control packet with enable set to true, it will enable the robot and feed the watchdog, even if that packet was sent seconds ago and delayed that much by the network\).
- DS: keyboard events should be processed at the same (or higher) thread priority as the control packet transmit loop. Or there should be an internal watchdog that tracks when the last keyboard/joystick/gui event check happened, and force disables when that expires.
- NetComm: Figure out a way to detect delayed control packets and reduce the probability of “stuttering” on sporadic enable packets. This is a hard problem in the general case, will almost certainly require a protocol change, and has some really tricky corner cases. To take one example: a radio reboot on the field will result in the first thing the robot sees being an enable packet after a period of watchdog. There probably needs to be some kind of predict time for receiving a control packet (to discard overly late ones), as well as timestamps and measured RTT provided by the DS to NetComm in control packets to provide a time sync.

Known Issues / Potential Fault Conditions:
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

- There is no upper limit to control lag. As long as packets keep arriving, they may be several seconds delayed from the DS, so a disable command from the DS would take the same amount of time to be reflected in robot operation. Once it\’s delayed, all controls, including disable/estop, will be delayed. We\’ve all seen delays increase either slowly or quickly\–the robot was controllable until it\’s suddenly much more laggy, or even been laggy from the start.
- Packet buffering / wifi retransmits of control packets result in sporadic enable packets making it to the robot after some delay. The watchdog would disable after 125 ms, but a single enable packet would re-enable motors for another 125 `ms` at a time.
