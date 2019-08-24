Git Version Control Introduction
================================

.. important:: A more in-depth guide on Git is available on the `Git website <https://git-scm.com/book/en/v2>`__.

`Git <https://git-scm.com/about>`_ is a Distributed Version Control System (VCS) created by Linus Torvalds, also known for creating and maintaining the linux kernel. Version Control is a system for tracking changes of code for developers. The advantages of Git Version Control are:

- Separate testing environments into *branches*
- Ability to navigate to a particular *commit* without removing history
- Ability to manage *commits* in various ways, including combining them
- Various other features, see `here <https://git-scm.com/about>`__

Prerequisites
-------------

.. important:: This tutorial uses the Windows operating system

You have to download and install Git from the following links:

- `Windows <https://git-scm.com/download/win>`_
- `Mac OS X <https://git-scm.com/download/mac>`_
- `Linux <https://git-scm.com/download/linux>`_

.. note:: You may need to add Git to your `path <https://www.google.com/search?q=adding+git+to+path>`__

Git Vocabulary
--------------

Git revolves around several core commands:

- **Repository:** the data structure of your code, including a ``.git`` folder in the root directory
- **Commit:** a particular saved state of the repository, this includes all files and additions
- **Branch:** a means of separating various commits, having a unique history. This is primarily used for separating development and stable branches.
- **Push:** update the remote repository with your local changes
- **Pull:** update your local repository with the remote changes
- **Clone:** retrieving a local copy of a repository to modify
- **Fork:** duplicating a pre-existing repository to modify, and to compare against the original
- **Merge:** combining various changes from different branches/commits/forks into a single history

Repository
----------

A Git repository is a data structure containing the structure, history, and files of a project.

Git repositories usually consist of:

- A ``.git`` folder. This folder contains the various information about the repository.
- A ``.gitignore`` file. This file contains the files or directories that you do *not* want included when you commit.
- Files and folders. This is the main content of the repository.

Creating the repository
^^^^^^^^^^^^^^^^^^^^^^^

You can store the repository locally, or through a remote. A remote being the cloud, or possibly another storage medium that hosts your repository. `Github <https://github.com/>`_ is a popular free hosting service. Numerous developers use it, and that's what this tutorial will use.

.. note:: There are various providers that can host repositories. `Gitlab <http://gitlab.com/>`_, `Bitbucket <https://bitbucket.org/>`_, and `Cloudforge <http://www.cloudforge.com/>`_ are a few alternatives to Github

Creating a Github Account
~~~~~~~~~~~~~~~~~~~~~~~~~

Go ahead and create a Github account by visiting the `website <https://github.com>`_ and following the own screen prompts.

.. image:: images/image1.png

Local Creation
~~~~~~~~~~~~~~

After creating and verifying your account, you'll want to visit the homepage. It'll look similar to the shown image.

.. image:: images/image2.png

Click the plus icon in the top right.

.. image:: images/image3.png

Then click *"New Repository"*

.. image:: images/image4.png

Fill out the appropriate information, and then click *"Create repository"*

.. image:: images/image5.png

You should see a screen similar to this

.. image:: images/image6.png

.. note:: The keyboard shortcut ``ctrl`` + ``~`` can be used to open a terminal in Visual Studio Code.

Now you'll want to open a powershell window and navigate to your project directory. An excellent tutorial on powershell can be found `here <https://programminghistorian.org/en/lessons/intro-to-powershell>`__. Please consult your search engine on how to open a terminal on alternative operating systems.

.. image:: images/image7.png

In the below example, we created a file called ``README.md`` with the contents of ``# Example Repo``. More details on the various commands can be found in the subsequent sections.

.. image:: images/image8.png

Commits
-------

Repositories are primarily composed of commits. Commits are saved states or *versions* of code.

In the previous example, we created a file called README.md. Open that file in your favorite text editor and edit a few lines. After tinkering with the file for a bit, simply save and close. Navigate to powershell and type the following commands.

1. ``git add README.md``
2. ``git commit -m "example commit"``
3. ``git push``

.. image:: images/image9.png

Git Pull
^^^^^^^^

.. note:: ``git fetch`` can be used when the user does not wish to automatically merge into the current working branch

This command retrieves the history or commits from the remote repository. When the remote contains work you do not have, it will attempt to automatically merge. See :ref:`docs/software/basic-programming/git-getting-started:Merging`.

Run: ``git pull``

Git Add
^^^^^^^

This command adds a selected file(s) to a commit. To commit every file/folder that isn't excluded via *gitignore*.

Run: ``git add FILENAME.txt`` where FILENAME.txt is the name and extension of the file to add to a commit.
Run: ``git add .`` will add every untracked, unexcluded file when ran in the root of the repository.

