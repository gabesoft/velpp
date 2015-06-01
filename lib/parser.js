'use strict';

var linkifyIt = require('linkify-it')
  , normalize = require('./normalize')
    // TODO: rename Token
  , Token     = require('./token').Token
  , util      = require('./util');

function toLines (text) {
    return (text || '').split(/\r?\n/g);
}

function Parser (options) {
    this.options = util.merge({}, {
        rootClass     : 'vim-help'
      , headlineClass : 'headline'
      , headerClass   : 'header'
      , tagNameClass  : 'tag-name'
      , tagLinkClass  : 'tag-link'
      , specialText   : 'special-text'
      , specialKey    : 'special-key'
      , codeExample   : 'code-example'
      , sectionSingle : 'section-single'
      , sectionDouble : 'section-double'
      , vimVersion    : 'vim-version'
      , note          : 'note'
      , error         : 'error'
      , todo          : 'todo'
    }, options);
}

Parser.prototype.parse = function (input) {
    var output = []
      , ln     = 0
      , len    = 0
      , rules  = [] // TODO: define
      , token  = null;

    input = normalize(input);
    token = new Token(input);

    token.markLines();
    len = token.lnCount;

    for (ln = 0; ln < len; ln++) {
        var line = token.getLines(ln, ln + 1)
          , end  = 0
          , out  = line;

        if (line) {
            rules.forEach(function (rule) {
                out = rule(out);
            });

            output.push(out);

            if (isCodeStart(line)) {
                end = token.findNextLineWithIndent(0);
                output.push('<code>');
                output.push(token.getLines(ln + 1, end));
                output.push('</code>');
                ln = end;
            }
        }
    }
};
