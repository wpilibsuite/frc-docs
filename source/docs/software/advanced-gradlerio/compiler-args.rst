# Using Compiler Arguments

Compiler arguments allow us to change the behavior of our compiler. This includes making warnings into errors, ignoring certain warnings and choosing optimization level. When compiling code a variety of flags are already included by default which can be found [here](https://github.com/wpilibsuite/native-utils/blob/v2024.7.2/src/main/java/edu/wpi/first/nativeutils/WPINativeUtilsExtension.java#L38). Normally it could be proposed that the solution is to pass them in as flags when compiling our code but this doesn't work in GradleRIO. Instead modify the build.gradle.

.. warning:: Modifying arguments is dangerous and can cause unexpected behavior.

## C++

### Platforms

Different compilers and different platforms use a variety of different flags. Therefore to avoid breaking different platforms with compiler flags configure all flags per platform. The platforms that are supported are listed [here](https://github.com/wpilibsuite/native-utils/blob/v2024.7.2/src/main/java/edu/wpi/first/nativeutils/WPINativeUtilsExtension.java#L96)

### Configuring for a Platform

```groovy
nativeUtils.platformConfigs.named('windowsx86-64').configure {
  it.cppCompiler.args.add("/utf-8")
}
```

native-utils is used to configure the platform, in this case, `windowsx86-64`. This can be replaced for any platform listed in the previous section. Then arguments, such as `/utf-8` is appended to the C++ compiler.

## Java

Compiler arguments can also be configured for Java. We do this by adding arguments in the `JavaCompile` task.

```groovy
// Configure string concat to always inline compile
tasks.withType(JavaCompile) {
    options.compilerArgs.add '-XDstringConcat=inline'
}
```

### JVM Arguments

Along with being able to configure compiler arguments Java also allows us to configure runtime options for the JVM. We do this by editing the `frcJava` artifact's arguments.

```groovy
frcJava(getArtifactClass('FRCJavaArtifact')) {
  jvmArgs.add("-XX:+DisableExplicitGC")
}
```

## Deleting Unused Deploy Files

By default the `src/main/deploy` directory in your project is transferred to the roboRIO when code is deployed.  It is initiated by this section of the `build.gradle` file.

```groovy
frcStaticFileDeploy(getArtifactTypeClass('FileTreeArtifact')) {
    files = project.fileTree('src/main/deploy')
    directory = '/home/lvuser/deploy'
    deleteOldFiles = false // Change to true to delete files on roboRIO that no
                           // longer exist in deploy directory on roboRIO
}
```

This will overwrite any duplicate files found in the `/home/lvuser/deploy` directory on the RIO and copy over any additional not present there.  If `deleteOldFiles` is false it will not remove any files no longer present in the project deploy directory.  Changing it to `true` helps prevent programs like :doc:`Choreo </docs/software/wpilib-tools/choreo/index>` and [PathPlanner](https://github.com/mjansen4857/pathplanner) from getting confused by files that were deleted locally but still exist on the roboRIO.

If you want to manage the roboRIO files directly, the :doc:`FTP documentation </docs/software/roborio-info/roborio-ftp>` provides one method to do so.
