# JVM Runtime error

Programs compiled with Microsoft Visual C++ (MSVC) require a MSVC runtime that is equal to or newer then the newest library being executed. WPILib is compiled with a recent version of MSVC.

In the past, this hasn’t really been used, but a change in the runtime in 2024 actually took advantage of this requirement.

Most JDKs ship with an MSVC runtime, and many of them are old. Additionally, many of them don’t actually include the full runtime. Both of these are a problem, as all the JNI libraries loaded by WPILib both use a lot of the runtime, and are compiled against basically the newest runtime.

For the JDK shipped with WPILib, the newest runtime is installed to ensure this issue isn't run into. But other JDKs will fail. So in 2025, much more important than prior years, the WPILib JDK needs to be used.

The following error will be seen if a JDK with an incompatible MSVC runtime is used. This only affects Windows users.

```console
> Task :simulateJavaRelease FAILED
If you receive errors loading the JNI dependencies, make sure you have the latest Visual Studio C++ Redstributable installed.
That can be found at https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads
Exception in thread "main" edu.wpi.first.util.MsvcRuntimeException: Invalid MSVC Runtime Detected.
Expected at least 14.40, but found 14.29
JVM Location: C:\Program Files\Amazon Corretto\jdk21.0.5_11\bin\java.exe
Runtime DLL Location: C:\Program Files\Amazon Corretto\jdk21.0.5_11\bin\msvcp140.dll
See https://wpilib.org/jvmruntime for more information

        at edu.wpi.first.util.WPIUtilJNI.checkMsvcRuntime(Native Method)
        at edu.wpi.first.wpilibj.RobotBase.startRobot(RobotBase.java:470)
        at frc.robot.Main.main(Main.java:23)

FAILURE: Build failed with an exception.
```

## Setting Gradle to use WPILib JDK

This is not necessary if using the WPILib VS Code, which is the supported way to run. The following methods may be used for other Windows users.

Ensure you've :doc:`installed WPILib </docs/zero-to-robot/step-2/wpilib-setup>` before proceeding.

### Commandline Parameter

To ensure that Gradle uses the WPILib JDK, you must set :code:`org.gradle.java.home` to the WPILib JDK. This can be done by passing a parameter to gradle (where YEAR is the current WPILib installation):

```console
gradlew -D org.gradle.java.home="C:\\Users\\Public\\wpilib\\YEAR\\jdk" ...
```

### gradle.properties

It can also be done by putting ``gradle.properties`` in the project root with the following contents (where YEAR is the current WPILib installation):

.. warning:: ``gradle.properties`` should not be checked into git or other version management tools. This will only work if you only use your project on Windows, as the location is hardcoded to the location on Windows.

```text
org.gradle.java.home=C:\\Users\\Public\\wpilib\\YEAR\\jdk
```

### IDE

Some IDEs have a method to set the JDK used. Consult the documentation for your IDE.
