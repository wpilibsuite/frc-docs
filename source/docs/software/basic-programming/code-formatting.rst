Using a Code Formatter
======================

Code formatters exist to ensure that the style of code written is consistent throughout the entire codebase. This is used in many major projects; from Android to OpenCV. Teams may wish to add a formatter throughout their robot code to ensure that the codebase maintains readability and consistency throughout.

For this article, we will highlight using `Spotless <https://github.com/diffplug/spotless>`__ for Java teams and `wpiformat <https://github.com/wpilibsuite/styleguide/blob/main/wpiformat/README.rst>`__ for C++ teams.

Spotless
--------

Configuration
^^^^^^^^^^^^^

Necessary ``build.gradle`` changes are required to get Spotless functional. In the ``plugins {}`` block of your ``build.gradle``, add the Spotless plugin so it appears similar to the below.

.. code-block:: groovy

   plugins {
      id "java"
      id "edu.wpi.first.GradleRIO" version "2021.2.1"
      id 'com.diffplug.spotless' version '5.5.0'
   }

Spotless uses ``mavenCentral`` for distribution, so this needs to get added to a ``repositories {}`` block of your ``build.gradle``.

.. note:: Please ensure ``repositories`` is not nested in any other block in your ``build.gradle``.

.. code-block:: groovy

   repositories {
      mavenCentral()
   }

then a required ``spotless {}`` block to correctly configure spotless. This can just get placed at the end of your ``build.gradle``.

.. code-block:: groovy

   spotless {
      java {
         target fileTree('.') {
               include '**/*.java'
               exclude '**/build/**', '**/build-*/**'
         }
         toggleOffOn()
         googleJavaFormat()
         removeUnusedImports()
         trimTrailingWhitespace()
         endWithNewline()
      }
      groovyGradle {
         target fileTree('.') {
               include '**/*.gradle'
               exclude '**/build/**', '**/build-*/**'
         }
         greclipse()
         indentWithSpaces(4)
         trimTrailingWhitespace()
         endWithNewline()
      }
      format 'xml', {
         target fileTree('.') {
               include '**/*.xml'
               exclude '**/build/**', '**/build-*/**'
         }
         eclipseWtp('xml')
         trimTrailingWhitespace()
         indentWithSpaces(2)
         endWithNewline()
      }
      format 'misc', {
         target fileTree('.') {
               include '**/*.md', '**/.gitignore'
               exclude '**/build/**', '**/build-*/**'
         }
         trimTrailingWhitespace()
         indentWithSpaces(2)
         endWithNewline()
      }
   }

Running Spotless
^^^^^^^^^^^^^^^^

Spotless can be ran using ``./gradlew spotlessApply`` which will apply all formatting options. You can also specify a specific task by just adding the name of formatter. An example is ``./gradlew spotlessmiscApply``.

Spotless can also be used as a :doc:`CI check <robot-code-ci>`. The check is ran with ``./gradlew spotlessCheck``.

Explanation of Options
^^^^^^^^^^^^^^^^^^^^^^

Each ``format`` section highlights formatting of custom files in the project. The ``java`` and ``groovyGradle`` are natively supported by spotless, so they are defined differently.

Breaking this down, we can split this into multiple parts.

- Formatting Java
- Formatting Gradle files
- Formatting XML files
- Formatting Miscellaneous files

They are all similar, except for some small differences that will be explained. The below example will highlight the ``java {}`` block.

.. code-block:: groovy

   java {
      target fileTree('.') {
         include '**/*.java'
         exclude '**/build/**', '**/build-*/**'
      }
      toggleOffOn()
      googleJavaFormat()
      removeUnusedImports()
      trimTrailingWhitespace()
      endWithNewline()
   }

Let's explain what each of the options mean.

.. code-block:: groovy

   target fileTree('.') {
      include '**/*.java'
      exclude '**/build/**', '**/build-*/**'
   }

The above example tells spotless where our Java classes are and to exclude the ``build`` directory. The rest of the options are fairly self-explanatory.

- ``toggleOffOn()`` adds the ability to have spotless ignore specific portions of a project. The usage looks like the following

.. code-block:: java

   // format:off

   public void myWeirdFunction() {

   }

   // format:on

- ``googleJavaFormat()`` tells spotless to format according to the `Google Style Guide <https://google.github.io/styleguide/javaguide.html>`__
- ``removeUnusedImports()`` will remove any unused imports from any of your java classes
- ``trimTrailingWhitespace()`` will remove any extra whitespace at the end of your lines
- ``endWithNewline()`` will add a newline character to the end of your classes

In the ``groovyGradle`` block, there is a ``greclipse`` option. This is the formatter that spotless uses to format gradle files.

Additionally, there is a ``eclipseWtp`` option in the ``xml`` block. This stands for "Gradle Web Tools Platform" and is the formatter to format ``xml`` files. Teams not using any XML files may wish to not include this configuration.

.. note:: A full list of configurations is available on the `Spotless README <https://github.com/diffplug/spotless>`__

wpiformat
---------

.. todo:: add wpiformat information and prerequisites. Maybe clang-widy?
