function resolveApiDocsLink(url) {
    "use strict";

    if (!window.hasOwnProperty("docsAccessInfo")) { // Cache Docs Access Info
        const match = window.location.href.match(/.*wpilib(?<sep>\/|\\)[0-9]{4}\k<sep>documentation\k<sep>/);
        const onlineDocsUrl = "https://github.wpilib.org/allwpilib/docs/release/";

        window.docsAccessInfo = {};
        window.docsAccessInfo.isLocal = Boolean(match);
        [window.docsAccessInfo.urlBase, window.docsAccessInfo.urlSep] = match || [onlineDocsUrl, "/"];
        window.docsAccessInfo.pathOffset = onlineDocsUrl.length;
    }

    return window.docsAccessInfo.urlBase + url.substring(window.docsAccessInfo.pathOffset);
}

document.addEventListener('DOMContentLoaded', function() {
    "use strict";
    for (let link of document.links) {
        if (link.href.startsWith("https://github.wpilib.org/allwpilib/docs/release/")) {
            link.href = resolveApiDocsLink(link.href)
        }
    }
}, false);
