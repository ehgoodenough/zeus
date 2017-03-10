import * as Pixi from "pixi.js"

import Hero from "scripts/models/Hero.js"
import Level from "scripts/models/world/Level.js"
import CollisionManager from "scripts/models/world/CollisionManager.js"

export default class Scene extends Pixi.Container {
    constructor(protolevel) {
        super()

        this.hero = new Hero()
        this.level = new Level(protolevel)
        this.collisionManager = new CollisionManager(this.hero, this.level)

        this.addChild(this.level)
        this.addChild(this.hero)
    }
    update(delta) {
        // Move the camera within the scene.
        this.position.x = -1 * (this.hero.position.x - (this.parent.renderer.width * 0.5))
        this.position.y = -1 * (this.hero.position.y - (this.parent.renderer.height * 0.6))
    }
    stashLevel() {
        Stash.set("level", this.level.toJSON())
    }
}
