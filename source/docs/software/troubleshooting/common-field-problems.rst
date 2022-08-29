Common Field Problems
=====================

This article details some of the common problems that can plague your robot when it's on the field. It can be extremely frustrating and stressful when your robot breaks down. This article hopes to inform and instruct on what you can do to find the problem, and it's resolution.

.. important:: Remember to never eliminate any possibility! It never hurts to double or even triple check that everything is working properly.

Robot is stuttering and the RSL lights are dimming
--------------------------------------------------

Whenever your robot seems to give jerking motions and the RSL lights are dimming, this is usually a sign of :doc:`brownouts </docs/software/roborio-info/roborio-brownouts>`. One of the first steps you can take to resolving a brownout is identify when it occurred and any notable correlating events. Did you go into a match with your battery too low? Are you drawing too much current somehow? Can you reproduce this in the pit?

One of the most useful tools for identifying brownout causes is the :doc:`driver station log viewer </docs/software/driverstation/driver-station-log-viewer>`.

.. image:: /docs/software/roborio-info/images/identifying-brownouts.png

In the above image, you can see the brownout indicated by the highlighted orange line. The orange line represents dips (or lack of a straight line) in robot voltage.

Joystick inputs seem to be dropping
-----------------------------------

One of the characteristics of lost joystick inputs is when you press buttons or an axis and nothing happens! This can happen from a variety of reasons, so it's important to analyze which one is likely to your situation.

.. todo:: looking at the driverstation log and identifying if lost joysticks is a code related .. error:: text

.. important:: There is a current :ref:`known issue <docs/yearly-overview/known-issues:onboard i2c causing system lockups>` where I2C reads can take a long time or lock up the roboRIO.

Let's begin by asking a question. Can you reliably reproduce this issue at home or in the pits? This step is critical and assumptions *must not* be made.

Yes, I can
^^^^^^^^^^

This eliminates bandwidth or connectivity issues to the FMS. Some areas to explore are:

- Are joysticks working properly?
  - Sometimes the issue can be as simple as a flakey USB cable or joystick.

- Is the computer running slow or sluggish? Try restarting
  - High CPU or Disk Utilization can be indicators the Driver Station itself is sending inputs late.

- Is the code doing any long computation or loops? (Misuse of `for` and `while` loops can be common problems)
  - In most cases, the use of any loops in FRC robot code can be avoided except in rare circumstances.

No, I cannot
^^^^^^^^^^^^

This is likely a bandwidth or IP configuration issue. Try setting your IP configurations to :ref:`DHCP <docs/networking/networking-introduction/ip-configurations:in the pits dhcp configuration>` or :ref:`Static <docs/networking/networking-introduction/ip-configurations:in the pits static configuration>`. Another potential problem could be excessive bandwidth utilization. Try :ref:`measuring your bandwidth utilization <docs/networking/networking-introduction/measuring-bandwidth-usage:viewing bandwidth usage>`.

Unable to connect to your robot?
--------------------------------

See :ref:`docs/software/troubleshooting/networking:Usual Symptoms`