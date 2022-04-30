Common Field Problems
=====================

This article details some of the common problems that can plague your robot when it's on the field. It can be extremely frustrating and stressful when your robot breaks down. This article hopes to inform and instruct on what you can do to find the problem, and it's resolution.

.. important:: Remember to never eliminate any possibility! It never hurts to double or even triple check that everything is working properly.

Robot is stuttering and the RSL lights are dimming
--------------------------------------------------

Whenever your robot seems to give jerking motions and the RSL lights are dimming, this is usually a sign of :doc:`brownouts </docs/software/roborio-info/roborio-brownouts>`. One of the first steps you can take to resolving a brownout is identify when it occurred and any notable correlating events. Did you go into a match with your battery too low? Are you drawing too much current somehow? Can you reproduce this in the pit?

One of the most useful tools for identifying brownout causes is the :doc:`driver station log viewer </docs/software/driverstation/driver-station-log-viewer>`.

.. todo:: add examples showcasing a brownout

Joystick inputs seem to be dropping
-----------------------------------

One of the characteristics of lost joystick inputs is when you press buttons or an axis and nothing happens! This can happen from a variety of reasons, so it's important to analyze which one is likely to your situation.

.. todo:: looking at the driverstation log and identifying if lost joysticks is a code related .. error:: text

.. todo:: Make some mention of the I2C issue

Let's begin by asking a question. Can you reliably reproduce this issue at home or in the pits?

Unable to connect to your robot?
--------------------------------

Setting up the driver station in the short few seconds before the match should be utilized to do a quick connectivity and joystick check. Assuming your robot is turned on and has been turned on for ~30-60 seconds, you might realize a problem has happened. Below are a list of common reasons you are unable to connect to your robot.

- Disconnected ethernet connection on the driver station
  - Is the ethernet port on the driver station functional?
- Disconnected ethernet connection on the robot
  - Perhaps the rio <-> radio connection came unplugged
  - Perhaps the ethernet cord is bad (can be identified by looking at the light indicators on the Rio/Radio for network activity)
- Is the firewall disabled?
  - It is recommended that the firewall is always disabled when at an events

.. todo:: add more and maybe some images

You should immediately notify the FTA that there is a connectivity issue for the quickest resolution. 

.. important:: While rare, it has been shown that the robot radio can sometimes take a large amount of time to boot.
