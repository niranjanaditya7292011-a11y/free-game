const player = document.getElementById("player");
const enemy = document.querySelector(".enemy");
const game = document.getElementById("game");

let px = 50;
let ex = 400;

let health = 100;
let score = 0;
let gameOver = false;
document.getElementById("sprint").ontouchstart = () => sprinting = true;
document.getElementById("sprint").ontouchend = () => sprinting = false;

// Player movement
document.getElementById("left").onclick = () => px -= 15;
document.getElementById("right").onclick = () => px += 15;

// Fire bullet
document.getElementById("fire").onclick = shoot;
const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let moveX = 0;
let sprinting = false;

// Touch start
joystick.addEventListener("touchstart", e => {
  e.preventDefault();
});

// Touch move
joystick.addEventListener("touchmove", e => {
  const rect = joystick.getBoundingClientRect();
  const touch = e.touches[0];

  let x = touch.clientX - rect.left - 60;
  let y = touch.clientY - rect.top - 60;

  const distance = Math.min(40, Math.sqrt(x*x + y*y));
  const angle = Math.atan2(y, x);

  moveX = Math.cos(angle) * distance;

  stick.style.left = 35 + Math.cos(angle) * distance + "px";
  stick.style.top  = 35 + Math.sin(angle) * distance + "px";
});

// Touch end
joystick.addEventListener("touchend", () => {
  moveX = 0;
  stick.style.left = "35px";
  stick.style.top = "35px";
});

// Move player using joystick
setInterval(() => {
  px += sprinting ? moveX / 4 : moveX / 6;
}, 20);

function shoot() {
  if (gameOver) return;

  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = px + 40 + "px";
  bullet.style.bottom = "30px";
  game.appendChild(bullet);

  const move = setInterval(() => {
    bullet.style.left = bullet.offsetLeft + 10 + "px";

    if (bullet.offsetLeft > ex) {
      score += 10;
      document.getElementById("score").innerText = score;
      bullet.remove();
      clearInterval(move);
    }
  }, 30);
}

// Enemy AI movement (CHASE PLAYER)
setInterval(() => {
  if (gameOver) return;

  if (ex > px) ex -= 2;
  else ex += 2;

  enemy.style.left = ex + "px";
}, 60);
let isJumping = false;
let ground = 20;

document.getElementById("jump").addEventListener("click", jump);
document.getElementById("jump").addEventListener("touchstart", jump);

function jump() {
  if (isJumping) return;
  isJumping = true;

  let height = 0;

  const up = setInterval(() => {
    height += 5;
    player.style.bottom = ground + height + "px";

    if (height >= 80) {
      clearInterval(up);
      down();
    }
  }, 20);
}

function down() {
  const fall = setInterval(() => {
    let current = parseInt(player.style.bottom);
    current -= 5;
    player.style.bottom = current + "px";

    if (current <= ground) {
      player.style.bottom = ground + "px";
      clearInterval(fall);
      isJumping = false;
    }
  }, 20);
}

// Enemy attack
setInterval(() => {
  if (gameOver) return;

  if (Math.abs(ex - px) < 60) {
    health -= 5;
    document.getElementById("health").innerText = health;

    if (health <= 0) {
      endGame();
    }
  }
}, 1000);

// Update player position
setInterval(() => {
  px = Math.max(0, Math.min(px, window.innerWidth - 40));
  player.style.left = px + "px";
}, 20);

// GAME OVER
function endGame() {
  gameOver = true;
  document.getElementById("restart").style.display = "block";
}

// Restart
document.getElementById("restart").onclick = () => {
  location.reload();
};
let jumping = false;

document.getElementById("jump").onclick = () => {
  if (jumping) return;
  jumping = true;

  let up = 0;
  const jump = setInterval(() => {
    up += 5;
    player.style.bottom = 20 + up + "px";

    if (up >= 60) {
      clearInterval(jump);
      fall();
    }
  }, 20);
};

function fall() {
  const fallDown = setInterval(() => {
    let bottom = parseInt(player.style.bottom);
    bottom -= 5;
    player.style.bottom = bottom + "px";

    if (bottom <= 20) {
      player.style.bottom = "20px";
      clearInterval(fallDown);
      jumping = false;
    }
  }, 20);
}
