Using Compiler Arguments
============================

Compiler arguments allow us to change the behavior of our compiler. This includes making warnings into errors, ignoring certain warnings and choosing optimization level. When you compile your code a variety of flags are already included by default which can be found `here <https://github.com/wpilibsuite/native-utils/blob/0055bc77da9d9d37e0876d04af53b7317b78174f/src/main/java/edu/wpi/first/nativeutils/WPINativeUtilsExtension.java#L37>`. Normally we would pass them in as flags when compiling our code but this doesn't work in GradleRIO. Instead we have to modify our build.gradle.

C++
---

Platforms
^^^^^^^^^

Different compilers on different platforms use a variety of different flags so in order to avoid breaking different platforms with compiler flags we configure everything per platform. The platforms that are supported are :

- windowsx86-64
- windowsx86
- windowsarm64
- linuxathena (roboRIO)
- linuxarm32
- linuxarm64
- linuxx86-64
- osxuniversal

Configuring for a Platform
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: groovy

  nativeUtils.platformConfigs.named('windowsx86-64').configure {
    it.cppCompiler.args.add("/utf-8")
  }

We can break this code up step by step. First we use nativeUtils to configure the platform which here is windowsx86-64, but you can replace for whichever platform you choose to configure. Then we take the C++ compiler and add an argument "/utf-8".

Java
----

We can configure arguments to the JVM when compiling projects with GradleRIO. We can go into our build.gradle and do something similar to this(note the FRCJavaArtifact already exists you just need to add into it) :

.. code-block:: groovy

  frcJava(getArtifactClass('FRCJavaArtifact')) {
    jvmArgs.add("DisableExplicitGC")
  }

Lets go through this step by step. First we enter the FRCJavaArtifact. This is the Java artifact we are deploying to the roboRIO. Here we add an argument to our JVM using jvmArgs.add. 
