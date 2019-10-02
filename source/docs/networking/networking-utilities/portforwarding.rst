Port Forwarding
===============

This class provides an easy way to forward local ports to another host/port. This is useful to provide a way to access Ethernet-connected devices from a computer tethered to the roboRIO USB port. This class acts as a raw TCP port forwarder, this means you can forward connections such as SSH.

Forwarding a Remote Port
------------------------

.. todo:: Add link to PortForwarding API doc

Often teams may wish to connect directly to the roboRIO for controlling their robot. The PortForwarding class can be used to forward the Raspberry Pi connection for usage during these times. The PortForwarding class establishes a bridge between the remote and the client. To forward a port, simply do ``PortForwarder.add(int port, String remoteName, int remotePort)``.

.. tabs::

   .. code-tab:: Java

      @Override
      public void robotInit() {
         PortForwarder.add(8888, "frcvision.local", 80);
      }

   .. code-tab:: Cpp
   
      void Robot::RobotInit {
         PortForwarder::Add(8888, "frcvision.local", 80);
      }

.. important:: You **can not** use a port less than 1024 as your local forwarded port. It is also important to note that you **can not** use full URLs (``http://frcvision.local``) and should only use IP Addresses or DNS names.

Removing a Forwarded Port
-------------------------

To stop forwarding on a specified port, simply call ``remove(int port)`` with port being the port number. If you call ``remove()`` on a port that is not being forwarded, nothing will happen.

.. tabs::

   .. code-tab:: Java

      @Override
      public void robotInit() {
         PortForwarder.remove(8888);
      }

   .. code-tab:: Cpp

      void Robot::RobotInit {
         PortForwarder::Remove(8888);
      }
