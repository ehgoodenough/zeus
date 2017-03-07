import Keyb from "keyb"

export default class Input {
    constructor(keys) {
        if(keys instanceof Array == false) {
            keys = new Array(keys)
        }

        this.keys = keys
    }
    isDown() {
        for(var index in this.keys) {
            var key = this.keys[index]

            if(Keyb.isDown(key)) {
                return true
            }
        }

        return false
    }
}
