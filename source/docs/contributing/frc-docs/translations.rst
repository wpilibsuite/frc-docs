Translations
============

frc-docs supports translations using the web-based `Transifex <https://www.transifex.com>`__ utility. frc-docs is currently testing Spanish Mexico (es_MX) and French Canada (fr_CA) translation support. We hope to support Chinese (zh_CN), Hebrew Israel (he_IL), and Turkish (tr_TR) in the future. Translators that are fluent in *both* English and one of the specified languages would be greatly appreciated to contribute to the translations.

Workflow
--------

Here are some steps to follow for translating frc-docs.

1. Sign up for `Transifex <https://www.transifex.com/>`__ and ask to join the `frc-docs project <https://www.transifex.com/wpilib/frc-docs>`__, and request access to the language you'd like to contribute to.
2. Join the wpilibsuite `gitter <https://gitter.im/wpilibsuite/wpilib>`__! This is a direct means of communication with the WPILib team. You can use this to ask us questions in a fast and streamlined fashion.
3. You may be contacted and asked questions involving contributing languages before being granted access to the frc-docs translation project.
4. Translate your language!

Links
-----

Links must be preserved in their original syntax. To translate a link, you can replace the TRANSLATE ME text (this will be replaced with the english title) with the appropriate translation.

An example of the original text may be

.. code-block:: text

   For complete wiring instructions/diagrams, please see the :doc:`Wiring the FRC Control System Document <Wiring the FRC Control System document>`.

where the ``Wiring the FRC Control System Document`` then gets translated.

.. code-block:: text

   For complete wiring instructions/diagrams, please see the :doc:`TRANSLATEED TEXT <Wiring the FRC Control System document>`.

Another example is below

.. code-block:: text

  For complete wiring instructions/diagrams, please see the :ref:`TRANSLATE TEXT <docs/getting-started/getting-started-frc-control-system/how-to-wire-a-robot:How to Wire an FRC Robot>`

Publishing Translations
-----------------------

Translations are pulled from Transifex and published automatically each day.

Accuracy
--------

Translations should be accurate to the original text. If improvements to the English text can be made, open a PR or issue on the `frc-docs <https://github.com/wpilibsuite/frc-docs>`__ repository. These can then get translated on merge.
