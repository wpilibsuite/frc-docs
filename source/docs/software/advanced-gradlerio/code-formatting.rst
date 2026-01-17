# Using a Code Formatter

Code formatters exist to ensure that the style of code written is consistent throughout the entire codebase. This is used in many major projects; from Android to OpenCV. Teams may wish to add a formatter throughout their robot code to ensure that the codebase maintains readability and consistency throughout.

For this article, we will highlight using [Spotless](https://github.com/diffplug/spotless) for Java teams and [wpiformat](https://github.com/wpilibsuite/styleguide/blob/main/wpiformat/README.md) for C++ teams.

## Spotless

### Configuration

Necessary ``build.gradle`` changes are required to get Spotless functional. In the ``plugins {}`` block of your ``build.gradle``, add the Spotless plugin so it appears similar to the below.

```groovy
plugins {
   id "java"
   id "edu.wpi.first.GradleRIO" version "2024.1.1"
   id 'com.diffplug.spotless' version '6.20.0'
}
```

Then ensure you add a required ``spotless {}`` block to correctly configure spotless. This can just get placed at the end of your ``build.gradle``.

```groovy
spotless {
   java {
      target fileTree('.') {
            include '**/*.java'
            exclude '**/build/**', '**/build-*/**', '**/bin/**'
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
```

### Running Spotless

Spotless can be ran using ``./gradlew spotlessApply`` which will apply all formatting options. You can also specify a specific task by just adding the name of formatter. An example is ``./gradlew spotlessmiscApply``.

In addition to formatting code, Spotless can also ensure the code is correctly formatted; this can be used by running ``./gradlew spotlessCheck``. Thus, Spotless can be used as a :doc:`CI check <robot-code-ci>`, as shown in the following GitHub Actions workflow:

```yaml
on: [push]
# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  spotless:
    # The type of runner that the job will run on
    runs-on: ubuntu-22.04
    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 17
      - run: ./gradlew spotlessCheck
```

### Explanation of Options

Each ``format`` section highlights formatting of custom files in the project. The ``java`` and ``groovyGradle`` are natively supported by spotless, so they are defined differently.

Breaking this down, we can split this into multiple parts.

- Formatting Java
- Formatting Gradle files
- Formatting XML files
- Formatting Miscellaneous files

They are all similar, except for some small differences that will be explained. The below example will highlight the ``java {}`` block.

```groovy
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
```

Let's explain what each of the options mean.

```groovy
target fileTree('.') {
   include '**/*.java'
   exclude '**/build/**', '**/build-*/**'
}
```

The above example tells spotless where our Java classes are and to exclude the ``build`` directory. The rest of the options are fairly self-explanatory.

- ``toggleOffOn()`` adds the ability to have spotless ignore specific portions of a project. The usage looks like the following

```java
// format:off
public void myWeirdFunction() {
}
// format:on
```

- ``googleJavaFormat()`` tells spotless to format according to the [Google Style Guide](https://google.github.io/styleguide/javaguide.html)
- ``removeUnusedImports()`` will remove any unused imports from any of your Java classes
- ``trimTrailingWhitespace()`` will remove any extra whitespace at the end of your lines
- ``endWithNewline()`` will add a newline character to the end of your classes

In the ``groovyGradle`` block, there is a ``greclipse`` option. This is the formatter that spotless uses to format gradle files.

Additionally, there is a ``eclipseWtp`` option in the ``xml`` block. This stands for "Gradle Web Tools Platform" and is the formatter to format ``xml`` files. Teams not using any XML files may wish to not include this configuration.

.. note:: A full list of configurations is available on the [Spotless README](https://github.com/diffplug/spotless)

### Issues with Line Endings

Spotless will attempt to apply line endings per-OS, which means Git diffs will be constantly changing if two users are on different OSes (Unix vs Windows). It's recommended that teams who contribute to the same repository from multiple OSes utilize a ``.gitattributes`` file. The following should suffice for handling line endings.

```text
*.gradle text eol=lf
*.java text eol=lf
*.md text eol=lf
*.xml text eol=lf
```

## wpiformat

### Requirements

- [Python 3.9 or higher](https://www.python.org/)

You can install [wpiformat](https://github.com/wpilibsuite/styleguide/blob/main/wpiformat/README.md) by typing ``pip3 install wpiformat`` into a terminal or command prompt.

### Usage

wpiformat can be ran by typing ``wpiformat`` in a console. This will format with ``clang-format``. Three configuration files are required (``.clang-format``, ``.styleguide``, ``.styleguide-license``). These must exist in the project root.

- ``.clang-format``: :download:`Download <https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/.clang-format>`
- ``.styleguide-license``: :download:`Download <https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/.styleguide-license>`

An example styleguide is shown below:

```text
cppHeaderFileInclude {
   \.h$
   \.hpp$
   \.inc$
   \.inl$
}
cppSrcFileInclude {
   \.cpp$
}
modifiableFileExclude {
   gradle/
}
```

.. note:: Teams can adapt ``.styleguide`` and ``.styleguide-license`` however they wish. It's important that these are not deleted, as they are required to run wpiformat!

You can turn this into a :doc:`CI check <robot-code-ci>` by running ``git --no-pager diff --exit-code HEAD``, as shown in the example GitHub Actions workflow below:

.. rli:: https://raw.githubusercontent.com/wpilibsuite/allwpilib/v2026.2.1/.github/workflows/lint-format.yml
   :language: yaml
   :lines: 1-5, 13, 21-43
