Robot Preemptive Troubleshooting
====================================

.. note::

    In FIRST Robotics Competion, robots take a lot of stress while driving around the field. It is important to make sure that connections are tight, parts are bolted securely in place and that everthing is mounted so that a robot bouncing around the field does not break.

Check battery connections
------------------------------

.. image:: images/preCheckBatt.png
   :width: 400

The tape the should be covering the battery connection in these examples has been removed to illustrate what is going on. On your robots, the connections should be covered.

Wiggle battery harness connector. Often these are loose because the screws loosen, or sometimes the crimp is not completely closed.  You will only catch the really bad ones though because often the electrical tape stiffens the connection to a point where it feels stiff. Using a voltmeter or Battery Beak will help with this.

Apply considerable force onto the battery cable at 90 degrees to try to move the direction of the cable leaving the battery, if successful the connection was not tight enough to begin with and it should be redone.

Secure the battery to robot connection
------------------------------------------------------------------

.. image:: images/preCheckConnecc.png
   :width: 400

In almost every event we see at least one robot where a not properly secured battery connector (the large Anderson) comes apart and disconnects power from the robot. This has happened in championship matches on the Einstein and everywhere else. Its an easy to ensure that this doesn't happen to you by securing the two connectors by wrapping a tie wrap around the connection. 10 or 12 tie wraps for the piece of mind during an event is not a high price to pay to guarantee that you will not have the problem of this robot from an actual event after a bumpy ride over a defense.

120 Amp circuit breaker
------------------------------------

.. image:: images/preCheckBreaker.png
   :width: 400

Apply a twisting force onto the cable to rotate the harness.  If you are successful then the screw is not tight enough.  Split washers might help here, but in the mean time, these require checking every few matches.

Because the metal is just molded into the case, every once in awhile you will break off the bolt, ask any veteran team and they’ll tell you they go through a number of these every few seasons.  After tightening the nut, retest by once again trying to twist the cable.

Power Distribution Panel (PDP)
------------------------------------

.. image:: images/preCheckPDP.png
   :width: 700

Make sure that split washers were placed under the PDP screws, but it is not easy to visually confirm, and sometimes you can’t.  You can check by removing the case.    Also if you squeeze the red and black wires together, sometimes you can catch the really lose connections.

Tug test everything
------------------------------------

.. image:: images/preCheckTug.png
   :width: 700

The Weidmuller contacts for power, compressor output, roboRIO power connector, and radio power are important to verify by tugging on the connections as shown.  Make sure that none of the connections pull out.

Look for possible or impending shorts with Weidmuller connections that are close to each other, and have too-long wire-lead lengths (wires that are stripped extra long).

Spade connectors can also fail due to improper crimps, so tug-test those as well.

Blade fuses
------------------------------------

.. image:: images/preCheckFuse.png
   :width: 600

If you can remove the blade fuses by hand then they are not in completely. Make sure that they are completely seated in the PDP so that they don't pop out during robot operation.

RoboRIO swarf
------------------------------------

Swarf is: fine chips or filings of stone, metal, or other material produced by a machining operation. Often modifications must be made to a robot while the control system parts are in place. The circuit board for the roboRIO is conformally coated, but that doesn't absolutely guarantee that metal chips won't short out traces or components inside the case. In this case, you must exercise care in making sure that none of the chips end up in the roboRIO or any of the other components. In particular, the exposed 3 pin headers are a place where chips can enter the case. A quick sweep through each of the four sides with a flashlight is usually sufficient to find the really bad areas of infiltration.

Radio barrel jack
------------------------------------

Make sure the correct barrel jack is used, not one that is too small and falls out for no reason.  This isn’t common, but ask an FTA and every once in awhile a team will use some random barrel jack that is not sized correctly, and it falls out in a match on first contact.

Ethernet cable
------------------------------------

If the RIO to radio ethernet cable is missing the clip that locks the connector in, get another cable.  This is a common problem that will happen several times in every competition. Make sure that your cables are secure. The clip often breaks off, especially when pulling it through a tight path, it snags on something then breaks.

Cable slack
------------------------------------

Cables must be tightened down, particularly the radio power and ethernet cable.  The radio power cables don’t have a lot of friction force and will fall out (even if it is the correct barrel) if the weight of the cable-slack is allowed to swing freely.

Ethernet cable is also pretty heavy, if it’s allowed to swing freely, the plastic clip may not be enough to hold the ethernet pin connectors in circuit.

Reproducing problems in the pit
------------------------------------

Beyond the normal shaking and rattling of all cables while the robot is power and tethered, you might try picking up one side of the robot  off the ground and drop it, and see if you lose connection. The driving on the field, especially when trying to breach defenses will often be very violent. It's better to see it fail in the pit rather than in a critical match.

When doing this test it’s important to be ethernet tethered and not USB tethered, otherwise you are not testing all of the critical paths.
Check firmware and versions

Robot inspectors do this, but you should do it as well, it helps robot inspectors out and they appreciate it.  And it guarantees that you are running with the most recent, bug fixed code. You wouldn't want to lose a match because of an out of date piece of control system software on your robot.

Driver station checks
------------------------------------

We often see problems with the Drivers Station. You should:

- ALWAYS bring the laptop power cable to the field, it doesn’t matter how good the battery is, you are allowed to plug in at the field.
- Check the power and sleep settings, turn off sleep and hybernate, screen savers, etc.
- Turn off power management for USB devices (dev manager)
- Turn off power management for ethernet ports (dev manager)
- Turn off windows defender
- Turn off firewall
- Close all apps except for DS/Dashboard when out on the field.
- Verify that there is nothing unnecessary running in the application tray in the start menu (bottom right side)

Handy tools
------------------------------------

.. image:: images/preCheckTools.png
   :width: 400

There never seems to be enough light inside robots, at least not enough to scrutinize the critical connection points, so consider using a handheld LED flashlight to inspect the connections on your robot. They're available from home depot or any hardware/automotive store.

Wago tool is nice to for redoing weidmuller connections with stranded wires.  Often I’ll do one to show the team, and then have them do the rest using the WAGO tool to press down the white-plunger while they insert the stranded wire.  The angle of the WAGO tool makes this particularly helpful.
