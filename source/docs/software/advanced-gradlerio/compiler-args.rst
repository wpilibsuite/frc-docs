Using Compiler Arguments
========================

Compiler arguments allow us to change the behavior of our compiler. This includes making warnings into errors, ignoring certain warnings and choosing optimization level. When compiling code a variety of flags are already included by default which can be found `here <https://github.com/wpilibsuite/native-utils/blob/0055bc77da9d9d37e0876d04af53b7317b78174f/src/main/java/edu/wpi/first/nativeutils/WPINativeUtilsExtension.java#L37>`. Normally it could be proposed that the solution is to pass them in as flags when compiling our code but this doesn't work in GradleRIO. Instead modify the build.gradle.
.. warning:: Warning Modifying arguments is dangerous and can cause unexpected behavior.

C++
---

Platforms
^^^^^^^^^

Different compilers and different platforms use a variety of different flags. Therefore to avoid breaking different platforms with compiler flags configure all flags per platform. The platforms that are supported are :

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

Lets break this code up step by step. First use nativeUtils to configure the platform which here is windowsx86-64, but can be replaced for whichever platform chosen to configure. Then take the C++ compiler and add an argument eg. "/utf-8".

Java
----

We can configure arguments to the JVM when compiling projects with GradleRIO. These arguments can serve a variety of purposes for example remote debugging or memory analysis. To do this we can go into our build.gradle and do something similar to this(note the FRCJavaArtifact already exists just add to it) :

.. code-block:: groovy

  frcJava(getArtifactClass('FRCJavaArtifact')) {
    jvmArgs.add("-XX:+DisableExplicitGC")
  }

Lets go through this step by step. First enter the FRCJavaArtifact. This is the Java artifact deployed to the roboRIO. Here add an argument to our JVM using jvmArgs.add.
