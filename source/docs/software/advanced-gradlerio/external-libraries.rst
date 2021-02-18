Using External Libraries with Robot Code
========================================

.. warning:: Using external libraries may have unintended behavior with your robot code! It is not recommended unless you are aware of what you are doing!

Often a team might want to add external Java or C++ libraries for usage with their robot code. This article highlights adding Java libraries to your Gradle dependencies, or the options that C++ teams have.

Java
----

.. note:: Any external dependencies that rely on native libraries (JNI) are likely not going to work.

Java is quite simple to add external dependencies. You simply add the required ``repositories`` and ``dependencies``.

Robot projects by default do not have a ``repositories {}`` block in the ``build.gradle`` file. You will have to add this yourself. Above the ``dependencies {}`` block, please add the following:

.. code-block:: groovy

   repositories {
      mavenCentral()
      ...
   }

``mavenCentral()`` can be replaced with whatever repository the library you want to import is using. Now you have to add the dependency on the library itself. This is done by adding the necessary line to your ``dependencies {}`` block. The below example showcases adding Apache Commons to your Gradle project.

.. code-block:: groovy

   dependencies {
      implementation 'org.apache.commons:commons-lang3:3.6'
      ...
   }

Now you run a build and ensure the dependencies are downloaded. Intellisense may not work properly until a build is ran!

C++
---

Adding C++ dependencies to your robot project is non-trivial due to needing to compile for the roboRIO. You have a couple of options.

1. Copy the source code of the wanted library into your robot project.
2. Use the `vendordep template <https://github.com/wpilibsuite/vendor-template>`__ as an example and create a vendordep.

Copying Source Code
^^^^^^^^^^^^^^^^^^^

Simply copy the necessary source and/or headers into your robot project. You can then configure any necessary platform args like below:

.. code-block:: groovy

   nativeUtils.platformConfigs.named("linuxx86-64").configure {
      it.linker.args.add('-lstdc++fs') // links in C++ filesystem library
   }

Creating a Vendordep
^^^^^^^^^^^^^^^^^^^^

Please follow the instructions in the `vendordep repository <https://github.com/wpilibsuite/vendor-template>`__.
