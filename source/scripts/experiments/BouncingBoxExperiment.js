import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

export default class BouncingBoxExperiment extends Experiment {
    constructor() {
        super()

        this.sprite = new Sprite()
        this.addChild(this.sprite)
    }
    update(delta) {
        // Update the sprite.
        this.sprite.position.x += 1.4
        this.sprite.position.y += 1
        this.sprite.rotation += 0.1

        // Render the scene.
        this.renderer.render(this)
    }
    get description() {
        return "A bouncing box."
    }
}