Git Commit
^^^^^^^^^^

This command creates the commit and stores it locally. This saves the state and adds it to the repositories history.

Run: ``git commit -m "type message here"``

Git Push
^^^^^^^^

Upload (Push) your local changes to the remote (Cloud)

Run: ``git push``

Branches
--------

Branches are a similar to parallel worlds to Git. They start off the same, and then they can "branch" out into different varying paths. Consider the Git control flow to look similar to this.

.. graphviz::

   digraph branches {
      "Example Repo" [ shape=cylinder]
      FeatureA [ shape=ellipse]
      FeatureB [ shape=ellipse]
      FeatureC [ shape=ellipse]
      "Example Repo" -> FeatureA
      "Example Repo" -> FeatureB
      "Example Repo" -> FeatureC
      "Update File 1" [ shape=box]
      FeatureA -> "Update File 1"
      "Update File 2" [ shape=box]
      FeatureB -> "Update File 2"
      "Update File 3" [ shape=box]
      FeatureC -> "Update File 3"
   }

In the above example, FeatureB was merged into FeatureA. This is what is called a merge. You are "merging" the changes from one branch into another.

Creating a Branch
^^^^^^^^^^^^^^^^^

Run: ``git branch branch-name`` where branch-name is the name of the branch to create. The new branch history will be created from the current active branch.

Entering a Branch
^^^^^^^^^^^^^^^^^

Once a branch is created, you have to then enter the branch.

Run: ``git checkout branch-name`` where branch-name is the branch that was previously created.

Merging
-------

In scenarios where you want to copy one branches history into another, you can merge them. A merge is done by calling ``git merge branch-name`` with branch-name being the name of the branch to merge from. It is automatically merged in the current active branch.

It's common for a remote repository to contain work (history) that you do not have. Whenever you run ``git pull``, it will attempt to automatically merge those commits. That merge may look like the below.

.. graphviz::

   digraph branches {
      "Example Repo" [ shape=cylinder]
      FeatureA [ shape=ellipse]
      FeatureB [ shape=ellipse]
      FeatureC [ shape=ellipse]
      "Example Repo" -> FeatureA
      "Example Repo" -> FeatureB
      "Example Repo" -> FeatureC
      "Update File 1" [ shape=box]
      FeatureA -> "Update File 1"
      "Update File 2" [ shape=box]
      FeatureB -> "Update File 2"
      "Update File 3" [ shape=box]
      FeatureC -> "Update File 3"
   }

However, in the above example, what if File 1 was modified by both branch FeatureA and FeatureB? This is called a **merge conflict**. A merge conflict will can be resolved by editing the conflicting file. In the example, we would need to edit File 1 to keep the history or changes that we want. After that has been done. Simply re-add, re-commit, and then push your changes.

Resets
------

Sometimes history needs to be reset, or a commit needs to be undone. This can be done multiple ways.

Reverting the Commit
^^^^^^^^^^^^^^^^^^^^

.. note:: You cannot revert a merge, as git does not know which branch or origin it should choose.

To revert history leading up to a commit run ``git revert commit-id``. The commit IDs can be shown using the ``git log`` command.

Resetting the Head
^^^^^^^^^^^^^^^^^^

.. warning:: Forcibly resetting the head is a dangerous command. It permanently erases all history past the target. You have been warned!

Run: ``git reset --hard commit-id``.

Forks
-----

Forks can be treated similarly to branches. You can merge the upstream (original repository) into the origin (forked repository).

Updating a Fork
^^^^^^^^^^^^^^^

1. Add the upstream: ``git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git``
2. Confirm it was added via: ``git remote -v``
3. Pull changes from upstream: ``git fetch upstream``
4. Merge the changes into head: ``git merge upstream/upstream-branch-name``

Gitignore
---------

.. important:: It is extremely important that teams **do not** modify the .gitignore file that is included with their robot project. This can lead to offline deployment not working.

A .gitignore file is commonly used as a list of files to not automatically commit with ``git add``. Any files or directory listed in this file will **not** be committed. They will also not show up with `git status <https://git-scm.com/docs/git-status>`_.

Additional Information can be found `here <https://www.atlassian.com/git/tutorials/saving-changes/gitignore>`__

Hiding a Folder
^^^^^^^^^^^^^^^

Simply add a new line containing the folder to hide, with a forward slash at the end

EX: ``directory-to-exclude/``

Hiding a File
^^^^^^^^^^^^^

Add a new line with the name of the file to hide, including any prepending directory relative to the root of the repository.

EX: ``directory/file-to-hide.txt``

EX: ``file-to-hide2.txt``

Additional Information
----------------------

A much more in-depth tutorial can be found at the official `git <https://git-scm.com/docs/gittutorial>`__ website.
