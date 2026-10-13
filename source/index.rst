.. include:: <isonum.txt>

.. meta::
   :google-site-verification: POR_nG8b56eXGxmUIutST7jcA_Vl58ypSdJTzJ1g0zg

WPILib Documentation
====================

.. raw:: html

   <div class="wl-hero">
     <h1 class="wl-hero-title">
       Welcome!
     </h1>
     <p class="wl-hero-copy">
       WPILib is the standard programming library for <em>FIRST</em> Robotics,
       supporting teams competing in
       <strong class="wl-hero-frc"><em>FIRST</em> Robotics Competition (FRC)</strong>
       and
       <strong class="wl-hero-ftc"><em>FIRST</em> Tech Challenge (FTC)</strong>.
     </p>
   </div>

   <div id="landing-tab-root">

     <!-- ── TAB SELECTOR ──────────────────────────── -->
     <div class="wl-tab-selector">
       <p class="wl-tab-prompt" id="wl-tab-prompt">How can we help?</p>
       <div class="wl-tab-buttons" role="group" aria-labelledby="wl-tab-prompt">
         <button class="wl-tab-btn" id="btn-new" type="button" aria-controls="panel-new" aria-expanded="false" onclick="wlSelectTab('new')">New to FIRST Programming</button>
         <button class="wl-tab-btn" id="btn-returning" type="button" aria-controls="panel-returning" aria-expanded="false" onclick="wlSelectTab('returning')">Returning WPILib User</button>
         <a class="wl-tab-btn wl-tab-link" href="#core-documentation">Core Documentation</a>
       </div>
     </div>

     <!-- ── NEW USER PANEL ────────────────────────── -->
     <div class="wl-panel" id="panel-new" aria-labelledby="btn-new">

       <!-- Screen 1: Experience level -->
       <div id="new-s1">
         <div class="wl-welcome">
           <h2 class="wl-welcome-h">New to WPILib? You're in the right place.</h2>
           <p class="wl-welcome-p">Start with Zero to Robot to connect Systemcore, install WPILib, and write your first robot program. No programming experience is required.</p>
         </div>
         <h3 class="wl-sh">Set Up and Program Your Robot</h3>
         <a class="wl-card wl-card-shared wl-btn wl-feature-card" href="docs/zero-to-robot/introduction.html">
           <span class="wl-num wl-shared-text">→</span>
           <div>
             <div class="wl-card-title">Zero to Robot</div>
             <div class="wl-card-desc">Choose a programming language and editor, connect and configure Systemcore, then deploy code and drive. Assembly and wiring guides are linked in Step 1.</div>
           </div>
         </a>
         <div class="wl-tip wl-tip-shared">
           <strong>Already comfortable programming?</strong>
           Read <a href="docs/zero-to-robot/new-to-wpilib.html">New to WPILib</a> for an introduction to the robot program structure, hardware classes, and development tools. Then continue with the setup step you need.
         </div>
       </div>

     </div>

     <!-- ── RETURNING PANEL ────────────────────────── -->
     <div class="wl-panel" id="panel-returning" aria-labelledby="btn-returning">

       <div class="wl-welcome">
         <h2 class="wl-welcome-h">Welcome back! Get ready for 2027.</h2>
         <p class="wl-welcome-p">Use the checklist below to install WPILib, import your project, and update vendor libraries. Check the replacement tools before you deploy.</p>
       </div>

       <div class="wl-grid">
         <a class="wl-card wl-card-shared wl-btn" href="docs/zero-to-robot/returning.html">
           <span class="wl-num wl-shared-text">0</span>
           <div>
             <div class="wl-card-title">Review the 2027 checklist</div>
             <div class="wl-card-desc">Check the FRC update steps and what's available for FTC teams using Systemcore.</div>
           </div>
         </a>
         <a class="wl-card wl-card-shared wl-btn" href="docs/zero-to-robot/step-2/index.html">
           <span class="wl-num wl-shared-text">1</span>
           <div>
             <div class="wl-card-title">Install the 2027 tools</div>
             <div class="wl-card-desc">Install WPILib and the Driver Station, or set up your OnBot editor.</div>
           </div>
         </a>
       </div>

       <div class="wl-ret-grid">

         <!-- ── FRC column ── -->
         <div class="wl-ret-column">

           <div class="wl-ret-card wl-ret-frc">
             <div class="wl-ret-label wl-frc-label">FRC</div>
             <h3 class="wl-ret-h">Pre-Season Checklist</h3>
             <ul>
               <li>Download and run the <strong><a href="docs/zero-to-robot/step-2/wpilib-setup.html">2027 WPILib installer</a></strong></li>
               <li><strong><a href="docs/software/systemcore-info/index.html">Update your Systemcore</a></strong> if needed</li>
               <li>Use <strong><a href="docs/software/vscode-overview/importing-last-years-robot-code.html">Import Project</a></strong> in VS Code to migrate your 2026 code</li>
               <li><strong><a href="docs/software/vscode-overview/3rd-party-libraries.html">Re-add all vendor libraries</a></strong>: they do not carry over when you import your project</li>
               <li>Check for <strong><a href="docs/software/vscode-overview/3rd-party-libraries.html">vendor library updates</a></strong> in the Dependency Manager</li>
               <li>Test with the <strong><a href="docs/software/wpilib-tools/robot-simulation/simulation-gui.html">simulator</a></strong> before deploying to hardware</li>
             </ul>
           </div>

           <div class="wl-ret-card wl-ret-frc">
             <div class="wl-ret-label wl-frc-label">FRC</div>
             <h3 class="wl-ret-h">Tools to Replace for 2027</h3>
             <p class="wl-ret-copy">These tools are <strong>not available in the 2027 release</strong>. Choose a replacement before your first robot test.</p>
             <ul>
               <li><strong>Shuffleboard</strong>: update to <a href="https://github.com/Gold872/elastic-dashboard">Elastic</a> or AdvantageScope</li>
               <li><strong>SmartDashboard</strong>: update to Glass or Elastic </li>
               <li><strong>PathWeaver</strong>: update to <a href="https://github.com/mjansen4857/pathplanner">PathPlanner</a> or <a href="https://sleipnirgroup.github.io/Choreo/">Choreo</a></li>
               <li><strong>RobotBuilder</strong>: being removed with the control system change in 2027</li>
             </ul>
           </div>

           <div class="wl-ret-card wl-ret-frc">
             <div class="wl-ret-label wl-frc-label">FRC</div>
             <h3 class="wl-ret-h">What Is New for 2027</h3>
             <ul>
               <li>FRC now uses Systemcore: see the hardware migration guide</li>
               <li>2027 field images and AprilTag layout data (included in WPILib after kickoff)</li>
               <li>Windows 10 is no longer supported: Windows 11 is required</li>
               <li>Vendor library updates required: check the Dependency Manager</li>
             </ul>
             <a href="docs/yearly-overview/index.html" class="wl-frc-text wl-ret-link">Full 2027 changelog</a>
           </div>

         </div>

         <!-- ── FTC + shared column ── -->
         <div class="wl-ret-column">

           <div class="wl-ret-card wl-ret-ftc">
             <div class="wl-ret-label wl-ftc-label">FTC</div>
             <h3 class="wl-ret-h">FTC: Choose Your Control System</h3>
             <p class="wl-ret-copy wl-ret-copy-spacious">FTC teams use Systemcore with WPILib or REV Control Hub / Expansion Hub with the FTC SDK. Choose the documentation for your hardware.</p>
             <strong class="wl-ret-subhead">Using REV Control Hub / Expansion Hub?</strong>
             <p class="wl-ret-copy">Follow <a href="https://ftc-docs.firstinspires.org/en/latest/">FTC Docs</a> for setup, wiring, and programming.</p>
             <strong class="wl-ret-subhead wl-ret-subhead-spaced">Using Systemcore with WPILib?</strong>
             <ul class="wl-ret-compact-list">
               <li>Systemcore works with WPILib code; Motioncore connects motors</li>
               <li>See the FTC overview for release status and setup information</li>
               <li>Practice writing and running code on an <a href="docs/xrp-robot/index.html">XRP robot</a></li>
               <li><a href="docs/ftc/index.html">WPILib FTC overview</a></li>
             </ul>
           </div>

           <div class="wl-ret-card wl-ret-shared">
             <div class="wl-ret-label wl-shared-label">FRC + FTC</div>
             <h3 class="wl-ret-h">Practice with WPILib</h3>
             <ul>
               <li>Use WPILib to read sensors, control motors, and write autonomous routines</li>
               <li>Choose your language and editor in Zero to Robot</li>
               <li>Use the XRP to practice without waiting for a competition robot</li>
             </ul>
             <a href="https://wpilib.org/blog" class="wl-shared-text wl-ret-link">Follow the WPILib blog for release updates</a>
           </div>

         </div>

       </div>
     </div>

   </div>


   <script>
   function wlSelectTab(tab) {
     if (tab !== 'new' && tab !== 'returning') tab = 'new';
     document.querySelectorAll('.wl-panel').forEach(function(panel) {
       panel.classList.remove('active');
       panel.hidden = true;
     });
     document.querySelectorAll('.wl-tab-buttons button').forEach(function(button) {
       button.classList.remove('active');
       button.setAttribute('aria-expanded', 'false');
     });
     var panel = document.getElementById('panel-' + tab);
     var button = document.getElementById('btn-' + tab);
     panel.hidden = false;
     panel.classList.add('active');
     button.classList.add('active');
     button.setAttribute('aria-expanded', 'true');
     try { localStorage.setItem('wpilib-tab', tab); } catch(e) {}
   }
   (function() {
     var saved; try { saved = localStorage.getItem('wpilib-tab'); } catch(e) {}
     wlSelectTab(saved || 'new');
   })();
   </script>

