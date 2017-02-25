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

        // A hack to load our font. :(
        this.text.style.fontFamily = ""
        this.text.style.fontFamily = "tiny"
    }
    get description() {
        return "Some text, styled with a truetype font. I'm not happy with "
             + "how fuzzy the font is rasterized, so I'll revisit this "
             + "sometime later."
    }
}
