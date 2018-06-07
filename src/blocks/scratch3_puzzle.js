/**
 * Host for the Puzzle-related blocks
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
var Scratch3PuzzleBlocks = function (runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;
};

/**
 * Retrieve the block primitives implemented by this package.
 * @return {object.<string, Function>} Mapping of opcode to Function.
 */
Scratch3PuzzleBlocks.prototype.getPrimitives = function () {
    return {
        puzzle_convertpainttowatermark: this.convertPaintToWatermark,
        puzzle_showwatermark: this.showWatermark,
        puzzle_hidewatermark: this.hideWatermark,
        puzzle_ispaintsameaswatermark: this.isPaintSameAsWatermark,
        puzzle_stepinterval: this.stepInterval,
        puzzle_setresolved: this.setResolved,
        puzzle_setspritetracker: this.setSpriteTracker
    };
};

Scratch3PuzzleBlocks.prototype.convertPaintToWatermark = function (args, util) {
    if (this.runtime.penSkinId == undefined) return;

    var penSkin = this.runtime.renderer._allSkins[this.runtime.penSkinId];
    var watermarkSkin = this.runtime.renderer._allSkins[this.runtime.watermarkSkinId];

    var size = penSkin.size;
    var w = size[0];
    var h = size[1];
    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;

    this.testScratch = tempCanvas.getContext("2d");
    this.testScratch.drawImage(penSkin._canvas, 0, 0);

    var canvasData = this.testScratch.getImageData(0, 0, w, h);
    for (var x = 0; x < canvasData.width; x++) {
        for (var y = 0; y < canvasData.height; y++) {
            // Index of the pixel in the array 
            var idx = (x + y * canvasData.width) * 4;
            var r = canvasData.data[idx + 0];
            var g = canvasData.data[idx + 1];
            var b = canvasData.data[idx + 2];
            // calculate gray scale value 
            var gray = 255 - ((255 - (.299 * r + .587 * g + .114 * b)) * 0.4);
            // assign gray scale value 
            canvasData.data[idx + 0] = gray; // Red channel 
            canvasData.data[idx + 1] = gray; // Green channel 
            canvasData.data[idx + 2] = gray; // Blue channel 
            //canvasData.data[idx + 3] = 255; // Alpha channel 
        }
    }

    penSkin.clear();
    watermarkSkin._canvas.getContext("2d").putImageData(canvasData, 0, 0);
    watermarkSkin._canvasDirty = true;
};

Scratch3PuzzleBlocks.prototype._setWatermarkVisible = function (visible) {
    if (this.runtime.penSkinId == undefined) return;
    if (this.runtime.renderer) {
        this.runtime.renderer.updateDrawableProperties(this.runtime.watermarkDrawableId, {
            visible: visible
        });
        this.runtime.requestRedraw();
    }
};

Scratch3PuzzleBlocks.prototype.showWatermark = function (args, util) {
    this._setWatermarkVisible(true);
};

Scratch3PuzzleBlocks.prototype.hideWatermark = function (args, util) {
    this._setWatermarkVisible(false);
};

Scratch3PuzzleBlocks.prototype.isPaintSameAsWatermark = function (args, util) {
    if (this.runtime.penSkinId == undefined || !this.testScratch) return false;

    var penSkin = this.runtime.renderer._allSkins[this.runtime.penSkinId];
    var watermarkSkin = this.runtime.renderer._allSkins[this.runtime.watermarkSkinId];

    var size = penSkin.size;
    var w = size[0];
    var h = size[1];

    var data1 = this.testScratch.getImageData(0, 0, w, h).data;
    var data2 = penSkin._canvas.getContext("2d").getImageData(0, 0, w, h).data;
    var count = 0;
    for (var i = 0; i < data1.length; i++) {
        if (i % 4 == 3 && data1[i] != data2[i] && !(data1[i] > 0 && data2[i] > 0)) {
            count++;
        }
    }
    return (count == 0);
};

Scratch3PuzzleBlocks.prototype.stepInterval = function (args, util) {
    return this.runtime.puzzle.stepInterval / 1000;
};

Scratch3PuzzleBlocks.prototype.setResolved = function (args, util) {
    if(util.runtime.puzzle.setResolved) {
        util.runtime.puzzle.setResolved();
    }
};

Scratch3PuzzleBlocks.prototype.setSpriteTracker = function (args, util) {
    util.target._spriteTracker = args.TRACKER;
};

module.exports = Scratch3PuzzleBlocks;
