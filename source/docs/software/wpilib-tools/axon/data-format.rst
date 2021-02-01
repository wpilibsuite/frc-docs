:orphan:

Data Format
===========

Accepted formats:
- Supervisely
- TensorFlow Object Detection CSV

Supervisely
-----------

..

	Taken from https://raw.githubusercontent.com/wpilibsuite/frc-docs/master/source/docs/software/examples-tutorials/machine-learning/setting-up-the-data.rst for temperary use

1. `Supervisely <https://supervise.ly/>`__ is the web tool we use for labeling our data. Create a supervise.ly account to access our dataset. On the supervise.ly website, the Signup box is in the top right corner. Provide the necessary details, then click "CREATE AN ACCOUNT".
2. Create a Workspace for your team. In your workspace, by click 'Members' on the left and then 'INVITE' at the top. After typing in your teammates' details, they should be able to view the workspace.
3. To attain the WPILib dataset, `click this link <https://app.supervise.ly/share-links/zU1hctCmBs4rkglGXRzsmh5GbeAeqQ50ZUsGxtI9JNNR2SSbTnbMHvOiyeUgYw10>`__. After choosing which workspace you want to use, click clone.

TensorFlow Object Detection CSV
-------------------------------

Tensorflow object detection CSV

::
	
	test
	|	_annotations.csv
	|	image1.jpg
	|	image2.jpg
	|	image3.jpg
	train
	|	_annnotations.csv
	|	image1.jpg
	|	image2.jpg
	|	image3.jpg

