var Fighter = Fire.Class({
    extends: Fire.Behavior,
    properties: {
        idleTexture: {
            default: null,
            url: Fire.Texture
        },
        atkTexture: {
            default: null,
            url: Fire.Texture
        }
    }
});
