'use strict';

var rules = require('./render_rules');

/**
 * Object used to render a list of tokens
 */
function Renderer (options) {
    this.options = options || {};
}

/**
 * Renders a list of tokens into an html string
 *
 * @param {Array<Token>} tokens
 * @return {String} an html string
 */
Renderer.prototype.render = function (tokens) {
    var output = ''
      , opts   = this.options;

    tokens.forEach(function (token) {
        token.pushAttr('class', opts[token.type] || token.type)
        output += rules.render(token, opts);
    });

    return rules.htag('pre', [ [ 'class',  'vim-help' ] ], output, true);
};

module.exports.Renderer = Renderer;
