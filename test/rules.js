'use strict';

var expect = require('chai').expect
  , util   = require('util')
  , State  = require('../lib/state').State
  , rules  = require('../lib/rules');

var fixtures = {
        'headline' : [ {
            content  : 'INTRODUCTION                                    *abolish* *:Abolish* *:Subvert*'
          , nonMatch : 'Not a headline'
          , results  : [ [ 'INTRODUCTION                                    ' ], [ 'text',  '*abolish* *:Abolish* *:Subvert*' ] ]
        } , {
            content  : '3. Writing help files					*help-writing*'
          , nonMatch : 'Not a headline'
          , results  : [ [ '3. Writing help files					' ], [ 'text', '*help-writing*' ] ]
        } ]
        , 'todo-line' : {
              content  : '	*Todo	something to do'
            , nonMatch : 'Not a headline'
            , results  : [ [ '	*Todo	something to do' ] ]
          }
        , 'header' : {
              content  : 'Values: A string of characters separated by spaces.                          ~\n'
            , nonMatch : 'Not a header'
            , results  : [ [ 'Values: A string of characters separated by spaces.                          ' ], [ 'text', '\n' ] ]
          }
        , 'vim-option' : {
              content  : "and 'tabstop' options and the 'filetype' to 'help'.  Never set a global option"
            , nonMatch : 'Not an option'
            , results  : [ ['text', 'and ' ], [ "'tabstop'" ], [ 'text', ' options and the ' ], [ "'filetype'" ], [ 'text', ' to ' ], [ "'help'" ], [ 'text', '.  Never set a global option' ] ]
          }
        , 'tag-name' : {
              content  : '*:helpfind* (*abc*) *:helpf* **note**'
            , nonMatch : 'Not a tag name'
            , results  : [ [ ':helpfind' ], [ 'text', ' (*abc*) ' ], [ ':helpf' ], [ 'text', ' **note**' ] ]
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
        , 'code-start' : {
              content  : '		Example: >\n'
            , nonMatch : 'Not code start'
            , results  : [ [ 'text', '		Example: ' ], [ '' ], [ 'text', '\n' ] ]
          }
    };


describe('rules', function () {
    var state = null;

    beforeEach(function () {
        state = new State();
    });

    function describeRule (rule, ruleData) {
        var match = false;

        describe(rule, function () {
            describe('when the rule matches', function () {
                beforeEach(function () {
                    state.pushToken('text', ruleData.content);
                    match = rules.applyRule(rule, state);
                });

                it('returns true', function () {
                    expect(match).to.be.true;
                });

                it('adds the correct number of tokens', function () {
                    expect(state.tokens.length).to.equal(ruleData.results.length);
                });

                ruleData.results.forEach(function (result, index) {
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
                beforeEach(function () {
                    state.pushToken('text', ruleData.nonMatch);
                    match = rules.applyRule(rule, state);
                });

                it('returns false', function () {
                    expect(match).to.be.false;
                });

                it('does not change the state', function () {
                    expect(state.tokens.length).to.equal(1);
                    expect(state.tokens[0].type).to.equal('text');
                    expect(state.tokens[0].content).to.equal(ruleData.nonMatch);
                });
            });
        });

    }

    Object.keys(fixtures).forEach(function (rule) {
        var ruleData = util.isArray(fixtures[rule]) ? fixtures[rule] : [fixtures[rule]];

        ruleData.forEach(function (data) {
            describeRule(rule, data);
        });
    });
});
