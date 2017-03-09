import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"
import Container from "scripts/models/Container.js"
import Input from "scripts/layers/Input.js"

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


        this.inputs = {
            one: new Input(["1"]),
            two: new Input(["2"]),
            three: new Input(["3"]),
            four: new Input(["4"]),
            five: new Input(["5"]),
            p: new Input(["P"])
        }
        this.createdPlatformSincePress = false

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
        if(this.inputs.p.isDown()) {
            if(!this.createdPlatformSincePress) {
                if(this.inputs.one.isDown()) {
                    this.createNewPlatformAtCenter(1)
                    this.createdPlatformSincePress = true
                } else if(this.inputs.two.isDown()) {
                    this.createNewPlatformAtCenter(2)
                    this.createdPlatformSincePress = true
                } else if(this.inputs.three.isDown()) {
                    this.createNewPlatformAtCenter(3)
                    this.createdPlatformSincePress = true
                } else if(this.inputs.four.isDown()) {
                    this.createNewPlatformAtCenter(4)
                    this.createdPlatformSincePress = true
                } else if(this.inputs.five.isDown()) {
                    this.createNewPlatformAtCenter(5)
                    this.createdPlatformSincePress = true
                }
            }
        } else {
            this.createdPlatformSincePress = false
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
            this.origin.stashLevel()
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
    createNewPlatformAtCenter(numSegments) {
        var center = this.origin.hero.position
        var pointKerning = 20
        var pointVertSpacing = 10
        var pointPairs = []
        for(let i = 0; i < numSegments + 1; i++) {
            var newTop = {x: center.x + pointKerning*i - numSegments*pointKerning/2,
                y: center.y - pointVertSpacing/2}
            var newBottom = {x: center.x + pointKerning*i - numSegments*pointKerning/2,
                y: center.y + pointVertSpacing/2}
            pointPairs.push({top: newTop, bottom: newBottom})
        }
        this.platforms.push(this.addChild(new Platform(pointPairs)))
        if(DevMode.isActive) {
            this.generateControlPoints(this.platforms[this.platforms.length-1])
        }
    }
}
