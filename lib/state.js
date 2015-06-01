'use strict';

var Token = require('./token').Token;

function State () {
    this.tokens = [];
}

State.prototype.pushToken = function (type, content) {
    this.tokens.push(new Token(type, content));
};

State.prototype.clearTokens = function () {
    this.tokens = [];
};

module.exports.State = State;
