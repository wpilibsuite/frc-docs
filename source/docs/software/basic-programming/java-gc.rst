# Java Garbage Collection
Java garbage collection is the process of automatically managing memory for Java objects. The Java Virtual Machine (JVM) is responsible for creating and destroying objects, and the garbage collector is responsible for identifying and reclaiming unused objects.

Java garbage collection is an automatic process, which means that the programmer does not need to explicitly deallocate memory. The garbage collector keeps track of which objects are in use and which are not, and it periodically reclaims unused objects.

## Object Creation

Creating a large number of objects in Java can lead to memory and performance issues. While the Java Garbage Collector (GC) is designed to handle memory management efficiently, creating too many objects can overwhelm the GC and cause performance degradation.

### Memory Concerns

When a large number of objects are created, it increases the overall memory footprint of the application. While the overhead for a single object may be insignificant, it can become substantial when multiplied by a large number of objects.

.. note:: :doc:`VisualVM </docs/software/advanced-gradlerio/profiling-with-visualvm>` can be used to see where memory is allocated.

### Performance Concerns

The GC's job is to periodically identify and reclaim unused objects in memory. While garbage collection is running on an FRC robot coded in Java, execution of the robot program is paused. When the GC has to collect a large number of objects, it has to pause the application to run more frequently or for longer periods of time. This is because the GC has to perform more work to collect and process each object.

GC-related performance degradation in robot programs can manifest as occasional pauses, freezes, or loop overruns as the GC works to reclaim memory.

### Design Considerations

If you anticipate your application creating a large number of short-lived objects, it is important to consider design strategies to mitigate the potential memory and performance issues. Here are some strategies to consider:

- Minimize object creation: Carefully evaluate the need for each object creation. If possible, reuse existing objects or use alternative data structures, such as arrays or primitives, to avoid creating new objects.

- Efficient data structures: Use data structures that are well-suited for the type of data you are working with. For example, if you are dealing with a large number of primitive values, consider using arrays or collections specifically designed for primitives.

## Diagnosing Out of Memory Errors with Heap Dumps

All objects in Java are retained in a section of memory called the *heap*. As objects typically consume the greatest amount of memory in a Java program, it is often useful to take a snapshot of the state of the heap---a heap dump---to analyze memory issues. Heap dumps only capture the state of a program's heap at a single point in time, so they are unlikely to be useful if not captured exactly at the time the program is experiencing memory issues.

Since ``OutOfMemoryError``\ s both crash the program and are a common reason to want a heap dump, the JVM can be configured to automatically take a heap dump the moment an ``OutOfMemoryError`` is caught by the JVM. To configure these options, locate the ``frcJava`` code block in your project's ``build.gradle``:

.. rli:: https://raw.githubusercontent.com/wpilibsuite/vscode-wpilib/v2026.2.1/vscode-wpilib/resources/gradle/java/build.gradle
   :language: groovy
   :lines: 15-42
   :lineno-match:
   :emphasize-lines: 15-16

Add to the code block so that it contains two ``jvmArgs`` commands, as shown below:

```groovy
frcJava(getArtifactTypeClass('FRCJavaArtifact')) {
    // If you have other configuration here, you do not need to remove it.
    // Enable automatic heap dumps on OutOfMemoryError
    // Note: the heap dump path here is a path on a USB flash drive, see below
    jvmArgs.add("-XX:+HeapDumpOnOutOfMemoryError")
    jvmArgs.add("-XX:HeapDumpPath=/u/frc-usercode.hprof")
}
```

This will cause the JVM to write heap dumps to a file named ``frc-usercode.hprof`` at the root of a USB flash drive attached to the roboRIO when the code runs out of memory. It is recommended to save these heap dumps to a USB flash drive because heap dumps intrinsically consume the same amount of space on disk as the program heap did in memory when the program crashed, and are likely to be larger than the roboRIO's internal storage has capacity for. Once you have reproduced the ``OutOfMemoryError``, redeploy your code without these options enabled, and use the USB flash drive to transfer the heap dump to a computer for analysis in a memory profiler such as :ref:`VisualVM <docs/software/advanced-gradlerio/profiling-with-visualvm:Analyzing a Heap Dump>`.

.. warning:: Configuring the JVM this way requires that the flash drive remain connected to the roboRIO while your code is running.

Larger SD cards may provide enough onboard storage to allow the use of these options on the roboRIO 2 without a USB flash drive. To do this, set the ``-XX:HeapDumpPath`` option to reference a path on the SD card, and use :doc:`FTP/SFTP to transfer the heap dump to a computer </docs/software/roborio-info/roborio-ftp>` before deleting it from the SD card.

Note that the JVM will **not** overwrite heap dumps with the exact path and filename specified by ``-XX:HeapDumpPath`` if they already exist, nor will it dump the process heap to a file with a different name. If a path to a directory is supplied instead of a path to a file, the JVM will instead write out heap dumps with unique filenames within the specified directory, with the name ``java_pidNNNN.hprof``, where ``NNNN`` is the process ID of the JVM that ran out of memory. Note that this can cause large files to build up on disk if they are not cleaned out, so if you configure the JVM this way, be sure to frequently copy heap dumps to a computer and delete them from the flash drive/SD card afterward.

.. caution:: Always be vigilant about the amount of available space on the underlying storage medium while you use this feature.

   Use of this feature is not recommended during competitive play.

## System Memory Tuning

If the JVM cannot allocate memory, the program will be terminated. As an embedded system with only a small amount of memory available (256 MB on the roboRIO 1, 512 MB on the roboRIO 2), the roboRIO is particularly susceptible to running out of memory.

