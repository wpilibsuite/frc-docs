document.addEventListener(
    "DOMContentLoaded",
    () => {
      $(".rst-other-versions dt:contains('Versions')")
        .parent()
        .append(
          `<dd><a href="https://wpilib.screenstepslive.com/s/3120">2014</a></dd>`
        );
    },
    false
  );