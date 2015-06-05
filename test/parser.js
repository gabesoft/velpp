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
              , [ 'headline', 0 ]
              , [ 'code', 1 ]
              , [ 'tag-name', 2 ]
              , [ 'tag-link', 1 ]
              , [ 'vim-option', 5 ]
              , [ 'vim-version', 1 ]
              , [ 'header', 1 ]
              , [ 'special-key', 2 ]
              , [ 'special', 3 ]
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
            expect(tokens.length).to.equal(103);
        });

        fixtures.forEach(function (fixture) {
            var type  = fixture[0]
              , count = fixture[1];
            it('returns the correct number of tokens of type ' + type, function () {
                expect(tokensOfType(type).length).to.equal(count);
            });
        });

        it('parses successive code block regions', function () {
            var text = [
                    '3.4 UPDATING PLUGINS ~'
                  , '                   *vundle-plugins-update* *:PluginUpdate* *:PluginInstall!*'
                  , '>'
                  , '  :PluginInstall!   " NOTE: bang(!)'
                  , 'or >'
                  , '  :PluginUpdate'
                  , ''
                  , 'Installs or updates the configured plugins. Press \'u\' after updates complete'
                  , 'to see the change log of all updated bundles. Press \'l\' (lowercase \'L\') to'
                ].join('\n');

            tokens = p.parse(text);
            expect(tokensOfType('code').length).to.equal(2);
        });
    });
});
