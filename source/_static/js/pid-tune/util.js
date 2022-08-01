function gaussian(mean, stdev) {
  let y2;
  let use_last = false;
  return function() {
    let y1;
    if (use_last) {
      y1 = y2;
      use_last = false;
    } else {
      let x1, x2, w;
      do {
        x1 = 2.0 * Math.random() - 1.0;
        x2 = 2.0 * Math.random() - 1.0;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1.0);
      w = Math.sqrt((-2.0 * Math.log(w)) / w);
      y1 = x1 * w;
      y2 = x2 * w;
      use_last = true;
    }

    return mean + stdev * y1;
  }
}

function isNear([x1, y1], [x2, y2], tolerance) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy <= tolerance * tolerance;
}