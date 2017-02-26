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
import VariableJumpExperiment from "scripts/experiments/VariableJumpExperiment"

var experiments = [
    new BouncingBoxExperiment(),
    new AnimatedSpriteExperiment(),
    new TextExperiment(),
    new InputPollingExperiment(),
    new VariableJumpExperiment()
]
experiments.reverse()

var focusedExperiment = undefined
focusedExperiment = experiments[0]

experiments.forEach(function(experiment) {
    document.getElementById("experiments").appendChild(experiment.view)
    experiment.renderer.view.addEventListener("click", function(event) {
        focusedExperiment = experiment
        event.stopPropagation()
    })
})

document.body.addEventListener("click", function(event) {
    focusedExperiment = undefined
})

////////////////////
// The Main Loop //
//////////////////

var loop = new Yaafloop(function(delta) {
    experiments.forEach(function(experiment) {
        experiment == focusedExperiment ? experiment.update(delta) : null
        experiment.alpha = experiment == focusedExperiment ? 1 : 0.1
        experiment.render()
    })
})

import vkey from "vkey"
document.body.addEventListener("keydown", function(event) {
    if(vkey[event.keyCode] == "<up>" || vkey[event.keyCode] == "<down>") {
        event.preventDefault()
    }
})
