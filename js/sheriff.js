var playerValues = {},
    a = navigator.userAgent||navigator.vendor||window.opera,
    isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) ||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));

function Good(name, value, max3, max, bonus) {
  this.name = name;
  this.value = value;
  this.max3 = max3;
  this.max = max;
  this.bonus = bonus;
}

// goods names must match IDs in table
var goods = [
  new Good('apples', 2, 48, 48, 1),
  new Good('cheese', 3, 36, 36, 1),
  new Good('bread', 3, 0, 36, 1),
  new Good('chicken', 4, 24, 24, 1),
  new Good('pepper', 6, 18, 22, 1),
  new Good('mead', 7, 16, 21, 1),
  new Good('silk', 8, 9, 12, 1),
  new Good('crossbow', 9, 5, 5, 1),
  new Good('green', 4, 2, 2, 2),
  new Good('golden', 6, 1, 2, 3),
  new Good('gouda', 6, 2, 2, 2),
  new Good('bleu', 9, 0, 1, 3),
  new Good('rye', 6, 0, 2, 2),
  new Good('pumpernickel', 9, 0, 1, 3),
  new Good('royal', 8, 1, 2, 2)
];

// sanitize input. Make sure it's not over maximum, and that it's numeric
function sanitizeInput(key, maximum) {
  var input = document.getElementById(key);
  var intValue = parseInt(input.value);
  if (Number.isNaN(intValue)) {
    // ignore and reset. This also takes care of starting number with minus sign.
    input.value = '';
  } else if (intValue > maximum) {
    alert('Value must be an integer between 0 and ' + maximum);
    input.value = '';
  } else {
    input.value = intValue;
  }
}

// create an input box for a particular good and player
function createInput(key, maximum) {
  var input;
  if (isMobile) {
    // use select dropdowns
    input = document.createElement("select");
    input.id = key;
    for (var i = 0; i <= maximum; i++) {
      var option = document.createElement("option");
      option.value = i;
      option.innerHTML = i;
      input.appendChild(option);
    }
    input.onchange = recalc;
  } else {
    // use text boxes
    input = document.createElement("input");
    input.size = 3;
    input.id = key;
    input.style.textAlign = "center";
    input.onkeyup = function() {
      sanitizeInput(input.id, maximum);
    };
    input.onchange = recalc;
  }
  return input;
}

function setRoyalty(goodName, kingBonus, queenBonus) {
  // Iterate through player values once to get firstPlace and secondPlace for good
  var royaltyKey = goodName + 'Royalty';
  // get an array of scores
  var scores = Object.keys(playerValues).map(function(key) {
    return playerValues[key][goodName];
  });
  // sort numerically and in descending order
  scores = scores.sort(function(a, b) {
    return b - a;
  });
  // accept only the first of each value - guarantees uniqueness
  scores = scores.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });

  // Iterate through a second time to extract the kings and queens
  var kings = [],
      queens = [];
  for (var key in playerValues) {
    var onePlayer = playerValues[key];
    // reset all values from previous iteration
    onePlayer[royaltyKey] = '';
    if (scores[0] && onePlayer[goodName] === scores[0]) {
      kings.push(onePlayer);
    } else if (scores[1] && onePlayer[goodName] === scores[1]) {
      queens.push(onePlayer);
    }
  }

  if (kings.length > 1) {
    // Share the combined king/queen bonus and remove queens
    var bonus = Math.floor((kingBonus + queenBonus) / kings.length);
    kings.forEach(function(king) {
      king[royaltyKey] = bonus;
    });
  } else if (kings.length === 1) {
    // just one king
    kings[0][royaltyKey] = kingBonus;
    bonus = queens.length > 1 ? Math.floor(queenBonus / queens.length) : queenBonus;
    queens.forEach(function(queen) {
      queen[royaltyKey] = bonus;
    });
  }
  // else all scores are 0 - no bonus
}

