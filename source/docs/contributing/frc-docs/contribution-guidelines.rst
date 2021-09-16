.. include:: <isonum.txt>

Contribution Guidelines
=======================

Welcome to the contribution guidelines for the frc\ |reg|-docs project. If you are unfamiliar to writing in the reStructuredText format, please read up on it `here <https://thomas-cokelaer.info/tutorials/sphinx/rest_syntax.html>`__.

.. important:: *FIRST*\ |reg| retains all rights to documentation and images provided. Credit for articles/updates will be in the `GitHub commit history. <https://github.com/wpilibsuite/frc-docs/graphs/commit-activity>`_

Mission Statement
-----------------

The WPILib Mission is to enable *FIRST* Robotics teams to focus on writing game-specific software rather than focusing on hardware details - "raise the floor, don't lower the ceiling". We work to enable teams with limited programming knowledge and/or mentor experience to be as successful as possible, while not hampering the abilities of teams with more advanced programming capabilities. We support Kit of Parts control system components directly in the library. We also strive to keep parity between major features of each language (Java, C++, and NI's LabVIEW), so that teams aren't at a disadvantage for choosing a specific programming language.

These docs serve to provide a learning ground for all *FIRST* Robotics Competition teams. Contributions to the project must follow these core principles.

- Community-led documentation. Documentation sources are hosted publicly and the community are able to make contributions
- Structured, well-formatted, clean documentation. Documentation should be clean and easy to read, from both a source and release standpoint
- Relevant. Documentation should be focused on the *FIRST* Robotics Competition.

Please see the :ref:`docs/contributing/frc-docs/style-guide:Style Guide` for information on styling your documentation.

Release Process
---------------

frc-docs uses a special release process for handling the main site ``/stable/`` and the development site ``/latest/``. This flow is detailed below.

During Season:

- Commit made to ``main`` branch

  - Updates ``/stable/`` and ``/latest/`` on the website

End of Season:

- Repository is tagged with year, for archival purposes

Off-Season:

- ``stable`` branch is locked to the last on-season commit
- Commit made to ``main`` branch

  - Only updates ``/latest/`` on the documentation site

Creating a PR
-------------

PRs should be made to the `frc-docs <https://github.com/wpilibsuite/frc-docs>`__ repo on GitHub. They should point to the ``main`` branch and *not* ``stable``.

Creating New Content
--------------------

Thanks for contributing to the `frc-docs <https://github.com/wpilibsuite/frc-docs>`__ project! There are a couple things you should know before getting started!

Where to place articles?
^^^^^^^^^^^^^^^^^^^^^^^^

The location for new articles can be a pretty opinionated subject. Standalone articles that fall well into an already subject category should be placed into mentioned subject category (documentation on something about simulation should be placed into the simulation section). However, things can get pretty complicated when an article combines or references two separate existing sections. In this situation, we advise the author to open an issue on the repository to get discussion going before opening the PR.

.. note:: All new articles will undergo a review process before being merged into the repository. This review process will be done by members of the WPILib team. New Articles must be on official *FIRST* supported Software and Hardware. Documentation on unofficial libraries or sensors *will not* be accepted. This process may take some time to review, please be patient.

Where to place sections?
^^^^^^^^^^^^^^^^^^^^^^^^

Sections are quite tricky, as they contain a large amount of content. We advise the author to open an `issue <https://github.com/wpilibsuite/frc-docs/issues>`__ to gather discussion before opening up a PR.

Linking Other Articles
^^^^^^^^^^^^^^^^^^^^^^

In the instance that the article references content that is described in another article, the author should make best effort to link to that article upon the first reference.

Imagine we have the following content in a drivetrain tutorial:

.. code-block:: text

   Teams may often need to test their robot code outside of a competition. :ref:`Simulation <link-to-simulation:simulation>` is a means to achieve this. Simulation offers teams a way to unit test and test their robot code without ever needing a robot.

Notice how only the first instance of Simulation is linked. This is the structure the author should follow. There are times where a linked article has different topics of content. If you reference the different types of content in the article, you should link to each new reference once (except in situations where the author has deemed it appropriate otherwise).
