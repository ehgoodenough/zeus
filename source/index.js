import * as Pixi from "pixi.js"
import Yaafloop from "yaafloop"
import FPSmeter from "fpsmeter"
import "statgrab/do"

import DevMode from "scripts/layers/DevMode.js"

///////////////
// The Game //
/////////////

import Game from "scripts/models/Game.js"

var game = new Game()

var frame = document.getElementById("frame")
frame.appendChild(game.renderer.view)

if(STAGE == "DEVELOPMENT") {
    window.game = game
}

////////////////////
// The FPS Meter //
//////////////////

var meter = undefined
if(DevMode.isActive) {
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
    game.update(delta)
    game.render()

    if(!!meter) {
        meter.tick()
    }
})
