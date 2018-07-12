const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const Color = require('../../util/color');
const MathUtil = require('../../util/math-util');
const RenderedTarget = require('../../sprites/rendered-target');
const log = require('../../util/log');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGVuLWljb248L3RpdGxlPjxnIHN0cm9rZT0iIzU3NUU3NSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04Ljc1MyAzNC42MDJsLTQuMjUgMS43OCAxLjc4My00LjIzN2MxLjIxOC0yLjg5MiAyLjkwNy01LjQyMyA1LjAzLTcuNTM4TDMxLjA2NiA0LjkzYy44NDYtLjg0MiAyLjY1LS40MSA0LjAzMi45NjcgMS4zOCAxLjM3NSAxLjgxNiAzLjE3My45NyA0LjAxNUwxNi4zMTggMjkuNTljLTIuMTIzIDIuMTE2LTQuNjY0IDMuOC03LjU2NSA1LjAxMiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS40MSA2LjExcy00LjQ1LTIuMzc4LTguMjAyIDUuNzcyYy0xLjczNCAzLjc2Ni00LjM1IDEuNTQ2LTQuMzUgMS41NDYiLz48cGF0aCBkPSJNMzYuNDIgOC44MjVjMCAuNDYzLS4xNC44NzMtLjQzMiAxLjE2NGwtOS4zMzUgOS4zYy4yODItLjI5LjQxLS42NjguNDEtMS4xMiAwLS44NzQtLjUwNy0xLjk2My0xLjQwNi0yLjg2OC0xLjM2Mi0xLjM1OC0zLjE0Ny0xLjgtNC4wMDItLjk5TDMwLjk5IDUuMDFjLjg0NC0uODQgMi42NS0uNDEgNC4wMzUuOTYuODk4LjkwNCAxLjM5NiAxLjk4MiAxLjM5NiAyLjg1NU0xMC41MTUgMzMuNzc0Yy0uNTczLjMwMi0xLjE1Ny41Ny0xLjc2NC44M0w0LjUgMzYuMzgybDEuNzg2LTQuMjM1Yy4yNTgtLjYwNC41My0xLjE4Ni44MzMtMS43NTcuNjkuMTgzIDEuNDQ4LjYyNSAyLjEwOCAxLjI4Mi42Ni42NTggMS4xMDIgMS40MTIgMS4yODcgMi4xMDIiIGZpbGw9IiM0Qzk3RkYiLz48cGF0aCBkPSJNMzYuNDk4IDguNzQ4YzAgLjQ2NC0uMTQuODc0LS40MzMgMS4xNjVsLTE5Ljc0MiAxOS42OGMtMi4xMyAyLjExLTQuNjczIDMuNzkzLTcuNTcyIDUuMDFMNC41IDM2LjM4bC45NzQtMi4zMTYgMS45MjUtLjgwOGMyLjg5OC0xLjIxOCA1LjQ0LTIuOSA3LjU3LTUuMDFsMTkuNzQzLTE5LjY4Yy4yOTItLjI5Mi40MzItLjcwMi40MzItMS4xNjUgMC0uNjQ2LS4yNy0xLjQtLjc4LTIuMTIyLjI1LjE3Mi41LjM3Ny43MzcuNjE0Ljg5OC45MDUgMS4zOTYgMS45ODMgMS4zOTYgMi44NTYiIGZpbGw9IiM1NzVFNzUiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0xOC40NSAxMi44M2MwIC41LS40MDQuOTA1LS45MDQuOTA1cy0uOTA1LS40MDUtLjkwNS0uOTA0YzAtLjUuNDA3LS45MDMuOTA2LS45MDMuNSAwIC45MDQuNDA0LjkwNC45MDR6IiBmaWxsPSIjNTc1RTc1Ii8+PC9nPjwvc3ZnPg==';

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3PuzzleBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'puzzle',
            name: 'Puzzle',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'convertPaintToWatermark',
                    blockType: BlockType.COMMAND,
                    text: '将画板保存为水印'
                },
                {
                    opcode: 'showWatermark',
                    blockType: BlockType.COMMAND,
                    text: '显示水印'
                },
                {
                    opcode: 'hideWatermark',
                    blockType: BlockType.COMMAND,
                    text: '隐藏水印'
                },
                {
                    opcode: 'isPaintSameAsWatermark',
                    blockType: BlockType.BOOLEAN,
                    text: '画板与水印是否相同'
                },
                {
                    opcode: 'attemptCount',
                    blockType: BlockType.REPORTER,
                    text: '重置次数'
                },
                {
                    opcode: 'stepInterval',
                    blockType: BlockType.REPORTER,
                    text: '动作间隔'
                },
                {
                    opcode: 'setResolved',
                    blockType: BlockType.COMMAND,
                    text: '将任务设定为已完成'
                },
                {
                    opcode: 'setSpriteTracker',
                    blockType: BlockType.COMMAND,
                    text: '设置角色追踪器 [TRACKER]',
                    arguments: {
                        TRACKER: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
            ]
        };
    }

    convertPaintToWatermark(args, util) {
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

    _setWatermarkVisible(visible) {
        if (this.runtime.penSkinId == undefined) return;
        if (this.runtime.renderer) {
            this.runtime.renderer.updateDrawableProperties(this.runtime.watermarkDrawableId, {
                visible: visible
            });
            this.runtime.requestRedraw();
        }
    };

    showWatermark(args, util) {
        this._setWatermarkVisible(true);
    };

    hideWatermark(args, util) {
        this._setWatermarkVisible(false);
    };

    isPaintSameAsWatermark(args, util) {
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

    attemptCount(args, util) {
        return this.runtime.puzzle.attemptCount || 0;
    };

    stepInterval(args, util) {
        return this.runtime.puzzle.stepInterval / 1000;
    };

    setResolved(args, util) {
        if (util.runtime.puzzle&&util.runtime.puzzle.setResolved) {
            util.runtime.puzzle.setResolved();
        }
    };

    setSpriteTracker(args, util) {
        util.target._spriteTracker = args.TRACKER;
    };
}

module.exports = Scratch3PuzzleBlocks;