// Executed whenever any field changes
function recalc() {
  // For each Good and playerValue, get values and calculate bonuses and totals
  for (var key in playerValues) {
    var onePlayer = playerValues[key];
    onePlayer.apples = 0;
    onePlayer.cheese = 0;
    onePlayer.bread = 0;
    onePlayer.chicken = 0;
    onePlayer.total = 0;
    onePlayer.values.forEach(function(playerValue) {
      var good = playerValue.good;
      var input = playerValue.input;
      if (good.name === 'apples' || good.name === 'green' || good.name === 'golden') {
        onePlayer.apples += good.bonus * input.value;
      } else if (good.name === 'cheese' || good.name === 'gouda' || good.name === 'bleu') {
        onePlayer.cheese += good.bonus * input.value;
      } else if (good.name === 'bread' || good.name === 'rye' || good.name === 'pumpernickel') {
        onePlayer.bread += good.bonus * input.value;
      } else if (good.name === 'chicken' || good.name === 'royal') {
        onePlayer.chicken += good.bonus * input.value;
      }
      onePlayer.total += good.value * input.value;
    });
  }

  setRoyalty('apples', 20, 10);
  setRoyalty('cheese', 15, 10);
  setRoyalty('bread', 15, 10);
  setRoyalty('chicken', 10, 5);

  for (var key in playerValues) {
    var onePlayer = playerValues[key];

    document.getElementById('applesBonus' + key).innerHTML = onePlayer.applesRoyalty;
    if (onePlayer.applesRoyalty) {
      onePlayer.total += onePlayer.applesRoyalty;
    }

    document.getElementById('cheeseBonus' + key).innerHTML = onePlayer.cheeseRoyalty;
    if (onePlayer.cheeseRoyalty) {
      onePlayer.total += onePlayer.cheeseRoyalty;
    }

    document.getElementById('breadBonus' + key).innerHTML = onePlayer.breadRoyalty;
    if (onePlayer.breadRoyalty) {
      onePlayer.total += onePlayer.breadRoyalty;
    }

    document.getElementById('chickenBonus' + key).innerHTML = onePlayer.chickenRoyalty;
    if (onePlayer.chickenRoyalty) {
      onePlayer.total += onePlayer.chickenRoyalty;
    }

    var coins = parseInt(document.getElementById('coins' + key).value);
    if (!Number.isNaN(coins)) {
      onePlayer.total += coins;
    }

    document.getElementById('total' + key).innerHTML = onePlayer.total;
  }
}

// We've defined our functions. Set up the page.
function loadPage() {

  if (confirm('This page is to help "Sheriff of Nottingham" players score the game. Press "OK" to start entering player names. Press "reload" in your browser to reset the page.')) {
    var playerName,
        playerNumber;

    do {
      playerNumber = Object.keys(playerValues).length + 1;
      playerName = prompt('Name of Player ' + playerNumber + ':');
      if (playerName) {
        playerValues[playerNumber] = {
          "name" : playerName,
          "values" : []
        };
      }
    }
    while (!!playerName && playerNumber < 5);

    // Populate the table with scoring sections for each player
    if (playerNumber < 3) {
      alert("You need at least three players to play Sheriff of Nottingham!");
    } else {
      for (var key in playerValues) {
        var onePlayer = playerValues[key];
        // find each relevant row and add a cell for each player
        var cell = document.createElement("th");
        cell.innerHTML = onePlayer.name;
        document.getElementById('goods').appendChild(cell);

        goods.forEach(function(good) {
          cell = document.createElement("td");
          var input = createInput(good.name + key, playerNumber > 3 ? good.max : good.max3);
          cell.appendChild(input);
          // put the new input into the playerValues for use in recalc
          playerValues[key].values.push({
            "good" : good,
            "input" : input
          });
          document.getElementById(good.name).appendChild(cell);
        });

        cell = document.createElement("td");
        cell.id = "applesBonus" + key;
        document.getElementById('applesBonus').appendChild(cell);

        cell = document.createElement("td");
        cell.id = "cheeseBonus" + key;
        document.getElementById('cheeseBonus').appendChild(cell);

        cell = document.createElement("td");
        cell.id = "breadBonus" + key;
        document.getElementById('breadBonus').appendChild(cell);

        cell = document.createElement("td");
        cell.id = "chickenBonus" + key;
        document.getElementById('chickenBonus').appendChild(cell);

        cell = document.createElement("td");
        var input = createInput("coins" + key, 250);
        cell.appendChild(input);
        document.getElementById('coins').appendChild(cell);

        cell = document.createElement("td");
        cell.id = "total" + key;
        document.getElementById('total').appendChild(cell);
      }
    }
  }
}