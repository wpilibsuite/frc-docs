Using Compiler Arguments
============================

Compiler arguments allow us to change the behavior of our compiler. This includes making warnings into errors, ignoring certain warnings and choosing optimization level. Normally we would pass them in as flags when compiling our code but this doesn't work in GradleRIO. Instead we have to modify our build.gradle.

C++
---

Platforms
^^^^^^^^^

In order to avoid breaking different platforms with compiler flags we configure everything per platform. The platforms that are supported are :

- windowsx86-64
- linuxathena

Configuring for a Platform
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: groovy

  nativeUtils.platformConfigs.named('windowsx86-64').configure {
    it.cppCompiler.args.add("/utf-8")
  }

We can break this code up step by step. First we use nativeUtils to configure the platform which here is windowsx86-64, but you can replace for whichever platform you choose to configure. Then we take the C++ compiler and add an argument "/utf-8".

Java
----
