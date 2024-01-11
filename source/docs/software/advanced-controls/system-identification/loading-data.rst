Loading Data
============

After downloading the WPILog containing the tests from the roboRIO, go to the ``Log Loader`` pane in SysId and click ``Open data log file...``.

.. note:: If the log file has many entries, use the ``Filter`` box to search for the needed entries.

After the file loads, look for a ``string`` entry starting with ``sysid-test-state-``. Drag this entry into the Data Selector pane's Test State slot.
^image

Now the ``Data Selector`` pane will present ``Position``, ``Velocity``, and ``Voltage`` slots. In the ``Log Loader`` pane, find entries starting with each of those terms and containing the motor name you set in the ``log`` callback, and drag those into the ``Data Selector`` slots.

Ideally, the correct units for the position and velocity entries would have been set in the code before running the tests. If this was not the case, use the Units dropdown in the ``Data Selector`` pane to correct it. Additionally, if you did not account for a gear ratio or some other factor that scales the recorded values up or down uniformly, you can compensate for that by setting position and velocity scaling factors in the provided text boxes.
^image

Ensure the correct analysis type has been selected, then click the ``Load`` button and move on to checking the fit diagnostics.