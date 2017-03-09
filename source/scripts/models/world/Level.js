import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"
import Container from "scripts/models/Container.js"

import Platform from "scripts/models/world/Platform.js"
import ControlPoint from "scripts/models/world/ControlPoint.js"
import DeleteButton from "scripts/models/world/Deletebutton.js"

export default class Level extends Container {
    constructor(protoLevel) {
        super()

        this.controlPointSets = []
        this.platforms = []

        this.trash = []

        //iterate through platforms
        for(let i = 0; i < protoLevel.length; i++) {
            this.platforms.push(this.addChild(new Platform(protoLevel[i])))
            var controlPoints = []
            //iterate through pointPairs
            for(let j = 0; j < protoLevel[i].length; j++) {
                var currentPair = protoLevel[i][j]
                var topPoint = new ControlPoint (currentPair.top.x,
                    currentPair.top.y, null, j, "top")
                topPoint.subject = this.platforms[i]
                var bottomPoint = new ControlPoint(currentPair.bottom.x,
                    currentPair.bottom.y, null, j, "bottom")
                bottomPoint.subject = this.platforms[i]
                this.addChild(topPoint)
                this.addChild(bottomPoint)
                controlPoints.push(topPoint, bottomPoint)
                this.platforms[i].controlPoints.push(topPoint, bottomPoint)
            }
            var deleteButton = new DeleteButton(this.platforms[i])
            this.controlPointSets.push(controlPoints)
        }
        this.introduceControlPoints()
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
    toJSON() {
        return this.platforms.map(function(platform) {
            return platform.toJSON()
        })
    }
    update(delta) {
        if(this.trash.length > 0) {
            this.emptyTrash()
        }
    }
    emptyTrash() {
        for(let i = 0; i < this.trash.length; i++) {
            //If it's a platform's delete button, remove that platform
            //from our list of platforms, and destory the platform, too
            if(this.trash[i] instanceof DeleteButton) {
                var subject = this.trash[i].subject
                this.platforms = this.platforms.filter(function(platform) {
                    return platform !== subject
                })
                subject.destroy()
            }
            this.trash[i].destroy()
        }
        this.trash = []
    }
}
