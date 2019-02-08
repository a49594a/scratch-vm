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
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSItMjMzIDM1Ni45IDEyOC4zIDEyOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtMjMzIDM1Ni45IDEyOC4zIDEyODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzdGM0Y5ODt9DQo8L3N0eWxlPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTS0xNDQuOCw0MjQuMWMtMiwwLTMuOCwwLjgtNS4yLDEuOWwtMTkuNi0xMS4xYzAuNC0xLjQsMC42LTIuOCwwLjYtNC4yYzAtMS4yLTAuMS0yLjMtMC41LTMuNWwxMy43LTYuOA0KCWMxLjQsMS40LDMuNSwyLjMsNS42LDIuM2M0LjUsMCw4LjEtMy42LDguMS04LjFjMC00LjUtMy42LTguMS04LjEtOC4xcy04LjEsMy42LTguMSw4LjF2MWwtMTMuNyw2LjhjLTIuNC0zLjEtNi4zLTUuMS0xMC42LTUuMQ0KCWMtNy40LDAtMTMuNCw2LTEzLjQsMTMuNGMwLDUuOCwzLjYsMTAuNiw4LjYsMTIuNWwtMS44LDExLjZjLTMuOCwwLjYtNi43LDQtNi43LDcuOWMwLDQuNSwzLjYsOC4xLDguMSw4LjFzOC4xLTMuNiw4LjEtOC4xDQoJYzAtMy4xLTEuNy01LjYtNC4yLTdsMS45LTExLjhjMy44LTAuMSw3LjMtMS45LDkuNi00LjZsMTkuNiwxMS4xYy0wLjEsMC41LTAuMSwwLjktMC4xLDEuNGMwLDQuNSwzLjYsOC4xLDguMSw4LjENCgljNC41LDAsOC4xLTMuNiw4LjEtOC4xQy0xMzYuNyw0MjcuOC0xNDAuNSw0MjQuMS0xNDQuOCw0MjQuMXoiLz4NCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0tMTM2LjksMzY0LjdILTIwMWwtMzIsNTUuNmwzMi4xLDU1LjZoNjRsMzIuMS01NS42TC0xMzYuOSwzNjQuN3ogTS0xNDIuOCw0NjUuNmgtNTIuNGwtMjYuMS00NS4zbDI2LjEtNDUuMw0KCWg1Mi40bDI2LjEsNDUuM0MtMTE2LjYsNDIwLjMtMTQyLjgsNDY1LjYtMTQyLjgsNDY1LjZ6Ii8+DQo8L3N2Zz4=';

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3KinectBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this._sensors = {};
        window.setTimeout(this.load, 50);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'kinect',
            name: 'Kinect',
            blockIconURI: blockIconURI,
            blocks: [{
                opcode: 'getSensorOfPlayer',
                blockType: BlockType.REPORTER,
                text: '[SENSOR] of [PLAYER]',
                arguments: {
                    SENSOR: {
                        type: ArgumentType.STRING,
                        menu: 'SENSOR',
                        defaultValue: 'Head_X'
                    },
                    PLAYER: {
                        type: ArgumentType.STRING,
                        menu: 'PLAYER',
                        defaultValue: 'P1'
                    }
                }
            }, ],
            menus: {
                PLAYER: ['P1', 'P2'],
                SENSOR: ['AnkleLeft_X', 'AnkleLeft_Y', 'AnkleRight_X', 'AnkleRight_Y',
                    'ElbowLeft_X', 'ElbowLeft_Y', 'ElbowRight_X', 'ElbowRight_Y',
                    'FootLeft_X', 'FootLeft_Y', 'FootRight_X', 'FootRight_Y',
                    'HandLeft_X', 'HandLeft_Y', 'HandRight_X', 'HandRight_Y',
                    'HandTipLeft_X', 'HandTipLeft_Y', 'HandTipRight_X', 'HandTipRight_Y',
                    'Head_X', 'Head_Y',
                    'HipLeft_X', 'HipLeft_Y', 'HipRight_X', 'HipRight_Y',
                    'KneeLeft_X', 'KneeLeft_Y', 'KneeRight_X', 'KneeRight_Y',
                    'Neck_X', 'Neck_Y',
                    'ShoulderLeft_X', 'ShoulderLeft_Y', 'ShoulderRight_X', 'ShoulderRight_Y',
                    'SpineBase_X', 'SpineBase_Y', 'SpineMid_X', 'SpineMid_Y', 'SpineShoulder_X', 'SpineShoulder_Y',
                    'ThumbLeft_X', 'ThumbLeft_Y', 'ThumbRight_X', 'ThumbRight_Y',
                    'WristLeft_X', 'WristLeft_Y', 'WristRight_X', 'WristRight_Y',
                    'HandLeftState', 'HandRightState',
                ]
            }
        };
    }
    load() {
        Blockey.Utils.ajax({
            url: "http://localhost:8080",
            data: {},
            crossDomain: true,
            cache: false,
            type: "POST",
            success: (r) => {
                this._sensors = r;
                window.setTimeout(this.load, 10);
            },
            error: (e) => {
                this._sensors = {};
                window.setTimeout(this.load, 10);
            }
        });
    }
    getSensorOfPlayer(sensor, player) {
        var val = this._sensors[player + "_" + sensor];
        return val ? val : 0;
    }
}

module.exports = Scratch3KinectBlocks;
