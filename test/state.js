'use strict';

var expect = require('chai').expect
  , rules  = require('../lib/rules')
  , Token  = require('../lib/token').Token
  , State  = require('../lib/state').State;

describe('State', function () {
    describe('hasCodeStart', function () {
        it('returns true if it contains a code-start token', function () {
            var state = new State()
              , token = new Token('text', '		Example: >\n');

            state.tokens.push(token);
            rules.names.forEach(function (rule) {
                rules.applyRule(rule, state);
            });

            expect(state.hasCodeStart()).to.be.true;
        });
    });
});
