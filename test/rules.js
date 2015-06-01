'use strict';

var expect = require('chai').expect
  , fs     = require('fs')
  , path   = require('path')
  , State  = require('../lib/state').State
  , Token  = require('../lib/token').Token
  , rules  = require('../lib/rules');

var fixtures = {
        'headline' : {
            content  : 'INTRODUCTION                                    *abolish* *:Abolish* *:Subvert*'
          , nonMatch : 'Not a headline'
          , results : [ [ 'INTRODUCTION                                    ' ], [ 'text',  '*abolish* *:Abolish* *:Subvert*' ] ]
        }
      , 'header' : {
            content  : 'Values: A string of characters separated by spaces.                          ~'
          , nonMatch : 'Not a header'
          , results  : [ [ 'Values: A string of characters separated by spaces.                          ' ] ]
        }
      , 'vim-option' : {
            content  : "and 'tabstop' options and the 'filetype' to 'help'.  Never set a global option"
          , nonMatch : 'Not an option'
          , results  : [ ['text', 'and ' ], [ "'tabstop'" ], [ 'text', ' options and the ' ], [ "'filetype'" ], [ 'text', ' to ' ], [ "'help'" ], [ 'text', '.  Never set a global option' ] ]
        }
      , 'tag-name' : {
            content  : '*:helpfind* *:helpf*'
          , nonMatch : 'Not a tag name'
          , results  : [ [ ':helpfind' ], [ 'text', ' ' ], [ ':helpf' ] ]
        }
      , 'tag-link' : {
            content  : '			|quickfix| commands, e.g., |:cnext| to jump to the'
          , nonMatch : 'Not a tag link'
          , results  : [ [ 'text', '			' ], [ 'quickfix'], [ 'text', ' commands, e.g., ' ], [ ':cnext' ], [ 'text', ' to jump to the' ] ]
        }
      , 'special-key' : {
            content  : '			CTRL-V first to insert the <LF> or <CR> {not in vi}. Example: >'
          , nonMatch : 'Not special'
          , results  : [ [ 'text', '			' ], [ 'CTRL-V' ], [ 'text', ' first to insert the ' ], [ '<LF>' ], [ 'text', ' or ' ], [ '<CR>' ], [ 'text', ' {not in vi}. Example: >' ] ]
        }
      , 'special' : {
            content  : '			CTRL-V first to insert the <LF> or <CR> {not in vi}. Example: >'
          , nonMatch : 'Not special'
          , results  : [ [ 'text', '			CTRL-V first to insert the <LF> or <CR> ' ], [ '{not in vi}' ], [ 'text', '. Example: >' ] ]
        }
    };


describe('rules', function () {
    var state = null;

    beforeEach(function () {
        state = new State();
    });

    Object.keys(fixtures).forEach(function (rule) {
        describe(rule, function () {
            describe('when the rule matches', function () {
                beforeEach(function () {
                    state.pushToken('text', fixtures[rule].content);
                    rules.applyRule(rule, state);
                });

                it('adds the correct number of tokens', function () {
                    expect(state.tokens.length).to.equal(fixtures[rule].results.length);
                });

                fixtures[rule].results.forEach(function (result, index) {
                    var type    = result.length === 1 ? rule : result[0]
                      , content = result.length === 1 ? result[0] : result[1];

                    it('adds the correct token type at position ' + index, function () {
                        expect(state.tokens[index].type).to.equal(type);
                    });

                    it('adds the correct token content at position ' + index, function () {
                        expect(state.tokens[index].content).to.equal(content);
                    });
                });
            });

            describe('when the rule does not match', function () {
                it('does not change the state', function () {
                    state.pushToken('text', fixtures[rule].nonMatch);
                    rules.applyRule(rule, state);
                    expect(state.tokens.length).to.equal(1);
                    expect(state.tokens[0].type).to.equal('text');
                    expect(state.tokens[0].content).to.equal(fixtures[rule].nonMatch);
                });
            });
        });
    });
});
