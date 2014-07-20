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
var MULTIPLIER = 10;
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

  stepper = setInterval(step, 1000 / FPS);
});

function setup() {
  console.log("Setup");
  instances.push(new Tank(60, 30));
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

function Tank(width, height) {

  this.width = width;
  this.height = height;
  this.location = {x: CANVAS_WIDTH / 2,
				   y: CANVAS_HEIGHT - this.height};

  this.cannon = new Cannon(25, this);
  
  this.cannonTip = function() {
	return this.cannon.cannonTip();
  };
  
  this.step = function() {
	this.cannon.step();
  };
  
  this.draw = function(ctx) {
	this.cannon.draw(ctx);
	ctx.fillStyle = "black";
	ctx.fillRect(this.location.x  - this.width / 2, this.location.y, this.width, this.height);
  };
}

function Cannon(length, tank) {

	this.length = length;
	this.location = tank.location;
	this.direction = document.getElementById("direction").value;
	
	this.cannonTip = function() {
	  return {x: this.location.x - Math.cos(Math.PI / 180 * this.direction) * this.length,
			  y: this.location.y - Math.sin(Math.PI / 180 * this.direction) * this.length};
    };
	
	this.step = function() {
	  this.location = tank.location;
	  this.direction = document.getElementById("direction").value;
	};
	
	this.draw = function(ctx) {
	  var cannonTipCoords = this.cannonTip();
	  ctx.lineWidth = 5;
	  ctx.strokeStyle = "red";
	  ctx.beginPath();
	  ctx.moveTo(this.location.x, this.location.y + 5);
	  ctx.lineTo(cannonTipCoords.x, cannonTipCoords.y);
	  ctx.stroke();
	  console.log("Called");
	};
	
	$(document).keydown(function(evt) {
		switch(evt.which) {
		  case 32:
			evt.preventDefault();
			spaceHandler();
			break;
		  case 37:
			evt.preventDefault();
			this.leftArrowHandler();
			break;
		  case 38:
			evt.preventDefault();
			this.upArrowHandler();
			break;
		  case 39:
			evt.preventDefault();
			this.rightArrowHandler();
			break;
		  case 40:
			evt.preventDefault();
			this.downArrowHandler();
			break;
		}
	});
	
	function spaceHandler() {
	  console.log("fire() should be called");
	  var speed = document.getElementById("speed").value * MULTIPLIER;
	  var direction = document.getElementById("direction").value;
	  var ball = new Projectile(location, speed, direction, 5);
	  instances.push(ball);
	  console.log(ball);
	}

	this.rightArrowHandler = function() {
	  this.modifyDirection(1);
	}

	this.leftArrowHandler = function() {
	  this.modifyDirection(-1);
	}

	this.modifyDirection = function(amount) {
	  var direction = document.getElementById("direction");
	  direction.value = Math.max(MIN_DIRECTION, Math.min(MAX_DIRECTION, (parseInt(direction.value) + amount)));
	  console.log("adjustCannon() should be called");
	}

	this.upArrowHandler = function() {
	  this.modifySpeed(1);
	}

	this.downArrowHandler = function() {
	  this.modifySpeed(-1);
	}

	this.modifySpeed = function(amount) {
	  var speed = document.getElementById("speed");
	  speed.value = Math.max(MIN_SPEED, Math.min(MAX_SPEED, (parseInt(speed.value) + amount)));
	}
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
  };

  this.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(location.x, location.y, size, 0, Math.PI * 2, true);
    ctx.fill();
  };

}