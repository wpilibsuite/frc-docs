# Java Garbage Collection
Java garbage collection is the process of automatically managing memory for Java objects. The Java Virtual Machine (JVM) is responsible for creating and destroying objects, and the garbage collector is responsible for identifying and reclaiming unused objects.

Java garbage collection is an automatic process, which means that the programmer does not need to explicitly deallocate memory. The garbage collector keeps track of which objects are in use and which are not, and it periodically reclaims unused objects.

## Object Creation

Creating a large number of objects in Java can lead to memory and performance issues. While the Java Garbage Collector (GC) is designed to handle memory management efficiently, creating too many objects can overwhelm the GC and cause performance degradation.

### Memory Concerns

When a large number of objects are created, it increases the overall memory footprint of the application. While the overhead for a single object may be insignificant, it can become substantial when multiplied by a large number of objects.

.. note:: :doc:`VisualVM </docs/software/advanced-gradlerio/profiling-with-visualvm>` can be used to see where memory is allocated.

### Performance Concerns

The GC's job is to periodically identify and reclaim unused objects in memory. While garbage collection is running on an robot coded in Java, execution of the robot program is paused. When the GC has to collect a large number of objects, it has to pause the application to run more frequently or for longer periods of time. This is because the GC has to perform more work to collect and process each object.

GC-related performance degradation in robot programs can manifest as occasional pauses, freezes, or loop overruns as the GC works to reclaim memory.

### Design Considerations

If you anticipate your application creating a large number of short-lived objects, it is important to consider design strategies to mitigate the potential memory and performance issues. Here are some strategies to consider:

- Minimize object creation: Carefully evaluate the need for each object creation. If possible, reuse existing objects or use alternative data structures, such as arrays or primitives, to avoid creating new objects.

- Efficient data structures: Use data structures that are well-suited for the type of data you are working with. For example, if you are dealing with a large number of primitive values, consider using arrays or collections specifically designed for primitives.

## Diagnosing Out of Memory Errors with Heap Dumps

All objects in Java are retained in a section of memory called the *heap*. As objects typically consume the greatest amount of memory in a Java program, it is often useful to take a snapshot of the state of the heap---a heap dump---to analyze memory issues. Heap dumps only capture the state of a program's heap at a single point in time, so they are unlikely to be useful if not captured exactly at the time the program is experiencing memory issues.

Since ``OutOfMemoryError``\ s both crash the program and are a common reason to want a heap dump, the JVM can be configured to automatically take a heap dump the moment an ``OutOfMemoryError`` is caught by the JVM. To configure these options, locate the ``wpilibJava`` code block in your project's ``build.gradle``:

.. rli:: https://raw.githubusercontent.com/wpilibsuite/vscode-wpilib/v2027.0.0-alpha-7/vscode-wpilib/resources/gradle/java/build.gradle
   :language: groovy
   :lines: 16-48
   :lineno-match:
   :emphasize-lines: 18-21

Add to the code block so that it contains two ``jvmArgs`` commands, as shown below:

```groovy
wpilibJava(getArtifactTypeClass('WPILibJavaArtifact')) {
    // Set to true to use debug including JNI, which will drastically impact performance.
    debugJni = false
    // If you have other configuration here, you do not need to remove it.
    // Enable automatic heap dumps on OutOfMemoryError
    // Note: the heap dump path here is a path on a USB flash drive, see below
    jvmArgs.add("-XX:+HeapDumpOnOutOfMemoryError")
    jvmArgs.add("-XX:HeapDumpPath=/u/wpilib-usercode.hprof")
}
```

This will cause the JVM to write heap dumps to a file named ``wpilib-usercode.hprof`` at the root of a USB flash drive attached to the Systemcore when the code runs out of memory. It is recommended to save these heap dumps to a USB flash drive because heap dumps intrinsically consume the same amount of space on disk as the program heap did in memory when the program crashed, and are likely to be larger than the Systemcore's internal storage has capacity for. Once you have reproduced the ``OutOfMemoryError``, redeploy your code without these options enabled, and use the USB flash drive to transfer the heap dump to a computer for analysis in a memory profiler such as :ref:`VisualVM <docs/software/advanced-gradlerio/profiling-with-visualvm:Analyzing a Heap Dump>`.

.. warning:: Configuring the JVM this way requires that the flash drive remain connected to the Systemcore while your code is running.

Note that the JVM will **not** overwrite heap dumps with the exact path and filename specified by ``-XX:HeapDumpPath`` if they already exist, nor will it dump the process heap to a file with a different name. If a path to a directory is supplied instead of a path to a file, the JVM will instead write out heap dumps with unique filenames within the specified directory, with the name ``java_pidNNNN.hprof``, where ``NNNN`` is the process ID of the JVM that ran out of memory. Note that this can cause large files to build up on disk if they are not cleaned out, so if you configure the JVM this way, be sure to frequently copy heap dumps to a computer and delete them from the flash drive/SD card afterward.

.. caution:: Always be vigilant about the amount of available space on the underlying storage medium while you use this feature.

   Use of this feature is not recommended during competitive play.
