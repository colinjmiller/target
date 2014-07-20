// controller.js

"use strict"

var FPS = 60;
var GRAVITY = 9.8;

var MULTIPLER = (window.innerWidth + window.innerHeight) / 200;
var MIN_SPEED = 0;
var MAX_SPEED = 100;
var MIN_DIRECTION = 0;
var MAX_DIRECTION = 180;
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

    document.getElementById("direction").addEventListener("change", adjustCannon);
    document.getElementById("fire").addEventListener("click", fire);
  }
  
  window.onresize = resizingModal;
  
  var closers = document.getElementsByClassName("close");
  for (var i = 0; i < closers.length; i++) {
	closers[i].onclick = closeModal;
  }
}

function resizingModal() {
  document.getElementById("message").innerHTML = 
	"Resizing the browser window forces the game to recalculate values. " +
	"Please finish adjusting the window, then click the button below " +
	"to continue.";
  var modalPieces = document.getElementsByClassName("modal");
  for (var i = 0; i < modalPieces.length; i++) {
	modalPieces[i].style.visibility = "visible";
  }
}

function closeModal() {
  var modalPieces = document.getElementsByClassName("modal");
  for (var i = 0; i < modalPieces.length; i++) {
	modalPieces[i].style.visibility = "hidden";
  }
  MULTIPLER = (window.innerWidth + window.innerHeight) / 200;
  placeTarget();
}

function placeTarget() {

  // 75% of the time, we want a number between 50 - 100
  // Otherwise, anything 10 - 100 is fine
  var speed;
  if (Math.random() > .25)
    speed = Math.ceil(Math.random() * 50 + 50);
  else 
    speed = Math.ceil(Math.random() * 90 + 10);
  speed *= MULTIPLER;

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

function fire() {
  if (!document.getElementsByClassName("projectile").length) {
    var speed = document.getElementById("speed").value * MULTIPLER;
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

function spaceHandler() {
  fire()
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
  adjustCannon();
}

function adjustCannon() {
  var direction = document.getElementById("direction");
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
  speed.value = Math.max(MIN_SPEED, Math.min(MAX_SPEED, (parseInt(speed.value) + amount)));
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