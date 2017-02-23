var Statgrab = require("statgrab/do")
var Yaafloop = require("yaafloop")
var Pixi = require("pixi.js")

/////////////////
// Pixi Setup //
///////////////

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

//////////////////////
// The Experiments //
////////////////////

import BouncingBoxExperiment from "scripts/experiments/BouncingBoxExperiment.js"
import AnimatedSpriteExperiment from "scripts/experiments/AnimatedSpriteExperiment.js"

var experiments = [
    new AnimatedSpriteExperiment(),
    new BouncingBoxExperiment(),
]

experiments.forEach(function(experiment) {
    document.getElementById("experiments").appendChild(experiment.view)
    experiment.renderer.view.addEventListener("click", function(event) {
        activeExperiment = experiment
        event.stopPropagation()
    })
})

document.body.addEventListener("click", function(event) {
    activeExperiment = undefined
})

////////////////////
// The Main Loop //
//////////////////

var activeExperiment = undefined

var loop = new Yaafloop(function(delta) {

    experiments.forEach(function(experiment) {
        experiment.update(delta)
    })
})
