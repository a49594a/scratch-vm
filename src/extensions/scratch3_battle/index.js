const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDEyOCAxMjgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEyOCAxMjg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTEwNy4xLDU2LjVoLTYuOVYzNy44YzAtNS00LjQtOS40LTkuNC05LjRINzIuMXYtNy41QzcxLjUsMTQsNjUuOSw5LDU5LjYsOQoJCWMtNi45LDAtMTEuOSw1LTExLjksMTEuOXY2LjlIMjljLTUuNiwwLTEwLDQuNC0xMCwxMHYxOC4xaDYuOUMzMi44LDU1LjksMzksNjEuNSwzOSw2OWMwLDYuOS01LjYsMTMuMS0xMy4xLDEzLjFIMTl2MTguMQoJCWMwLDQuNCw0LjQsOC44LDkuNCw4LjhoMTguMXYtNi45YzAtNi45LDUuNi0xMy4xLDEzLjEtMTMuMWM2LjksMCwxMy4xLDUuNiwxMy4xLDEzLjF2Ni45aDE4LjFjNSwwLDkuNC00LjQsOS40LTkuNFY4MC45aDYuOQoJCWM2LjksMCwxMS45LTUsMTEuOS0xMS45QzExOSw2MS41LDExNCw1Ni41LDEwNy4xLDU2LjVMMTA3LjEsNTYuNXoiLz4KPC9nPgo8L3N2Zz4K';
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDE4IDE4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxOCAxODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMxMjk2REI7IiBkPSJNMTYuMSw3LjZIMTV2LTNjMC0wLjgtMC43LTEuNS0xLjUtMS41aC0zVjEuOWMtMC4xLTEuMS0xLTEuOS0yLTEuOUM3LjQsMCw2LjYsMC44LDYuNiwxLjlWM2gtMwoJCUMyLjcsMywyLDMuNywyLDQuNnYyLjloMS4xYzEuMSwwLDIuMSwwLjksMi4xLDIuMWMwLDEuMS0wLjksMi4xLTIuMSwyLjFIMnYyLjlDMiwxNS4zLDIuNywxNiwzLjUsMTZoMi45di0xLjEKCQljMC0xLjEsMC45LTIuMSwyLjEtMi4xYzEuMSwwLDIuMSwwLjksMi4xLDIuMVYxNmgyLjljMC44LDAsMS41LTAuNywxLjUtMS41di0zaDEuMWMxLjEsMCwxLjktMC44LDEuOS0xLjkKCQlDMTgsOC40LDE3LjIsNy42LDE2LjEsNy42TDE2LjEsNy42eiIvPgo8L2c+Cjwvc3ZnPgo=';

class FlameMind {
    constructor() {
        this._id = '';
    }
    create(id, resolve) {
        return this.connect(id, resolve);
    }
    connect(id) {
        var promise = new Promise(resolve => {
            this._id = id;
            resolve();
        });
        return promise;
    }
    config(options) {
        var promise = new Promise(resolve => {
            this._options = options;
            resolve();
        });
        return promise;
    }
    replay() {
        return null;
    }
    excute(command) {
        var extUtils = this.runtime.extUtils;
        var promise = new Promise(resolve => {
            extUtils.ajax({
                url: `http://flamechess.cn/js/1/21/roboth.html?${this._id},${command};`,
                success: () => {
                    resolve();
                }
            });
        });
        return promise;
    }
    getId() {
        return this._id;
    }
    getSituation() {
        var promise = new Promise(resolve => {
            var r = '';
            resolve(r);
        });
        promise.then(r => r);
        return promise;
    }
}

const battleHandlers = {
    'FlameMind': new FlameMind()
};

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3BattleBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this._battleHandler = null;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'battle',
            name: 'Battle',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [{
                    opcode: 'create',
                    blockType: BlockType.COMMAND,
                    text: '创建[TYPE]战场[ID]',
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        },
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: '连接[TYPE]战场[ID]',
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        },
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'config',
                    blockType: BlockType.COMMAND,
                    text: '设置[OPTIONS]',
                    arguments: {
                        OPTIONS: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'replay',
                    blockType: BlockType.COMMAND,
                    text: '重新开始'
                },
                {
                    opcode: 'excute',
                    blockType: BlockType.COMMAND,
                    text: '执行命令[COMMAND]',
                    arguments: {
                        COMMAND: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'getId',
                    blockType: BlockType.REPORTER,
                    text: '战场ID'
                },
                {
                    opcode: 'getSituation',
                    blockType: BlockType.REPORTER,
                    text: '战况'
                }
            ]
        };
    }

    create(args, util) {
        var type = args.TYPE;
        var id = args.ID;
        var battleHandler = battleHandlers[type];
        if (!battleHandler) return;
        var promise = battleHandler.create(id);
        promise.then(() => {
            this._battleHandler = battleHandler;
        });
        return promise;
    };

    connect(args, util) {
        var type = args.TYPE;
        var id = args.ID;
        var battleHandler = battleHandlers[type];
        var promise = battleHandler.connect(id);
        promise.then(() => {
            this._battleHandler = battleHandler;
        });
        return promise;
    };

    config(args, util) {
        var battleHandler = this._battleHandler;
        if (!battleHandler) return;
        var options = args.OPTIONS;
        var promise = battleHandler.config(options);
        return promise;
    };

    replay(args, util) {
        var battleHandler = this._battleHandler;
        if (!battleHandler) return;
        var promise = battleHandler.replay();
        return promise;
    };

    excute(args, util) {
        var command = args.COMMAND;
        var battleHandler = this._battleHandler;
        if (!battleHandler) return;
        var promise = battleHandler.excute(command);
        return promise;
    };

    getId(args, util) {
        var battleHandler = this._battleHandler;
        return battleHandler ? battleHandler.getId() : '';
    };

    getSituation(args, util) {
        var battleHandler = this._battleHandler;
        if (!battleHandler) return '';
        var promise = battleHandler.getSituation();
        return promise;
    };
}

module.exports = Scratch3BattleBlocks;
