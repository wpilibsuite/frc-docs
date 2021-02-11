Adding Predeploy Tasks
======================

.. warning:: Adding predeploy tasks can cause some unintended behavior!

Adding predeploy tasks are useful when the user needs to configure some external program on the roboRIO before deploying robot code. It's also useful for other advanced configurations.

Add a ``deploy {}`` block to your ``build.gradle`` using the below as an example:

.. code-block:: groovy

    deploy {
        ...
        artifacts {
            frcNativeArtifact('frcCpp') {
                ...
                predeploy << {
                    // Give RT capability
                    it.execute('setcap cap_sys_nice+eip /home/lvuser/frcUserProgram')

                    // Disable crond because it uses 50% CPU and there's no cronjobs to run
                    it.execute('/etc/init.d/crond stop')

                    // Disable NI web server because it leaks memory
                    it.execute('/usr/local/natinst/etc/init.d/systemWebServer stop')

                    // Compress old log files
                    it.execute('find . -type f | grep \\.csv$ | xargs -d \\n gzip -q')
                }
            }
        }
    }

The above commands will run *after* the robot program is deleted but *before* the new robot program is deployed.
