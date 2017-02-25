import * as Pixi from "pixi.js"

import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

Pixi.extras.BitmapText.fonts["tiny"]

export default class TextExperiment extends Experiment {
    constructor() {
        super()

        // Pixi.loader
        //     .add("tiny", "fonts/tiny.fnt")
        //     .load(() => {
        //         this.text = new Pixi.extras.BitmapText("Hello World!!", {
        //             font: {name: "tiny", size: 36}
        //         })
        //     })

        this.text = new Pixi.Text("Hello World!!", new Pixi.TextStyle({fontSize: 36, fill: "#FFF"}))

        this.text.position.x = 320 / 2
        this.text.position.y = 180 / 2
        this.text.anchor.x = 0.5
        this.text.anchor.y = 0.5
        this.addChild(this.text)
    }
    update(delta) {
        super.update(delta)
    }
    get description() {
        return "Hello World!!"
    }
}
