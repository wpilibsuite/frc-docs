Including Git Data in Deploy
============================

This article will go over how to include information from Git, such as branch name or commit hash, into the robot code using the `gversion <https://github.com/lessthanoptimal/gversion-plugin>`__ gradle plugin. This is necessary for using such information in robot code, such as printing out commit hash and branch name when the robot starts.

- Installing gversion

To install gversion add the following line to the plugins block of `build.gradle`.

.. code-block:: groovy

  plugins {
      // ...
      id "com.peterabeles.gversion" version "1.10"
  }

Then add the following block to `build.gradle` to add `createVersionFile` as a dependancy of `compileJava`. The `timeZone` field can be modified based on your team's time zone based on `this list of timezone IDs <https://docs.oracle.com/middleware/12211/wcs/tag-ref/MISC/TimeZones.html>`__.

.. code-block:: groovy

  project.compileJava.dependsOn(createVersionFile)
  gversion {
    srcDir       = "src/main/java/"
    classPackage = "frc.robot"
    className    = "BuildConstants"
    dateFormat   = "yyyy-MM-dd HH:mm:ss z"
    timeZone     = "America/New_York" // Use preferred time zone
    indent       = "  "
  }

You should also add the `BuildConstants.java` file to the repository `.gitignore`:

.. code-block:: 

  src/main/java/frc/robot/BuildConstants.java

