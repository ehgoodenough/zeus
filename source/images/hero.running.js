var spritesheet = {
    "frames": [
        // {
        //     "frame": {"x":0,"y":0,"w":41,"h":43},
        //     "sourceSize": {"w":164,"h":129}
        // }
    ],
    "meta": {
        "app": "http://www.codeandweb.com/texturepacker",
        "version": "1.0",
        "image": "hero.running.png",
        "format": "RGBA8888",
        "size": {"w":164,"h":129},
        "scale": "1",
        "smartupdate": "$TexturePacker:SmartUpdate:8b2d9e0185442505c8d851f51b9a52fc:d620c8336d153f9c18c27d4815fdc81e:78b1df88c0acb4a5322765641b170e25$"
    }
}

var WIDTH = 41, HEIGHT = 43
var SHEET_WIDTH = 164, SHEET_HEIGHT = 129

for(var y = 0; y < SHEET_HEIGHT; y += HEIGHT) {
    for(var x = 0; x < SHEET_WIDTH; x += WIDTH) {
        spritesheet.frames.push({
            "frame": {"x": x, "y": y, "w": WIDTH, "h": HEIGHT},
            "sourceSize": {"w": SHEET_WIDTH, "h": SHEET_HEIGHT},
        })
    }
}

module.exports = spritesheet

// module.exports = {
//     "frames": [
//         {
//             "frame": {"x":0,"y":0,"w":41,"h":43},
//             "sourceSize": {"w":164,"h":129}
//         }
//     ]
// }
