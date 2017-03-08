import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"

import Hero from "scripts/models/Hero.js"
import Level from "scripts/models/world/Level.js"
import CollisionManager from "scripts/models/world/CollisionManager.js"
import Monster from "scripts/models/monsters/Monster.js"

import pixelSrc from "images/pixel.png"

export default class Game extends Pixi.Container {
    constructor() {
        super()

        // Instantiate the renderer.
        Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
        this.renderer = Pixi.autoDetectRenderer(320, 180)
        this.renderer.backgroundColor = 0x444444

        // Instantiate the entities.
        this.level = this.addChild(new Level())
        this.hero = this.addChild(new Hero())
        this.collisionManager = new CollisionManager(this.hero, this.level)

        // this.addChild(new Monster())
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
    }
    render() {
        this.renderer.render(this)
    }
}
