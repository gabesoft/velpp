'use strict';

var Parser   = require('./parser').Parser
  , Renderer = require('./renderer').Renderer;

/**
 * Main parser/renderer class
 * @class Velpp
 *
 * @param {Object} options
 */
function Velpp (options) {
    if (!(this instanceof Velpp)) {
        return new Velpp(options);
    }

    options = options || {};

    this.parser   = new Parser(options);
    this.renderer = new Renderer(options);
}

/**
 * Parses the input string and returns an array of tokens
 *
 * @param {String} src - the source string
 * @return {Array<Token>} an array of tokens
 */
Velpp.prototype.parse = function (src) {
    return this.parser.parse(src);
};

/**
 * Renders a vim help file into html
 *
 * @param {String} src - the source string
 * @return {String} the html
 */
Velpp.prototype.render = function (src) {
    return this.renderer.render(this.parse(src));
};

module.exports.Velpp = Velpp;
