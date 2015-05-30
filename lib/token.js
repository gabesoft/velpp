'use strict';

function Token (content, tag, attr) {
    this.tag     = tag || '';
    this.attr    = attr || [];
    this.content = content;
}

module.exports.Token = Token;
