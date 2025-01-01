# Port Forwarding

This class provides an easy way to forward local ports to another host/port. This is useful to provide a way to access Ethernet-connected devices from a computer tethered to the roboRIO USB port. This class acts as a raw TCP port forwarder, this means you can forward connections such as SSH.

## Forwarding a Remote Port

Often teams may wish to connect directly to the roboRIO for controlling their robot. The PortForwarding class ([Java](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/net/PortForwarder.html), [C++](https://github.wpilib.org/allwpilib/docs/release/cpp/classwpi_1_1_port_forwarder.html)) can be used to forward the Raspberry Pi connection for usage during these times. The PortForwarding class establishes a bridge between the remote and the client. To forward a port in Java, simply do ``PortForwarder.add(int port, String remoteName, int remotePort)``.

.. tab-set-code::

   ```java
   public Robot() {
      PortForwarder.add(8888, "wpilibpi.local", 80);
   }
   ```

   ```c++
   Robot::Robot() {
      wpi::PortForwarder::GetInstance().Add(8888, "wpilibpi.local", 80);
   }
   ```

   ```python
   wpinet.PortForwarder.getInstance().add(8888, "wpilibpi.local", 80)
   ```

.. important:: You **can not** use a port less than 1024 as your local forwarded port. It is also important to note that you **can not** use full URLs (``http://wpilibpi.local``) and should only use IP Addresses or DNS names.

## Removing a Forwarded Port

To stop forwarding on a specified port, simply call ``remove(int port)`` with port being the port number. If you call ``remove()`` on a port that is not being forwarded, nothing will happen.

.. tab-set-code::

   ```java
   public Robot() {
      PortForwarder.remove(8888);
   }
   ```

   ```c++
   Robot::Robot() {
      wpi::PortForwarder::GetInstance().Remove(8888);
   }
   ```

   ```python
   wpinet.PortForwarder.getInstance().remove(8888)
   ```

