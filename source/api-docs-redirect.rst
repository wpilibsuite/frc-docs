:orphan:

API Documentation
=================

.. API_DOCUMENTATION_REDIRECTER

.. raw:: html

    <script>
        match = window.location.href.match(/.*wpilib(?<sep>\/|\\)[0-9]{4}\k<sep>documentation/);
        path = window.location.search.match(/.*path=(.*?)(&|$)/) || "";
        if (path) path = path[1];
        hash = window.location.search.match(/.*hash=(.*?)(&|$)/) || "";
        if (hash) hash = hash[1];
        if (hash) hash = "#" + hash;

        if (!path) {
            // No path specified. Shouldn't happen
            document.write("<p>You should not have reached this page. Did you enter the correct url?</p>");
        } else if (match) {
            // Redirecting from local docs
            [documentation_url_base, sep] = match;
            window.location.replace(documentation_url_base + sep + path + hash);
        } else {
            // Redirecting from online docs
            window.location.replace("https://first.wpi.edu/FRC/roborio/release/docs/" + path + hash);
        }
    </script>

    <noscript>
        <p>
            Oops. Your browser doesn't support JavaScript.
        </p>
    </noscript>

The C++ API Documentation is available at `https://first.wpi.edu/FRC/roborio/release/docs/cpp/index.html <https://first.wpi.edu/FRC/roborio/release/docs/cpp/index.html>`_.

The Java API Documentation is available at `https://first.wpi.edu/FRC/roborio/release/docs/java/index.html <https://first.wpi.edu/FRC/roborio/release/docs/java/index.html>`_.
