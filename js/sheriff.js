const players = [];
const a = navigator.userAgent||navigator.vendor||window.opera;
const isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) ||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));

// Sanitize input. Make sure it's not over maximum, and that it's numeric
function sanitizeInput(key, maximum) {
  const input = document.getElementById(key);
  const intValue = parseInt(input.value, 10);
  if (Number.isNaN(intValue)) {
    // Ignore and reset. This also takes care of starting number with minus sign.
    input.value = '';
  } else if (maximum === 0) {
    alert(`This good is ignored in the three-person game`);
    input.value = '';
  } else if (intValue > maximum) {
    alert(`Value must be an integer between 0 and ${maximum}`);
    input.value = '';
  } else {
    input.value = intValue;
  }
}

// Create an input box for a particular good and player
function createInput(key, maximum) {
  let input;
  if (isMobile) {
    // Use select dropdowns
    input = document.createElement('select');
    input.id = key;
    for (let i = 0; i <= maximum; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.innerHTML = i;
      input.appendChild(option);
    }
    input.onchange = crossCheck;
  } else {
    // Use text boxes
    input = document.createElement('input');
    input.size = 3;
    input.id = key;
    input.style.textAlign = 'center';
    input.onkeyup = () => sanitizeInput(key, maximum);
    input.onchange = crossCheck;
  }
  return input;
}

/**
 * Check total of each good across players to ensure that it does not exceed maximum,
 * and display an alert and reset totals for the row if the maximum is exceeded.
 */
function crossCheck() {
  goods.forEach((good) => {
    let currentTotal = 0;
    players.forEach((player) => {
      currentTotal += player.getCount(good.name);
    });
    if (currentTotal > good.max) {
      alert(`There are only ${good.max} ${good.name}s. Please count again.`);
      players.forEach((player) => {
        player.clearInputValue(good.name);
      });
    }
  });
}

/**
 * Calculate and log subtotals, then populate fields with totals
 */
function calculateTotals() {
  players.forEach((player) => {
    // Calculate counts by good type
    player.updateGoodTypeCounts();
  });

  goodTypes.forEach((goodType) => {
    let scores = players.map((player) => player.getGoodTypeCount(goodType.name));
    // Sort numerically and in descending order
    scores = scores.sort((a, b) => b - a);
    // Accept only the first positive value - guarantees uniqueness
    scores = scores.filter((value, index, self) => value > 0 && self.indexOf(value) === index);

    // Extract the king(s) and queen(s)
    const kings = players.filter((player) => player.isKing(goodType.name, scores));
    const queens = players.filter((player) => player.isQueen(goodType.name, scores));

    if (kings.length === 1) {
      // Just one king - the usual
      kings[0].setRoyalty(goodType.name,  goodType.kingBonus);
      bonus = queens.length > 1 ? Math.floor(goodType.queenBonus / queens.length) : goodType.queenBonus;
      queens.forEach((queen) => queen.setRoyalty(goodType.name, bonus));
    } else if (kings.length > 1) {
      // Share the combined king/queen bonus and ignore queens
      const bonus = Math.floor((goodType.kingBonus + goodType.queenBonus) / kings.length);
      kings.forEach((king) => king.setRoyalty(goodType.name, bonus));
    }
    // Else all scores are 0, so no bonus
  });

  players.forEach((player) => {
    goodTypes.forEach((goodType) => {
      const royalty = player.getRoyalty(goodType.name);
      // Set or clear royalty cells for each player and goodType
      document.getElementById(`${goodType.name}Bonus${player.key}`).innerHTML = royalty || '';
    });
  });

  // Determine the winner
  const winners = players.sort((playerA, playerB) => {
    const playerATotal = playerA.getTotal();
    const playerBTotal = playerB.getTotal();
    if (playerATotal !== playerBTotal) {
      return playerBTotal - playerATotal;
    }
    // Totals are equal - what about legal goods only?
    const playerALegalTotal = playerA.getLegalGoodsTotal();
    const playerBLegalTotal = playerB.getLegalGoodsTotal();
    if (playerALegalTotal !== playerBLegalTotal) {
      return playerBLegalTotal - playerALegalTotal;
    }
    // Legal goods are equal - what about contraband goods only?
    const playerAContraTotal = playerA.getContrabandTotal();
    const playerBContraTotal = playerB.getContrabandTotal();
    return playerBContraTotal - playerAContraTotal;
  });
  // console.log(`${winners[0].name} wins!`);
  for (let i = 0; i < winners.length; i++) {
    const totalCell = document.getElementById(`total${winners[i].key}`);
    totalCell.innerHTML = winners[i].getTotal();
    totalCell.style.backgroundColor = (i === 0 ? "gold" : i === 1 ? "silver" : "black");
    totalCell.style.color = (i === 0 ? "black" : i === 1 ? "black" : "white");
  }
}

// Set up the page. Called from sheriffScore.html once structure has been defined
function loadPage() {

  if (confirm('"Sheriff of Nottingham" is a game published by Cool Mini or Not. It is fun to play, but a pain to score. This page helps players score the game.\n\nPress "OK" to start entering player names. Press "reload" in your browser to reset the page.')) {
    let playerName;

    do {
      const playerKey = players.length + 1;
      playerName = prompt('Press Cancel (or OK with empty player name) to stop entering player names.\n\nPlayer ' + playerKey + ':');
      if (playerName) {
        players.push(new Player(playerName, playerKey));
      }
    }
    while (!!playerName && players.length < 5);

    if (players.length < 3) {
      alert('You need at least three players to play Sheriff of Nottingham!');
      return;
    }
    
    // Adjust Good maximum for 3 players if necessary
    if (players.length === 3) {
      setThreePlayerMaxima();
    }

    // Populate the table with scoring sections for each player
    players.forEach((player) => {
      // Find each relevant row and add a cell for each player
      const headerCell = document.createElement('th');
      headerCell.innerHTML = player.name;
      document.getElementById('goods').appendChild(headerCell);

      goods.forEach((good) => {
        const goodCell = document.createElement('td');
        const input = createInput(`${good.name}${player.key}`, good.max);
        goodCell.appendChild(input);
        // Put the new input into the player
        player.setInput(good.name, input);
        document.getElementById(good.name).appendChild(goodCell);
      });

      goodTypes.forEach((goodType) => {
        const bonusId = `${goodType.name}Bonus`;
        const bonusCell = document.createElement('td');
        bonusCell.id = `${bonusId}${player.key}`;
        document.getElementById(bonusId).appendChild(bonusCell);
      });

      const totalCell = document.createElement('td');
      totalCell.id = `total${player.key}`;
      document.getElementById('total').appendChild(totalCell);
    });
  }
}