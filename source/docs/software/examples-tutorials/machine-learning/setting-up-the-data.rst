Setting Up the Data
====================

Machine learning works by "learning" the important features of objects by evaluating thousands of pictures. The pictures have boxes drawn around the important objects such as game pieces. Each kind of object to be detected is called a class. WPILib provides a pre-labeled dataset. You can also add additional images to the provided dataset, but you will need to label them.

Getting Data
------------

1. `Supervisely <https://supervise.ly/>`__ is the web tool we use for labeling our data. Create a supervise.ly account to access our dataset. On the supervise.ly website, the Signup box is in the top right corner. Provide the necessary details, then click "CREATE AN ACCOUNT".
2. Create a Workspace for your team. In your workspace, by click 'Members' on the left and then 'INVITE' at the top. After typing in your teammates' details, they should be able to view the workspace.
3. To attain the WPILib dataset, `click this link <https://app.supervise.ly/share-links/zU1hctCmBs4rkglGXRzsmh5GbeAeqQ50ZUsGxtI9JNNR2SSbTnbMHvOiyeUgYw10>`__. After choosing which workspace you want to use, click clone.

.. image:: images/supervisely-clone.png
   :alt: Dialog that clones a dataset on Supervisely
