var width,
  height,
  largeHeader,
  canvas,
  ctx,
  points,
  target,
  animateHeader = true;

initHeader();
initAnimation();
addListeners();

function initHeader() {
  width = window.innerWidth;
  height = window.innerHeight;
  target = {
    x: width / 2,
    y: height / 2
  };

  largeHeader = document.getElementById('particles');
  largeHeader.style.height = height + 120 + 40 + "px";

  canvas = document.getElementById("canvas");
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d");

  points = [];
  for (var x = 0; x < width; x = x + width / 20) {
    for (var y = 0; y < height; y = y + height / 20) {
      var px = x + Math.random() * width / 20;
      var py = y + Math.random() * height / 20;
      var p = {
        x: px,
        originX: px,
        y: py,
        originY: py
      };
      points.push(p);
    }
  }

  for (var i = 0; i < points.length; i++) {
    var closest = [];
    var p1 = points[i];
    for (var j = 0; j < points.length; j++) {
      var p2 = points[j];
      if (!(p1 == p2)) {
        var placed = false;
        for (var k = 0; k < 5; k++) {
          if (!placed) {
            if (closest[k] == undefined) {
              closest[k] = p2;
              placed = true;
            }
          }
        }

        for (var k = 0; k < 5; k++) {
          if (!placed) {
            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
              closest[k] = p2;
              placed = true;
            }
          }
        }
      }
    }
    p1.closest = closest;
  }

  for (var i in points) {
    var c = new Circle(
      points[i],
      2 + Math.random() * 2,
      "rgba(255,255,255,0.4)"
    );
    points[i].circle = c;
  }
}

function addListeners() {
  if (!("ontouchstart" in window)) {
    window.addEventListener("mousemove", mouseMove);
  }
  window.addEventListener("scroll", scrollCheck);
  window.addEventListener("resize", resize);
}

function mouseMove(e) {
  var posx = (posy = 0);
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx =
      e.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    posy =
      e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  target.x = posx;
  target.y = posy;
}

function scrollCheck() {
  if (document.body.scrollTop > height) animateHeader = false;
  else animateHeader = true;
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  largeHeader.style.height = height + 120 + 40 + "px";
  canvas.width = width;
  canvas.height = height;
}

function initAnimation() {
  animate();
  for (var i in points) {
    shiftPoint(points[i]);
  }
}

function animate() {
  if (animateHeader) {
    ctx.clearRect(0, 0, width, height);
    for (var i in points) {
      if (Math.abs(getDistance(target, points[i])) < 4000) {
        points[i].active = 0.3;
        points[i].circle.active = 0.6;
      } else if (Math.abs(getDistance(target, points[i])) < 20000) {
        points[i].active = 0.1;
        points[i].circle.active = 0.3;
      } else if (Math.abs(getDistance(target, points[i])) < 40000) {
        points[i].active = 0.02;
        points[i].circle.active = 0.1;
      } else {
        points[i].active = 0;
        points[i].circle.active = 0;
      }

      drawLines(points[i]);
      points[i].circle.draw();
    }
  }
  requestAnimationFrame(animate);
}

function shiftPoint(p) {
  TweenMax.to(p, 1 + 1 * Math.random(), {
    x: p.originX - 50 + Math.random() * 100,
    y: p.originY - 50 + Math.random() * 100,
    ease: Circ.easeInOut,
    onComplete: function() {
      shiftPoint(p);
    }
  });
}

function drawLines(p) {
  if (!p.active) return;
  for (var i in p.closest) {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineWidth = 3;
    ctx.lineTo(p.closest[i].x, p.closest[i].y);
    ctx.strokeStyle = "rgba(39,39,41," + p.active + ")";
    ctx.stroke();
  }
}

function Circle(pos, rad, color) {
  var _this = this;

  (function() {
    _this.pos = pos || null;
    _this.radius = rad || null;
    _this.color = color || null;
  })();

  this.draw = function() {
    if (!_this.active) return;
    ctx.beginPath();
    ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgba(161,161,161," + _this.active + ")";
    ctx.fill();
  };
}

function getDistance(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

(function() {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
})();


var links = document.querySelectorAll(".link__pop");

links.forEach(function(link) {
  return link.addEventListener("mouseenter", shootLines);
});

function shootLines(e) {
  var itemDim = this.getBoundingClientRect(),
    itemSize = {
      x: itemDim.right - itemDim.left,
      y: itemDim.bottom - itemDim.top
    },
    shapes = ["line", "zigzag"],
    colors = ["#2FB5F3", "#FF0A47", "#FF0AC2", "#47FF0A"];

  var chosenC = Math.floor(Math.random() * colors.length),
    chosenS = Math.floor(Math.random() * shapes.length);

  var burst = new mojs.Burst({
    left: itemDim.left + itemSize.x / 2,
    top: itemDim.top + itemSize.y / 2,
    radiusX: itemSize.x,
    radiusY: itemSize.y,
    count: 8,

    children: {
      shape: shapes[chosenS],
      radius: 10,
      scale: { 0.8: 1 },
      fill: "none",
      points: 7,
      stroke: colors[chosenC],
      strokeDasharray: "100%",
      strokeDashoffset: { "-100%": "100%" },
      duration: 350,
      delay: 100,
      easing: "quad.out",
      isShowEnd: false
    }
  });

  burst.play();
}


var imageWrap = document.getElementsByClassName('author__pic');
document.body.addEventListener('mousemove', cursorPositionHandler);

function cursorPositionHandler(e) {
  var decimalX = e.clientX / window.innerWidth - 0.5;
  var decimalY = e.clientY / window.innerHeight - 0.5;
  TweenMax.to(imageWrap, 0.5, {
    rotationY: 10 * decimalX,
    rotationX: 10 * decimalY,
    ease: Quad.easeOut,
    transformPerspective: 700,
    transformOrigin: 'center'
  });
}



$(function() {
  // This will select everything with the class smoothScroll
  // This should prevent problems with carousel, scrollspy, etc...
  $('.scroll').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000); // The number here represents the speed of the scroll in milliseconds
        return false;
      }
    }
  });
});

// Change the speed to whatever you want
// Personally i think 1000 is too much
// Try 800 or below, it seems not too much but it will make a difference