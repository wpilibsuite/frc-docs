Introduction to Filters
=======================

Filters are some of the most common tools used in modern technology, and find numerous applications in robotics in both signal processing and controls.  Understanding the notion of a filter is crucial to understanding the utility of the various types of filters provided by WPILib.

What Is a Filter?
-----------------

.. note:: For the sake of this article, we will assume all data are single-dimensional time-series data.  Obviously, the concepts involved are more general than this - but a full/rigorous discussion of signals and filtering is out of the scope of this documentation.

So, what exactly *is* a filter, then?  Simply put, a filter is a mapping from a stream of inputs to a stream of outputs.  That is to say, the value output by a filter (in principle) can depend not only on the *current* value of the input, but on *the entire set of past and future values* (of course, in practice, the filters provided by WPILib are implementable in real-time on streaming data; accordingly, they can only depend on the *past* values of the input, and not on future values).  This is an important concept, because generally we use filters to remove/mitigate unwanted *dynamics* from a signal.  When we filter a signal, we're interested in modifying *how the signal changes over time*.

Effects of Using a Filter
-------------------------

Noise Reduction
^^^^^^^^^^^^^^^

One of the most typical uses of a filter is for noise reduction.  A filter that reduces noise is called a *low-pass* filter (because it allows low frequencies to "pass through," while blocking high-frequencies).  Most of the filters currently included in WPILib are effectively low-pass filters.

Rate Limiting
^^^^^^^^^^^^^

Filters are also commonly used to reduce the rate at which a signal can change.  This is closely related to noise reduction, and filters that reduce noise also tend to limit the rate of change of their output.

Edge Detection
^^^^^^^^^^^^^^

The counterpart to the low-pass filter is the high-pass filter, which only permits high frequencies to pass through to the output.  High-pass filters can be somewhat tricky to build intuition for, but a common usage for a high-pass filter is edge-detection - since high-pass filters will reflect sudden changes in the input while ignoring slower changes, they are useful for determining the location of sharp discontinuities in the signal.

Phase Lag
^^^^^^^^^

An unavoidable negative effect of a real-time low-pass filter is the introduction of "phase lag."  Since, as mentioned earlier, a real-time filter can only depend on past values of the signal (we cannot time-travel to obtain the future values), the filtered value takes some time to "catch up" when the input starts changing.  The greater the noise-reduction, the greater the introduced delay.  This is, in many ways, *the* fundamental trade-off of real-time filtering, and should be the primary driving factor of your filter design.

Interestingly, high-pass filters introduce a phase *lead*, as opposed to a phase lag, as they exacerbate local changes to the value of the input.
