var tree = ["p", ["e"]]

addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("p", 13)) mult = mult.mul(upgradeEffect("p", 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
      11: {
        title: "It's just a start",
        description: "Double Point gain",
        cost: new OmegaNum(1),
      },
      12: {
        title: "PP effect",
        description: "Boosts Point gain by PP",
        cost: new OmegaNum(2),
        effect() {
          return player.p.points.add(1).pow(0.5)
        },
        effectDisplay() {
          return `${format(upgradeEffect("p", 12))}x`
        },
        unlocked() {
          return hasUpgrade("p", 11)
        }
      },
      13: {
        title: "Synergy",
        description: "Boosts Point Gain by Points",
        cost: new OmegaNum(4),
        effect() {
          eff = player.points.add(1).pow(0.25)
          if (hasUpgrade("p", 21)) eff = eff.pow(upgradeEffect("p", 21).add(10).log10().add(10).add(1).log10().div(player.p.points.div(1e3).add(1)).add(1))
          return eff
        },
        effectDisplay() {
          return `${format(upgradeEffect("p", 13))}x`
        },
        unlocked() {
          return hasUpgrade("p", 12)
        }
      },
      14: {
        title: "The Great Upgrade",
        description: "Boosts PP by points",
        cost: new OmegaNum(10),
        effect() {
          return player.points.add(1).pow(0.1)
        },
        effectDisplay() {
          return `${format(upgradeEffect("p", 14))}x`
        },
        unlocked() {
          return hasUpgrade("p", 13)
        }
      },
      21: {
        title: "OP upgrade",
        description: "Boosts Synergy by PP",
        cost: new OmegaNum(100),
        effect() {
          return player.points.add(1).pow(0.1)
        },
        effectDisplay() {
          return `idk lol`
        },
        unlocked() {
          return hasUpgrade("p", 13)
        }
      }
    },
    passiveGeneration() {
      return hasMilestone("v", 2)
    }
})

addLayer("e", {
    name: "electricity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {return {unlocked: false,
		points: new ExpantaNum(0),
		charge: new ExpantaNum(0)}},
    color: "#DCDC13",
    requires() { return new ExpantaNum(200).times((player.e.unlocked)?2:1).pow(player.e.points.add(1)).div(hasUpgrade("v", 11) ? 10 : 1)}, // Can be a function that takes requirement increases into account
    resource: "electricity", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for electricity", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() {return hasUpgrade("p", 14) || player.e.unlocked},
    upgrades: {
      11: {
        title: "A New Beginning",
        description: "Multiply Charge rate by 10",
        cost: new OmegaNum(2),
      },
      12: {
        title: "Charge Synergy",
        description: "Boost charge rate by Points",
        cost: new OmegaNum(2),
      },
      13: {
        title: "Free Upgrade",
        description: "Boost charge rate by PP",
        cost: new OmegaNum(0),
        unlocked() {
          return player.e.best.gte(4)
        }
      }
    },
    buyables: {
      11: {
        cost(x) { return new ExpantaNum(x).mul(2) },
        title: "The Best first Buyable",
        display() { return `Double Charge rate<br>Amount: ${getBuyableAmount("e", 11)}` },
        canAfford() { return player.e.points.gte(tmp[this.layer].buyables[this.id].cost) },
        buy() {
          
            player.e.points = player.e.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked() {
          return hasMilestone("v", 1)
        }
      }
    },
    milestones: {
      0: {
        requirementDescription: "Peform Electrify",
        effectDescription: "Start generating charge",
        done() {return player.e.best.gte(1)}
      },
      1: {
        requirementDescription: "4 electricity",
        effectDescription: "Unlock Volts",
        done() {return player.e.best.gte(4)}
      }
    },
    infobox: {
      charger: {
        title: "The Charger",
        body: "Welcome to the second row! This is an idle layer. First, we got charge. Charge boosts points and PP."
      }
    },
    tabFormat: [
      "main-display",
      ["prestige-button", function() { return "Electrify for " }],
      "blank",
      ["display-text",
          function() { return `You have ${format(player.points)} points<br>You have ${format(player.e.charge)} charge which multiplies PP and point gain by ${format(chargeEffect())}<br>You have ${format(getChargeGen())} charge rate` }],
      "blank",
      ["toggle", ["c", "beep"]],
      "milestones",
      "blank",
      "blank",
      "upgrades",
      "buyables",
      "infobox"
  ],
  branches: ["p"],
  uptdate(diff) {
    player.e.charge = player.e.charge.plus(getChargeGen().div(60));
  },
  effect() {
    let eff = player.e.charge.pow(0.5).add(1)
    return eff
  },
  onPrestige(gain) {
    player.e.unlocked = true
  },
  autoPrestige() {
    return hasMilestone("v", 0)
  },
  resetsNothing() {
    return hasMilestone("v", 0)
  },
  autoUpgrade() {
    return hasMilestone("v", 3)
  }
})