.. rubric:: Find the Right Documentation

.. grid:: 1 1 3 3
   :gutter: 3

   .. grid-item-card:: WPILib: Systemcore and Robot Programming
      :link: /docs/zero-to-robot/introduction
      :link-type: doc
      :class-card: sw-card-shared

      Set up Systemcore, write robot code, and learn how to test and debug it.
      You'll also find links to hardware guides and vendor documentation.

   .. grid-item-card:: FRC Docs: Team, Hardware, and Vendor Resources
      :link: /docs/hardware/hardware-basics/hardware-overview
      :link-type: doc
      :class-card: sw-card-frc

      **Separate site coming soon**
      ^^^
      Find FRC hardware guides, vendor links, and team resources. These will
      move to a separate site; until then they are here in WPILib docs.

      +++
      Browse current FRC resources →

   .. grid-item-card:: FTC Docs: Hardware and Setup and more
      :link: https://ftc-docs.firstinspires.org/en/latest/
      :link-type: url
      :class-card: sw-card-ftc

      Find FTC assembly and wiring guides, plus setup and programming help
      for the REV control system. For Systemcore programming, use WPILib docs.

.. raw:: html

   <hr class="wl-core-intro"/>
   <h2 class="wl-sh wl-core-heading" id="core-documentation">Core Documentation</h2>
   <p class="wl-core-copy">Looking for a specific topic? Start with the links below.</p>

   <h3 class="wl-sh">Foundations</h3>
   <div class="wl-core-grid">
     <a class="wl-core-card" href="docs/hardware/hardware-basics/hardware-overview.html"><div class="wl-core-title">Hardware Overview</div><div class="wl-core-desc">Compare controllers, power distribution, radios, and sensors.</div></a>
     <a class="wl-core-card" href="docs/software/what-is-wpilib.html"><div class="wl-core-title">Software Overview</div><div class="wl-core-desc">Choose a programming language and development environment.</div></a>
     <a class="wl-core-card" href="docs/software/commandbased/index.html"><div class="wl-core-title">Robot Programming</div><div class="wl-core-desc">Write robot code with commands, subsystems, and triggers.</div></a>
   </div>

   <h3 class="wl-sh">Everyday Tools</h3>
   <div class="wl-core-grid">
     <a class="wl-core-card" href="docs/software/dashboards/index.html"><div class="wl-core-title">Dashboards</div><div class="wl-core-desc">Display sensor readings and robot status in Elastic, AdvantageScope, or Glass using NetworkTables.</div></a>
     <a class="wl-core-card" href="docs/software/wpilib-tools/robot-simulation/index.html"><div class="wl-core-title">Simulation</div><div class="wl-core-desc">Test your code on your computer without a robot.</div></a>
     <a class="wl-core-card" href="docs/api-reference.html"><div class="wl-core-title">API Reference</div><div class="wl-core-desc">Java, C++, and Python class and method documentation.</div></a>
   </div>

   <h3 class="wl-sh">Controls and Autonomous Programming</h3>
   <div class="wl-core-grid">
     <a class="wl-core-card" href="docs/software/pathplanning/index.html"><div class="wl-core-title">Path Planning</div><div class="wl-core-desc">Plan autonomous paths with PathPlanner, Choreo, and WPILib tools.</div></a>
     <a class="wl-core-card" href="docs/software/advanced-controls/index.html"><div class="wl-core-title">Advanced Controls</div><div class="wl-core-desc">PID, feedforward, state-space, kinematics, and system identification.</div></a>
   </div>

   <div class="wl-legacy-note">
     <strong>Still using a legacy control system?</strong>
     This site covers the 2027 Systemcore-based control system.
     FRC teams using a roboRIO should use the
     <a href="https://docs.wpilib.org/en/stable/index.html">2026 WPILib documentation</a>.
     FTC teams using a REV Control Hub or Expansion Hub should use the
     <a href="https://ftc-docs.firstinspires.org/en/latest/">FTC documentation</a>.
   </div>

