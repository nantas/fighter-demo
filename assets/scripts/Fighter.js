var FXManager = require('FXManager');

var Fighter = Fire.Class({
    extends: Fire.Behavior,
    properties: {
        moveForwardDuration: 0,
        moveBackwardDuration: 0,
        attackFreezeDuration: 0,
        hurtFX: 0,
        idleTexture: {
            default: null,
            url: Fire.Texture
        },
        atkTexture: {
            default: null,
            url: Fire.Texture
        }
    },

    onLoad: function() {
        // target
        this.targetFighter = null;
        // z order
        this.origZ = this.getLocalZOrder();
        // move to target offset
        this.targetOffset = 0;
        // fxmanager
        this.fxManager = Fire.engine.getCurrentSceneN().getChildByName('fxLayer');
        // flash sprite
        this.flash = this.getChildByName('flash');
        this.flash.setOpacity(0);
        // actions
        this.actionMoveForward = null;
        this.actionMoveBackward = null;
        this.actionHurt = null;
        this.actionDie = null;
        // position
        this.targetPos = cc.p(0,0);
        this.selfPos = cc.p(this.x, this.y);
        this.actionMoveBackward = cc.moveTo(this.moveBackwardDuration, this.selfPos).easing(cc.easeCubicActionOut());
    },

    _assignTarget: function(target, offset) {
        this.targetFighter = target;
        this.targetPos = cc.p(target.x + offset, target.y);
        this.actionMoveForward = cc.moveTo(this.moveForwardDuration, this.targetPos).easing(cc.easeCubicActionOut());
    },

    _showAtkPose: function() {
        this.setTexture(this.atkTexture);
    },

    _showIdlePose: function() {
        this.setTexture(this.idleTexture);
    },

    _playHitFreeze: function() {
        var offset = this.targetOffset;
        setTimeout(function() {
            this._moveBack();
        }.bind(this), this.attackFreezeDuration * 1000);
    },

    _playAttack: function() {
        var offset = this.targetOffset;
        this._showAtkPose();
        var callback = cc.callFunc(this._playHitFreeze, this);
        var seq = cc.sequence(cc.moveBy(this.attackFreezeDuration/4, cc.p(-offset, 0)), callback);
        this.fxManager.playFX(cc.p(this.x - offset, 0), FXManager.FXType.Hit, this.targetFighter.getScaleX());
        this.runAction(seq);
        this.targetFighter.hurt(-offset);
    },

    moveToAttack: function(target, offset) {
        this.setLocalZOrder(100);
        this.targetOffset = offset;
        this._assignTarget(target, offset);
        var callback = cc.callFunc(this._playAttack, this);
        this.runAction(cc.sequence(this.actionMoveForward, callback));
    },

    _moveBack: function() {
        this._showIdlePose();
        var callback = cc.callFunc(this._onAtkEnd, this);
        this.runAction(cc.sequence(this.actionMoveBackward, callback));
    },

    _onAtkEnd: function() {
        Fire.log("Attack end!");
        this.setLocalZOrder(this.origZ);
    },

    hurt: function(offset) {
        var move1 = cc.moveBy(this.attackFreezeDuration, cc.p(offset,0)).easing(cc.easeElasticInOut(0.2));
        var move2 = cc.moveBy(this.attackFreezeDuration, cc.p(-offset,0)).easing(cc.easeElasticInOut(0.2));
        var seq1 = cc.sequence(move1, move2);
        var flash1 = cc.fadeIn(this.attackFreezeDuration/2);
        var flash2 = cc.fadeOut(this.attackFreezeDuration/2);
        var seq2 = cc.sequence(flash1, flash2);
        this.fxManager.playFX(cc.p(this.x+offset, this.y + 30), FXManager.FXType.Blood, this.getScaleX());
        this.runAction(seq1);
        this.flash.runAction(seq2);
    }
});
