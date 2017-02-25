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
import InputPollingExperiment from "scripts/experiments/InputPollingExperiment.js"

var experiments = [
    new BouncingBoxExperiment(),
    new AnimatedSpriteExperiment(),
    new TextExperiment(),
    new InputPollingExperiment(),
]

experiments.reverse()

var activeExperiment = undefined

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

var loop = new Yaafloop(function(delta) {

    experiments.forEach(function(experiment) {
        experiment.update(delta)
    })
})

document.body.addEventListener("keydown", function(event) {
    event.preventDefault()
})