----

.. toctree::
   :maxdepth: 1
   :caption: Start Here
   :hidden:

   New to WPILib <docs/zero-to-robot/new-to-wpilib>
   Returning Teams <docs/zero-to-robot/returning>
   Zero to Robot <docs/zero-to-robot/introduction>

.. toctree::
   :maxdepth: 1
   :caption: Reference
   :hidden:

   docs/yearly-overview/index
   docs/api-reference
   docs/software/support/support-resources
   docs/software/support/troubleshooting
   docs/software/frc-glossary

.. toctree::
   :maxdepth: 1
   :caption: Programming Fundamentals
   :hidden:

   docs/software/what-is-wpilib
   docs/controls-overviews/control-system-software
   docs/software/basic-programming/index
   docs/software/hardware-apis/index
   docs/software/commandbased/index
   docs/software/python/index
   docs/software/programming-snippets
   docs/software/examples-tutorials/wpilib-examples
   docs/software/examples-tutorials/third-party-examples

.. toctree::
   :maxdepth: 1
   :caption: Tools, Dashboards, and Networking
   :hidden:

   docs/software/vscode-overview/index
   docs/software/vscode-overview/3rd-party-libraries
   docs/software/firstdriverstation/index
   docs/software/dashboards/index
   docs/software/telemetry/index
   docs/software/wpilib-tools/outlineviewer/index
   docs/software/wpilib-tools/wpical/index
   docs/networking/networking-introduction/index
   docs/networking/networking-utilities/index

.. toctree::
   :maxdepth: 1
   :caption: Robot Behavior and Autonomy
   :hidden:

   docs/software/kinematics-and-odometry/index
   docs/software/pathplanning/index
   docs/software/advanced-controls/index
   docs/software/wpilib-tools/robot-simulation/index

.. toctree::
   :maxdepth: 1
   :caption: Control Systems
   :hidden:

   docs/ftc/index
   docs/xrp-robot/index
   docs/romi-robot/index

.. toctree::
   :maxdepth: 1
   :caption: Hardware and Wiring
   :hidden:

   docs/controls-overviews/control-system-hardware
   docs/hardware/hardware-basics/hardware-overview
   docs/hardware/hardware-basics/status-lights-ref
   docs/software/can-devices/index

.. toctree::
   :maxdepth: 1
   :caption: Contributing
   :hidden:

   docs/contributing/wpilib-docs/index
   docs/contributing/wpilib/index
   docs/legal/privacy-policy
   Report an Issue <https://github.com/wpilibsuite/frc-docs/issues>
