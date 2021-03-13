.. include:: <isonum.txt>

Robot Battery
=============

The power supply for an FRC\ |reg| robot is a single 12V 18Ah SLA AGM battery, capable of high momentary currents.

SLA stands for Sealed Lead Acid, AGM stands for Absorbent Glass Mat.

The Robot Battery assembly includes a COTS battery, with positive and negative lead cables to an Anderson SB connector. The Red/Pink Anderson SB50 is STRONGLY recommended.

Always start your match with a fully charged battery - ask for help if it looks like you won't!

Battery Safety & Handling
-------------------------

**DO NOT CARRY A BATTERY BY THE CABLES**, and always avoid pulling by them.
Pulling on batteries by the cables may loosen, bend, or break the lug or battery tab -- or even tear the entire tab out of the housing!

.. image:: images/robot-battery/broken-terminal.png
  :alt: One terminal of an FRC battery fully detached from the battery.

Even if it doesn't get broken, the battery will not be able to provide the same amount of current if the :ref:`connectors are loose <docs/hardware/hardware-basics/preemptive-troubleshooting:Check Battery Connections>`.

Dropping the batteries can bend the internal plates, create bulges, or in the worst case - crack the battery case open. While we do use AGM [absorbant glass mat] technology for safety, when a cell is punctured it still will leak some liquid. This is why FIRST recommends teams have a battery spill kit available.

Finally, certain older battery chargers without "maintenance mode" features can *overcharge* the battery, resulting in boiling off some of the battery acid - another reason for a spill kit.

.. image:: images/robot-battery/boiled.jpg
  :alt: An FRC battery that was boiled by a high current dumb charger.

Damaged batteries should be safely disposed of as soon as possible. All retailers that sell large SLA batteries, like car batteries, should be able to dispose of it for you. They may charge a small fee, or provide a small "core charge refund", depending on your state law.

.. warning:: **DO NOT** attempt to "repair" damaged or non-functional batteries.

Battery Construction & Tools
-----------------------------

Battery Leads
^^^^^^^^^^^^^^^^^^^

Standard 6AWG, Pink/Red SB50 battery leads with #10 bolted (0.2" diameter bolt hole) crimp lugs often come in the Kit of Parts. Teams are encouraged to use these leads.

Battery leads must be copper, minimum size 6AWG and maximum length 12" - there is no maximum size. 6AWG is sufficient for almost all robots.

The Anderson SB Connector may be the standard Pink/Red SB50, or another Anderson SB connector. Teams are *STRONGLY* recommended to use the Pink/Red SB50 for interoperability: the other colors and sizes of housings will not intermate, and you will be unable to borrow batteries or chargers.

Follow manufacturer's instructions to crimp contacts and assemble the leads into Anderson SB connectors. A small flathead screwdriver can help to insert the contacts (carefully push on the contact, not the wire insulation), or it can help to disengage the internal latch if the contact is in the wrong slot or upside down.

Bolt-on crimp lugs with 0.2" tab holes (compatible with #10 bolt) battery tabs are available online and through electrical supply houses, sold by the accepted wire size and the tab hole diameter, sometimes listed on catalogs as a "post diameter". Use a size that matches the lead wires.

Teams are strongly recommended to use properly rated tools and stringent quality control practices for crimping processes, ask local veteran teams for help, or use vendor-made crimped leads. *Bolt-on screw terminal lugs are not recommended for battery leads.*

Battery Lug Connection
^^^^^^^^^^^^^^^^^^^^^^^

A #10 or M5 nut & bolt connect the battery lead lug to the battery tab.

..warning:: The lug and tab must directly contact, copper to copper: do not put a washer of any kind separating them.

These connections must be very tight for reliability. Any movement of the lug while in operation may interrupt robot power, resulting in robot reboots and disconnections lasting 30 seconds or more.

Some batteries come with tab bolts in the package: they may be used, or replaced with stronger alloy steel bolts. It is a good idea to add a lock washer, such as a #10 star washer or a nordlock system, in addition to a nylon locking ("nylock") nut. Using a split ring washer will not add to joint strength or reliability and is not required even if one is provided with your battery.

This connection must also be wrapped for electrical safety; electrical tape will work, but heatshrink that fits over the entire connection is recommended.

.. image:: images/robot-battery/heatshrink.png
  :alt: One terminal of an FRC battery fully covered in heatshrink.

Battery Chargers
^^^^^^^^^^^^^^^^^^^

There are many good COTS "smart" battery chargers with 'maintenance mode' features designed for 12V SLA batteries.

Chargers used at competition may only use a maximum of 6A per battery. Charging below 6 amps will avoid heat buildup, but take longer.

Teams are required to use Anderson SB connectors on battery chargers used at competitions.

The simplest way to add an SB connector to a COTS charger yourself is to use the original charger clamps on a set of COTS leads and then wrap each clamp in electrical tape. Alternatively, screw terminals or wire nuts can be used. SB Connector Contacts are also available for smaller wire sizes, if the team has crimping capability.

..warning:: Check the polarities with a multimeter before plugging in the first battery.

Some FRC vendors sell chargers with red SB50 connectors pre-attached.

Battery Evaluation Tools
^^^^^^^^^^^^^^^^^^^^^^^^^

