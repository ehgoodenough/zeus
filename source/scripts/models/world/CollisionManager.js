export default class CollisionManager {
    constructor(hero, level) {
        this.hero = hero
        this.level = level
        this.hero.currentPlatform = null
        this.hero.collisionManager = this
        this.fallthroughBuffer = 2
    }
    getLanding() {
        var nearestLandingPlatform = null
        var heroHeight = this.hero.feetOffset
        var maxAltitude = Infinity

        for(let i = 0; i < this.level.platforms.length; i++) {
            var platYAtPlayerX = this.level.platforms[i].getTopYAtX(this.hero.position.x)
            if(platYAtPlayerX <= maxAltitude
            && this.level.platforms[i].isPointAboveMe(
                {x: this.hero.position.x, y: this.hero.position.y
                    + heroHeight - this.fallthroughBuffer})) {
                maxAltitude = platYAtPlayerX
                nearestLandingPlatform = this.level.platforms[i]
            }
            //this.level.platforms[i].tint = 0x888888
            if(nearestLandingPlatform) {
                //nearestLandingPlatform.tint = 0xBBBBBB
            }
        }
        return nearestLandingPlatform
    }
    getCeiling() {

    }
}
