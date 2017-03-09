import * as Pixi from "pixi.js"
import Yaafloop from "yaafloop"
import FPSmeter from "fpsmeter"
import "statgrab/do"

///////////////
// The Game //
/////////////

import Game from "scripts/models/Game.js"

var game = new Game()

var frame = document.getElementById("frame")
frame.appendChild(game.renderer.view)

////////////////////
// The FPS Meter //
//////////////////

import DevMode from "scripts/layers/DevMode.js"

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
