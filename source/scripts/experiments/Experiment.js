import * as Pixi from "pixi.js"

export default class Experiment extends Pixi.Container {
    constructor() {
        super()

        // Instantiate a renderer, solely for this experiment.
        this.renderer = Pixi.autoDetectRenderer(320, 180)
        this.renderer.backgroundColor = 0x444444

        // Create the HTML/DOM elements.
        this.view = document.createElement("div")
        this.view.appendChild(document.createTextNode(this.description))
        this.view.appendChild(this.renderer.view)
        this.view.className = "experiment"
    }
    update(delta) {
        this.children.forEach(function(child) {
            if(child.update instanceof Function) {
                child.update(delta)
            }
        })
    }
    render() {
        this.renderer.render(this)
    }
    get description() {
        return "Hello World!!"
    }
}
