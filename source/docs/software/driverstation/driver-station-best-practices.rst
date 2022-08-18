.. include:: <isonum.txt>

Driver Station Best Practices
=============================

This document was created by Steve Peterson, with contributions from Juan Chong, James Cole-Henry, Rick Kosbab, Greg McKaskle, Chris Picone, Chris Roadfeldt, Joe Ross, and Ryan Sjostrand. The original post and follow-up posts can be found `here <https://www.chiefdelphi.com/t/paper-driver-station-best-practices/164429>`__.

Want to ensure the driver station isn't a stopper for your team at the FIRST Robotics Competition (FRC) field? Building and configuring a solid driver station laptop is an easy project for the time between stop build day and your competition. Read on to find lessons learned by many teams over thousands of matches.

Prior To Departing For The Competition
--------------------------------------

1. Dedicate a laptop to be used solely as a driver station. Many teams do. A dedicated machine allows you manage the configuration for one goal – being ready to compete at the field. Dedicated means no other software except the FRC-provided Driver Station software and associated Dashboard installed or running.
2. Use a business-class laptop for your driver station. Why? They're much more durable than the $300 Black Friday special at Best Buy. They'll survive being banged around at the competition. Business-class laptops have higher quality device drivers, and the drivers are maintained for a longer period than consumer laptops. This makes your investment last longer. Lenovo ThinkPad T series and Dell Latitude are two popular business-class brands you'll commonly see at competitions. There are thousands for sale every day on eBay. The laptop provided in recent rookie kits is a good entry level machine. Teams often graduate from it to bigger displays as they do more with vision and dashboards.
3. Consider used laptops rather than new. The FRC\ |reg| Driver Station and dashboard software uses very few system resources, so you don't need to buy a new laptop -- instead, buy a cheap 4-5 year old used one. You might even get one donated by a used computer store in your area.
4. Laptop recommended features

   a. RAM -- 4GB of RAM
   b. A display size of 13" or greater, with minimum resolution of 1440x1050.
   c. Ports

      i. A built-in Ethernet port is highly preferred. Ensure that it's a full-sized port. The hinged Ethernet ports don't hold up to repeated use.
      ii. Use an Ethernet port saver to make your Ethernet connection. This extends the life of the port on the laptop. This is particularly important if you have a consumer-grade laptop with a hinged Ethernet port.
      iii. If the Ethernet port on your laptop is dodgy, either replace the laptop (recommended) or buy a USB Ethernet dongle from a reputable brand. Many teams find that USB Ethernet is less reliable than built-in Ethernet, primarily due to cheap hardware and bad drivers. The dongles given to rookies in the KOP have a reputation for working well.
      iv. 2 USB ports minimum

   d. A keyboard. It’s hard to quickly do troubleshooting on touch-only computers at the field.
   e. A solid-state disk (SSD). If the laptop has a rotating disk, spend $50 and replace it with a SSD.
   f. Updated to the current release of Windows 10 or 11. Being the most common OS now seen at competitions, bugs are more likely to be found and fixed for Windows 10 and 11 than on older Windows versions.

5. Install all Windows updates a week before the competition. This allows you time to ensure the updates will not interfere with driver station functions. To do so, open the Windows Update settings page and see that you're up-to-date. Install pending updates if not. Reboot and check again to make sure you’re up to date.
6. Change "Active Hours" for Windows Updates to prevent updates from installing during competition hours. Navigate to Start -> Settings -> Update & Security -> Windows Update, then select Change active hours. If you’re traveling to a competition, take time zone differences into account. This will help ensure your driver station does not reboot or fail due to update installing on the field.
7. Remove any 3rd party antivirus or antimalware software. Instead, use Windows Defender on Windows 10 or 11. Since you're only connecting to the internet for Windows and FRC software updating, the risk is low. Only install software on your driver station that's needed for driving. Your goal here is to eliminate variables that might interfere with proper operation. Remove any unneeded preinstalled software ("bloatware") that came with the machine. Don't use the laptop as your Steam machine for gaming back at the hotel the night before the event. Many teams go as far as having a separate programming laptop.
8. Avoid managed Windows 10 or 11 installations from the school's IT department. These deployments are built for the school environment and often come with unwanted software that interferes with your robot's operation.
9. Laptop battery / power

   a. Turn off Put the computer to sleep in your power plan for both battery and powered operation.
   b. Turn off USB Selective Suspend:

      i. Right click on the battery/charging icon in the tray, then select Power Options.
      ii. Edit the plan settings of your power plan.
      iii. Click the Change advanced power settings link.
      iv. Scroll down in the advanced settings and disable the USB selective suspend setting for both Battery and Plugged in.

   c. Ensure the laptop battery can hold a charge for at least an hour after making the changes above. This allows plenty of time for the robot and drive team to go through the queue and reach the alliance station without mains power.

10. Bring a trusted USB and Ethernet cable for use connecting to the roboRIO.
11. Add retention/strain relief to prevent your joystick/gamepad controllers from falling on the floor and/or yanking on the USB ports. This helps prevent issues with intermittent controller connections.
12. The Windows user account you use to drive must be a member of the Administrator group.

At The Competition
------------------

1. Turn off Windows firewall using :ref:`these instructions <docs/networking/networking-introduction/windows-firewall-configuration:Disabling Windows Firewall>`.
2. Turn off the Wi-Fi adapter, either using the dedicated hardware Wi-Fi switch or by disabling it in the Adapter Settings control panel.
3. Charge the driver station when it’s in the pit.
4. Remove login passwords or ensure everyone on the drive team knows the password. You'd be surprised at how often drivers arrive at the field without knowing the password for the laptop.
5. Ensure your LabView code is deployed permanently and set to "run as startup", using the instructions in the LabView Tutorial. If you must deploy code every time you turn the robot on, you’re doing it wrong.
6. Limit web browsing to FRC related web sites. This minimizes the chance of getting malware during the competition.
7. Don't plan on using internet access to do software updates. There likely won't be any in the venue, and hotel Wi-Fi varies widely in quality. If you do need updates, contact a Control System Advisor in the pit.

Before Each Match
-----------------

1. Make sure the laptop is on and logged in prior to the end of the match before yours.
2. Close programs that aren’t needed during the match – e.g., Visual Studio Code or LabView – when you are competing.
3. Bring your laptop charger to the field. Power is provided for you in each player station.
4. Fasten your laptop with hook-and-loop tape to the player station shelf. You never know when your alliance partner will have an autonomous programming issue and blast the wall.
5. Ensure joysticks and controllers are assigned to the correct USB ports.

   a. In the USB tab in the FRC Driver Station software, drag and drop to assign joysticks as needed.
   b. Use the rescan button (F1) if joysticks / controllers do not appear green
   c. Use the rescan button (F1) during competition if joystick or controllers become unplugged and then are plugged back in or otherwise turn gray during competition.