**Voltmeter** or **Multimeter**

A voltage reading will give you a good snapshot of what the Voc (Voltage open circuit, or "float voltage") is. Anything from 13.0 to 14.0 may show up for charged batteries, but depends as much on the individual battery as it does on real state of charge. Below 13V, it's worth trying to charge it more.

**Battery Charger**

If your battery charger has Maintenance Mode indicator, such as a GREEN LED, you can use that indicator to tell you whether you are READY.

Some chargers will cycle between "CHARGING" and "READY" periodically. This is a "maintenance" behavior, sometimes associated with the battery cooling off after a tough match, and being able to accept more charge.

**Load Tester**

A battery load tester can be used as a quick way to determine the detailed readiness of a battery. It may provide information like: open-load voltage, voltage under load, internal resistance, and state of charge. These metrics can be used to quickly confirm that a battery is ready for a match and even possibly help to identify some long term problems with the battery.

.. image:: images/robot-battery/beak.png
  :alt: Output screen of a common load tester showing properties of the battery.

Ideal internal resistance should be less than 0.015 Ohms. The manufacturer specification for most batteries is 0.011 Ohms. If a battery gets higher than 0.02 Ohms it is a good idea to consider not using that battery for competition matches.

If a battery shows significantly lower voltages at the higher test current loads, it may not be done charging, or it may need to be retired.

Understanding Battery Voltages
------------------------------

A "12V battery" is anything but 12V.

Fully charged, a battery can be anywhere from 13 to 14 volts open circuit (Voc). Open circuit voltage is measured with *nothing* connected.

Once a load (like a robot) is connected, and any amount of current is flowing, the battery voltage will drop. So if you check a battery with a Voltmeter, and it reads 13.5, and then connect it to your robot and power on, it will read lower, maybe 13.1 on the Driver Station display. Those numbers will vary with every battery and specific robot, see Characterization below. Once your robot starts running, it will pull more current, and the voltage will drop further.

Depleted batteries will read between 11.5 and 12.5 volts on an idle robot. While batteries can be run lower, it will risk permanent battery damage.

(SLA battery voltage and current performance also depends on temperature: cool batteries are happy batteries.)

Battery Characterization
^^^^^^^^^^^^^^^^^^^^^^^^^

A battery analyzer can be used to give a detailed inspection and comparison of battery performance.

.. image:: images/robot-battery/cba-graph.jpg
  :alt: Graph from a common battery analyzer plotting volts and AmpHrs for many different batteries.

It will provide graphs of battery performance over time. This test takes significant time (roughly two hours) so it is less suited to testing during competition. It is recommended to run this test on each battery every year to monitor and track its performance. This will determine how it should be used: matches, practice, testing, or disposed of.

At the standard 7.5 amps test load, competition batteries should have at least a 11.5 amp hour rating. Anything less than that should only be used for practice or other less demanding use cases.

Battery Longevity
^^^^^^^^^^^^^^^^^^^

A battery is rated for about 1200 normal charge/recharge cycles. The high currents required for an FRC match reduce that lifespan to about 400 cycles. These cycles are intended to be relatively low discharge, from around 13.5 down to 11 or 12 volts. Deep cycling the battery (running it all the way down to less than 6 volts) will damage it.

Batteries last the longest if they are kept fully charged when not it use, either by charging regularly or by use of a maintenance charger. Batteries drop roughly 0.1V every month of non-use.

Batteries need to be kept away from both extreme heat and cold. This generally means storing the batteries in a climate controlled area: a classroom closet is usually fine, a parking lot shipping container is more risky.

Battery Best Practices
----------------------

- Only use a charged battery for competition matches. If you are in a situation where you have run out of charged batteries, please ask a veteran team for help! Nobody wants to see a robot dead on the field (:ref:`brownout <docs/software/roborio-info/roborio-brownouts:roboRIO Brownout and Understanding Current Draw>`) due to a bad or uncharged battery.

- Wait for batteries to cool after the match before recharging at high currents

- Teams should consider purchasing several new batteries each year to help keep their batteries fresh. Elimination matches can require many batteries and there may not be enough time to recharge.

.. image:: images/robot-battery/battery-cart.jpg
  :alt: A wooden bookcase like cart for storing and charging batteries.

- A multi bank battery charger allows you to charge more than one battery at a time. Many teams build a robot cart for their batteries and the charger allowing for easy transport and storage.

- It is a good idea to permanently identify each battery with at least: team number, year, and a unique identifier.

- Teams may also want to use something removeable (stickers, labeling machine etc.) to identify what that battery should be used for based on its performance data and when the last analyzer test was run.

.. image:: images/robot-battery/battery-flag.jpg
  :alt: A battery flag is just a small piece of plastic that fits in the battery connector.

- Using battery flags (a piece of plastic placed in the battery connector) is a common way to indicate that a battery has been charged. Battery flags can also be easily 3D printed.

- Fastening down the robot-side and charger-side SB connectors will help reduce wire strain and protect electrical parts.

- Handles for SB50 contacts can be purchased or 3D printed to help avoid pulling on the leads while connecting or disconnecting batteries.

- Some teams sew battery carrying straps from old seatbelts or other flat nylon that fit around the battery to help prevent carrying by leads.
