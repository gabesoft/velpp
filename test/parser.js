'use strict';

var expect = require('chai').expect
  , fs     = require('fs')
  , path   = require('path')
  , eyes   = require('eyes')
  , Parser = require('../lib/parser').Parser;

describe('Parser', function () {
    var p, d;

    beforeEach(function () {
        d = fs.readFileSync(path.join(__dirname, './data/doc1.txt'), 'utf8');
        p = new Parser();
    });

    describe('parse', function () {
        it('returns a list of tokens', function () {
            var tokens = p.parse(d);
            tokens.forEach(function (token) {
                eyes.inspect(token);
            });
        });
    });
});
