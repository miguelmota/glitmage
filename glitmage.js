(function(root) {
  function Glitmage(el) {
    if (!(this instanceof Glitmage)) {
      return new Glitmage(el);
    }

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var image = new Image();
    var width;
    var height;
    var paused = false;
    var drawTimeout;
    var glitchTimeout;

    if (el.complete) {
      elLoaded();
    }

    el.onload = elLoaded;

    function elLoaded() {
      width = el.offsetWidth;
      height = el.offsetHeight;
      image.src = el.src;
      image.onload = imageLoaded;
    }

    function imageLoaded() {
      el.parentNode.replaceChild(canvas, el);
      canvas.width = width;
      canvas.height = height;
      draw();
    }

    function draw() {
      if (paused) return false;
      clear();
      glitchTimeout = setTimeout(glitchImage, random(500,800));
      drawTimeout = setTimeout(draw, random(100, 500));
    }

    function glitchImage() {
      for (var i = 0; i < random(1, 4); i++) {
        var x = Math.random() * width;
        var y = Math.random() * height;
        var spliceWidth = width - x;
        var spliceHeight = height / random(2,10);
        context.save();
        context.scale(-1, 1);
        context.drawImage(canvas, 0, y, width, spliceHeight, 0, y, width*-1, spliceHeight);
        context.restore();
        context.drawImage(canvas, 0, y, spliceWidth, spliceHeight, x, spliceHeight, spliceWidth, spliceHeight);
      }
    }

    function clear() {
      context.rect(0, 0, width, height);
      context.fill();
      context.drawImage(image, 0, 0, el.width, el.height, 0, 0, width, height);
    }

    function clearTimeouts() {
      clearTimeout(glitchTimeout);
      clearTimeout(drawTimeout);
    }

    function stop() {
      pause();
      setTimeout(clear, 800);
    }

    function pause() {
      paused = true;
      clearTimeouts();
    }

    function resume() {
      paused = false;
      draw();
    }

    return {
      pause: pause,
      resume: resume,
      stop: stop,
      start: resume,
      context: context,
      canvas: canvas
    };
  }

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Glitmage;
    }
    exports.pixelate = Glitmage;
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Glitmage;
    });
  } else {
    root.Glitmage = Glitmage;
  }

})(this);
