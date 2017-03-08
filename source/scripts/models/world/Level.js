import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"

import Platform from "scripts/models/world/Platform.js"
import ControlPoint from "scripts/models/world/ControlPoint.js"

export default class Level extends Sprite {
    constructor() {
        super(Pixi.Texture.EMPTY)

        this.position.x = 0
        this.position.y = 0
        this.anchor.x = 0
        this.anchor.y = 0

        this.platforms = [
            new Platform(160, 160, 320, 20, {}),
            new Platform(60, 140, 60, 8, {isPermeable: true}),
            new Platform(220, 114, 100, 8, {isPermeable: true}),
            new Platform(245, 80, 50, 8, {isPermeable: true})
        ]
        this.platforms.push(new Platform(140, 94, 60, 8, {slope: 1/3, isPermeable: true}))
        this.platforms.push(new Platform(240, 94, 60, 8, {slope: -1/6, isPermeable: true}))

        for(let i = 0; i < this.platforms.length; i++) {
            this.addChild(this.platforms[i])
            this.platforms[i].generateNewTexture()
            this.addChild(new ControlPoint(this.platforms[i], "Left"))
            this.addChild(new ControlPoint(this.platforms[i], "Right"))
        }
    }
}
