'use strict';

// TODO: determine the option path (based on its help file)
var OPTIONS_URL = 'http://vimdoc.sourceforge.net/htmldoc/options.html'
  , escapeHtml  = require('./util').escapeHtml
  , rules       = {
        'code'       : code
      , 'url'        : url
      , 'text'       : text
      , 'vim-option' : vimOption
      , 'tag-name'   : tagName
      , 'tag-link'   : tagLink
    };

function attr (attrs) {
    var result = '';

    attrs.forEach(function (a) {
        var name = a[0], value = a[1];
        result = result + ' ' + escapeHtml(name) + '="' + escapeHtml(value) + '"';
    });

    return result;
}

function htag (name, attrs, content, escaped) {
    var open  = '<' + name + attr(attrs) + '>'
      , close = '</' + name + '>'
      , text  = escaped ? content : escapeHtml(content);
    return  open + text + close;
}

function code (token, options) {
    var content = token.content
      , attr    = token.attr;

    if (options.highlight) {
        content = options.highlight(content) || escapeHtml(content);
    } else {
        content = escapeHtml(content);
    }

    return htag('code', attr, content, true);
}

function tagName (token) {
    token.pushAttr('name', token.content);
    return htag('a', token.attr, token.content);
}

function tagLink (token) {
    token.pushAttr('href', '#' + token.content);
    return htag('a', token.attr, token.content);
}

function text (token) {
    return escapeHtml(token.content);
}

function url (token) {
    return htag('a', token.attr, token.content);
}

function vimOption (token) {
    token.pushAttr('href', OPTIONS_URL + '#' + token.content);
    return htag('a', token.attr, token.content);
}

function span (token) {
    return htag('span', token.attr, token.content);
}

module.exports.render = function (token, options) {
    return (rules[token.type] || span)(token, options);
};

module.exports.htag = htag;
