'use strict';

var chars = require('./chars');

function Token (content, tag, attr) {
    this.attr    = attr || [];
    this.tag     = tag || '';
    this.content = content || '';
}

Token.prototype.markLines = function () {
    this.lnBegin  = [];     // line begin offsets
    this.lnEnd    = [];     // line end offsets
    this.lnIndent = [];     // indent per line

    var start       = 0
      , pos         = 0
      , indent      = 0
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

Token.prototype.getLines = function (begin, end, indent, keepLastLF) {
    if (begin >= end) { return ''; }

    var i     = 0
      , first = 0
      , last  = 0
      , queue = new Array(end - begin)
      , shift = 0
      , line  = begin;

    indent = Math.max(0, indent || 0);

    for (i = 0; line < end; line++, i++) {
        shift    = Math.min(this.lnIndent[line], indent);
        first    = this.lnBegin[line] + shift;
        last     = this.lnEnd[line] + ((line + 1 < end || keepLastLF) ? 1 : 0);
        queue[i] = this.content.slice(first, last);
    }

    return queue.join('');
};


module.exports.Token = Token;
