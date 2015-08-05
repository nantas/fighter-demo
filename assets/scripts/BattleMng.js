var BattleMng = Fire.Class({
    extends: Fire.Behavior,
    onLoad: function() {
        this.player1 = this.getChildByName('player1');
        this.enemy1 = this.getChildByName('enemy1');
        this.registerInput();
    },

    registerInput: function() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if (keyCode === cc.KEY.space) {
                    self.testAttack();
                }
            }
        }, self);
    },

    testAttack: function() {
        this.player1.moveToAttack(this.enemy1, -80);
    }
});
