'use strict';

function Token (type, content, attr) {
    this.type    = type;
    this.content = content || '';
    this.attr    = attr || [];
}

Token.prototype.isText = function () {
    return this.type === 'text';
};

Token.prototype.pushAttr = function (name, value) {
    this.attr.push([ name, value ]);
};

module.exports.Token = Token;
