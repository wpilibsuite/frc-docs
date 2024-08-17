Using Compiler Arguments
========================

Compiler arguments allow us to change the behavior of our compiler. This includes making warnings into errors, ignoring certain warnings and choosing optimization level. When compiling code a variety of flags are already included by default which can be found [here](https://github.com/wpilibsuite/native-utils/blob/v2024.7.2/src/main/java/edu/wpi/first/nativeutils/WPINativeUtilsExtension.java#L38). Normally it could be proposed that the solution is to pass them in as flags when compiling our code but this doesn't work in GradleRIO. Instead modify the build.gradle.

.. warning:: Modifying arguments is dangerous and can cause unexpected behavior.

C++
---

Platforms
^^^^^^^^^

Different compilers and different platforms use a variety of different flags. Therefore to avoid breaking different platforms with compiler flags configure all flags per platform. The platforms that are supported are listed [here](https://github.com/wpilibsuite/native-utils/blob/v2024.7.2/src/main/java/edu/wpi/first/nativeutils/WPINativeUtilsExtension.java#L96)

Configuring for a Platform
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: groovy

  nativeUtils.platformConfigs.named('windowsx86-64').configure {
    it.cppCompiler.args.add("/utf-8")
  }

native-utils is used to configure the platform, in this case, `windowsx86-64`. This can be replaced for any platform listed in the previous section. Then arguments, such as `/utf-8` is appended to the C++ compiler.

Java
----

Arguments can also be configured for Java. This can be accomplished by editing `build.gradle` and appending arguments to the `FRCJavaArtifact`. An example of this is shown below.

.. code-block:: groovy

  frcJava(getArtifactClass('FRCJavaArtifact')) {
    jvmArgs.add("-XX:+DisableExplicitGC")
  }
