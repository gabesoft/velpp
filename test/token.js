'use strict';

var expect = require('chai').expect
  , fs     = require('fs')
  , path   = require('path')
  , Token  = require('../lib/token').Token;

describe('Token', function () {
    var d, t;

    beforeEach(function () {
        d = fs.readFileSync(path.join(__dirname, './data/doc8.txt'), 'utf8');
        t = new Token(d);
        t.markLines();
    });

    it('marks lines info', function () {
        expect(t.lnCount).to.equal(13);
        expect(t.lnBegin).to.eql([0, 13, 14, 32, 63, 93, 125, 158, 202, 238, 261, 287, 322, 323])
        expect(t.lnEnd).to.eql([12, 13, 31, 62, 92, 124, 157, 201, 237, 260, 286, 321, 322, 323])
        expect(t.lnIndent).to.eql([0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 323]);
    });

    it('gets specific lines', function () {
        var lines = t.getLines(4, 7);

        expect(lines).to.equal([
            '  - Completion string ranking'
          , '  - General semantic completion'
          , '  - C-family semantic completion'
        ].join('\n'));
    });
});
