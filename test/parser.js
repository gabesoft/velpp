'use strict';

var expect = require('chai').expect
  , fs     = require('fs')
  , path   = require('path')
  , Parser = require('../lib/parser').Parser;

describe('Parser', function () {
    var p, d;

    beforeEach(function () {
        d = fs.readFileSync(path.join(__dirname, './data/doc-spec.txt'), 'utf8');
        p = new Parser();
    });

    describe('parse', function () {
        var tokens = null
          , fixtures = [
                [ 'section-double', 1 ]
              , [ 'headline', 1 ]
              , [ 'code', 1 ]
            ];

        function tokensOfType (type) {
            return tokens.filter(function (token) {
                return token.type === type;
            });
        }

        beforeEach(function () {
            tokens = p.parse(d);
        });

        it('returns the correct number of tokens', function () {
            expect(tokens.length).to.equal(99);
        });

        fixtures.forEach(function (fixture) {
            var type  = fixture[0]
              , count = fixture[1];
            it('returns the correct number of tokens of type ' + type, function () {
                expect(tokensOfType(type).length).to.equal(count);
            });
        });
    });
});
