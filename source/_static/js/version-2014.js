$lazy = async function (selector) {
    let $this = [];

    while (!$this.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        $this = $(selector);
    }

    return $this;
};

document.addEventListener(
    "DOMContentLoaded",
    async function () {
        (await $lazy(".rst-other-versions .injected dt:contains('Versions')"))
            .parent()
            .append(
                `<dd><a href="https://wpilib.screenstepslive.com/s/3120">2014</a></dd>`
            );
    },
    false
);
