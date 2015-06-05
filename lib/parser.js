'use strict';

var normalize = require('./normalize')
  , rules     = require('./parse_rules')
  , linkify   = require('./linkify')
  , Token     = require('./token').Token
  , Text      = require('./text').Text
  , State     = require('./state').State;

/**
 * Vim help text parser
 */
function Parser () {

}

/**
 * Parses an input string and returns a list of tokens
 *
 * @param {String} input - an input string
 * @return {Array<Token>} a list of tokens
 */
Parser.prototype.parse = function (input) {
    var tokens = []
      , ln     = 0
      , count  = 0
      , text   = null
      , state  = null
      , apply  = function (rule) {
            rules.applyRule(rule, state);
        };

    input = normalize(input, false);
    text  = new Text(input);
    count = text.lnCount;

    for (ln = 0; ln < count; ln++) {
        var line = text.getLines(ln, ln + 1, true)
          , end  = 0;

        state = new State();
        state.pushToken('text', line);
        rules.names.forEach(apply);
        tokens = tokens.concat(state.tokens);

        if (state.hasCodeStart()) {
            end = text.nextLineWithIndent(ln, 0);
            tokens.push(new Token('code', text.getLines(ln + 1, end, true)));
            ln = end - 1;
        }
    }

    return linkify(tokens);
};

module.exports.Parser = Parser;
