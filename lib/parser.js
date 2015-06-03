'use strict';

var normalize = require('./normalize')
  , rules     = require('./rules')
  , linkify   = require('./linkify')
  , Token     = require('./token').Token
  , Text      = require('./text').Text
  , State     = require('./state').State
  , util      = require('./util');

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
    var tokens = []
      , ln     = 0
      , len    = 0
      , text   = null
      , state  = null
      , apply  = function (rule) {
            rules.applyRule(rule, state);
        };

    input = normalize(input, false);
    text  = new Text(input);
    len   = text.lnCount;

    for (ln = 0; ln < len; ln++) {
        var line = text.getLines(ln, ln + 1, true)
          , end  = 0;

        state = new State();
        state.pushToken('text', line);
        rules.names.forEach(apply);
        tokens = tokens.concat(state.tokens);

        // TODO: code blocks don't work
        //       tag names should not match **text**
        if (state.hasCodeStart()) {
            end = text.nextLineWithIndent(ln, 0);
            tokens.push(new Token('code', text.getLines(ln + 1, end, true)));
            ln = end;
        }
    }

    return linkify(tokens);
};

module.exports.Parser = Parser;
