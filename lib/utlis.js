
function reactangularCollision({ rec1, rec2 }) {
    return (
      rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x &&
      rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
      rec1.attackBox.position.y + rec1.attackBox.height >= rec2.position.y &&
      rec1.attackBox.position.y <= rec2.position.y + rec2.height
    );
  }
  
  function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    isWinner = true;
    document.querySelector("#winnerSessage").style.display = "flex";
  
    if (player.health == enemy.health) {
      document.querySelector("#winnerSessage").innerHTML = "Draw";
    } else if (player.health > enemy.health) {
      document.querySelector("#winnerSessage").innerHTML = "Player 1 Wins";
    } else if (player.health < enemy.health) {
      document.querySelector("#winnerSessage").innerHTML = "Player 2 Wins";
    }
  }
  let timer = 60;
  let timerId;
  let isWinner = false;
  function decreaseTimer() {
    if (timer > 0) {
      timerId = setTimeout(decreaseTimer, 1000);
      timer--;
      document.querySelector("#timer").innerHTML = timer;
    }
    if (timer === 0) {
      determineWinner({ player, enemy });
    }
  }