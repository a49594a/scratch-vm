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
const iconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGVuLWljb248L3RpdGxlPjxnIHN0cm9rZT0iIzU3NUU3NSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04Ljc1MyAzNC42MDJsLTQuMjUgMS43OCAxLjc4My00LjIzN2MxLjIxOC0yLjg5MiAyLjkwNy01LjQyMyA1LjAzLTcuNTM4TDMxLjA2NiA0LjkzYy44NDYtLjg0MiAyLjY1LS40MSA0LjAzMi45NjcgMS4zOCAxLjM3NSAxLjgxNiAzLjE3My45NyA0LjAxNUwxNi4zMTggMjkuNTljLTIuMTIzIDIuMTE2LTQuNjY0IDMuOC03LjU2NSA1LjAxMiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS40MSA2LjExcy00LjQ1LTIuMzc4LTguMjAyIDUuNzcyYy0xLjczNCAzLjc2Ni00LjM1IDEuNTQ2LTQuMzUgMS41NDYiLz48cGF0aCBkPSJNMzYuNDIgOC44MjVjMCAuNDYzLS4xNC44NzMtLjQzMiAxLjE2NGwtOS4zMzUgOS4zYy4yODItLjI5LjQxLS42NjguNDEtMS4xMiAwLS44NzQtLjUwNy0xLjk2My0xLjQwNi0yLjg2OC0xLjM2Mi0xLjM1OC0zLjE0Ny0xLjgtNC4wMDItLjk5TDMwLjk5IDUuMDFjLjg0NC0uODQgMi42NS0uNDEgNC4wMzUuOTYuODk4LjkwNCAxLjM5NiAxLjk4MiAxLjM5NiAyLjg1NU0xMC41MTUgMzMuNzc0Yy0uNTczLjMwMi0xLjE1Ny41Ny0xLjc2NC44M0w0LjUgMzYuMzgybDEuNzg2LTQuMjM1Yy4yNTgtLjYwNC41My0xLjE4Ni44MzMtMS43NTcuNjkuMTgzIDEuNDQ4LjYyNSAyLjEwOCAxLjI4Mi42Ni42NTggMS4xMDIgMS40MTIgMS4yODcgMi4xMDIiIGZpbGw9IiM0Qzk3RkYiLz48cGF0aCBkPSJNMzYuNDk4IDguNzQ4YzAgLjQ2NC0uMTQuODc0LS40MzMgMS4xNjVsLTE5Ljc0MiAxOS42OGMtMi4xMyAyLjExLTQuNjczIDMuNzkzLTcuNTcyIDUuMDFMNC41IDM2LjM4bC45NzQtMi4zMTYgMS45MjUtLjgwOGMyLjg5OC0xLjIxOCA1LjQ0LTIuOSA3LjU3LTUuMDFsMTkuNzQzLTE5LjY4Yy4yOTItLjI5Mi40MzItLjcwMi40MzItMS4xNjUgMC0uNjQ2LS4yNy0xLjQtLjc4LTIuMTIyLjI1LjE3Mi41LjM3Ny43MzcuNjE0Ljg5OC45MDUgMS4zOTYgMS45ODMgMS4zOTYgMi44NTYiIGZpbGw9IiM1NzVFNzUiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0xOC40NSAxMi44M2MwIC41LS40MDQuOTA1LS45MDQuOTA1cy0uOTA1LS40MDUtLjkwNS0uOTA0YzAtLjUuNDA3LS45MDMuOTA2LS45MDMuNSAwIC45MDQuNDA0LjkwNC45MDR6IiBmaWxsPSIjNTc1RTc1Ii8+PC9nPjwvc3ZnPg==';

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3CommunityBlocks {
    constructor (runtime) {
        
        this.lastPayTime = 0;
        this._error='';

        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'community',
            name: 'Community',
            iconURI: iconURI,
            blocks: [
                {
                    opcode: 'getUserInfo',
                    blockType: BlockType.REPORTER,
                    text: '[USER_ATTR]',
                    arguments: {
                        USER_ATTR: {
                            type: ArgumentType.STRING,
                            menu: 'userAttr',
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
                userAttr:['user id', 'username', 'user level']
            }
        };
    }
    
    getUserInfo (args, util) {
        if (!Blockey.INIT_DATA.LOGGED_IN_USER.options.authenticated) return "";
        if (args.USER_ATTR == "user id") return Blockey.INIT_DATA.LOGGED_IN_USER.model.id;
        else if (args.USER_ATTR == "username") return Blockey.INIT_DATA.LOGGED_IN_USER.model.username;
        else if (args.USER_ATTR == "user level") return Blockey.INIT_DATA.LOGGED_IN_USER.model.level;
        else return "";
    }
    
    isFollower () {
        return !!(Blockey.INIT_DATA.PROJECT && Blockey.INIT_DATA.PROJECT.model.isCreatorFollower);
    }
    
    isProjectLover () {
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
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    }

    openUrl (args, util) {
        if (this.isValidUrl(args.URL)) {
            window.open(args.URL);
        }
        else {
            alert("该指令块只能用于打开魔抓社区的页面");
        }
    }

    redirectUrl (args, util) {        
        if (this.isValidUrl(args.URL)) {
            window.location = args.URL;
        }
        else {
            alert("该指令块只能用于打开魔抓社区的页面");
        }
    }
    
    pay (args, util) {
        var self=this;
        self._error = "";
        return new Promise(resolve => {
            var template = _.template('你确定要支付<strong><%=amount%></strong>金币购买<strong><%=remark%></strong>吗？' + ((new Date().getTime() - self.lastPayTime < 2000) ? '<div><smaller>如果重复看到此提示，请给<a href="/User?id=1">守护者</a>留言举报。</smaller></div>' : ''));
            Blockey.Dialog.confirm("作品内购支付确认", template({ amount: args.AMOUNT, remark: args.ITEM }), function (e) {
                if (e) {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        data: { id: Blockey.INIT_DATA.PROJECT.model.id, amount: args.AMOUNT, remark: args.ITEM },
                        url: "/MProjectApi/Pay",
                    }).done(function (e) {
                        if (!e.status) self._error = e.message;
                    }).error(function (e) {
                        self._error = "未知错误";
                        Blockey.AlertView.msg($("#alert-view"), { alert: "error", msg: e.statusText })
                    }).always(function (e) {
                        setTimeout(function () {
                            resolve();
                        }, 500);
                    });
                }
                else {
                    self._error = "取消";
                    setTimeout(function () {
                        resolve();
                    }, 500);
                }
                self.lastPayTime = new Date().getTime();
            });
        });
    }

    getError (args, util) {
        return this._error;
    }

}

module.exports = Scratch3CommunityBlocks;
