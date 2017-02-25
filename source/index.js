var Pixi = require("pixi.js")
var Afloop = require("afloop")
var Statgrab = require("statgrab/do")

Pixi.renderer = Pixi.autoDetectRenderer(320, 180)
Pixi.renderer.backgroundColor = 0x444444
Pixi.renderer.roundPixels = true
Pixi.render = function(scene) {
    this.renderer.render(scene)
}

document.body.appendChild(Pixi.renderer.view)

// Create a scene.
var scene = new Pixi.Container()

// Create a sprite and add it to the scene.
var sprite = new Pixi.Sprite.fromImage(require("images/monster.png"))
sprite.anchor.x = 0.5
sprite.anchor.y = 0.5
scene.addChild(sprite)

var loop = new Afloop(function(delta) {

    // Update the sprite.
    sprite.position.x += 1
    sprite.position.y += 1
    //sprite.rotation += 0.1

    // Render the scene.
    Pixi.render(scene)
})
