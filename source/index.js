import * as Pixi from "pixi.js"
import Yaafloop from "yaafloop"
import "statgrab/do"

///////////////
// The Game //
/////////////

import Game from "scripts/models/Game.js"

var game = new Game()

var frame = document.getElementById("frame")
frame.appendChild(game.renderer.view)

////////////////////
// The Main Loop //
//////////////////

var loop = new Yaafloop(function(delta) {
    game.update(delta)
    game.render()
})
