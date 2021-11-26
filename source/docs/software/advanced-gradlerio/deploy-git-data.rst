Including Git Data in Deploy
============================

This article will go over how to include information from Git, such as branch name or commit hash, into the robot code. This is necessary for using such information in robot code, such as printing out commit hash and branch name when the robot starts.

.. note:: Git must be in the path for this to work. This should be enabled by default when `installing Git <https://git-scm.com/downloads>`__.

Deploying Branch Name
---------------------

This example uses `git rev-parse <https://git-scm.com/docs/git-rev-parse>`__ to extract data the name of the current branch. The Git command we will be using for this is:

.. code-block:: console

   $ git rev-parse --abbrev-ref HEAD

The ``--abbrev-ref`` flag tells Git to use a short version of the name for the current commit that rev-parse is acting on. When HEAD is the most recent commit on a branch, this will return the name of that branch since they are synonymous. 

Next, create a new task in the ``build.gradle`` file that will run the above Git command and write it to a file in the ``src/main/deploy`` directory. For example, the following is how to define a task named ``writeBranchName`` that will write the branch name to a file named ``branch.txt``.

.. code-block:: groovy

   tasks.register("writeBranchName") {
      // define an output stream to write to instead of terminal
      def stdout = new ByteArrayOutputStream()

      // execute the git command
      exec {
         commandLine "git", "rev-parse", "--abbrev-ref", "HEAD"
         // write to the output stream instead of terminal
         standardOutput = stdout
      }

      // parse the output into a string
      def branch = stdout.toString().trim()

      // create a new file
      new File(
         // join project directory and deploy directory
         projectDir.toString() + "/src/main/deploy",
         // file name to write to
         "branch.txt"
      ).text = branch // set the contents of the file to the variable branch
   }
    

