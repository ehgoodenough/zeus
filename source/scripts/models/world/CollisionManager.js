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

        for(let i = 0; i < this.level.platforms.length; i ++) {
            var platYAtPlayerX = this.level.platforms[i].getTopYAtX(this.hero.position.x)
            if(platYAtPlayerX <= maxAltitude
                && this.level.platforms[i].isPointAboveMe(
                {x: this.hero.position.x, y: this.hero.position.y + heroHeight})) {
                maxAltitude = platYAtPlayerX
                nearestLandingPlatform = this.level.platforms[i]
            }
        }
        this.hero.currentPlatform = nearestLandingPlatform
    }
}
