var Pixi = require("pixi.js")
var Yaafloop = require("yaafloop")
var Statgrab = require("statgrab/do")
var FPSmeter = require("fpsmeter")

///////////////////////
// Configuring Pixi //
/////////////////////

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
Pixi.renderer = Pixi.autoDetectRenderer(320, 240)
Pixi.renderer.backgroundColor = 0x444444
Pixi.render = function(scene) {
    this.renderer.render(scene)
}

var frame = document.getElementById("frame")
frame.appendChild(Pixi.renderer.view)

/////////////////////
// The Game Scene //
///////////////////

var Sprite = require("scripts/Sprite.js")

// Create a scene.
var scene = new Pixi.Container()

// Create a sprite and add it to the scene.
var sprite = new Sprite()
scene.addChild(sprite)

////////////////////
// The FPS Meter //
//////////////////

var meter = undefined
if(STAGE == "DEVELOPMENT") {
    meter = new FPSMeter(frame, {
        theme: "colorful", graph: true, heat: true,
        left: "auto", top: "10px", right: "10px",
        decimals: 0,
    })
}

////////////////////
// The Main Loop //
//////////////////

var loop = new Yaafloop(function(delta) {

    // Update the sprite.
    sprite.position.x += 1.4
    sprite.position.y += 1
    sprite.rotation += 0.1

    // Render the scene.
    Pixi.render(scene)

    // Update the FPS meter.
    if(meter != undefined) {
        meter.tick()
    }
})
