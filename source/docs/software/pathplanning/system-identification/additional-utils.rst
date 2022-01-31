Additional Utilities and Tools
==============================

This page mainly covers useful information about additional functionality that this tool provides.


JSON Converters
---------------

There are a two JSON Utility tools that can be used in the :guilabel:`JSON Converters` tab: FRC-Char Converter and JSON to CSV Converter.

.. image:: images/json-converters.png
   :alt: Picture of the json converters

The FRC-Char Converter reads in an FRC-Char JSON and converts it into a SysId JSON that the tool can read.

The JSON to CSV Converter takes a SysId JSON and outputs a CSV file. If the JSON had Drivetrain Mechanism data, the columns are: ``Timestamp (s)``, ``Test``, ``Left Volts (V)`` , ``Right Volts (V)``, ``Left Position ({0})``, ``Right Position ({units})``, ``Left Velocity ({units}/s)``, ``Right Velocity ({units}/s)``, ``Gyro Position (deg)``, ``Gyro Rate (deg/s)``.
If the JSON had General Mechanism data, the CSV has the following columns: ``Timestamp (s)``, ``Test``, ``Volts (V)``, ``Position({units})``, ``Velocity ({units}/s)``.

ImGui Tips
----------

The following are essentially handy features that come with the ImGui framework that SysId uses:

Showing and Hiding Plot Data
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
To add or remove certain data from the plots, click on the color of the data that you would like to hide or remove.

For example, if we want to hide sim data, we can click the green color box.

.. image:: images/hide-sim-data.png
  :alt: Where one would need to click to hide sim data on an example plot

.. image:: images/post-sim-hide.png
   :alt: Picture of a plot after sim is hidden

Auto Sizing Plots
^^^^^^^^^^^^^^^^^
If you zoom in to plots and want to revert back to the normally sized plots, just double click on the plot and it will automatically resize it.

Here is a plot that is zoomed in:

.. image:: images/zoomed-in-plot.png
    :alt: Picture of a plot that is zoomed in

After double clicking, it is automatically resized:

.. image:: images/resized-plot.png
    :alt: Picture of the previously zoomed in plot that is resized

Setting Slider Values
^^^^^^^^^^^^^^^^^^^^^
To set the value of a slider as a number rather than sliding the widget, you can CTRL + Click the slider and it will allow you to input a number.

Here is a regular slider:

.. image:: images/regular-slider.png
    :alt: Picture of a regular slider

Here is the input after double clicking the slider:

.. image:: images/input-slider.png
    :alt: Picture of the slider as a number entry



