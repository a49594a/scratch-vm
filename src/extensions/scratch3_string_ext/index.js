const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDEyOCAxMjgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEyOCAxMjg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwNy4xLDU2LjVoLTYuOVYzNy44YzAtNS00LjQtOS40LTkuNC05LjRINzIuMXYtNy41QzcxLjUsMTQsNjUuOSw5LDU5LjYsOWMtNi45LDAtMTEuOSw1LTExLjksMTEuOXY2LjlIMjkKCWMtNS42LDAtMTAsNC40LTEwLDEwdjE4LjFoNi45QzMyLjgsNTUuOSwzOSw2MS41LDM5LDY5YzAsNi45LTUuNiwxMy4xLTEzLjEsMTMuMUgxOXYxOC4xYzAsNC40LDQuNCw4LjgsOS40LDguOGgxOC4xdi02LjkKCWMwLTYuOSw1LjYtMTMuMSwxMy4xLTEzLjFjNi45LDAsMTMuMSw1LjYsMTMuMSwxMy4xdjYuOWgxOC4xYzUsMCw5LjQtNC40LDkuNC05LjRWODAuOWg2LjljNi45LDAsMTEuOS01LDExLjktMTEuOQoJQzExOSw2MS41LDExNCw1Ni41LDEwNy4xLDU2LjV6IE02NS43LDgyLjNoLTUuNWMtMTAuMiwwLTE0LjctNS4yLTE1LjEtNS43bDYuOC02LjZjMC4xLDAuMSwyLjQsMi42LDguMywyLjZoMS4zCgljMywwLDYuMi0wLjQsNi4yLTIuMWMwLTEuOS01LjItMi44LTcuNy0zLjFjLTMuMS0wLjQtNi4zLTAuOS05LjEtMi4yYy0xLjgtMC45LTMuMy0yLjEtNC4zLTMuNmMtMS4yLTEuNy0xLjgtMy43LTEuOC01LjkKCWMwLTcuMiw3LjMtMTEuOSwxNy45LTExLjloMS44YzYuMiwwLDExLjMsMi41LDE1LjQsNy4ybC02LjcsNi41Yy0yLjItMi43LTQuOS0zLjktOC41LTMuOWgtMC40Yy0xLjksMC02LjItMC40LTYuMiwyLjEKCWMwLDEuOCw0LjksMi42LDcuNCwyLjljMy4xLDAuNCw2LjUsMSw5LjIsMi4yYzEuOCwwLjksMy4zLDIuMSw0LjQsMy43YzEuMSwxLjcsMS44LDMuOCwxLjgsNi4xQzgwLjksODAuNSw2OS42LDgyLjMsNjUuNyw4Mi4zeiIvPgo8L3N2Zz4=';
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLlm77lsYJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDEyOCAxMjgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEyOCAxMjg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojMTI5NmRiO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTEwNy4xLDU2LjVoLTYuOVYzNy44YzAtNS00LjQtOS40LTkuNC05LjRINzIuMXYtNy41QzcxLjUsMTQsNjUuOSw5LDU5LjYsOWMtNi45LDAtMTEuOSw1LTExLjksMTEuOXY2LjlIMjkKCWMtNS42LDAtMTAsNC40LTEwLDEwdjE4LjFoNi45QzMyLjgsNTUuOSwzOSw2MS41LDM5LDY5YzAsNi45LTUuNiwxMy4xLTEzLjEsMTMuMUgxOXYxOC4xYzAsNC40LDQuNCw4LjgsOS40LDguOGgxOC4xdi02LjkKCWMwLTYuOSw1LjYtMTMuMSwxMy4xLTEzLjFjNi45LDAsMTMuMSw1LjYsMTMuMSwxMy4xdjYuOWgxOC4xYzUsMCw5LjQtNC40LDkuNC05LjRWODAuOWg2LjljNi45LDAsMTEuOS01LDExLjktMTEuOQoJQzExOSw2MS41LDExNCw1Ni41LDEwNy4xLDU2LjV6IE02NS43LDgyLjNoLTUuNWMtMTAuMiwwLTE0LjctNS4yLTE1LjEtNS43bDYuOC02LjZjMC4xLDAuMSwyLjQsMi42LDguMywyLjZoMS4zCgljMywwLDYuMi0wLjQsNi4yLTIuMWMwLTEuOS01LjItMi44LTcuNy0zLjFjLTMuMS0wLjQtNi4zLTAuOS05LjEtMi4yYy0xLjgtMC45LTMuMy0yLjEtNC4zLTMuNmMtMS4yLTEuNy0xLjgtMy43LTEuOC01LjkKCWMwLTcuMiw3LjMtMTEuOSwxNy45LTExLjloMS44YzYuMiwwLDExLjMsMi41LDE1LjQsNy4ybC02LjcsNi41Yy0yLjItMi43LTQuOS0zLjktOC41LTMuOWgtMC40Yy0xLjksMC02LjItMC40LTYuMiwyLjEKCWMwLDEuOCw0LjksMi42LDcuNCwyLjljMy4xLDAuNCw2LjUsMSw5LjIsMi4yYzEuOCwwLjksMy4zLDIuMSw0LjQsMy43YzEuMSwxLjcsMS44LDMuOCwxLjgsNi4xQzgwLjksODAuNSw2OS42LDgyLjMsNjUuNyw4Mi4zeiIvPgo8L3N2Zz4=';

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3StringExtBlocks {
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
            id: 'stringExt',
            name: 'String Extension',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [{
                    opcode: 'charCodeAt',
                    blockType: BlockType.REPORTER,
                    text: '[STRING]的第[INDEX]个字符的编码',
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello'
                        },
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'fromCharCode',
                    blockType: BlockType.REPORTER,
                    text: '编码[CODE]对应的字符',
                    arguments: {
                        CODE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 97
                        }
                    }
                }
            ]
        };
    }

    charCodeAt(args, util) {
        var str = args.STRING;
        var idx = args.INDEX;
        if (idx < 1 || idx > str.length) return NaN;
        return str.charCodeAt(idx - 1);
    };

    fromCharCode(args, util) {
        var code = args.CODE;
        return String.fromCharCode(code);
    };

}

module.exports = Scratch3StringExtBlocks;
