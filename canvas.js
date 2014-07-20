// canvas.js

"use strict";

var ctx = null; // The canvas rendering context
var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var MIN_SPEED = 0;
var MAX_SPEED = 100;
var MIN_DIRECTION = 0;
var MAX_DIRECTION = 180;
var FPS = 60;
var GRAVITY = 9.8;
var direction = 90;
var speed = 50;
var stepper = null;

var instances = [];

$(document).ready(function() {
  var canvas = document.getElementById("game");
  if (canvas.getContext) {
    ctx = canvas.getContext("2d");
    CANVAS_WIDTH = canvas.width;
    CANVAS_HEIGHT = canvas.height;
    setup();
  } else {
    // TODO: Add in non-compliance behavior here
  }

  $(document).keydown(function(evt) {
    switch(evt.which) {
      case 32:
        evt.preventDefault();
        spaceHandler();
        break;
      case 37:
        evt.preventDefault();
        leftArrowHandler();
        break;
      case 38:
        evt.preventDefault();
        upArrowHandler();
        break;
      case 39:
        evt.preventDefault();
        rightArrowHandler();
        break;
      case 40:
        evt.preventDefault();
        downArrowHandler();
        break;
    }
  });

  stepper = setInterval(step, 1000 / FPS);
});

function setup() {
  console.log("Setup");
  ctx.fillRect(CANVAS_WIDTH / 2 - 50, CANVAS_HEIGHT - 50, 100, 50);
}

function step() {
  // Store the current transformation matrix
  ctx.save();

  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Restore the transform
  ctx.restore();
  $.each(instances, function(index, instance) {
    instance.step();
    instance.draw(ctx);
  });
}

function spaceHandler() {
  console.log("fire() should be called");
  var ball = new Projectile({x: 50, y: 50}, 10, 90, 10);
  instances.push(ball);
}

function rightArrowHandler() {
  modifyDirection(1);
}

function leftArrowHandler() {
  modifyDirection(-1);
}

function modifyDirection(amount) {
  var direction = document.getElementById("direction");
  direction.value = Math.max(MIN_DIRECTION, Math.min(MAX_DIRECTION, (parseInt(direction.value) + amount)));
  console.log("adjustCannon() should be called");
}

function upArrowHandler() {
  modifySpeed(1);
}

function downArrowHandler() {
  modifySpeed(-1);
}

function modifySpeed(amount) {
  var speed = document.getElementById("speed");
  speed.value = Math.max(MIN_SPEED, Math.min(MAX_SPEED, (parseInt(speed.value) + amount)));
}

function Tank() {
  var cannon = new Cannon() 
}

function Cannon() {

}

function Projectile(location, speed, direction, size) {

  this.speed = speed;
  this.direction = direction;
  this.location = location;
  this.size = size;
  this.verticalSpeed = -Math.sin(Math.PI / 180 * direction) * speed;
  this.horizontalSpeed = -Math.cos(Math.PI / 180 * direction) * speed;

  this.step = function() {
    var dy = this.verticalSpeed / FPS;
    var dx = this.horizontalSpeed / FPS;
    this.location.x += dx;
    this.location.y += dy;
    this.verticalSpeed += GRAVITY;
  }

  this.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(location.x, location.y, size, 0, Math.PI * 2, true);
    ctx.fill();
  }

}