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
class Scratch3CommunityBlocks {
    constructor(runtime) {

        this.lastPayTime = 0;
        this._error = '';

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
            id: 'community',
            name: 'Community',
            blockIconURI: blockIconURI,
            blocks: [{
                    opcode: 'getUserInfo',
                    blockType: BlockType.REPORTER,
                    text: '[USER_ATTR]',
                    arguments: {
                        USER_ATTR: {
                            type: ArgumentType.STRING,
                            menu: 'USER_ATTR',
                            defaultValue: 'user level'
                        }
                    }
                },
                {
                    opcode: 'isFollower',
                    blockType: BlockType.BOOLEAN,
                    text: 'is follower?',
                },
                {
                    opcode: 'isProjectLover',
                    blockType: BlockType.BOOLEAN,
                    text: 'love this project?',
                },
                {
                    opcode: 'openUrl',
                    blockType: BlockType.COMMAND,
                    text: 'open [URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'http://mozhua.aerfaying.com'
                        }
                    }
                },
                {
                    opcode: 'redirectUrl',
                    blockType: BlockType.COMMAND,
                    text: 'redirect [URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'http://mozhua.aerfaying.com'
                        }
                    }
                },
                {
                    opcode: 'pay',
                    blockType: BlockType.COMMAND,
                    text: 'pay [AMOUNT] for [ITEM]',
                    arguments: {
                        AMOUNT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '10'
                        },
                        ITEM: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'getError',
                    blockType: BlockType.REPORTER,
                    text: 'error',
                }
            ],
            menus: {
                USER_ATTR: ['user id', 'username', 'user level']
            }
        };
    }

    getUserInfo(args, util) {
        var loggedInUser = Blockey.Utils.getLoggedInUser();
        if (!loggedInUser) return "";
        var attr = args.USER_ATTR;
        if (attr == "user id") return loggedInUser.id;
        else if (attr == "username") return loggedInUser.username;
        else if (attr == "user level") return loggedInUser.level;
        else return "";
    }

    isFollower() {
        return !!(Blockey.INIT_DATA.PROJECT && Blockey.INIT_DATA.PROJECT.model.isCreatorFollower);
    }

    isProjectLover() {
        return !!(Blockey.INIT_DATA.PROJECT && Blockey.INIT_DATA.PROJECT.model.isProjectLover);
    }

    isValidUrl(url) {
        var regex = /.*\:\/\/([^\/]*).*/;
        var match = url.match(regex);
        if (match) {
            var domain = match[1];
            var validDomain = ".aerfaying.com"
            if (domain.indexOf(validDomain) >= 0 && domain.indexOf(validDomain) + validDomain.length == domain.length) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    openUrl(args, util) {
        if (this.isValidUrl(args.URL)) {
            window.open(args.URL);
        } else {
            alert("该指令块只能用于打开魔抓社区的页面");
        }
    }

    redirectUrl(args, util) {
        if (this.isValidUrl(args.URL)) {
            window.location = args.URL;
        } else {
            alert("该指令块只能用于打开魔抓社区的页面");
        }
    }

    pay(args, util) {
        var self = this;
        self._error = "";
        return new Promise(resolve => {
            var template = _.template('你确定要支付<strong><%=amount%></strong>金币购买<strong><%=remark%></strong>吗？' + ((new Date().getTime() - self.lastPayTime < 2000) ? '<div><smaller>如果重复看到此提示，请给<a href="/User?id=1">守护者</a>留言举报。</smaller></div>' : ''));
            Blockey.Dialog.confirm("作品内购支付确认", template({
                amount: args.AMOUNT,
                remark: args.ITEM
            }), function (e) {
                if (e) {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        data: {
                            id: Blockey.INIT_DATA.PROJECT.model.id,
                            amount: args.AMOUNT,
                            remark: args.ITEM
                        },
                        url: "/MProjectApi/Pay",
                    }).done(function (e) {
                        if (!e.status) self._error = e.message;
                    }).error(function (e) {
                        self._error = "未知错误";
                        Blockey.AlertView.msg($("#alert-view"), {
                            alert: "error",
                            msg: e.statusText
                        })
                    }).always(function (e) {
                        setTimeout(function () {
                            resolve();
                        }, 500);
                    });
                } else {
                    self._error = "取消";
                    setTimeout(function () {
                        resolve();
                    }, 500);
                }
                self.lastPayTime = new Date().getTime();
            });
        });
    }

    getError(args, util) {
        return this._error;
    }

}

module.exports = Scratch3CommunityBlocks;