addLayer("v", {
    name: "volts", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "⚡", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {return {unlocked: false,
		points: new ExpantaNum(0),
		bestper: new ExpantaNum(0)
    }},
    color: "#DCDC13",
    requires() { return new ExpantaNum(20000).mul((player.e.unlocked)?20:1).mul(player.v.points.add(1)) }, // Can be a function that takes requirement increases into account
    resource: "voltage", // Name of prestige currency
    baseResource: "charge rate", // Name of resource prestige is based on
    baseAmount() {return getChargeGen()}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "V: Reset for Voltage", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() {return hasMilestone("e", 1) || player.v.unlocked},
    upgrades: {
      11: {
        title: "A New Beginning Again",
        description: "Multiply Electricity gain by 10",
        cost: new OmegaNum(2),
      },
      12: {
        title: "Again with charge rate",
        description: "Multiply Charge rate by 10",
        cost: new OmegaNum(6),
      },
      13: {
        title: "12 but stronger",
        description: "Multiply Charge rate by 100",
        cost: new OmegaNum(6),
      },
    },
    milestones: {
      0: {
        requirementDescription: "Peform Voltage",
        effectDescription: "Auto Eletricize and Eletricize doesn't reset anything",
        done() {return player.v.best.gte(1)}
      },
      1: {
        requirementDescription: "2 total voltage",
        effectDescription: "Unlock First buyable in Electricity",
        done() {return player.v.best.gte(2)}
      },
      2: {
        requirementDescription: "4 total voltage",
        effectDescription: "Passively gain PP",
        done() {return player.v.total.gte(4)}
      },
      3: {
        requirementDescription: "6 total voltage",
        effectDescription: "Autobuy Electricity upgrades",
        done() {return player.v.total.gte(6)}
      }
    },
  achievements: {
    rows: 5,
    cols: 5,
    11: {
      name: "Two volts",
      tooltip: "Gain 2 volts in a single voltage<br>Reward: Eletric Challanges",
      image: "https://static.wikia.nocookie.net/battlefordreamisland/images/9/9f/TWOTWOTWOTWOTWO.png/revision/latest?cb=20220601172526",
      done() {
        return player.v.bestper.gte(2)
      },
      onComplete() {
        player.ec.unlocked = true
      }
    }
  },
  branches: ["p"],
  onPrestige(gain) {
    player.v.unlocked = true
    player.e.points = new ExpantaNum(0)
    player.charge = new ExpantaNum(0)
    player.v.bestper = gain.gte(player.v.bestper) ? gain : player.v.bestper
  },
  total: new ExpantaNum(0)
})

function chargeEffect() {
  let eff = player.e.charge.pow(0.5).add(1)
  return eff
}

addLayer("ec", {
    name: "electric challanges", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EC", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
      unlocked: false,
		  points: new ExpantaNum(0),
		  pointprogress: new ExpantaNum(0)
    }},
    color: "#4BDCDC",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "challange points", // Name of prestige currency
    baseResource: "Charge rate", // Name of resource prestige is based on
    baseAmount() {return getChargeGen()}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("p", 13)) mult = mult.mul(upgradeEffect("p", 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    branches: ["e", "v"],
    layerShown(){return player.ec.unlocked},
    tabFormat: {
      Challanges: {
        content: ["challanges", "main-display",
          "blank",
          ["display-text",
          function() { return `You have ${format(getChargeGen())} charge rate` }],],
          challanges: {
            11: {
              name: "Basic",
              challangeDescription: "Now do it again!",
              goal: ExpantaNum(1e30),
              currencyDisplayName: "Charge Rate",
              currencyInternalName: "charge rate",
              currencyLocation() {
                return getChargeGen()
              },
              rewardDescription: "Autobuy Prestige Upgrades"
            }
          }
      },
      Sacrfice: {}
    }
})
