var Pixi = require("pixi.js")

var DEFAULT_TEXTURE = Pixi.Texture.fromImage(require("images/pixel.png"))

class Sprite extends Pixi.Sprite {
    constructor(texture) {
        super(texture || DEFAULT_TEXTURE)

        if(texture == undefined) {
            this.scale.x = 16
            this.scale.y = 16
        }

        // By default, all sprites
        // should be anchored at
        // their centers.
        this.anchor.x = 0.5
        this.anchor.y = 0.5
    }
}

module.exports = Sprite
