//------Canvas------------//
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
const gravity = 0.8;
c.fillRect(0, 0, canvas.width, canvas.height);
//------Canvas------------//

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./assets/img/shop.png",
  scale: 2.75,
  framesMax: 6,
});
//Jugador
const player = new Fighter({
  position: {
    x: 50,
    y: 200,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2,
  offset: {
    x: 100,
    y: 92,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack2: {
      imageSrc: "./assets/img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/img/samuraiMack/Take Hit.png",
      framesMax: 4,
    },
     die: {
      imageSrc: "./assets/img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 57,
      y: 80,
    },
    width: 130,
    height: 50,
  },
});
//enemy
const enemy = new Fighter({
  position: {
    x: 700,
    y: 200,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "yellow",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./assets/img/kenji/Idle.png",
  framesMax: 4,
  scale: 2,
  offset: {
    x: 110,
    y: 105,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/img/kenji/Fall.png",
      framesMax: 2,
    },
    attack2: {
      imageSrc: "./assets/img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/img/kenji/Take hit.png",
      framesMax: 3,
    },
     die: {
      imageSrc: "./assets/img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -140,
      y: 80,
    },
    width: 130,
    height: 50,
  },
});

//------Botones personaje------------//

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};
//Dibujar jugadores
enemy.draw();
player.draw();
//------Botones personaje------------//

//------Funciones------------//

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //Player movement

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.swithSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.swithSprite("run");
  } else {
    player.swithSprite("idle");
  }
  if (player.velocity.y < 0) {
    player.swithSprite("jump");
  } else if (player.velocity.y > 0) {
    player.swithSprite("fall");
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.swithSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.swithSprite("run");
  } else {
    enemy.swithSprite("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.swithSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.swithSprite("fall");
  }

  //detect for collision for player && and hit enemy
  if (
    reactangularCollision({
      rec1: player,
      rec2: enemy,
    }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    player.isAttacking = false;
    enemy.takeHit()
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }
  //Collision for enemy && and hit player
  if (
    reactangularCollision({
      rec1: enemy,
      rec2: player,
    }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    enemy.isAttacking = false;
    player.takeHit()
    document.querySelector("#playerHealth").style.width = player.health + "%";
    enemy.isAttacking = false;
  }
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  //End the game is one wins
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();
//------Funciones------------//

//------Mover personajes------------//

//events
window.addEventListener("keydown", (event) => {
  if (!isWinner) {
    switch (event.key) {
      case "w":
        player.velocity.y = -15;

        break;
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;

      case "s":
        player.attack();
        break;
      case "ArrowUp":
        enemy.velocity.y = -15;
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});
//events
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    //Player

    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;

    //enemy
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
//------Mover personajes------------//
