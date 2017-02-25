import "statgrab/do"
import Yaafloop from "yaafloop"
import * as Pixi from "pixi.js"

/////////////////
// Pixi Setup //
///////////////

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

//////////////////////
// The Experiments //
////////////////////

import BouncingBoxExperiment from "scripts/experiments/BouncingBoxExperiment.js"
import AnimatedSpriteExperiment from "scripts/experiments/AnimatedSpriteExperiment.js"
import TextExperiment from "scripts/experiments/TextExperiment.js"

var experiments = [
    new BouncingBoxExperiment(),
    new AnimatedSpriteExperiment(),
    new TextExperiment(),
]

experiments.reverse()

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