.. admonition :: No amount of system tuning can fix out of memory errors caused by out-of-control allocations.

    If you are running out of memory, always investigate allocations with heap dumps and/or :doc:`VisualVM </docs/software/advanced-gradlerio/profiling-with-visualvm>` first.

If you continue to run out of memory even after investigating with VisualVM and taking steps to minimize the number of allocated objects, a few different options are available to make additional memory available to the robot program.

- Disabling the system web server
- Setting sysctls (Linux kernel options)
- Periodically calling the garbage collector
- Setting up swap on a USB flash drive

Implementing most of these options require :doc:`connecting with SSH </docs/software/roborio-info/roborio-ssh>` to the roboRIO and running commands. If run incorrectly, it may require a reimage to recover, so be careful when following the instructions.

### Disabling the System Web Server

The built-in NI system web server provides the webpage (the :doc:`roboRIO Web Dashboard </docs/software/roborio-info/roborio-web-dashboard>`) seen when using a web browser to connect to the roboRIO, e.g. to change IP address settings. It also is used by the Driver Station's data log download functionality. However, it consumes several MB of RAM, so disabling it will free up that memory for the robot program to use. There are several ways to disable the web server:

The first and easiest is to use the :doc:`RoboRIO Team Number Setter </docs/software/wpilib-tools/roborio-team-number-setter/index>` tool. Versions 2024.2.1 and later of the tool have a button to disable or enable the web server. However, a few teams have reported that this does not work or does not persist between reboots. There are two alternate ways to disable the web server; both require connecting to the roboRIO with SSH and logging in as the ``admin`` user.

1. Run ``/etc/init.d/systemWebServer stop; update-rc.d -f systemWebServer remove; sync``

2. Run ``chmod a-x /usr/local/natinst/etc/init.d/systemWebServer; sync``

To revert the alternate ways and re-enable the web server, take the corresponding step:

1. Run ``update-rc.d -f systemWebServer defaults; /etc/init.d/systemWebServer start; sync``

2. Run ``chmod a+x /usr/local/natinst/etc/init.d/systemWebServer; sync``

### Setting sysctls

Several Linux kernel options (called sysctls) can be set to tweak how the kernel allocates memory. Several options have been found to reduce out-of-memory errors:

- Setting ``vm.overcommit_memory`` to 1 (the default value is 2). This causes the kernel to always pretend there is enough memory for a requested memory allocation at the time of allocation; the default setting always checks to see if there's actually enough memory to back an allocation at the time of allocation, not when the memory is actually used.
- Setting ``vm.vfs_cache_pressure`` to 1000 (the default value is 100). Increasing this causes the kernel to much more aggressively reclaim file system object caches; it may slightly degrade performance.
- Setting ``vm.swappiness`` to 100 (the default value is 60). This causes the kernel to more aggressively swap process memory to the swap file. Changing this option has no effect unless you add a swap file.

You can set some or all of these options; the most important one is ``vm.overcommit_memory``. Setting these options requires connecting to the roboRIO with SSH and logging in as the ``admin`` user, then running the following commands:

```text
echo "vm.overcommit_memory=1" >> /etc/sysctl.conf
echo "vm.vfs_cache_pressure=1000" >> /etc/sysctl.conf
echo "vm.swappiness=100" >> /etc/sysctl.conf
sync
```

The ``/etc/sysctl.conf`` file should contain the following lines at the end when done (to check, you can run the command ``cat /etc/sysctl.conf``):

```text
vm.overcommit_memory=1
vm.vfs_cache_pressure=1000
vm.swappiness=100
```

To revert the change, edit ``/etc/sysctl.conf`` (this will require the use of the vi editor) and remove these 3 lines.

### Periodically Calling the Garbage Collector

Sometimes the garbage collector won't run frequently enough to keep up with the quantity of allocations. As Java provides a way to trigger a garbage collection to occur, running it on a periodic basis may reduce peak memory usage. This can be done by adding a ``Timer`` and a periodic check:

```java
Timer m_gcTimer = new Timer();
public Robot() {
  m_gcTimer.start();
}
public void periodic() {
  // run the garbage collector every 5 seconds
  if (m_gcTimer.advanceIfElapsed(5)) {
    System.gc();
  }
}
```

### Setting Up Swap on a USB Flash Drive

A swap file on a Linux system provides disk-backed space that can be used by the system as additional virtual memory to put infrequently used data and programs when they aren't being used, freeing up physical RAM for active use such as the robot program. It is strongly recommended to not use the built-in non-replaceable flash storage on the roboRIO 1 for a swap file, as it has very limited write cycles and may wear out quickly. Instead, however, a FAT32-formatted USB flash drive may be used for this purpose. This does require the USB flash drive to always be plugged into the roboRIO before boot.

.. caution:: Having a swap file on a USB stick means it's critical the USB stick stay connected to the roboRIO at all times it is powered.

    This should be used as a last resort if none of the other steps above help. Generally needing swap is indicative of some other allocation issue, so use VisualVM first to optimize allocations.

A swap file can be set up by plugging the USB flash drive into the roboRIO USB port, connecting to the roboRIO with SSH and logging in as the ``admin`` user, and running the following commands. Note the vi step requires knowledge of how to edit and save a file in vi.

```text
fallocate -l 100M /u/swapfile
mkswap /u/swapfile
swapon /u/swapfile
vi /etc/init.d/addswap.sh
chmod a+x /etc/init.d/addswap.sh
update-rc.d -v addswap.sh defaults
sync
```

The ``/etc/init.d/addswap.sh`` file contents should look like this:

```text
#!/bin/sh
[ -x /sbin/swapon ] && swapon -e /u/swapfile
: exit 0
```

To revert the change, run ``update-rc.d -f addswap.sh remove; rm /etc/init.d/addswap.sh; sync; reboot``.
