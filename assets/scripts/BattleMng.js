function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var BattleMng = Fire.Class({
    extends: Fire.Behavior,
    onLoad: function() {
        this.fighters = this.getChildren();
        this.players = [];
        this.enemies = [];
        for (var i = 0; i < this.fighters.length; ++i) {
            var fighter = this.fighters[i];
            if (fighter.isEnemy) {
                this.enemies.push(fighter);
            } else {
                this.players.push(fighter);
            }
        }
        this.registerInput();
    },

    registerInput: function() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if (keyCode === cc.KEY.space) {
                    self.launchRandomAttack();
                }
            }
        }, self);
    },

    launchRandomAttack: function() {
        var availableFighters = this.fighters.filter(function(fighter) {
            return fighter.canMove;
        });
        var count = availableFighters.length;
        if (count > 1) {
            var randIdx = getRandomInt(0, count);
            var attacker = availableFighters[randIdx];
            attacker.canMove = false;
            var target = null;
            for (var i = 0; i < availableFighters.length; ++i) {
                if (attacker.isEnemy !== availableFighters[i].isEnemy) {
                    target = availableFighters[i];
                    break;
                }
            }
            if (target) {
                attacker.moveToAttack(target);
            } else {
                attacker.canMove = true;
            }
        }
    }
});
