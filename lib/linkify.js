'use strict';

var PROTOCOLS    = [ 'http:', 'https:', 'mailto:' ]
  , BAD_PROTO_RE = /^(vbscript|javascript|file|data):/
  , GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/
  , linkifyIt    = new require('linkify-it')()
  , Token        = require('./token').Token
  , mdurl        = require('mdurl')
  , punycode     = require('punycode');

function normalizeLink(url) {
    var parsed = mdurl.parse(url, true);

    if (parsed.hostname) {
        if (!parsed.protocol || PROTOCOLS.indexOf(parsed.protocol) >= 0) {
            try {
                parsed.hostname = punycode.toASCII(parsed.hostname);
            } catch(er) {}
        }
    }

    return mdurl.encode(mdurl.format(parsed));
}

function normalizeLinkText(url) {
    var parsed = mdurl.parse(url, true);

    if (parsed.hostname) {
        if (!parsed.protocol || PROTOCOLS.indexOf(parsed.protocol) >= 0) {
            try {
                parsed.hostname = punycode.toUnicode(parsed.hostname);
            } catch(er) {}
        }
    }

    return mdurl.decode(mdurl.format(parsed));
}

function validateLink(url) {
    var str = url.trim().toLowerCase();
    return BAD_PROTO_RE.test(str) ? (GOOD_DATA_RE.test(str) ? true : false) : true;
}

function linkify (token) {
    if (token.type !== 'text') { return [ token ]; }
    if (!linkifyIt.test(token.content)) { return [ token ]; }

    var input  = token.content
      , links  = linkifyIt.match(input)
      , pos    = 0
      , tokens = [];

    links.forEach(function (link) {
        var url  = normalizeLink(link.url)
          , text = null;

        if (!validateLink(url)) { return; }

        text = link.text;

        if (!link.schema) {
            text = normalizeLinkText('http://' + text).replace(/^http:\/\//, '');
        } else if (link.schema === 'mailto:' && !/^mailto:/i.test(text)) {
            text = normalizeLinkText('mailto:' + text).replace(/^mailto:/, '');
        } else {
            text = normalizeLinkText(text);
        }

        if (link.index > pos) {
            tokens.push(new Token('text', input.slice(pos, link.index)));
        }

        tokens.push(new Token('url', text, [ ['href', url ] ]));
        pos = link.lastIndex;
    });

    if (pos < input.length) {
        tokens.push(new Token('text', input.slice(pos)));
    }

    return tokens.length > 0 ? tokens : [ token ];
}

module.exports = function linkifyAll (tokens) {
    var out = [];

    tokens.forEach(function (token) {
        out = out.concat(linkify(token));
    });

    return out;
};
