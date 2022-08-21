class Player {
  constructor(name, key) {
    this.name = name;
    this.key = key;
    this.inputs = {};
    this.countSubtotals = {};
    this.royalties = {};
  }

  /**
   * Called from crossCheck to read the entered good count, and also called from updateGoodTypeTotal
   * @param {string} goodName - The key for this player's input
   * @returns {number} Integer value of the input, if it was parsable as an integer, otherwise 0
   */
  getCount(goodName) {
    const input = this.inputs[goodName];
    if (input) {
      const intValue = parseInt(input.value, 10);
      return Number.isNaN(intValue) ? 0 : intValue;
    }
    // If we got here, this must be an ignored good in a three-player game
    return 0;
  }

  /**
   * Defined in loadPage for each type of Good
   * @param {string} goodName - The name of this particular Good
   * @param {object} input - The input object which the user may populate
   */
  setInput(goodName, input) {
    this.inputs[goodName] = input;
  }

  /**
   * Called from crossCheck to clear the input value after an erroneous entry
   * @param {string} goodName - The key for this player's input
   */
  clearInputValue(goodName) {
    this.inputs[goodName].value = '';
  }

  /**
   * @param {string} goodTypeName - The name of good related to this set of scores
   * @param {array} scores - List of top scores across all players for this goodType
   * @return true if the first score in the list matches this player's score
   */
  isKing(goodTypeName, scores) {
    return scores[0] && this.getGoodTypeCount(goodTypeName) === scores[0];
  }

  /**
   * @param {string} goodTypeName - The name of good related to this set of scores
   * @param {array} scores - List of top scores across all players for this goodType
   * @return true if the second score in the list matches this player's score
   */
   isQueen(goodTypeName, scores) {
     return scores[1] && this.getGoodTypeCount(goodTypeName) === scores[1];
  }

  /**
   * Called from setRoyalties after calculating King and Queen values
   * @param {object} goodTypeName - good type name used to calculate royalty
   * @param {number} value - Total value of all goods in this type
   */
  setRoyalty(goodTypeName, value) {
    this.royalties[goodTypeName] = value;
  }

  /**
   * Used by getTotal, and in setRoyalties to populate the bonus box in the GUI
   * @param {object} goodTypeName - good type name used to calculate royalty
   * @returns {number} Value of this royalty bonus
   */
  getRoyalty(goodTypeName) {
    return this.royalties[goodTypeName];
  }

  /**
   * Called from setRoyalties to update non-input totals for one goodType.
   * Need to do this in advance of calculating totals so that players' countSubtotals can be compared to decide on King and Queen.
   */
  updateGoodTypeCounts() {
    getValidGoodTypes().forEach((goodType) => {
      // Reset all calculated values from previous iteration
      this.setRoyalty(goodType.name, 0);
      this.countSubtotals[goodType.name] = 0;
      // Each player has inputs that come in a specific type. Some goods score extra when it comes to
      // determining bonuses for first and second (King and Queen). Recaclulate the total for each goodType.
      goodType.goods.forEach((targetGood) => {
        // Multiplier is relevant for royal goods.
        this.countSubtotals[goodType.name] += this.getCount(targetGood.name) * targetGood.multiplier;
      });
    });
  }

  /**
   * Used by setRoyalties to map countSubtotals across players
   * @param {string} goodTypeName - Name of the good type associated with this score
   * @returns {number} score value
   */
  getGoodTypeCount(goodTypeName) {
    return this.countSubtotals[goodTypeName];
  }

  getTotal() {
    // Calculate the value of what we have, plus royalties that should already have been set
    let total = 0;
    getValidGoods().forEach((good) => {
      const value = this.getCount(good.name) * good.value;
      if (value > 0) {
        // console.log(`${this.name} ${good.name} value=${value}`);
        total += value;
      }
    });
    Object.keys(this.royalties).forEach((royaltyName) => {
      const royalty = this.getRoyalty(royaltyName);
      if (royalty > 0) {
        // console.log(`${this.name} ${royaltyName} bonus=${royalty}`);
        total += this.royalties[royaltyName];
      }
    });
    return total;
  }

  /**
   * Used only to break a tie when totals are equal. Rules say "player with the most Legal Goods wins"
   * but that's ambiguous - "most" meaning simple count, or total value? Here I'm assuming value.
   * @returns total value of legal goods only
   */
  getLegalGoodsTotal() {
    let total = 0;
    legalGoods.forEach((good) => {
      total += this.getCount(good.name) * good.value;
    });
    return total;
  }

  /**
   * Used only to break a tie when totals and legal goods are equal. Rules say "player with the most Contraband Goods wins"
   * but that's ambiguous - "most" meaning simple count, or total value? Here I'm assuming value.
   * @returns total value of contraband goods only
   */
   getContrabandTotal() {
    let total = 0;
    contraband.forEach((good) => {
      total += this.getCount(good.name) * good.value;
    });
    return total;
  }
}