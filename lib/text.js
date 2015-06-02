'use strict';

var chars = require('./chars');

function Text (input) {
    this.content = input || '';
    this._markLines();
}

/**
 * Marks the position of each line and their indentation
 * @private
 */
Text.prototype._markLines = function () {
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
Text.prototype.getLines = function (begin, end, keepLastLF) {
    if (begin >= end) { return ''; }

    var first = this.lnBegin[begin]
      , last  = this.lnEnd[end - 1] + (keepLastLF ? 1 : 0);

    return this.content.slice(first, last);
};

/**
 * Returns the next line that has the specified indent if any
 *
 * @param {Number} start - the start line
 * @param {Number} indent - the indent value
 * @return {Number} a line number
 */
Text.prototype.nextLineWithIndent = function (start, indent) {
    start++;
    while (start < this.lnCount) {
        if (this.lnIndent[start] === indent && !this.isEmptyLine(start)) {
            return start;
        } else {
            start++;
        }
    }

    return this.lnCount;
};

/**
 * Returns true if the specified line is empty
 *
 * @param {Number} line - the line number
 */
Text.prototype.isEmptyLine = function (line) {
    return this.lnBegin[line] + this.lnIndent[line] === this.lnEnd[line];
};

module.exports.Text = Text;
