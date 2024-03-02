Java Garbage Collection
=======================
Java garbage collection is the process of automatically managing memory for Java objects. The Java Virtual Machine (JVM) is responsible for creating and destroying objects, and the garbage collector is responsible for identifying and reclaiming unused objects.

Java garbage collection is an automatic process, which means that the programmer does not need to explicitly deallocate memory. The garbage collector keeps track of which objects are in use and which are not, and it periodically reclaims unused objects.

Object Creation
---------------

Creating a large number of objects in Java can lead to memory and performance issues. While the Java Garbage Collector (GC) is designed to handle memory management efficiently, creating too many objects can overwhelm the GC and cause performance degradation.

Memory Concerns
^^^^^^^^^^^^^^^

When a large number of objects are created, it increases the overall memory footprint of the application. While the overhead for a single object may be insignificant, it can become substantial when multiplied by a large number of objects.

.. note:: :doc:`VisualVM </docs/software/advanced-gradlerio/profiling-with-visualvm>` can be used to see where memory is allocated.

Performance Concerns
^^^^^^^^^^^^^^^^^^^^

The GC's job is to periodically identify and reclaim unused objects in memory. While garbage collection is running on an FRC robot coded in Java, execution of the robot program is paused. When the GC has to collect a large number of objects, it has to pause the application to run more frequently or for longer periods of time. This is because the GC has to perform more work to collect and process each object.

GC-related performance degradation in robot programs can manifest as occasional pauses, freezes, or loop overruns as the GC works to reclaim memory.

Design Considerations
^^^^^^^^^^^^^^^^^^^^^

If you anticipate your application creating a large number of short-lived objects, it is important to consider design strategies to mitigate the potential memory and performance issues. Here are some strategies to consider:

- Minimize object creation: Carefully evaluate the need for each object creation. If possible, reuse existing objects or use alternative data structures, such as arrays or primitives, to avoid creating new objects.

- Efficient data structures: Use data structures that are well-suited for the type of data you are working with. For example, if you are dealing with a large number of primitive values, consider using arrays or collections specifically designed for primitives.

Fixing Out of Memory Errors
---------------------------

If the JVM cannot allocate memory, the program will be terminated. As an embedded system with only a small amount of memory available (256 MB on the roboRIO 1, 512 MB on the roboRIO 2), the roboRIO is particularly susceptible to running out of memory. If you continue to run out of memory even after investigating with VisualVM and taking steps to minimize the number of allocated objects, a few different options are available to make additional memory available to the robot program.

- Disabling the system web server
- Setting sysctls (Linux kernel options)
- Periodically calling the garbage collector
- Setting up swap on a USB flash drive

Implementing most of these options require :doc:`connecting with SSH </docs/software/roborio-info/roborio-ssh>` to the roboRIO and running commands. If run incorrectly, it may require a reimage to recover, so be careful when following the instructions.

Disabling the System Web Server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The built-in NI system web server provides the webpage seen when using a web browser to connect to the roboRIO. It also is used by the Driver Station's data log download functionality. However, it consumes several MB of RAM, so disabling it will free up that memory for the robot program to use. There are several ways to disable the web server:

The first and easiest is to use the RoboRIO Team Number Setter tool. Versions 2024.2.1 and later of the tool have a button to disable or enable the web server. However, a few teams have reported that this does not work or does not persist between reboots. There are two alternate ways to disable the web server; both require connecting to the roboRIO with SSH and logging in as the ``admin`` user.

1. Run ``/etc/init.d/systemWebServer stop; update-rc.d -f systemWebServer remove; sync``

2. Run ``chmod a-x /usr/local/natinst/etc/init.d/systemWebServer``

Setting sysctls
^^^^^^^^^^^^^^^

Several Linux kernel options (called sysctls) can be set to tweak how the kernel allocates memory. Several options have been found to reduce out-of-memory errors. Setting these options requires connecting to the roboRIO with SSH and logging in as the ``admin`` user, then running the following commands:

.. code-block:: text

    echo "swappiness=100" > /etc/sysctl.conf
    echo "vfs_cache_pressure=1000" >> /etc/sysctl.conf
    echo "overcommit_memory=1" >> /etc/sysctl.conf
    sync

Periodically Calling the Garbage Collector
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Sometimes the garbage collector won't run frequently enough to keep up with the quantity of allocations. As Java provides a way to trigger a garbage collection to occur, running it on a periodic basis may reduce peak memory usage. This can be done by adding a ``Timer`` and a periodic check:

.. code-block:: java

    Timer m_gcTimer = new Timer();

    public void robotInit() {
      m_gcTimer.start();
    }

    public void periodic() {
      // run the garbage collector every 5 seconds
      if (m_gcTimer.advanceIfElapsed(5)) {
        System.gc();
      }
    }

Setting Up Swap on a USB Flash Drive
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A swap file on a Linux system provides disk-backed space that can be used by the system as additional virtual memory to put infrequently used data and programs when they aren't being used, freeing up physical RAM for active use such as the robot program. It is strongly recommended to not use the built-in non-replaceable flash storage on the roboRIO 1 for a swap file, as it has very limited write cycles and may wear out quickly. Instead, however, a FAT32-formatted USB flash drive may be used for this purpose. This does require the USB flash drive to always be plugged into the roboRIO before boot. A swap file can be set up by plugging the USB flash drive into the roboRIO USB port, connecting to the roboRIO with SSH and logging in as the ``admin`` user, and running the following commands:

.. code-block:: text

    fallocate -l 100M /u/swapfile
    mkswap /u/swapfile
    swapon /u/swapfile
    echo "#!/bin/sh" > /etc/init.d/addswap.sh
    echo "[ -x /sbin/swapon ] && swapon --ifexists /u/swapfile" >> /etc/init.d/addswap.sh
    echo ": exit 0" >> /etc/init.d/addswap.sh
    chmod a+x /etc/init.d/addswap.sh
    update-rc.d -v addswap.sh defaults
    sync
