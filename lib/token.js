'use strict';

function Token (type, content, attr) {
    this.type    = type;
    this.content = content || '';
    this.attr    = attr || [];
}

Token.prototype.isText = function () {
    return this.type === 'text';
};

module.exports.Token = Token;
