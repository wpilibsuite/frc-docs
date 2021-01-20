.. FIRST Robotics Competition documentation master file, created by
   sphinx-quickstart on Fri Apr  5 23:28:43 2019.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

.. include:: <isonum.txt>

FIRST Robotics Competition Control System
===========================================

Welcome to the *FIRST*\ |reg| Robotics Competition Control System Documentation! An overview of the changes from 2020 to 2021 is available on the :ref:`New for 2021 <docs/yearly-overview/yearly-changelog:New for 2021>` document.

.. raw:: html

   <img src="data:image/png;base64,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" width="452" height="379" alt="base64 test" usemap="#workmap">

   <map name="workmap">
      <area shape="rect" coords="21,54,428,118" alt="getting started" href="https://docs.wpilib.org/en/stable/docs/software/what-is-wpilib.html">
      <area shape="rect" coords="27,152,146,228" alt="dashboards" href="https://docs.wpilib.org/en/stable/docs/software/wpilib-tools/shuffleboard/index.html">
      <area shape="rect" coords="174,152,295,226" alt="basic tutorial" href="https://docs.wpilib.org/en/stable/docs/zero-to-robot/introduction.html">
      <area shape="rect" coords="328,152,443,227" alt="advprog" href="https://docs.wpilib.org/en/stable/docs/software/advanced-controls/index.html">
      <area shape="rect" coords="28,283,150,371" alt="vis" href="https://docs.wpilib.org/en/stable/docs/software/vision-processing/index.html">
      <area shape="rect" coords="174,278,309,366" alt="blah" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
      <area shape="rect" coords="348,290,448,367" alt="blah" href="http://oj.tv/">
   </map>

   <script>!function(){"use strict";function r(){function e(){var r={width:u.width/u.naturalWidth,height:u.height/u.naturalHeight},a={width:parseInt(window.getComputedStyle(u,null).getPropertyValue("padding-left"),10),height:parseInt(window.getComputedStyle(u,null).getPropertyValue("padding-top"),10)};i.forEach(function(e,t){var n=0;o[t].coords=e.split(",").map(function(e){var t=1==(n=1-n)?"width":"height";return a[t]+Math.floor(Number(e)*r[t])}).join(",")})}function t(e){return e.coords.replace(/ *, */g,",").replace(/ +/g,",")}function n(){clearTimeout(d),d=setTimeout(e,250)}function r(e){return document.querySelector('img[usemap="'+e+'"]')}var a=this,o=null,i=null,u=null,d=null;"function"!=typeof a._resize?(o=a.getElementsByTagName("area"),i=Array.prototype.map.call(o,t),u=r("#"+a.name)||r(a.name),a._resize=e,u.addEventListener("load",e,!1),window.addEventListener("focus",e,!1),window.addEventListener("resize",n,!1),window.addEventListener("readystatechange",e,!1),document.addEventListener("fullscreenchange",e,!1),u.width===u.naturalWidth&&u.height===u.naturalHeight||e()):a._resize()}function e(){function t(e){e&&(!function(e){if(!e.tagName)throw new TypeError("Object is not a valid DOM element");if("MAP"!==e.tagName.toUpperCase())throw new TypeError("Expected <MAP> tag, found <"+e.tagName+">.")}(e),r.call(e),n.push(e))}var n;return function(e){switch(n=[],typeof e){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(e||"map"),t);break;case"object":t(e);break;default:throw new TypeError("Unexpected data type ("+typeof e+").")}return n}}"function"==typeof define&&define.amd?define([],e):"object"==typeof module&&"object"==typeof module.exports?module.exports=e():window.imageMapResize=e(),"jQuery"in window&&(window.jQuery.fn.imageMapResize=function(){return this.filter("map").each(r).end()})}();
   //# sourceMappingURL=imageMapResizer.map</script>

   <script>imageMapResize();</script>

.. toctree::
   :maxdepth: 1
   :titlesonly:
   :caption: Zero to Robot

   docs/zero-to-robot/introduction
   docs/zero-to-robot/step-1/index
   docs/zero-to-robot/step-2/index
   docs/zero-to-robot/step-3/index
   docs/zero-to-robot/step-4/index

.. toctree::
   :maxdepth: 1
   :caption: Control System Overviews

   docs/controls-overviews/control-system-hardware
   docs/controls-overviews/control-system-software

.. toctree::
   :maxdepth: 1
   :caption: Programming Basics

   docs/software/what-is-wpilib
   docs/yearly-overview/index
   docs/software/vscode-overview/index
   docs/software/labview/index
   docs/software/actuators/index
   docs/software/sensors/index
   docs/software/can-devices/index
   docs/software/basic-programming/index
   docs/software/support/support-resources

.. toctree::
   :maxdepth: 1
   :caption: API Docs

   WPILib Java API Docs <https://first.wpi.edu/wpilib/allwpilib/docs/release/java/index.html>
   WPILib C++ API Docs <https://first.wpi.edu/wpilib/allwpilib/docs/release/cpp/index.html>

.. toctree::
   :maxdepth: 1
   :caption: Software Tools

   docs/software/driverstation/index
   docs/software/wpilib-tools/shuffleboard/index
   docs/software/wpilib-tools/smartdashboard/index
   docs/software/wpilib-tools/glass/index
   docs/software/labview-dashboard/index
   docs/software/wpilib-tools/pathweaver/index
   docs/software/wpilib-tools/robotbuilder/index
   docs/software/wpilib-tools/robot-simulation/index
   docs/software/wpilib-tools/robot-characterization/index
   docs/software/wpilib-tools/outlineviewer/index

.. toctree::
   :maxdepth: 1
   :caption: Advanced Programming

   docs/software/vision-processing/index
   docs/software/commandbased/index
   docs/software/old-commandbased/index
   docs/software/kinematics-and-odometry/index
   docs/software/networktables/index
   docs/software/roborio-info/index
   docs/software/advanced-controls/index
   docs/software/convenience-features/index

.. toctree::
   :maxdepth: 1
   :caption: Examples and Tutorials

   docs/software/examples-tutorials/wpilib-examples
   docs/software/examples-tutorials/trajectory-tutorial/index
   docs/software/examples-tutorials/drivesim-tutorial/index

.. toctree::
   :maxdepth: 1
   :caption: Hardware

   docs/hardware/hardware-basics/index
   docs/hardware/hardware-tutorials/index
   docs/hardware/sensors/index

.. toctree::
   :maxdepth: 1
   :caption: Romi Robot

   docs/romi-robot/index

.. toctree::
   :maxdepth: 1
   :caption: Robot Networking

   docs/networking/networking-introduction/index
   docs/networking/networking-utilities/index

.. toctree::
   :maxdepth: 1
   :caption: Contributing

   docs/contributing/frc-docs/index
   docs/contributing/wpilib/index

.. toctree::
   :maxdepth: 1
   :caption: Issues

   Report an Issue <https://github.com/wpilibsuite/frc-docs/issues>

.. todolist::
