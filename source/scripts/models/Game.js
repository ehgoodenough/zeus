import * as Pixi from "pixi.js"
import Keyb from "keyb"

import Sprite from "scripts/models/Sprite.js"
import DevMode from "scripts/layers/DevMode.js"
import Stash from "scripts/layers/Stash.js"

import Hero from "scripts/models/Hero.js"
import Level from "scripts/models/world/Level.js"
import CollisionManager from "scripts/models/world/CollisionManager.js"
import Monster from "scripts/models/monsters/Monster.js"

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

export default class Game extends Pixi.Container {
    constructor() {
        super()

        // Instantiate the renderer.
        Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
        this.renderer = Pixi.autoDetectRenderer(320, 180)
        this.renderer.backgroundColor = 0x444444

        // Instantiate the entities.
        this.level = this.addChild(new Level(protolevel))
        this.hero = this.addChild(new Hero())
        this.collisionManager = new CollisionManager(this.hero, this.level)

        // this.addChild(new Monster())

        if(DevMode.isActive) {
            // this.renderer.resize(this.renderer.width * 2, this.renderer.height * 2)
            // this.width /= 2
            // this.height /= 2
        }
    }
    update(delta) {
        this.children.forEach(function(child) {
            if(child.update instanceof Function) {
                child.update(delta)
            }
        })

        if(this.collisionManager.update instanceof Function) {
            this.collisionManager.update()
        }

        // Move the camera to follow the player.
        // this.position.x = -1 * (this.hero.position.x - (this.width / 2))
        // this.position.y = -1 * (this.hero.position.y - (this.height / 2))
        // TODO: Tween this.
    }
    render() {
        this.renderer.render(this)
    }
}
