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
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0ibGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9Ii0yMzMgMzU2LjkgMTI4IDEyOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtMjMzIDM1Ni45IDEyOCAxMjg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiM3RjNGOTg7fQ0KPC9zdHlsZT4NCjxwYXRoIGlkPSJYTUxJRF8yXyIgY2xhc3M9InN0MCIgZD0iTS0xNjkuMSw0NzcuNmMtMi4xLDAtNC0wLjgtNS40LTIuM2wtMTIuOC0xMi44Yy0xLjcsMy43LTQsNy4xLTYuMyw5LjQNCgljLTMuNSwzLjUtOC40LDUuNS0xMy4zLDUuNWMtNC45LDAtOS44LTItMTMuMy01LjVjLTcuMy03LjQtNy4zLTE5LjMsMC0yNi42YzIuMy0yLjMsNS43LTQuNSw5LjQtNi4zbC0xMi43LTEyLjdjLTMtMy0zLTcuOSwwLTEwLjkNCglsMTguMi0xOC4ybDIuOCw0LjdjMSwxLjcsMi4yLDMuMywzLjIsNC4zYzQuMyw0LjMsMTEuMyw0LjMsMTUuNywwYzIuMS0yLjEsMy4zLTQuOSwzLjMtNy44YzAtMy0xLjEtNS43LTMuMi03LjgNCgljLTEuMS0xLjEtMi42LTIuMi00LjMtMy4ybC00LjgtMi43bDE4LjItMTguMmMxLjQtMS42LDMuMy0yLjQsNS4zLTIuNGMyLjEsMCw0LDAuOCw1LjQsMi4zbDEyLjgsMTIuOGMxLjgtMy44LDQtNy4yLDYuMy05LjUNCgljNy40LTcuNCwxOS40LTcuNCwyNi43LDBjMy42LDMuNiw1LjYsOC4zLDUuNiwxMy40YzAsNS0yLDkuOC01LjYsMTMuNGMtMi4xLDIuMS01LjUsNC40LTkuNSw2LjNsMTIuNywxMi44YzEuNCwxLjQsMi4yLDMuNCwyLjIsNS40DQoJYzAsMi4xLTAuOCw0LTIuMyw1LjRsLTE4LjEsMTguMWwtMi44LTQuNmMtMS4xLTEuOS0yLjItMy4zLTMuMi00LjNjLTQuNC00LjMtMTEuMy00LjMtMTUuOCwwbC0wLjEsMC4xYy00LjMsNC4zLTQuMiwxMS4yLDAsMTUuNQ0KCWMxLjQsMS4zLDIuOCwyLjMsNC40LDMuMmw0LjgsMi43bC0xOC4yLDE4LjJDLTE2NS4xLDQ3Ni44LTE2Nyw0NzcuNi0xNjkuMSw0NzcuNnogTS0yMTcsNDIwLjhsMjAuNywyMC44bC0xMC4xLDQuNg0KCWMtMy4xLDEuNC02LjEsMy4zLTcuOCw1Yy00LDQtNCwxMC43LDAsMTQuOGMxLjksMS45LDQuNiwzLDcuMywzczUuNC0xLjEsNy40LTMuMWMxLjctMS43LDMuNi00LjcsNS03LjhsNC42LTEwbDIwLjgsMjAuOGwxMC4yLTEwLjINCgljLTAuNS0wLjQtMS0wLjktMS42LTEuNGwtMC4xLTAuMWMtMy43LTMuNy01LjctOC41LTUuNy0xMy43YzAtNS4yLDItMTAuMSw1LjYtMTMuOGwwLjEtMC4xYzcuOC03LjcsMTkuOS03LjcsMjcuNiwwDQoJYzAuNSwwLjUsMSwxLDEuNSwxLjZsMTAuMi0xMC4ybC0yMC42LTIwLjlsMTAuMi00LjZjMy40LTEuNiw2LjQtMy40LDcuOS01YzItMiwzLjEtNC42LDMuMS03LjRzLTEuMS01LjQtMy4xLTcuNA0KCWMtNC4yLTQuMi0xMC43LTQuMi0xNC44LDBjLTEuNywxLjctMy42LDQuNy01LDcuOWwtNC43LDEwLjFsLTIwLjgtMjAuOGwtMTAuMiwxMC4yYzAuNiwwLjUsMS4xLDEsMS42LDEuNWMzLjcsMy43LDUuNyw4LjYsNS43LDEzLjgNCgljMCw1LjItMi4xLDEwLjEtNS44LDEzLjhjLTcuNiw3LjYtMTkuOSw3LjYtMjcuNSwwYy0wLjUtMC41LTEtMS0xLjQtMS42TC0yMTcsNDIwLjh6Ii8+DQo8L3N2Zz4=';

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
