// controller.js

"use strict"

var FPS = 60;
var GRAVITY = 9.8;

var stepper = null;
var projectileVelocity = null;

var cannon = null;

window.onload = function() {

  cannon = document.getElementById("cannon");

  alignTankParts();

  placeTarget();

  window.onkeydown = function(evt) {
    //evt.preventDefault();
  	switch(evt.keyCode) {
  	  case 32:
  	  	keyboardHandler();
  	  	break;
      case 37:
        leftArrowHandler();
        break;
      case 38:
        upArrowHandler();
        break;
  	  case 39:
  	  	rightArrowHandler();
  	  	break;
  	  case 40:
        downArrowHandler();
        break;
  	}
  }
}

function placeTarget() {

  // 75% of the time, we want a number between 50 - 100
  // Otherwise, anything 10 - 100 is fine
  var speed;
  if (Math.random() > .25)
    speed = Math.ceil(Math.random() * 50 + 50);
  else 
    speed = Math.ceil(Math.random() * 90 + 10);
  speed *= 10;

  var direction = Math.round(Math.random() * 180);
  projectileVelocity = {
    speed: speed,
    verticalSpeed: -Math.sin(Math.PI / 180 * direction) * speed,
    horizontalSpeed: -Math.cos(Math.PI / 180 * direction) * speed,
    direction: direction
  }

  var positions = [];

  // createProjectile();

  var projectile = document.createElement("div");
  projectile.classList.add("projectile");

  var viewportOffset = cannon.getBoundingClientRect();
  projectile.style.top = viewportOffset.top + "px";
  projectile.style.left = viewportOffset.left + "px";
  document.body.appendChild(projectile);

  var colliding = false;

  while (!colliding) {
    var dy = projectileVelocity.verticalSpeed / FPS;
    var dx = projectileVelocity.horizontalSpeed / FPS;
    projectile.style.top = parseFloat(projectile.style.top) + dy + "px";
    projectile.style.left = parseFloat(projectile.style.left) + dx + "px";
    projectileVelocity.verticalSpeed += GRAVITY;

    // Is it hitting a wall?
    var boundaries = document.getElementsByClassName("boundary");
    for (var i = 0; i < boundaries.length; i++) {
      if (checkCollision(boundaries[i], projectile)) {
        colliding = true;
        projectile.parentElement.removeChild(projectile);
      }
    }
    positions.push([projectile.style.top, projectile.style.left]);
  }

  var coordsToUse = Math.round(positions.length / 2 + Math.random() * (positions.length / 2 - 5));

  var target = document.getElementById("target");
  var coords = positions[coordsToUse];
  target.style.top = coords[0];
  target.style.left = coords[1];
}

function keyboardHandler() {
  if (!document.getElementsByClassName("projectile").length) {
    var speed = document.getElementById("speed").value * 10;
    var direction = document.getElementById("direction").value;
    projectileVelocity = {
      speed: speed,
      verticalSpeed: -Math.sin(Math.PI / 180 * direction) * speed,
      horizontalSpeed: -Math.cos(Math.PI / 180 * direction) * speed,
      direction: direction
    }
    createProjectile();
  }
}

function rightArrowHandler() {
  modifyDirection(1);
}

function leftArrowHandler() {
  modifyDirection(-1);
}

function modifyDirection(amount) {
  var direction = document.getElementById("direction");
  direction.value = mod(181, (parseInt(direction.value) + amount));
  var setting = "rotate(" + (90 + parseInt(direction.value)) +"deg)";
  cannon.style.webkitTransform = setting;
  cannon.style.MozTransform = setting;
  cannon.style.msTransform = setting;
  cannon.style.OTransform = setting;
  cannon.style.transform = setting;
}

function upArrowHandler() {
  modifySpeed(1);
}

function downArrowHandler() {
  modifySpeed(-1);
}

function modifySpeed(amount) {
  var speed = document.getElementById("speed");
  speed.value = mod(101, (parseInt(speed.value) + amount))
}

function createProjectile() {
  var projectile = document.createElement("div");
  projectile.classList.add("projectile");

  var viewportOffset = cannon.getBoundingClientRect();
  projectile.style.top = viewportOffset.top + "px";
  projectile.style.left = viewportOffset.left + "px";
  document.body.appendChild(projectile);
  stepper = window.setInterval(step, 1000 / FPS);
}

function step() {
  var projectile = document.getElementsByClassName("projectile")[0];
  var dy = projectileVelocity.verticalSpeed / FPS;
  var dx = projectileVelocity.horizontalSpeed / FPS;
  projectile.style.top = parseFloat(projectile.style.top) + dy + "px";
  projectile.style.left = parseFloat(projectile.style.left) + dx + "px";
  projectileVelocity.verticalSpeed += GRAVITY;

  // Is it hitting a wall?
  var boundaries = document.getElementsByClassName("boundary");
  for (var i = 0; i < boundaries.length; i++) {
    if (checkCollision(boundaries[i], projectile)) {
      clearInterval(stepper);
      projectile.parentElement.removeChild(projectile);
    }
  }

  // Is it hitting the target?
  var target = document.getElementById("target");
  if (checkCollision(target, projectile)) {
    clearInterval(stepper);
    target.parentElement.removeChild(target);
    projectile.parentElement.removeChild(projectile);
  }
}

function checkCollision(target, projectile) {
  // Projectile Coords
  var projectileX = parseInt(projectile.style.left);
  var projectileY = parseInt(projectile.style.top);

  // Bounding box of the target
  var targetX = parseInt(window.getComputedStyle(target).getPropertyValue("left"));
  var targetY = parseInt(window.getComputedStyle(target).getPropertyValue("top"));
  var targetWidth = parseInt(window.getComputedStyle(target).getPropertyValue("width"));
  var targetHeight = parseInt(window.getComputedStyle(target).getPropertyValue("height"));

  // Is the projectile within the coords of the target?
  var inTargetY = projectileY > targetY && projectileY < (targetY + targetHeight);
  var inTargetX = projectileX > targetX && projectileX < (targetX + targetWidth);
  console.log(target);
  if (inTargetY && inTargetX) {
    console.log("true");
  }
  return inTargetY && inTargetX;
}

function alignTankParts() {
  var tank = document.getElementById("tank");

  var tankWidth = parseInt(window.getComputedStyle(tank).getPropertyValue("width")) / 2;
  cannon.style.left = tankWidth + "px";
  
  var setting = "rotate(" + (90 + parseInt(direction.value)) +"deg)";
  cannon.style.webkitTransform = setting;
  cannon.style.MozTransform = setting;
  cannon.style.msTransform = setting;
  cannon.style.OTransform = setting;
  cannon.style.transform = setting;
}

// Workaround for Javascript's negative mod behavior
function mod(n, m) {
  return ((m % n) + n) % n;
}