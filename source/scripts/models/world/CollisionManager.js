export default class CollisionManager {
    constructor(hero, level) {
        this.hero = hero
        this.level = level
        this.hero.currentPlatform = this.level.platforms[0]
    }
    update() {
        var nearestLandingPlatform = this.level.platforms[0]
        var heroHeight = this.hero.feetOffset
        var maxAltitude = Infinity
        var fallthroughBuffer = 2

        for(let i = 0; i < this.level.platforms.length; i++) {
            var platYAtPlayerX = this.level.platforms[i].getTopYAtX(this.hero.position.x)
            if(platYAtPlayerX <= maxAltitude
                    && this.level.platforms[i].isPointAboveMe(
                        {x: this.hero.position.x, y: this.hero.position.y
                        + heroHeight - fallthroughBuffer})) {
                maxAltitude = platYAtPlayerX
                nearestLandingPlatform = this.level.platforms[i]
            }
            //this.level.platforms[i].tint = 0x888888
        }
        //nearestLandingPlatform.tint = 0xBBBBBB
        this.hero.currentPlatform = nearestLandingPlatform
    }
}
