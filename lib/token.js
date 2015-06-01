'use strict';

var chars = require('./chars');

function Token (type, content) {
    this.type = type;
    this.content = content || '';
}

Token.prototype.isText = function () {
    return this.type === 'text';
};

Token.prototype.markLines = function () {
    this.lnBegin  = [];     // line begin offsets
    this.lnEnd    = [];     // line end offsets
    this.lnIndent = [];     // indent per line

    var start       = 0
      , pos         = 0
      , ch          = null
      , src         = this.content
      , indent      = 0
      , indentFound = false
      , len         = src.length;

    for(pos = 0; pos < len; pos++) {
        ch = src.charCodeAt(pos);

        if (!indentFound) {
            if (ch === chars.SPACE) {
                indent++;
                continue;
            } else {
                indentFound = true;
            }
        }

        if (ch === chars.LINE_FEED || pos === len - 1) {
            if (ch !== chars.LINE_FEED) {
                pos++;
            }

            this.lnBegin.push(start);
            this.lnEnd.push(pos);
            this.lnIndent.push(indent);

            start       = pos + 1;
            indentFound = false;
            indent      = 0;
        }
    }

    this.lnBegin.push(src.length);
    this.lnEnd.push(src.length);
    this.lnIndent.push(src.length);

    this.lnCount = this.lnBegin.length - 1;
};

/**
 * Returns a block of text starting at the line given by begin
 * and ending before the line given by end.
 *
 * @param {Number} begin - the beginning line
 * @param {Number} end - the line after the end line
 * @param {Boolean} keepLastLF - true to return the last line feed character
 */
Token.prototype.getLines = function (begin, end, keepLastLF) {
    if (begin >= end) { return ''; }

    var first = this.lnBegin[begin]
      , last  = this.lnEnd[end - 1] + (keepLastLF ? 1 : 0);

    return this.content.slice(first, last);
};

module.exports.Token = Token;
