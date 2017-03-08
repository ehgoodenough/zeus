import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"

import OldPlatform from "scripts/models/world/OldPlatform.js"
import Platform from "scripts/models/world/Platform.js"
import ControlPoint from "scripts/models/world/ControlPoint.js"

export default class Level extends Sprite {
    constructor() {
        super(Pixi.Texture.EMPTY)

        this.position.x = 0
        this.position.y = 0
        this.anchor.x = 0
        this.anchor.y = 0

        this.controlPointSets = []

        //control points will be generated from platform pointPair data
        var controlPoints0 = [this.addChild(new ControlPoint(180, 120, null, 0, "top")),
            this.addChild(new ControlPoint(180, 160, null, 0, "bottom")),
            this.addChild(new ControlPoint(260, 140, null, 1, "top")),
            this.addChild(new ControlPoint(260, 160, null, 1, "bottom")),
            this.addChild(new ControlPoint(290, 120, null, 2, "top")),
            this.addChild(new ControlPoint(290, 170, null, 2, "bottom"))]

        var controlPoints1 = [this.addChild(new ControlPoint(40, 40, null, 0, "top")),
            this.addChild(new ControlPoint(40, 50, null, 0, "bottom")),
            this.addChild(new ControlPoint(60, 40, null, 1, "top")),
            this.addChild(new ControlPoint(60, 70, null, 1, "bottom")),
            this.addChild(new ControlPoint(100, 20, null, 2, "top")),
            this.addChild(new ControlPoint(100, 70, null, 2, "bottom")),
            this.addChild(new ControlPoint(120, 30, null, 3, "top")),
            this.addChild(new ControlPoint(120, 60, null, 3, "bottom")),
            this.addChild(new ControlPoint(150, 20, null, 4, "top")),
            this.addChild(new ControlPoint(150, 100, null, 4, "bottom"))]

        this.controlPointSets.push(controlPoints0, controlPoints1)
        this.introduceControlPoints()

        var pointPairs0 = []
        for(let i = 0; i < controlPoints0.length; i+=2) {
            pointPairs0.push({top: {x: controlPoints0[i].position.x,
                y: controlPoints0[i].position.y },
                bottom: {x: controlPoints0[i+1].position.x,
                    y: controlPoints0[i+1].position.y}})
        }
        var pointPairs1 = []
        for(let i = 0; i < controlPoints1.length; i+=2) {
            pointPairs1.push({top: {x: controlPoints1[i].position.x,
                y: controlPoints1[i].position.y },
                bottom: {x: controlPoints1[i+1].position.x,
                    y: controlPoints1[i+1].position.y}})
        }

        //new OldPlatform(160, 160, 320, 20, {})
        this.platforms = [new Platform(pointPairs0), new Platform(pointPairs1)]

        for(let i = 0; i < controlPoints0.length; i+=2) {
            controlPoints0[i].subject = this.platforms[0]
            controlPoints0[i+1].subject = this.platforms[0]
        }
        for(let i = 0; i < controlPoints1.length; i+=2) {
            controlPoints1[i].subject = this.platforms[1]
            controlPoints1[i+1].subject = this.platforms[1]
        }

        for(let i = 0; i < this.platforms.length; i++) {
            this.addChild(this.platforms[i])
            for(let j = 0; j <= this.platforms[i].numOfSegments; j++) {

            }
            //this.platforms[0].generateNewTexture()
        }

        this.children.reverse()
    }
    introduceControlPoints() {
        for(let i = 0; i < this.controlPointSets.length; i++) {
            for(let j = 0 ; j < this.controlPointSets[i].length; j++) {
                if(j%2 == 0) {
                    this.controlPointSets[i][j].partner
                    = this.controlPointSets[i][j+1]
                } else {
                    this.controlPointSets[i][j].partner
                    = this.controlPointSets[i][j-1]
                }
            }
        }
    }
}
