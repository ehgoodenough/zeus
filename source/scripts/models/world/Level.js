import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"
import Container from "scripts/models/Container.js"

import Platform from "scripts/models/world/Platform.js"
import ControlPoint from "scripts/models/world/ControlPoint.js"
import DeleteButton from "scripts/models/world/Deletebutton.js"

import DevMode from "scripts/layers/DevMode.js"

export default class Level extends Container {
    constructor(protolevel) {
        super()

        this.controlPointSets = []
        this.platforms = []

        //create platforms from protolevel
        for(let i = 0; i < protolevel.length; i++) {
            this.platforms.push(this.addChild(new Platform(protolevel[i])))
            if(DevMode.isActive) {
                this.generateControlPoints(this.platforms[i])
            }
        }

        this.trash = []

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
                this.controlPointSets = this.controlPointSets.filter(
                    function(controlPointSet) {
                        return controlPointSet[0].subject !== subject
                    })
                subject.destroy()
            }
            this.trash[i].destroy()
        }
        this.trash = []
    }
    generateControlPoints(platform) {
        var controlPoints = []
        for(let i = 0; i < platform.pointPairs.length; i++) {
            var currentPair = platform.pointPairs[i]
            var topPoint = new ControlPoint (currentPair.top.x,
                currentPair.top.y, platform, i, "top")
            var bottomPoint = new ControlPoint(currentPair.bottom.x,
                currentPair.bottom.y, platform, i, "bottom")
            topPoint.partner = bottomPoint
            bottomPoint.partner = topPoint
            this.addChild(topPoint)
            this.addChild(bottomPoint)
            controlPoints.push(topPoint, bottomPoint)
            platform.controlPoints.push(topPoint, bottomPoint)
        }
        var deleteButton = new DeleteButton(platform)
        this.controlPointSets.push(controlPoints)
    }
}
