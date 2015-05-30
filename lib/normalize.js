'use strict';

var TABS = /[\n\t]/g
  , NL   = /\r[\n\u0085]|[\u2424\u2028\u0085]/g
  , NULL = /\u0000/g;

var chars = require('../chars');

module.exports = function (state) {
    var str, lineStart, lastTabPos;

    str = state.src;
    str = str.replace(NL, '\n');
    str = str.replace(NULL, '\uFFFD');

    if (str.indexOf('\t') >= 0) {
        lineStart = 0;
        lastTabPos = 0;

        str = str.replace(TABS, function (match, offset) {
            var result = '';

            if (str.charCodeAt(offset) === chars.LINE_FEED) {
                lineStart = offset + 1;
                lastTabPos = 0;
                result = match;
            } else {
                result = '    '.slice((offset - lineStart - lastTabPos) % 4);
                lastTabPos = offset - lineStart + 1;
            }

            return result;
        });
    }

    state.src = str;
};
