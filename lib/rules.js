'use strict';

var chars    = require('./chars')
  , Token    = require('./token').Token
  , rules    = {
        'headline'    : { fn : headline, re : /^([-A-Za-z .][-A-Za-z0-9 .()]*[ \t]+)\*/ }
      , 'header'      : { fn : header, re : /^(.*)~$/ }
      , 'vim-option'  : { fn : vimOption, re : /(('[a-z][a-z]+')|(t_..))/ }
      , 'tag-name'    : { fn : tagName, re : /\*([^*"|]+)\*/ }
      , 'tag-link'    : { fn : tagLink, re : /\|([^"*|]+)\|/ }
      , 'code-start'  : { fn : null, re : />[\r\n]?$/ }
      , 'special'     : { fn : special, re : /({[-a-zA-Z0-9'"*+/:%#=[\]<>., ]+})/ }
      , 'special-key' : { fn : specialKey, re : /(CTRL-Break|CTRL-PageUp|CTRL-PageDown|CTRL-Insert|CTRL-Del|CTRL-.|(<[-a-zA-Z0-9_]+>))/ }
    };

function getPattern (name) { return rules[name].re; }
function getRule (name) { return rules[name].fn; }

// TODO: replace most rules with
//       matchWhole and matchCapture

function specialKey (match, input) {
    return {
        type   : 'special-key'
      , output : match[0]
      , rest   : input.substr(match.index + match[0].length)
    };
}

function vimOption (match, input) {
    return {
        type   : 'vim-option'
      , output : match[0]
      , rest   : input.substr(match.index + match[0].length)
    };
}

function special (match, input) {
    return {
        type   : 'special'
      , output : match[0]
      , rest   : input.substr(match.index + match[0].length)
    };
}

function headline (match, input) {
    return {
        type   : 'headline'
      , output : match[1]
      , rest   : input.substr(match[1].length)
    };
}

function header (match, input) {
    return {
        type   : 'header'
      , output : match[1]
      , rest   : input.substr(match[0].length)
    };
}

function tagName (match, input) {
    return {
        type   : 'tag-name'
      , output : match[1]
      , rest   : input.substr(match.index + match[0].length)
    };
}

function tagLink (match, input) {
    return {
        type   : 'tag-link'
      , output : match[1]
      , rest   : input.substr(match.index + match[0].length)
    };
}

function applyRule (ruleName, state) {
    var tokens = []
      , pat    = getPattern(ruleName);

    state.tokens.forEach(function (token) {
        if (token.isText() && pat.test(token.content)) {
            tokens = tokens.concat(matchRule(ruleName, token.content));
        } else {
            tokens.push(token);
        }
    });

    state.tokens = tokens;
}

function matchRule (ruleName, input) {
    var match  = null
      , pat    = getPattern(ruleName)
      , rule   = getRule(ruleName)
      , result = null
      , tokens = [];

    if (input && pat.test(input)) {
        match = input.match(pat);
        if (match.index > 0) {
            tokens.push(new Token('text', input.slice(0, match.index)));
        }

        result = rule(match, input);
        tokens.push(new Token(result.type, result.output));
        tokens = tokens.concat(matchRule(ruleName, result.rest));
    } else if (input) {
        tokens.push(new Token('text', input));
    }

    return tokens;
}

function isCodeStart (input) {
    return input && getPattern('code-start').test(input);
}

function isCodeEnd (input) {
    var ch = (input || '').charCodeAt(0);
    return ch !== chars.SPACE && ch !== chars.H_TAB;
}

module.exports = {
    applyRule   : applyRule
  , isCodeStart : isCodeStart
  , isCodeEnd   : isCodeEnd
};
