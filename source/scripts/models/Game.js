import * as Pixi from "pixi.js"
import Keyb from "keyb"

import Sprite from "scripts/models/Sprite.js"
import Container from "scripts/models/Container.js"

import DevMode from "scripts/layers/DevMode.js"
import Stash from "scripts/layers/Stash.js"

import HeroHealthBar from "scripts/models/hud/HeroHealthBar.js"
import Monster from "scripts/models/monsters/Monster.js"

import Scene from "scripts/models/Scene.js"

////////////////////
// The Game Data //
//////////////////

var protolevel = require("data/level.json")

if(DevMode.isActive) {
    window.Stash = Stash

    if(Stash.get("level") != undefined) {
        protolevel = Stash.get("level")

        window.setTimeout(function() {
            console.log("You are using STASHED LEVEL DATA! Only you can use this data "
                + "from your stash. To share your data, run Stash.download(\"level\"). "
                + "To delete the data, run Stash.drop(\"level\"). :D")
        }, 100)
    }
}

/////////////////////
// The Game Class //
///////////////////

export default class Game extends Container {
    constructor() {
        super()

        // Instantiate the renderer.
        Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
        this.renderer = Pixi.autoDetectRenderer(320, 180)
        this.renderer.backgroundColor = 0x444444

        this.addChild(new Scene(protolevel))
        this.addChild(new HeroHealthBar())
    }
    update(delta) {
        this.children.forEach((child) => {
            // TODO: Make this recursive.
            if(child.children != undefined) {
                child.children.forEach((child) => {
                    if(child.update instanceof Function) {
                        child.update(delta)
                    }
                })
            }
            if(child.update instanceof Function) {
                child.update(delta)
            }
        })
    }
    render() {
        this.renderer.render(this)
    }
}
