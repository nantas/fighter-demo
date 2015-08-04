var Animation = require('Animation');

var FXType = Fire.defineEnum({
    Blood  : -1,
    Boom   : -1,
    Dust   : -1,
    Hit    : -1,
    Flash  : -1
});

var animData = [
    {
        name: "blood_splash_",
        count: 3,
        startIdx: 1,
        delay: 0.1
    },
    {
        name: "boom_0",
        count: 6,
        startIdx: 1,
        delay: 0.1
    },
    {
        name: "fog_0",
        count: 7,
        startIdx: 1,
        delay: 0.1
    },
    {
        name: "hit_0",
        count: 4,
        startIdx: 1,
        delay: 0.1
    },
    {
        name: "coin_gather_",
        count: 3,
        startIdx: 1,
        delay: 0.1
    }
];

var getAnimInfo = function(fxType) {
    return animData[fxType];
};

var SimpleFX = cc.Sprite.extend({
    ctor: function(parent, type) {
        this._super();
        SimpleFX.fxID ++;
        this.fxID = SimpleFX.fxID;
        parent.addChild(this);
        var nameStr = 'fx_' + FXType[type] + this.fxID;
        Fire.log(nameStr);
        this.setName(nameStr);
        var animAction = Animation.createAnimAction(getAnimInfo(type));
        var callback = cc.callFunc(this.onPlayEnd, this);
        this.runAction( cc.sequence(animAction, callback) );
    },
    newAnim: function(type) {
        var animAction = Animation.createAnimAction(getAnimInfo(type));
        var callback = cc.callFunc(this.onPlayEnd, this);
        this.runAction( cc.sequence(animAction, callback) );
    },
    onPlayEnd: function() {
        this.removeFromParent();
        cc.pool.putInPool(this);
    }
});
SimpleFX.fxID = 0;

var FXManager = Fire.Class({
    extends: Fire.Behavior,
    properties: {
        fxAtlasAsset: {
            default: "",
            url: Runtime.SpriteAtlas
        }
    },
    onLoad: function() {
        if (this.fxAtlasAsset) {
            cc.spriteFrameCache.addSpriteFrames(this.fxAtlasAsset);
        }
        setInterval(function() {
            this.testFX();
        }.bind(this), 200);
    },
    _spawnFX: function(parent, type) {
        var fx;
        if (cc.pool.hasObject(SimpleFX)) {
            fx = cc.pool.getFromPool(SimpleFX);
            fx.newAnim(type);
            parent.addChild(fx);
            return fx;
        } else {
            fx = new SimpleFX(this, type);
            return fx;
        }
    },
    playFX: function(pos, type) {
        var fx = this._spawnFX(this, type);
        fx.setPosition(pos);
    }
});

module.exports = {
    FXType: FXType,
    getAnimInfo: getAnimInfo
};
