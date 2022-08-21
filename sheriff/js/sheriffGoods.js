class Good {
  constructor(name, value, threePlayerMax, max, multiplier) {
    this.name = name;
    this.value = value;
    this.threePlayerMax = threePlayerMax;
    this.max = max;
    this.multiplier = multiplier;
  }

  /**
   * In the three-player game, some goods have reduced numbers. These cards should be removed before playing.
   */
  setThreePlayerMax() {
    this.max = this.threePlayerMax;
  }

  /**
   * If setThreePlayerMax is called, some goods are no longer valid.
   * @returns {boolean} true if this good still has a maximum greater than 0, false otherwise
   */
  isValid() {
    return this.max > 0;
  }
}

// Goods names must match IDs in table
const apple = new Good('apple', 2, 48, 48, 1);
const cheese = new Good('cheese', 3, 36, 36, 1);
const bread = new Good('bread', 3, 0, 36, 1);
const chicken = new Good('chicken', 4, 24, 24, 1);
const pepper = new Good('pepper', 6, 18, 22, 1);
const mead = new Good('mead', 7, 16, 21, 1);
const silk = new Good('silk', 8, 9, 12, 1);
const crossbow = new Good('crossbow', 9, 5, 5, 1);
// Only Royal Goods have a multiplier of more than 1. This is multiplied by the count, not the value of the good
const greenApple = new Good('greenApple', 4, 2, 2, 2);
const goldenApple = new Good('goldenApple', 6, 1, 2, 3);
const goudaCheese = new Good('goudaCheese', 6, 2, 2, 2);
const bleuCheese = new Good('bleuCheese', 9, 0, 1, 3);
const ryeBread = new Good('ryeBread', 6, 0, 2, 2);
const pumpernickel = new Good('pumpernickel', 9, 0, 1, 3);
const royalRooster = new Good('royalRooster', 8, 1, 2, 2);
const coin = new Good('coin', 1, 250, 250, 1);

const goods = [apple, cheese, bread, chicken, pepper, mead, silk, crossbow, greenApple, goldenApple, goudaCheese, bleuCheese, ryeBread, pumpernickel, royalRooster, coin];

function setThreePlayerMaxima() {
  goods.forEach((good) => good.setThreePlayerMax());
}

/**
 * Goods are grouped by type, and bonus points are given for the top two players in each type.
 */
class GoodType {
  constructor(name, kingBonus, queenBonus, goods) {
    this.name = name;
    this.kingBonus = kingBonus;
    this.queenBonus = queenBonus;
    this.goods = goods;
  }

  /**
   * In the three-player game, some goods are removed. If all goods are removed from a type, the goodType itself is no longer valid.
   * @returns {boolean} true if this goodType has at least one valid good, false otherwise
   */
  isValid() {
    return this.goods.filter((good) => good.isValid()).length > 0;
  }
}

const goodTypes = [
  new GoodType('apples', 20, 10, [apple, greenApple, goldenApple]),
  new GoodType('cheeses', 15, 10, [cheese, goudaCheese, bleuCheese]),
  new GoodType('breads', 15, 10, [bread, ryeBread, pumpernickel]),
  new GoodType('chickens', 10, 5, [chicken, royalRooster])
];

// Groups used only to determine winner in case of a tie
const legalGoods = [apple, cheese, bread, chicken];
const contraband = [pepper, mead, silk, crossbow];

/**
 * In the three-player game, some goods are removed.
 * @returns {array} of only the goods that had a max greater than 0
 */
function getValidGoods() {
  return goods.filter((good) => good.isValid());
}

/**
 * In the three-player game, some goods are removed. If all goods are removed from a type, the goodType itself is no longer valid.
 * @returns {array} of only the goodTypes that had one or more valid goods
 */
function getValidGoodTypes() {
  return goodTypes.filter((goodType) => goodType.isValid());
}
