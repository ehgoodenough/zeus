var Pixi = require("pixi.js")

Pixi.renderer = Pixi.autoDetectRenderer(320, 240)
Pixi.renderer.backgroundColor = 0x000000
Pixi.renderer.roundPixels = true
Pixi.render = function(scene) {
    this.renderer.render(scene)
}

document.body.appendChild(Pixi.renderer.view)
