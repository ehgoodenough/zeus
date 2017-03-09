import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"
import Container from "scripts/models/Container.js"

import HeroNumberBox from "scripts/models/hud/HeroNumberBox.js"
import HeroHealthBar from "scripts/models/hud/HeroHealthBar.js"
import HeroManaBar from "scripts/models/hud/HeroManaBar.js"

export default class HUD extends Container {
    constructor() {
        super()

        this.box = this.addChild(new HeroNumberBox())
        this.box.position.x = 10
        this.box.position.y = 10

        this.healthbar = this.addChild(new HeroHealthBar())
        this.healthbar.position.x = 36
        this.healthbar.position.y = 10

        this.manabar = this.addChild(new HeroManaBar())
        this.manabar.position.x = 36
        this.manabar.position.y = 23
    }
}
