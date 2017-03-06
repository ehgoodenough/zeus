// THE EXPERIMENTS HAVE BEEN CONDUCTED, AND
// ARE NOW DEPRECATED. DO NOT EDIT THESE.

import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

export default class BouncingBoxExperiment extends Experiment {
    constructor() {
        super()

        this.addChild(new BounceBox())
    }
    get description() {
        return "A bouncing box in a 320x180 frame, with nearest-neighbor "
             + "scaling. A simple rendering test for translating and "
             + "rotating a sprite on the canvas."
    }
}

class BounceBox extends Sprite {
    constructor() {
        super()

        this.velocity = {x: 2, y: 2}
    }
    update(delta) {

        // Spin the box.
        this.rotation += 0.1 * delta.f

        // Move the box.
        this.position.x += this.velocity.x * delta.f
        this.position.y += this.velocity.y * delta.f

        // If the box has hit the west edge, bounce it.
        if(this.position.x < 0) {
            this.velocity.x = +2
        }

        // if the box has hit the east edge, bounce it.
        if(this.position.x > this.parent.renderer.width) {
            this.velocity.x = -2
        }

        // If the box has hit the north edge, bounce it.
        if(this.position.y < 0) {
            this.velocity.y = +2
        }

        // If the box has his the south edge, bounce it.
        if(this.position.y > this.parent.renderer.height) {
            this.velocity.y = -2
        }
    }
}
