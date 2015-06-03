'use strict';

var chars = require('./chars')
  , Token = require('./token').Token
  , rules = {
        'todo-line'      : { fn : todoLine, re : /\t[* ]Todo\t+[a-z].*/ }
      , 'error-line'     : { fn : errorLine, re : /\t[* ]Error\t+[a-z].*/ }
      , 'headline'       : { fn : headline, re : /^([-A-Za-z0-9 .][-A-Za-z0-9 .()]*[ \t]+)\*/ }
      , 'header'         : { fn : header, re : /^((.*)~)[\r\n]?$/ }
      , 'tag-name'       : { fn : tagName, re : /(\*([#-)!+-~]+)\*)(\s|$)/ }
      , 'tag-link'       : { fn : tagLink, re : /\|([^"*|]+)\|/ }
      , 'vim-option'     : { fn : vimOption, re : /(('[a-z][a-z]+')|(t_..))/ }
      , 'special'        : { fn : special, re : /({[-a-zA-Z0-9'"*+/:%#=[\]<>., ]+})/ }
      , 'special-key'    : { fn : specialKey, re : /(CTRL-Break|CTRL-PageUp|CTRL-PageDown|CTRL-Insert|CTRL-Del|CTRL-.|(<[-a-zA-Z0-9_]+>))/ }
      , 'code-start'     : { fn : codeStart, re : /(>)[\r\n]?$/ }
      , 'section-double' : { fn : sectionDouble, re : /^(=+)[\r\n]?$/ }
      , 'section-single' : { fn : sectionSingle, re : /^(-+)[\r\n]?$/ }
    };

function getPattern (name) { return rules[name].re; }
function getRule (name) { return rules[name].fn; }

function ruleResult (match, input, type, outputIndex, restIndex) {
    return {
        type   : type
      , output : (outputIndex || 0 >= 0) ? match[outputIndex || 0] : ''
      , rest   : input.substr(match.index + match[restIndex || 0].length)
    };
}

function todoLine (match, input) {
    return ruleResult(match, input, 'todo-line', 0, 0);
}

function errorLine (match, input) {
    return ruleResult(match, input, 'error-line', 0, 0);
}

function tagName (match, input) {
    return ruleResult(match, input, 'tag-name', 2, 1);
}

function tagLink (match, input) {
    return ruleResult(match, input, 'tag-link', 1, 0);
}

function sectionSingle (match, input) {
    return ruleResult(match, input, 'section-single', 1, 1);
}

function sectionDouble (match, input) {
    return ruleResult(match, input, 'section-double', 1, 1);
}

function codeStart (match, input) {
    return ruleResult(match, input, 'code-start', -1, 1);
}

function specialKey (match, input) {
    return ruleResult(match, input, 'special-key');
}

function vimOption (match, input) {
    return ruleResult(match, input, 'vim-option');
}

function special (match, input) {
    return ruleResult(match, input, 'special');
}

function headline (match, input) {
    return ruleResult(match, input, 'headline', 1, 1);
}

function header (match, input) {
    return ruleResult(match, input, 'header', 2, 1);
}

function applyRule (ruleName, state) {
    var tokens  = []
      , matched = false
      , pat     = getPattern(ruleName);

    state.tokens.forEach(function (token) {
        if (token.isText() && pat.test(token.content)) {
            tokens = tokens.concat(matchRule(ruleName, token.content));
            matched = true;
        } else {
            tokens.push(token);
        }
    });

    state.tokens = tokens;
    return matched;
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
  , names       : Object.keys(rules)
  , isCodeStart : isCodeStart
  , isCodeEnd   : isCodeEnd
};
