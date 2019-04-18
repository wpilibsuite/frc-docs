# Contribution Guidelines

## Project Goals 

***IMPORTANT: Currently we are in the process of migrating documentation from the official screensteps. Please hold off on writing new articles unless they are a migration from [screensteps](http://wpilib.screenstepslive.com/s/currentCS)***

***ALSO NOTE: FIRST retains all rights to documentation and images provided. This disclaimer is in the event that FIRST decides to make this project official***

The goal of frc-docs is to have a [FIRST](https://firstinspires.org) Robotics Competition documentation into a community led model.

This community-led model's goals are:
- Community-led documentation. Documentation sources are hosted publicly and the community are able to make contributions
- Structured, well-formatted, clean documentation. Documentation should be clean and easy to read, from both a source and release standpoint
- Modern. Documentation should be up-to-date and modern.

## Guidelines
- Pages must be located under /source/docs/page-category/[pagesgohere]
- Pages must be in [reStructuredText format](https://github.com/ralsina/rst-cheatsheet/blob/master/rst-cheatsheet.rst). Pull-requests using Markdown ***will not*** be accepted!.
- Images must be located under /source/docs/page-category/images/[images go here].
- Sections containing notes, or important remarks must be prefaced with the `.. note::` or `.. warning::` tag.
- Contributions must target the `develop` branch. Contributions targeting `master` will be rejected.

## FAQ
### Why Sphinx?
- Because Sphinx is a simply, easy-to-use documentation build system with lots of flexibility and extendability. Other documentation systems such as MkDocs don't have the extendability that this project requires.

### Why reStructuredText?
- reStruturedText is what Sphinx natively supports

### But... Sphinx supports Markdown through extensions
- Yes, Sphinx does indeed support Markdown through extensions. However, Markdown has over 50 available *flavours* with multiple cons. See [this](https://eli.thegreenplace.net/2017/restructuredtext-vs-markdown-for-technical-documentation/) excellent article for more information.

### Why was my page involving X not accepted?
- It contains outdated or bad information
- It involved unofficial FRC software
- It contains unacceptable language
- There was likely a comment regarding why on your Pull-Request. Please review it.
