.. _networking-basics:

Networking Basics
=================

.. contents::
   :local:
   :depth: 4

IP Addressing Background
------------------------

What is an IP Address?
^^^^^^^^^^^^^^^^^^^^^^

An IP address is a unique string of numbers, separated by periods that identifies each device on a network. Each IP address is divided up into 4 sections (octets) ranging from 0-255.

.. images/networking-basics/ip-address-parts.png

As shown above, this means that each IP address is a 32-bit address meaning there are 232 addresses, or just over 4,000,000,00 addresses possible. However, most of these are used publicly for things like web servers. This brings up our first key point of IP Addressing: Each device on the network must have a unique IP address. No two devices can have the same IP address, otherwise collisions will occur.

Since there are only 4-billion addresses, and there are more than 4-billion computers connected to the internet, we need to be as efficient as possible with giving out IP addresses. This brings us to public vs. private addresses.

Public vs Private IP Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To be efficient with using IP Addresses, the idea of “Reserved IP Ranges” was implemented. In short,
this means that there are ranges of IP Addresses that will never be assigned to web servers, and will
only be used for local networks, such as those in your house. Key point #2: Unless you a directly
connecting to your internet provider’s basic modem (no router function), your device will have an
IP Address in one of these ranges. This means that at any local network, such as: your school, work
office, home, etc., your device will 99% of the time have an IP address in a range listed below:

.. image:: images/networking-basics/ip-ranges.png

These reserved ranges let us assign one “unreserved IP Address” to an entire house, and then use
multiple addresses in a reserved range to connect more than one computer to the internet. A process on the
home’s internet router known as NAT (Network Address Translation), handles the process of keeping track
which private IP is requesting data, using the public IP to request that data from the internet, and
then passing the returned data back to the private IP that requested it. This allows us to use the
same reserved IP addresses for many local networks, without causing any conflicts. An image of this
process is presented below.

.. image:: images/networking-basics/nat-diagram.png

.. note:: For the FRC networks, we will use the 10.0.0.0 range. This range allows us to use the 10.TE.AM.xx
   format for IP addresses, whereas using the Class B or C networks would only allow a subset of teams to follow
   the format. An example of this formatting would be 10.17.50.1 for FRC Team 1750.


How are these addresses assigned?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

We’ve covered the basics of what IP addresses are, and which IP addresses we will use for the FRC
competition,so now we need to discuss how these addresses will get assigned to the devices on our
network. We already stated above that we can’t have two devices on the same network with the same
IP Address, so we need a way to be sure that every device receives an address without overlapping.
This can be done Dynamically (automatic), or Statically (manual).

Dynamically
~~~~~~~~~~~

Dynamically assigning IP addresses means that we are letting a device on the network manage the IP
address assignments. This is done through the Dynamic Host Configuration Protocol (DHCP). DHCP has
many components to it, but for the scope of this document, we will think of it as a service that
automatically manages the network. Whenever you plug in a new device to the network, the DHCP service
sees the new device, then provides it with an available IP address and the other network settings
required for the device to communicate. This can mean that there are times we do not know the exact
IP address of each device.

What is a DHCP server?
""""""""""""""""""""""

A DHCP server is a device that runs the DHCP service to monitor the network for new devices to
configure. In larger businesses, this could be a dedicated computer running the DHCP service and
that computer would be the DHCP server. For home networks, FRC networks, and other smaller networks,
the DHCP service is usually running on the router; in this case, the router is the DHCP server.

This means that if you ever run into a situation where you need to have a DHCP server assigning IP
addresses to your network devices, it’s as simple as finding the closest home router, and plugging it in.

Statically
~~~~~~~~~~

Dynamically assigning IP addresses means that we are manually telling each device on the network which
IP address we want it to have. This configuration happens through a setting on each device. By
disabling DHCP on the network and assigning the addresses manually, we get the benefit of knowing the
exact IP address of each device on the network, but because we set each one manually and there is no service
keeping track of the used IP addresses, we have to keep track of this ourselves. While statically setting IP
addresses, we must be careful not to assign duplicate addresses, and must be sure we are setting the other
network settings (such as subnet mask and default gateway) correctly on each device.

What is link-local?
~~~~~~~~~~~~~~~~~~~

If a device does not have an IP address, then it cannot communicate on a network. This can become
an issue if we have a device that is set to dynamically acquire its address from a DHCP server, but
there is no DHCP server on the network. An example of this would be when you have a laptop directly
connected to a roboRIO and both are set to dynamically acquire an IP address. Neither device is a DHCP
server, and since they are the only two devices on the network, they will not be assigned IP addresses automatically.

Link-local addresses give us a standard set of addresses that we can “fall-back” to if a device set
to acquire dynamically is not able to acquire an address. If this happens, the device will assign
itself an IP address in the 169.254.xx.yy address range; this is a link-local address. In our roboRIO
and computer example above, both devices will realize they haven’t been assigned an IP address and
assign themselves a link-local address. Once they are both assigned addresses in the 169.254.xx.yy
range, they will be in the same network and will be able to communicate, even though they were set
to dynamic and a DHCP server did not assign addresses.

IP Addressing for FRC
---------------------

For the FRC devices, the recommendation is to use dynamic addressing. As an alternate, static
addressing can be used if there is additional software or hardware that does not support mDNS
(explained below). If static addressing is used, take care to not set any IP addresses in the range
potentially used by the field.

In either configuration, the wireless radio will be statically set to 10.TE.AM.1 by the radio configuration
utility. This should not change.


