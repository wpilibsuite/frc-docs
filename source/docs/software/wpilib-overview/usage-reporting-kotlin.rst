Usage Reporting for Kotlin Teams
--------------------------------
.. warning:: Kotlin is an unsupported language and teams using Kotlin should not expect help from CSAs or FTAs at official FRC events.

Teams that are using Kotlin for their robot code can report their programming language using the HAL usage reporting API. By default, since Kotlin teams use the Java APIs, Java is errorenously reported as their language. These teams must explicitly report that they are using Kotlin so that all data collected can be as accurate as possible.

The following code should be added to teams' robot code to correctly report their language.

.. code-block:: kotlin

   override fun robotInit() {
     HAL.report(FRCNetComm.tResourceType.kResourceType_Language, FRCNetComm.tInstances.kLanguage_Kotlin)
   }
