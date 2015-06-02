'use strict';

var expect = require('chai').expect
  , fs     = require('fs')
  , path   = require('path')
  , Text   = require('../lib/text').Text;

describe('Text', function () {
    var d, t;

    beforeEach(function () {
        d = fs.readFileSync(path.join(__dirname, './data/doc8.txt'), 'utf8');
        t = new Text(d);
    });

    describe('_markLines', function () {
        it('returns the correct number of lines', function () {
            expect(t.lnCount).to.equal(14);
        });

        it('marks the begin position of each line', function () {
            expect(t.lnBegin).to.eql([0, 13, 14, 32, 63, 93, 125, 158, 202, 238, 261, 287, 322, 323, 333])
        });

        it('marks the end position of each line', function () {
            expect(t.lnEnd).to.eql([12, 13, 31, 62, 92, 124, 157, 201, 237, 260, 286, 321, 322, 332, 333])
        });

        it('marks the indent of each line', function () {
            expect(t.lnIndent).to.eql([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 333]);
        });
    });

    describe('getLines', function () {
        it('gets specific lines', function () {
            var lines = t.getLines(4, 7);

            expect(lines).to.equal([
                '  - Completion string ranking'
              , '  - General semantic completion'
              , '  - C-family semantic completion'
            ].join('\n'));
        });

        it('gets one line', function () {
            expect(t.getLines(0, 1)).to.equal('- User Guide');
        });

        it('gets the last line', function () {
            expect(t.getLines(t.lnCount - 1, t.lnCount)).to.equal('Last line');
        });
    });
});
