import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import escapeStringRegexp from 'escape-string-regexp';
import 'chalk';

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

// In the absence of a WeakSet or WeakMap implementation, don't break, but don't cache either.
function noop() {
}
function createWeakMap() {
    if (typeof WeakMap !== "undefined") {
        return new WeakMap();
    }
    else {
        return fakeSetOrMap();
    }
}
/**
 * Creates and returns a no-op implementation of a WeakMap / WeakSet that never stores anything.
 */
function fakeSetOrMap() {
    return {
        add: noop,
        delete: noop,
        get: noop,
        set: noop,
        has: function (k) {
            return false;
        },
    };
}
// Safe hasOwnProperty
var hop = Object.prototype.hasOwnProperty;
var has = function (obj, prop) {
    return hop.call(obj, prop);
};
// Copy all own enumerable properties from source to target
function extend(target, source) {
    for (var prop in source) {
        if (has(source, prop)) {
            target[prop] = source[prop];
        }
    }
    return target;
}
var reLeadingNewline = /^[ \t]*(?:\r\n|\r|\n)/;
var reTrailingNewline = /(?:\r\n|\r|\n)[ \t]*$/;
var reStartsWithNewlineOrIsEmpty = /^(?:[\r\n]|$)/;
var reDetectIndentation = /(?:\r\n|\r|\n)([ \t]*)(?:[^ \t\r\n]|$)/;
var reOnlyWhitespaceWithAtLeastOneNewline = /^[ \t]*[\r\n][ \t\r\n]*$/;
function _outdentArray(strings, firstInterpolatedValueSetsIndentationLevel, options) {
    // If first interpolated value is a reference to outdent,
    // determine indentation level from the indentation of the interpolated value.
    var indentationLevel = 0;
    var match = strings[0].match(reDetectIndentation);
    if (match) {
        indentationLevel = match[1].length;
    }
    var reSource = "(\\r\\n|\\r|\\n).{0," + indentationLevel + "}";
    var reMatchIndent = new RegExp(reSource, "g");
    if (firstInterpolatedValueSetsIndentationLevel) {
        strings = strings.slice(1);
    }
    var newline = options.newline, trimLeadingNewline = options.trimLeadingNewline, trimTrailingNewline = options.trimTrailingNewline;
    var normalizeNewlines = typeof newline === "string";
    var l = strings.length;
    var outdentedStrings = strings.map(function (v, i) {
        // Remove leading indentation from all lines
        v = v.replace(reMatchIndent, "$1");
        // Trim a leading newline from the first string
        if (i === 0 && trimLeadingNewline) {
            v = v.replace(reLeadingNewline, "");
        }
        // Trim a trailing newline from the last string
        if (i === l - 1 && trimTrailingNewline) {
            v = v.replace(reTrailingNewline, "");
        }
        // Normalize newlines
        if (normalizeNewlines) {
            v = v.replace(/\r\n|\n|\r/g, function (_) { return newline; });
        }
        return v;
    });
    return outdentedStrings;
}
function concatStringsAndValues(strings, values) {
    var ret = "";
    for (var i = 0, l = strings.length; i < l; i++) {
        ret += strings[i];
        if (i < l - 1) {
            ret += values[i];
        }
    }
    return ret;
}
function isTemplateStringsArray(v) {
    return has(v, "raw") && has(v, "length");
}
/**
 * It is assumed that opts will not change.  If this is a problem, clone your options object and pass the clone to
 * makeInstance
 * @param options
 * @return {outdent}
 */
function createInstance(options) {
    /** Cache of pre-processed template literal arrays */
    var arrayAutoIndentCache = createWeakMap();
    /**
       * Cache of pre-processed template literal arrays, where first interpolated value is a reference to outdent,
       * before interpolated values are injected.
       */
    var arrayFirstInterpSetsIndentCache = createWeakMap();
    function outdent(stringsOrOptions) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        /* tslint:enable:no-shadowed-variable */
        if (isTemplateStringsArray(stringsOrOptions)) {
            var strings = stringsOrOptions;
            // Is first interpolated value a reference to outdent, alone on its own line, without any preceding non-whitespace?
            var firstInterpolatedValueSetsIndentationLevel = (values[0] === outdent || values[0] === defaultOutdent) &&
                reOnlyWhitespaceWithAtLeastOneNewline.test(strings[0]) &&
                reStartsWithNewlineOrIsEmpty.test(strings[1]);
            // Perform outdentation
            var cache = firstInterpolatedValueSetsIndentationLevel
                ? arrayFirstInterpSetsIndentCache
                : arrayAutoIndentCache;
            var renderedArray = cache.get(strings);
            if (!renderedArray) {
                renderedArray = _outdentArray(strings, firstInterpolatedValueSetsIndentationLevel, options);
                cache.set(strings, renderedArray);
            }
            /** If no interpolated values, skip concatenation step */
            if (values.length === 0) {
                return renderedArray[0];
            }
            /** Concatenate string literals with interpolated values */
            var rendered = concatStringsAndValues(renderedArray, firstInterpolatedValueSetsIndentationLevel ? values.slice(1) : values);
            return rendered;
        }
        else {
            // Create and return a new instance of outdent with the given options
            return createInstance(extend(extend({}, options), stringsOrOptions || {}));
        }
    }
    var fullOutdent = extend(outdent, {
        string: function (str) {
            return _outdentArray([str], false, options)[0];
        },
    });
    return fullOutdent;
}
var defaultOutdent = createInstance({
    trimLeadingNewline: true,
    trimTrailingNewline: true,
});
if (typeof module !== "undefined") {
    // In webpack harmony-modules environments, module.exports is read-only,
    // so we fail gracefully.
    try {
        module.exports = defaultOutdent;
        Object.defineProperty(defaultOutdent, "__esModule", { value: true });
        defaultOutdent.default = defaultOutdent;
        defaultOutdent.outdent = defaultOutdent;
    }
    catch (e) { }
}

var mockAdapter = {
  appendCss: () => {},
  registerClassName: () => {},
  onEndFileScope: () => {},
  registerComposition: () => {},
  markCompositionUsed: () => {},
  getIdentOption: () => process.env.NODE_ENV === 'production' ? 'short' : 'debug'
};
var adapterStack = [mockAdapter];

var currentAdapter = () => {
  if (adapterStack.length < 1) {
    throw new Error('No adapter configured');
  }

  return adapterStack[adapterStack.length - 1];
};

var hasConfiguredAdapter = false;
var setAdapterIfNotSet = newAdapter => {
  if (!hasConfiguredAdapter) {
    setAdapter(newAdapter);
  }
};
var setAdapter = newAdapter => {
  hasConfiguredAdapter = true;
  adapterStack.push(newAdapter);
};
var appendCss = function appendCss() {
  return currentAdapter().appendCss(...arguments);
};
var registerClassName = function registerClassName() {
  return currentAdapter().registerClassName(...arguments);
};
var registerComposition = function registerComposition() {
  return currentAdapter().registerComposition(...arguments);
};
var markCompositionUsed = function markCompositionUsed() {
  return currentAdapter().markCompositionUsed(...arguments);
};
var onEndFileScope = function onEndFileScope() {
  return currentAdapter().onEndFileScope(...arguments);
};
var getIdentOption = function getIdentOption() {
  var adapter = currentAdapter(); // Backwards compatibility with old versions of the integration package

  if (!('getIdentOption' in adapter)) {
    return process.env.NODE_ENV === 'production' ? 'short' : 'debug';
  }

  return adapter.getIdentOption(...arguments);
};

var _templateObject$2;
var refCounter = 0;
var fileScopes = [];
function setFileScope(filePath, packageName) {
  refCounter = 0;
  fileScopes.unshift({
    filePath,
    packageName
  });
}
function endFileScope() {
  onEndFileScope(getFileScope());
  refCounter = 0;
  fileScopes.splice(0, 1);
}
function getFileScope() {
  if (fileScopes.length === 0) {
    throw new Error(defaultOutdent(_templateObject$2 || (_templateObject$2 = _taggedTemplateLiteral(["\n        Styles were unable to be assigned to a file. This is generally caused by one of the following:\n\n        - You may have created styles outside of a '.css.ts' context\n        - You may have incorrect configuration. See https://vanilla-extract.style/documentation/setup\n      "]))));
  }

  return fileScopes[0];
}
function getAndIncrementRefCounter() {
  return refCounter++;
}

var stylesheets = {};
var injectStyles = _ref => {
  var {
    fileScope,
    css
  } = _ref;
  var fileScopeId = fileScope.packageName ? [fileScope.packageName, fileScope.filePath].join('/') : fileScope.filePath;
  var stylesheet = stylesheets[fileScopeId];

  if (!stylesheet) {
    var styleEl = document.createElement('style');

    if (fileScope.packageName) {
      styleEl.setAttribute('data-package', fileScope.packageName);
    }

    styleEl.setAttribute('data-file', fileScope.filePath);
    styleEl.setAttribute('type', 'text/css');
    stylesheet = stylesheets[fileScopeId] = styleEl;
    document.head.appendChild(styleEl);
  }

  stylesheet.innerHTML = css;
};

function getVarName(variable) {
  var matches = variable.match(/^var\((.*)\)$/);

  if (matches) {
    return matches[1];
  }

  return variable;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/*! https://mths.be/cssesc v3.0.0 by @mathias */

var object = {};
var hasOwnProperty = object.hasOwnProperty;
var merge = function merge(options, defaults) {
	if (!options) {
		return defaults;
	}
	var result = {};
	for (var key in defaults) {
		// `if (defaults.hasOwnProperty(key) { … }` is not needed here, since
		// only recognized option names are used.
		result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
	}
	return result;
};

var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;

// https://mathiasbynens.be/notes/css-escapes#css
var cssesc = function cssesc(string, options) {
	options = merge(options, cssesc.options);
	if (options.quotes != 'single' && options.quotes != 'double') {
		options.quotes = 'single';
	}
	var quote = options.quotes == 'double' ? '"' : '\'';
	var isIdentifier = options.isIdentifier;

	var firstChar = string.charAt(0);
	var output = '';
	var counter = 0;
	var length = string.length;
	while (counter < length) {
		var character = string.charAt(counter++);
		var codePoint = character.charCodeAt();
		var value = void 0;
		// If it’s not a printable ASCII character…
		if (codePoint < 0x20 || codePoint > 0x7E) {
			if (codePoint >= 0xD800 && codePoint <= 0xDBFF && counter < length) {
				// It’s a high surrogate, and there is a next character.
				var extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) {
					// next character is low surrogate
					codePoint = ((codePoint & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000;
				} else {
					// It’s an unmatched surrogate; only append this code unit, in case
					// the next code unit is the high surrogate of a surrogate pair.
					counter--;
				}
			}
			value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
		} else {
			if (options.escapeEverything) {
				if (regexAnySingleEscape.test(character)) {
					value = '\\' + character;
				} else {
					value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
				}
			} else if (/[\t\n\f\r\x0B]/.test(character)) {
				value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
			} else if (character == '\\' || !isIdentifier && (character == '"' && quote == character || character == '\'' && quote == character) || isIdentifier && regexSingleEscape.test(character)) {
				value = '\\' + character;
			} else {
				value = character;
			}
		}
		output += value;
	}

	if (isIdentifier) {
		if (/^-[-\d]/.test(output)) {
			output = '\\-' + output.slice(1);
		} else if (/\d/.test(firstChar)) {
			output = '\\3' + firstChar + ' ' + output.slice(1);
		}
	}

	// Remove spaces after `\HEX` escapes that are not followed by a hex digit,
	// since they’re redundant. Note that this is only possible if the escape
	// sequence isn’t preceded by an odd number of backslashes.
	output = output.replace(regexExcessiveSpaces, function ($0, $1, $2) {
		if ($1 && $1.length % 2) {
			// It’s not safe to remove the space, so don’t.
			return $0;
		}
		// Strip the space.
		return ($1 || '') + $2;
	});

	if (!isIdentifier && options.wrap) {
		return quote + output + quote;
	}
	return output;
};

// Expose default options (so they can be overridden globally).
cssesc.options = {
	'escapeEverything': false,
	'isIdentifier': false,
	'quotes': 'single',
	'wrap': false
};

cssesc.version = '3.0.0';

var cssesc_1 = cssesc;

var lib = {};

var parse$1 = {};

var __spreadArray$1 = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(parse$1, "__esModule", { value: true });
parse$1.isTraversal = void 0;
var reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/;
var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
var actionTypes$1 = new Map([
    ["~", "element"],
    ["^", "start"],
    ["$", "end"],
    ["*", "any"],
    ["!", "not"],
    ["|", "hyphen"],
]);
var Traversals = {
    ">": "child",
    "<": "parent",
    "~": "sibling",
    "+": "adjacent",
};
var attribSelectors = {
    "#": ["id", "equals"],
    ".": ["class", "element"],
};
// Pseudos, whose data property is parsed as well.
var unpackPseudos = new Set([
    "has",
    "not",
    "matches",
    "is",
    "where",
    "host",
    "host-context",
]);
var traversalNames = new Set(__spreadArray$1([
    "descendant"
], Object.keys(Traversals).map(function (k) { return Traversals[k]; }), true));
/**
 * Attributes that are case-insensitive in HTML.
 *
 * @private
 * @see https://html.spec.whatwg.org/multipage/semantics-other.html#case-sensitivity-of-selectors
 */
var caseInsensitiveAttributes = new Set([
    "accept",
    "accept-charset",
    "align",
    "alink",
    "axis",
    "bgcolor",
    "charset",
    "checked",
    "clear",
    "codetype",
    "color",
    "compact",
    "declare",
    "defer",
    "dir",
    "direction",
    "disabled",
    "enctype",
    "face",
    "frame",
    "hreflang",
    "http-equiv",
    "lang",
    "language",
    "link",
    "media",
    "method",
    "multiple",
    "nohref",
    "noresize",
    "noshade",
    "nowrap",
    "readonly",
    "rel",
    "rev",
    "rules",
    "scope",
    "scrolling",
    "selected",
    "shape",
    "target",
    "text",
    "type",
    "valign",
    "valuetype",
    "vlink",
]);
/**
 * Checks whether a specific selector is a traversal.
 * This is useful eg. in swapping the order of elements that
 * are not traversals.
 *
 * @param selector Selector to check.
 */
function isTraversal(selector) {
    return traversalNames.has(selector.type);
}
parse$1.isTraversal = isTraversal;
var stripQuotesFromPseudos = new Set(["contains", "icontains"]);
var quotes = new Set(['"', "'"]);
// Unescape function taken from https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L152
function funescape(_, escaped, escapedWhitespace) {
    var high = parseInt(escaped, 16) - 0x10000;
    // NaN means non-codepoint
    return high !== high || escapedWhitespace
        ? escaped
        : high < 0
            ? // BMP codepoint
                String.fromCharCode(high + 0x10000)
            : // Supplemental Plane codepoint (surrogate pair)
                String.fromCharCode((high >> 10) | 0xd800, (high & 0x3ff) | 0xdc00);
}
function unescapeCSS(str) {
    return str.replace(reEscape, funescape);
}
function isWhitespace(c) {
    return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
}
/**
 * Parses `selector`, optionally with the passed `options`.
 *
 * @param selector Selector to parse.
 * @param options Options for parsing.
 * @returns Returns a two-dimensional array.
 * The first dimension represents selectors separated by commas (eg. `sub1, sub2`),
 * the second contains the relevant tokens for that selector.
 */
function parse(selector, options) {
    var subselects = [];
    var endIndex = parseSelector(subselects, "" + selector, options, 0);
    if (endIndex < selector.length) {
        throw new Error("Unmatched selector: " + selector.slice(endIndex));
    }
    return subselects;
}
parse$1.default = parse;
function parseSelector(subselects, selector, options, selectorIndex) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var tokens = [];
    var sawWS = false;
    function getName(offset) {
        var match = selector.slice(selectorIndex + offset).match(reName);
        if (!match) {
            throw new Error("Expected name, found " + selector.slice(selectorIndex));
        }
        var name = match[0];
        selectorIndex += offset + name.length;
        return unescapeCSS(name);
    }
    function stripWhitespace(offset) {
        while (isWhitespace(selector.charAt(selectorIndex + offset)))
            offset++;
        selectorIndex += offset;
    }
    function isEscaped(pos) {
        var slashCount = 0;
        while (selector.charAt(--pos) === "\\")
            slashCount++;
        return (slashCount & 1) === 1;
    }
    function ensureNotTraversal() {
        if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) {
            throw new Error("Did not expect successive traversals.");
        }
    }
    stripWhitespace(0);
    while (selector !== "") {
        var firstChar = selector.charAt(selectorIndex);
        if (isWhitespace(firstChar)) {
            sawWS = true;
            stripWhitespace(1);
        }
        else if (firstChar in Traversals) {
            ensureNotTraversal();
            tokens.push({ type: Traversals[firstChar] });
            sawWS = false;
            stripWhitespace(1);
        }
        else if (firstChar === ",") {
            if (tokens.length === 0) {
                throw new Error("Empty sub-selector");
            }
            subselects.push(tokens);
            tokens = [];
            sawWS = false;
            stripWhitespace(1);
        }
        else if (selector.startsWith("/*", selectorIndex)) {
            var endIndex = selector.indexOf("*/", selectorIndex + 2);
            if (endIndex < 0) {
                throw new Error("Comment was not terminated");
            }
            selectorIndex = endIndex + 2;
        }
        else {
            if (sawWS) {
                ensureNotTraversal();
                tokens.push({ type: "descendant" });
                sawWS = false;
            }
            if (firstChar in attribSelectors) {
                var _c = attribSelectors[firstChar], name_1 = _c[0], action = _c[1];
                tokens.push({
                    type: "attribute",
                    name: name_1,
                    action: action,
                    value: getName(1),
                    namespace: null,
                    // TODO: Add quirksMode option, which makes `ignoreCase` `true` for HTML.
                    ignoreCase: options.xmlMode ? null : false,
                });
            }
            else if (firstChar === "[") {
                stripWhitespace(1);
                // Determine attribute name and namespace
                var namespace = null;
                if (selector.charAt(selectorIndex) === "|") {
                    namespace = "";
                    selectorIndex += 1;
                }
                if (selector.startsWith("*|", selectorIndex)) {
                    namespace = "*";
                    selectorIndex += 2;
                }
                var name_2 = getName(0);
                if (namespace === null &&
                    selector.charAt(selectorIndex) === "|" &&
                    selector.charAt(selectorIndex + 1) !== "=") {
                    namespace = name_2;
                    name_2 = getName(1);
                }
                if ((_a = options.lowerCaseAttributeNames) !== null && _a !== void 0 ? _a : !options.xmlMode) {
                    name_2 = name_2.toLowerCase();
                }
                stripWhitespace(0);
                // Determine comparison operation
                var action = "exists";
                var possibleAction = actionTypes$1.get(selector.charAt(selectorIndex));
                if (possibleAction) {
                    action = possibleAction;
                    if (selector.charAt(selectorIndex + 1) !== "=") {
                        throw new Error("Expected `=`");
                    }
                    stripWhitespace(2);
                }
                else if (selector.charAt(selectorIndex) === "=") {
                    action = "equals";
                    stripWhitespace(1);
                }
                // Determine value
                var value = "";
                var ignoreCase = null;
                if (action !== "exists") {
                    if (quotes.has(selector.charAt(selectorIndex))) {
                        var quote = selector.charAt(selectorIndex);
                        var sectionEnd = selectorIndex + 1;
                        while (sectionEnd < selector.length &&
                            (selector.charAt(sectionEnd) !== quote ||
                                isEscaped(sectionEnd))) {
                            sectionEnd += 1;
                        }
                        if (selector.charAt(sectionEnd) !== quote) {
                            throw new Error("Attribute value didn't end");
                        }
                        value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd));
                        selectorIndex = sectionEnd + 1;
                    }
                    else {
                        var valueStart = selectorIndex;
                        while (selectorIndex < selector.length &&
                            ((!isWhitespace(selector.charAt(selectorIndex)) &&
                                selector.charAt(selectorIndex) !== "]") ||
                                isEscaped(selectorIndex))) {
                            selectorIndex += 1;
                        }
                        value = unescapeCSS(selector.slice(valueStart, selectorIndex));
                    }
                    stripWhitespace(0);
                    // See if we have a force ignore flag
                    var forceIgnore = selector.charAt(selectorIndex);
                    // If the forceIgnore flag is set (either `i` or `s`), use that value
                    if (forceIgnore === "s" || forceIgnore === "S") {
                        ignoreCase = false;
                        stripWhitespace(1);
                    }
                    else if (forceIgnore === "i" || forceIgnore === "I") {
                        ignoreCase = true;
                        stripWhitespace(1);
                    }
                }
                // If `xmlMode` is set, there are no rules; otherwise, use the `caseInsensitiveAttributes` list.
                if (!options.xmlMode) {
                    // TODO: Skip this for `exists`, as there is no value to compare to.
                    ignoreCase !== null && ignoreCase !== void 0 ? ignoreCase : (ignoreCase = caseInsensitiveAttributes.has(name_2));
                }
                if (selector.charAt(selectorIndex) !== "]") {
                    throw new Error("Attribute selector didn't terminate");
                }
                selectorIndex += 1;
                var attributeSelector = {
                    type: "attribute",
                    name: name_2,
                    action: action,
                    value: value,
                    namespace: namespace,
                    ignoreCase: ignoreCase,
                };
                tokens.push(attributeSelector);
            }
            else if (firstChar === ":") {
                if (selector.charAt(selectorIndex + 1) === ":") {
                    tokens.push({
                        type: "pseudo-element",
                        name: getName(2).toLowerCase(),
                    });
                    continue;
                }
                var name_3 = getName(1).toLowerCase();
                var data = null;
                if (selector.charAt(selectorIndex) === "(") {
                    if (unpackPseudos.has(name_3)) {
                        if (quotes.has(selector.charAt(selectorIndex + 1))) {
                            throw new Error("Pseudo-selector " + name_3 + " cannot be quoted");
                        }
                        data = [];
                        selectorIndex = parseSelector(data, selector, options, selectorIndex + 1);
                        if (selector.charAt(selectorIndex) !== ")") {
                            throw new Error("Missing closing parenthesis in :" + name_3 + " (" + selector + ")");
                        }
                        selectorIndex += 1;
                    }
                    else {
                        selectorIndex += 1;
                        var start = selectorIndex;
                        var counter = 1;
                        for (; counter > 0 && selectorIndex < selector.length; selectorIndex++) {
                            if (selector.charAt(selectorIndex) === "(" &&
                                !isEscaped(selectorIndex)) {
                                counter++;
                            }
                            else if (selector.charAt(selectorIndex) === ")" &&
                                !isEscaped(selectorIndex)) {
                                counter--;
                            }
                        }
                        if (counter) {
                            throw new Error("Parenthesis not matched");
                        }
                        data = selector.slice(start, selectorIndex - 1);
                        if (stripQuotesFromPseudos.has(name_3)) {
                            var quot = data.charAt(0);
                            if (quot === data.slice(-1) && quotes.has(quot)) {
                                data = data.slice(1, -1);
                            }
                            data = unescapeCSS(data);
                        }
                    }
                }
                tokens.push({ type: "pseudo", name: name_3, data: data });
            }
            else {
                var namespace = null;
                var name_4 = void 0;
                if (firstChar === "*") {
                    selectorIndex += 1;
                    name_4 = "*";
                }
                else if (reName.test(selector.slice(selectorIndex))) {
                    if (selector.charAt(selectorIndex) === "|") {
                        namespace = "";
                        selectorIndex += 1;
                    }
                    name_4 = getName(0);
                }
                else {
                    /*
                     * We have finished parsing the selector.
                     * Remove descendant tokens at the end if they exist,
                     * and return the last index, so that parsing can be
                     * picked up from here.
                     */
                    if (tokens.length &&
                        tokens[tokens.length - 1].type === "descendant") {
                        tokens.pop();
                    }
                    addToken(subselects, tokens);
                    return selectorIndex;
                }
                if (selector.charAt(selectorIndex) === "|") {
                    namespace = name_4;
                    if (selector.charAt(selectorIndex + 1) === "*") {
                        name_4 = "*";
                        selectorIndex += 2;
                    }
                    else {
                        name_4 = getName(1);
                    }
                }
                if (name_4 === "*") {
                    tokens.push({ type: "universal", namespace: namespace });
                }
                else {
                    if ((_b = options.lowerCaseTags) !== null && _b !== void 0 ? _b : !options.xmlMode) {
                        name_4 = name_4.toLowerCase();
                    }
                    tokens.push({ type: "tag", name: name_4, namespace: namespace });
                }
            }
        }
    }
    addToken(subselects, tokens);
    return selectorIndex;
}
function addToken(subselects, tokens) {
    if (subselects.length > 0 && tokens.length === 0) {
        throw new Error("Empty sub-selector");
    }
    subselects.push(tokens);
}

var stringify$1 = {};

var __spreadArray = (commonjsGlobal && commonjsGlobal.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(stringify$1, "__esModule", { value: true });
var actionTypes = {
    equals: "",
    element: "~",
    start: "^",
    end: "$",
    any: "*",
    not: "!",
    hyphen: "|",
};
var charsToEscape = new Set(__spreadArray(__spreadArray([], Object.keys(actionTypes)
    .map(function (typeKey) { return actionTypes[typeKey]; })
    .filter(Boolean), true), [
    ":",
    "[",
    "]",
    " ",
    "\\",
    "(",
    ")",
    "'",
], false));
/**
 * Turns `selector` back into a string.
 *
 * @param selector Selector to stringify.
 */
function stringify(selector) {
    return selector.map(stringifySubselector).join(", ");
}
stringify$1.default = stringify;
function stringifySubselector(token) {
    return token.map(stringifyToken).join("");
}
function stringifyToken(token) {
    switch (token.type) {
        // Simple types
        case "child":
            return " > ";
        case "parent":
            return " < ";
        case "sibling":
            return " ~ ";
        case "adjacent":
            return " + ";
        case "descendant":
            return " ";
        case "universal":
            return getNamespace(token.namespace) + "*";
        case "tag":
            return getNamespacedName(token);
        case "pseudo-element":
            return "::" + escapeName(token.name);
        case "pseudo":
            if (token.data === null)
                return ":" + escapeName(token.name);
            if (typeof token.data === "string") {
                return ":" + escapeName(token.name) + "(" + escapeName(token.data) + ")";
            }
            return ":" + escapeName(token.name) + "(" + stringify(token.data) + ")";
        case "attribute": {
            if (token.name === "id" &&
                token.action === "equals" &&
                !token.ignoreCase &&
                !token.namespace) {
                return "#" + escapeName(token.value);
            }
            if (token.name === "class" &&
                token.action === "element" &&
                !token.ignoreCase &&
                !token.namespace) {
                return "." + escapeName(token.value);
            }
            var name_1 = getNamespacedName(token);
            if (token.action === "exists") {
                return "[" + name_1 + "]";
            }
            return "[" + name_1 + actionTypes[token.action] + "='" + escapeName(token.value) + "'" + (token.ignoreCase ? "i" : token.ignoreCase === false ? "s" : "") + "]";
        }
    }
}
function getNamespacedName(token) {
    return "" + getNamespace(token.namespace) + escapeName(token.name);
}
function getNamespace(namespace) {
    return namespace !== null
        ? (namespace === "*" ? "*" : escapeName(namespace)) + "|"
        : "";
}
function escapeName(str) {
    return str
        .split("")
        .map(function (c) { return (charsToEscape.has(c) ? "\\" + c : c); })
        .join("");
}

(function (exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.stringify = exports.parse = void 0;
	__exportStar(parse$1, exports);
	var parse_1 = parse$1;
	Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return __importDefault(parse_1).default; } });
	var stringify_1 = stringify$1;
	Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return __importDefault(stringify_1).default; } });
} (lib));

/*! @license MediaQueryParser - MIT License - Tom Golden (github@tbjgolden.com) */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

var weirdNewlines = /(\u000D|\u000C|\u000D\u000A)/g;
var nullOrSurrogates = /[\u0000\uD800-\uDFFF]/g;
var commentRegex = /(\/\*)[\s\S]*?(\*\/)/g;
var lexicalAnalysis = function lexicalAnalysis(str, index) {
  if (index === void 0) {
    index = 0;
  }

  str = str.replace(weirdNewlines, '\n').replace(nullOrSurrogates, "\uFFFD");
  str = str.replace(commentRegex, '');
  var tokens = [];

  for (; index < str.length; index += 1) {
    var code = str.charCodeAt(index);

    if (code === 0x0009 || code === 0x0020 || code === 0x000a) {
      var code_1 = str.charCodeAt(++index);

      while (code_1 === 0x0009 || code_1 === 0x0020 || code_1 === 0x000a) {
        code_1 = str.charCodeAt(++index);
      }

      index -= 1;
      tokens.push({
        type: '<whitespace-token>'
      });
    } else if (code === 0x0022) {
      var result = consumeString(str, index);

      if (result === null) {
        return null;
      }

      var _a = __read(result, 2),
          lastIndex = _a[0],
          value = _a[1];

      tokens.push({
        type: '<string-token>',
        value: value
      });
      index = lastIndex;
    } else if (code === 0x0023) {
      if (index + 1 < str.length) {
        var nextCode = str.charCodeAt(index + 1);

        if (nextCode === 0x005f || nextCode >= 0x0041 && nextCode <= 0x005a || nextCode >= 0x0061 && nextCode <= 0x007a || nextCode >= 0x0080 || nextCode >= 0x0030 && nextCode <= 0x0039 || nextCode === 0x005c && index + 2 < str.length && str.charCodeAt(index + 2) !== 0x000a) {
          var flag = wouldStartIdentifier(str, index + 1) ? 'id' : 'unrestricted';
          var result = consumeIdentUnsafe(str, index + 1);

          if (result !== null) {
            var _b = __read(result, 2),
                lastIndex = _b[0],
                value = _b[1];

            tokens.push({
              type: '<hash-token>',
              value: value.toLowerCase(),
              flag: flag
            });
            index = lastIndex;
            continue;
          }
        }
      }

      tokens.push({
        type: '<delim-token>',
        value: code
      });
    } else if (code === 0x0027) {
      var result = consumeString(str, index);

      if (result === null) {
        return null;
      }

      var _c = __read(result, 2),
          lastIndex = _c[0],
          value = _c[1];

      tokens.push({
        type: '<string-token>',
        value: value
      });
      index = lastIndex;
    } else if (code === 0x0028) {
      tokens.push({
        type: '<(-token>'
      });
    } else if (code === 0x0029) {
      tokens.push({
        type: '<)-token>'
      });
    } else if (code === 0x002b) {
      var plusNumeric = consumeNumeric(str, index);

      if (plusNumeric === null) {
        tokens.push({
          type: '<delim-token>',
          value: code
        });
      } else {
        var _d = __read(plusNumeric, 2),
            lastIndex = _d[0],
            tokenTuple = _d[1];

        if (tokenTuple[0] === '<dimension-token>') {
          tokens.push({
            type: '<dimension-token>',
            value: tokenTuple[1],
            unit: tokenTuple[2].toLowerCase(),
            flag: 'number'
          });
        } else if (tokenTuple[0] === '<number-token>') {
          tokens.push({
            type: tokenTuple[0],
            value: tokenTuple[1],
            flag: tokenTuple[2]
          });
        } else {
          tokens.push({
            type: tokenTuple[0],
            value: tokenTuple[1],
            flag: 'number'
          });
        }

        index = lastIndex;
      }
    } else if (code === 0x002c) {
      tokens.push({
        type: '<comma-token>'
      });
    } else if (code === 0x002d) {
      var minusNumeric = consumeNumeric(str, index);

      if (minusNumeric !== null) {
        var _e = __read(minusNumeric, 2),
            lastIndex = _e[0],
            tokenTuple = _e[1];

        if (tokenTuple[0] === '<dimension-token>') {
          tokens.push({
            type: '<dimension-token>',
            value: tokenTuple[1],
            unit: tokenTuple[2].toLowerCase(),
            flag: 'number'
          });
        } else if (tokenTuple[0] === '<number-token>') {
          tokens.push({
            type: tokenTuple[0],
            value: tokenTuple[1],
            flag: tokenTuple[2]
          });
        } else {
          tokens.push({
            type: tokenTuple[0],
            value: tokenTuple[1],
            flag: 'number'
          });
        }

        index = lastIndex;
        continue;
      }

      if (index + 2 < str.length) {
        var nextCode = str.charCodeAt(index + 1);
        var nextNextCode = str.charCodeAt(index + 2);

        if (nextCode === 0x002d && nextNextCode === 0x003e) {
          tokens.push({
            type: '<CDC-token>'
          });
          index += 2;
          continue;
        }
      }

      var result = consumeIdentLike(str, index);

      if (result !== null) {
        var _f = __read(result, 3),
            lastIndex = _f[0],
            value = _f[1],
            type = _f[2];

        tokens.push({
          type: type,
          value: value
        });
        index = lastIndex;
        continue;
      }

      tokens.push({
        type: '<delim-token>',
        value: code
      });
    } else if (code === 0x002e) {
      var minusNumeric = consumeNumeric(str, index);

      if (minusNumeric === null) {
        tokens.push({
          type: '<delim-token>',
          value: code
        });
      } else {
        var _g = __read(minusNumeric, 2),
            lastIndex = _g[0],
            tokenTuple = _g[1];

        if (tokenTuple[0] === '<dimension-token>') {
          tokens.push({
            type: '<dimension-token>',
            value: tokenTuple[1],
            unit: tokenTuple[2].toLowerCase(),
            flag: 'number'
          });
        } else if (tokenTuple[0] === '<number-token>') {
          tokens.push({
            type: tokenTuple[0],
            value: tokenTuple[1],
            flag: tokenTuple[2]
          });
        } else {
          tokens.push({
            type: tokenTuple[0],
            value: tokenTuple[1],
            flag: 'number'
          });
        }

        index = lastIndex;
        continue;
      }
    } else if (code === 0x003a) {
      tokens.push({
        type: '<colon-token>'
      });
    } else if (code === 0x003b) {
      tokens.push({
        type: '<semicolon-token>'
      });
    } else if (code === 0x003c) {
      if (index + 3 < str.length) {
        var nextCode = str.charCodeAt(index + 1);
        var nextNextCode = str.charCodeAt(index + 2);
        var nextNextNextCode = str.charCodeAt(index + 3);

        if (nextCode === 0x0021 && nextNextCode === 0x002d && nextNextNextCode === 0x002d) {
          tokens.push({
            type: '<CDO-token>'
          });
          index += 3;
          continue;
        }
      }

      tokens.push({
        type: '<delim-token>',
        value: code
      });
    } else if (code === 0x0040) {
      var result = consumeIdent(str, index + 1);

      if (result !== null) {
        var _h = __read(result, 2),
            lastIndex = _h[0],
            value = _h[1];

        tokens.push({
          type: '<at-keyword-token>',
          value: value.toLowerCase()
        });
        index = lastIndex;
        continue;
      }

      tokens.push({
        type: '<delim-token>',
        value: code
      });
    } else if (code === 0x005b) {
      tokens.push({
        type: '<[-token>'
      });
    } else if (code === 0x005c) {
      var result = consumeEscape(str, index);

      if (result === null) {
        return null;
      }

      var _j = __read(result, 2),
          lastIndex = _j[0],
          value = _j[1];

      str = str.slice(0, index) + value + str.slice(lastIndex + 1);
      index -= 1;
    } else if (code === 0x005d) {
      tokens.push({
        type: '<]-token>'
      });
    } else if (code === 0x007b) {
      tokens.push({
        type: '<{-token>'
      });
    } else if (code === 0x007d) {
      tokens.push({
        type: '<}-token>'
      });
    } else if (code >= 0x0030 && code <= 0x0039) {
      var result = consumeNumeric(str, index);

      var _k = __read(result, 2),
          lastIndex = _k[0],
          tokenTuple = _k[1];

      if (tokenTuple[0] === '<dimension-token>') {
        tokens.push({
          type: '<dimension-token>',
          value: tokenTuple[1],
          unit: tokenTuple[2].toLowerCase(),
          flag: 'number'
        });
      } else if (tokenTuple[0] === '<number-token>') {
        tokens.push({
          type: tokenTuple[0],
          value: tokenTuple[1],
          flag: tokenTuple[2]
        });
      } else {
        tokens.push({
          type: tokenTuple[0],
          value: tokenTuple[1],
          flag: 'number'
        });
      }

      index = lastIndex;
    } else if (code === 0x005f || code >= 0x0041 && code <= 0x005a || code >= 0x0061 && code <= 0x007a || code >= 0x0080) {
      var result = consumeIdentLike(str, index);

      if (result === null) {
        return null;
      }

      var _l = __read(result, 3),
          lastIndex = _l[0],
          value = _l[1],
          type = _l[2];

      tokens.push({
        type: type,
        value: value
      });
      index = lastIndex;
    } else {
      tokens.push({
        type: '<delim-token>',
        value: code
      });
    }
  }

  tokens.push({
    type: '<EOF-token>'
  });
  return tokens;
};
var consumeString = function consumeString(str, index) {
  if (str.length <= index + 1) return null;
  var firstCode = str.charCodeAt(index);
  var charCodes = [];

  for (var i = index + 1; i < str.length; i += 1) {
    var code = str.charCodeAt(i);

    if (code === firstCode) {
      return [i, String.fromCharCode.apply(null, charCodes)];
    } else if (code === 0x005c) {
      var result = consumeEscape(str, i);
      if (result === null) return null;

      var _a = __read(result, 2),
          lastIndex = _a[0],
          charCode = _a[1];

      charCodes.push(charCode);
      i = lastIndex;
    } else if (code === 0x000a) {
      return null;
    } else {
      charCodes.push(code);
    }
  }

  return null;
};
var wouldStartIdentifier = function wouldStartIdentifier(str, index) {
  if (str.length <= index) return false;
  var code = str.charCodeAt(index);

  if (code === 0x002d) {
    if (str.length <= index + 1) return false;
    var nextCode = str.charCodeAt(index + 1);

    if (nextCode === 0x002d || nextCode === 0x005f || nextCode >= 0x0041 && nextCode <= 0x005a || nextCode >= 0x0061 && nextCode <= 0x007a || nextCode >= 0x0080) {
      return true;
    } else if (nextCode === 0x005c) {
      if (str.length <= index + 2) return false;
      var nextNextCode = str.charCodeAt(index + 2);
      return nextNextCode !== 0x000a;
    } else {
      return false;
    }
  } else if (code === 0x005f || code >= 0x0041 && code <= 0x005a || code >= 0x0061 && code <= 0x007a || code >= 0x0080) {
    return true;
  } else if (code === 0x005c) {
    if (str.length <= index + 1) return false;
    var nextCode = str.charCodeAt(index + 1);
    return nextCode !== 0x000a;
  } else {
    return false;
  }
};
var consumeEscape = function consumeEscape(str, index) {
  if (str.length <= index + 1) return null;
  if (str.charCodeAt(index) !== 0x005c) return null;
  var code = str.charCodeAt(index + 1);

  if (code === 0x000a) {
    return null;
  } else if (code >= 0x0030 && code <= 0x0039 || code >= 0x0041 && code <= 0x0046 || code >= 0x0061 && code <= 0x0066) {
    var hexCharCodes = [code];
    var min = Math.min(index + 7, str.length);
    var i = index + 2;

    for (; i < min; i += 1) {
      var code_2 = str.charCodeAt(i);

      if (code_2 >= 0x0030 && code_2 <= 0x0039 || code_2 >= 0x0041 && code_2 <= 0x0046 || code_2 >= 0x0061 && code_2 <= 0x0066) {
        hexCharCodes.push(code_2);
      } else {
        break;
      }
    }

    if (i < str.length) {
      var code_3 = str.charCodeAt(i);

      if (code_3 === 0x0009 || code_3 === 0x0020 || code_3 === 0x000a) {
        i += 1;
      }
    }

    return [i - 1, parseInt(String.fromCharCode.apply(null, hexCharCodes), 16)];
  } else {
    return [index + 1, code];
  }
};
var consumeNumeric = function consumeNumeric(str, index) {
  var numberResult = consumeNumber(str, index);
  if (numberResult === null) return null;

  var _a = __read(numberResult, 3),
      numberEndIndex = _a[0],
      numberValue = _a[1],
      numberFlag = _a[2];

  var identResult = consumeIdent(str, numberEndIndex + 1);

  if (identResult !== null) {
    var _b = __read(identResult, 2),
        identEndIndex = _b[0],
        identValue = _b[1];

    return [identEndIndex, ['<dimension-token>', numberValue, identValue]];
  }

  if (numberEndIndex + 1 < str.length && str.charCodeAt(numberEndIndex + 1) === 0x0025) {
    return [numberEndIndex + 1, ['<percentage-token>', numberValue]];
  }

  return [numberEndIndex, ['<number-token>', numberValue, numberFlag]];
};
var consumeNumber = function consumeNumber(str, index) {
  if (str.length <= index) return null;
  var flag = 'integer';
  var numberChars = [];
  var firstCode = str.charCodeAt(index);

  if (firstCode === 0x002b || firstCode === 0x002d) {
    index += 1;
    if (firstCode === 0x002d) numberChars.push(0x002d);
  }

  while (index < str.length) {
    var code = str.charCodeAt(index);

    if (code >= 0x0030 && code <= 0x0039) {
      numberChars.push(code);
      index += 1;
    } else {
      break;
    }
  }

  if (index + 1 < str.length) {
    var nextCode = str.charCodeAt(index);
    var nextNextCode = str.charCodeAt(index + 1);

    if (nextCode === 0x002e && nextNextCode >= 0x0030 && nextNextCode <= 0x0039) {
      numberChars.push(nextCode, nextNextCode);
      flag = 'number';
      index += 2;

      while (index < str.length) {
        var code = str.charCodeAt(index);

        if (code >= 0x0030 && code <= 0x0039) {
          numberChars.push(code);
          index += 1;
        } else {
          break;
        }
      }
    }
  }

  if (index + 1 < str.length) {
    var nextCode = str.charCodeAt(index);
    var nextNextCode = str.charCodeAt(index + 1);
    var nextNextNextCode = str.charCodeAt(index + 2);

    if (nextCode === 0x0045 || nextCode === 0x0065) {
      var nextNextIsDigit = nextNextCode >= 0x0030 && nextNextCode <= 0x0039;

      if (nextNextIsDigit || (nextNextCode === 0x002b || nextNextCode === 0x002d) && nextNextNextCode >= 0x0030 && nextNextNextCode <= 0x0039) {
        flag = 'number';

        if (nextNextIsDigit) {
          numberChars.push(0x0045, nextNextCode);
          index += 2;
        } else if (nextNextCode === 0x002d) {
          numberChars.push(0x0045, 0x002d, nextNextNextCode);
          index += 3;
        } else {
          numberChars.push(0x0045, nextNextNextCode);
          index += 3;
        }

        while (index < str.length) {
          var code = str.charCodeAt(index);

          if (code >= 0x0030 && code <= 0x0039) {
            numberChars.push(code);
            index += 1;
          } else {
            break;
          }
        }
      }
    }
  }

  var numberString = String.fromCharCode.apply(null, numberChars);
  var value = flag === 'number' ? parseFloat(numberString) : parseInt(numberString);
  if (value === -0) value = 0;
  return Number.isNaN(value) ? null : [index - 1, value, flag];
};
var consumeIdentUnsafe = function consumeIdentUnsafe(str, index) {
  if (str.length <= index) {
    return null;
  }

  var identChars = [];

  for (var code = str.charCodeAt(index); index < str.length; code = str.charCodeAt(++index)) {
    if (code === 0x002d || code === 0x005f || code >= 0x0041 && code <= 0x005a || code >= 0x0061 && code <= 0x007a || code >= 0x0080 || code >= 0x0030 && code <= 0x0039) {
      identChars.push(code);
      continue;
    } else {
      var result = consumeEscape(str, index);

      if (result !== null) {
        var _a = __read(result, 2),
            lastIndex = _a[0],
            code_4 = _a[1];

        identChars.push(code_4);
        index = lastIndex;
        continue;
      }
    }

    break;
  }

  return index === 0 ? null : [index - 1, String.fromCharCode.apply(null, identChars)];
};
var consumeIdent = function consumeIdent(str, index) {
  if (str.length <= index || !wouldStartIdentifier(str, index)) {
    return null;
  }

  var identChars = [];

  for (var code = str.charCodeAt(index); index < str.length; code = str.charCodeAt(++index)) {
    if (code === 0x002d || code === 0x005f || code >= 0x0041 && code <= 0x005a || code >= 0x0061 && code <= 0x007a || code >= 0x0080 || code >= 0x0030 && code <= 0x0039) {
      identChars.push(code);
      continue;
    } else {
      var result = consumeEscape(str, index);

      if (result !== null) {
        var _a = __read(result, 2),
            lastIndex = _a[0],
            code_5 = _a[1];

        identChars.push(code_5);
        index = lastIndex;
        continue;
      }
    }

    break;
  }

  return [index - 1, String.fromCharCode.apply(null, identChars)];
};
var consumeUrl = function consumeUrl(str, index) {
  var code = str.charCodeAt(index);

  while (code === 0x0009 || code === 0x0020 || code === 0x000a) {
    code = str.charCodeAt(++index);
  }

  var urlChars = [];
  var hasFinishedWord = false;

  while (index < str.length) {
    if (code === 0x0029) {
      return [index, String.fromCharCode.apply(null, urlChars)];
    } else if (code === 0x0022 || code === 0x0027 || code === 0x0028) {
      return null;
    } else if (code === 0x0009 || code === 0x0020 || code === 0x000a) {
      if (!hasFinishedWord && urlChars.length !== 0) hasFinishedWord = true;
    } else if (code === 0x005c) {
      var result = consumeEscape(str, index);
      if (result === null || hasFinishedWord) return null;

      var _a = __read(result, 2),
          lastIndex = _a[0],
          value = _a[1];

      urlChars.push(value);
      index = lastIndex;
    } else {
      if (hasFinishedWord) return null;
      urlChars.push(code);
    }

    code = str.charCodeAt(++index);
  }

  return null;
};
var consumeIdentLike = function consumeIdentLike(str, index) {
  var result = consumeIdent(str, index);
  if (result === null) return null;

  var _a = __read(result, 2),
      lastIndex = _a[0],
      value = _a[1];

  if (value.toLowerCase() === 'url') {
    if (str.length > lastIndex + 1) {
      var nextCode = str.charCodeAt(lastIndex + 1);

      if (nextCode === 0x0028) {
        for (var offset = 2; lastIndex + offset < str.length; offset += 1) {
          var nextNextCode = str.charCodeAt(lastIndex + offset);

          if (nextNextCode === 0x0022 || nextNextCode === 0x0027) {
            return [lastIndex + 1, value.toLowerCase(), '<function-token>'];
          } else if (nextNextCode !== 0x0009 && nextNextCode !== 0x0020 && nextNextCode !== 0x000a) {
            var result_1 = consumeUrl(str, lastIndex + offset);
            if (result_1 === null) return null;

            var _b = __read(result_1, 2),
                lastUrlIndex = _b[0],
                value_1 = _b[1];

            return [lastUrlIndex, value_1, '<url-token>'];
          }
        }

        return [lastIndex + 1, value.toLowerCase(), '<function-token>'];
      }
    }
  } else if (str.length > lastIndex + 1) {
    var nextCode = str.charCodeAt(lastIndex + 1);

    if (nextCode === 0x0028) {
      return [lastIndex + 1, value.toLowerCase(), '<function-token>'];
    }
  }

  return [lastIndex, value.toLowerCase(), '<ident-token>'];
};

var simplifyAST = function simplifyAST(ast) {
  for (var i = ast.length - 1; i >= 0; i--) {
    ast[i] = simplifyMediaQuery(ast[i]);
  }

  return ast;
};

var simplifyMediaQuery = function simplifyMediaQuery(mediaQuery) {
  if (mediaQuery.mediaCondition === null) return mediaQuery;
  var mediaCondition = simplifyMediaCondition(mediaQuery.mediaCondition);

  if (mediaCondition.operator === null && mediaCondition.children.length === 1 && 'children' in mediaCondition.children[0]) {
    mediaCondition = mediaCondition.children[0];
  }

  return {
    mediaPrefix: mediaQuery.mediaPrefix,
    mediaType: mediaQuery.mediaType,
    mediaCondition: mediaCondition
  };
};

var simplifyMediaCondition = function simplifyMediaCondition(mediaCondition) {
  for (var i = mediaCondition.children.length - 1; i >= 0; i--) {
    var unsimplifiedChild = mediaCondition.children[i];

    if (!('context' in unsimplifiedChild)) {
      var child = simplifyMediaCondition(unsimplifiedChild);

      if (child.operator === null && child.children.length === 1) {
        mediaCondition.children[i] = child.children[0];
      } else if (child.operator === mediaCondition.operator && (child.operator === 'and' || child.operator === 'or')) {
        var spliceArgs = [i, 1];

        for (var i_1 = 0; i_1 < child.children.length; i_1++) {
          spliceArgs.push(child.children[i_1]);
        }

        mediaCondition.children.splice.apply(mediaCondition.children, spliceArgs);
      }
    }
  }

  return mediaCondition;
};

var createError = function createError(message, err) {
  if (err instanceof Error) {
    return new Error("".concat(err.message.trim(), "\n").concat(message.trim()));
  } else {
    return new Error(message.trim());
  }
};

var toAST = function toAST(str) {
  return simplifyAST(toUnflattenedAST(str));
};
var toUnflattenedAST = function toUnflattenedAST(str) {
  var tokenList = lexicalAnalysis(str.trim());

  if (tokenList === null) {
    throw createError('Failed tokenizing');
  }

  var startIndex = 0;
  var endIndex = tokenList.length - 1;

  if (tokenList[0].type === '<at-keyword-token>' && tokenList[0].value === 'media') {
    if (tokenList[1].type !== '<whitespace-token>') {
      throw createError('Expected whitespace after media');
    }

    startIndex = 2;

    for (var i = 2; i < tokenList.length - 1; i++) {
      var token = tokenList[i];

      if (token.type === '<{-token>') {
        endIndex = i;
        break;
      } else if (token.type === '<semicolon-token>') {
        throw createError("Expected '{' in media query but found ';'");
      }
    }
  }

  tokenList = tokenList.slice(startIndex, endIndex);
  return syntacticAnalysis(tokenList);
};
var removeWhitespace = function removeWhitespace(tokenList) {
  var newTokenList = [];
  var before = false;

  for (var i = 0; i < tokenList.length; i++) {
    if (tokenList[i].type === '<whitespace-token>') {
      before = true;

      if (newTokenList.length > 0) {
        newTokenList[newTokenList.length - 1].wsAfter = true;
      }
    } else {
      newTokenList.push(__assign(__assign({}, tokenList[i]), {
        wsBefore: before,
        wsAfter: false
      }));
      before = false;
    }
  }

  return newTokenList;
};
var syntacticAnalysis = function syntacticAnalysis(tokenList) {
  var e_1, _a;

  var mediaQueryList = [[]];

  for (var i = 0; i < tokenList.length; i++) {
    var token = tokenList[i];

    if (token.type === '<comma-token>') {
      mediaQueryList.push([]);
    } else {
      mediaQueryList[mediaQueryList.length - 1].push(token);
    }
  }

  var mediaQueries = mediaQueryList.map(removeWhitespace);

  if (mediaQueries.length === 1 && mediaQueries[0].length === 0) {
    return [{
      mediaCondition: null,
      mediaPrefix: null,
      mediaType: 'all'
    }];
  } else {
    var mediaQueryTokens = mediaQueries.map(function (mediaQueryTokens) {
      if (mediaQueryTokens.length === 0) {
        return null;
      } else {
        return tokenizeMediaQuery(mediaQueryTokens);
      }
    });
    var nonNullMediaQueryTokens = [];

    try {
      for (var mediaQueryTokens_1 = __values(mediaQueryTokens), mediaQueryTokens_1_1 = mediaQueryTokens_1.next(); !mediaQueryTokens_1_1.done; mediaQueryTokens_1_1 = mediaQueryTokens_1.next()) {
        var mediaQueryToken = mediaQueryTokens_1_1.value;

        if (mediaQueryToken !== null) {
          nonNullMediaQueryTokens.push(mediaQueryToken);
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (mediaQueryTokens_1_1 && !mediaQueryTokens_1_1.done && (_a = mediaQueryTokens_1["return"])) _a.call(mediaQueryTokens_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    if (nonNullMediaQueryTokens.length === 0) {
      throw createError('No valid media queries');
    }

    return nonNullMediaQueryTokens;
  }
};
var tokenizeMediaQuery = function tokenizeMediaQuery(tokens) {
  var firstToken = tokens[0];

  if (firstToken.type === '<(-token>') {
    try {
      return {
        mediaPrefix: null,
        mediaType: 'all',
        mediaCondition: tokenizeMediaCondition(tokens, true)
      };
    } catch (err) {
      throw createError("Expected media condition after '('", err);
    }
  } else if (firstToken.type === '<ident-token>') {
    var mediaPrefix = null;
    var mediaType = void 0;
    var value = firstToken.value;

    if (value === 'only' || value === 'not') {
      mediaPrefix = value;
    }

    var firstIndex = mediaPrefix === null ? 0 : 1;

    if (tokens.length <= firstIndex) {
      throw createError("Expected extra token in media query");
    }

    var firstNonUnaryToken = tokens[firstIndex];

    if (firstNonUnaryToken.type === '<ident-token>') {
      var value_1 = firstNonUnaryToken.value;

      if (value_1 === 'all') {
        mediaType = 'all';
      } else if (value_1 === 'print' || value_1 === 'screen') {
        mediaType = value_1;
      } else if (value_1 === 'tty' || value_1 === 'tv' || value_1 === 'projection' || value_1 === 'handheld' || value_1 === 'braille' || value_1 === 'embossed' || value_1 === 'aural' || value_1 === 'speech') {
        mediaPrefix = mediaPrefix === 'not' ? null : 'not';
        mediaType = 'all';
      } else {
        throw createError("Unknown ident '".concat(value_1, "' in media query"));
      }
    } else if (mediaPrefix === 'not' && firstNonUnaryToken.type === '<(-token>') {
      var tokensWithParens = [{
        type: '<(-token>',
        wsBefore: false,
        wsAfter: false
      }];
      tokensWithParens.push.apply(tokensWithParens, tokens);
      tokensWithParens.push({
        type: '<)-token>',
        wsBefore: false,
        wsAfter: false
      });

      try {
        return {
          mediaPrefix: null,
          mediaType: 'all',
          mediaCondition: tokenizeMediaCondition(tokensWithParens, true)
        };
      } catch (err) {
        throw createError("Expected media condition after '('", err);
      }
    } else {
      throw createError('Invalid media query');
    }

    if (firstIndex + 1 === tokens.length) {
      return {
        mediaPrefix: mediaPrefix,
        mediaType: mediaType,
        mediaCondition: null
      };
    } else if (firstIndex + 4 < tokens.length) {
      var secondNonUnaryToken = tokens[firstIndex + 1];

      if (secondNonUnaryToken.type === '<ident-token>' && secondNonUnaryToken.value === 'and') {
        try {
          return {
            mediaPrefix: mediaPrefix,
            mediaType: mediaType,
            mediaCondition: tokenizeMediaCondition(tokens.slice(firstIndex + 2), false)
          };
        } catch (err) {
          throw createError("Expected media condition after 'and'", err);
        }
      } else {
        throw createError("Expected 'and' after media prefix");
      }
    } else {
      throw createError('Expected media condition after media prefix');
    }
  } else {
    throw createError('Expected media condition or media prefix');
  }
};
var tokenizeMediaCondition = function tokenizeMediaCondition(tokens, mayContainOr, previousOperator) {
  if (previousOperator === void 0) {
    previousOperator = null;
  }

  if (tokens.length < 3 || tokens[0].type !== '<(-token>' || tokens[tokens.length - 1].type !== '<)-token>') {
    throw new Error('Invalid media condition');
  }

  var endIndexOfFirstFeature = tokens.length - 1;
  var maxDepth = 0;
  var count = 0;

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (token.type === '<(-token>') {
      count += 1;
      maxDepth = Math.max(maxDepth, count);
    } else if (token.type === '<)-token>') {
      count -= 1;
    }

    if (count === 0) {
      endIndexOfFirstFeature = i;
      break;
    }
  }

  if (count !== 0) {
    throw new Error('Mismatched parens\nInvalid media condition');
  }

  var child;
  var featureTokens = tokens.slice(0, endIndexOfFirstFeature + 1);

  if (maxDepth === 1) {
    child = tokenizeMediaFeature(featureTokens);
  } else {
    if (featureTokens[1].type === '<ident-token>' && featureTokens[1].value === 'not') {
      child = tokenizeMediaCondition(featureTokens.slice(2, -1), true, 'not');
    } else {
      child = tokenizeMediaCondition(featureTokens.slice(1, -1), true);
    }
  }

  if (endIndexOfFirstFeature === tokens.length - 1) {
    return {
      operator: previousOperator,
      children: [child]
    };
  } else {
    var nextToken = tokens[endIndexOfFirstFeature + 1];

    if (nextToken.type !== '<ident-token>') {
      throw new Error('Invalid operator\nInvalid media condition');
    } else if (previousOperator !== null && previousOperator !== nextToken.value) {
      throw new Error("'".concat(nextToken.value, "' and '").concat(previousOperator, "' must not be at same level\nInvalid media condition"));
    } else if (nextToken.value === 'or' && !mayContainOr) {
      throw new Error("Cannot use 'or' at top level of a media query\nInvalid media condition");
    } else if (nextToken.value !== 'and' && nextToken.value !== 'or') {
      throw new Error("Invalid operator: '".concat(nextToken.value, "'\nInvalid media condition"));
    }

    var siblings = tokenizeMediaCondition(tokens.slice(endIndexOfFirstFeature + 2), mayContainOr, nextToken.value);
    return {
      operator: nextToken.value,
      children: [child].concat(siblings.children)
    };
  }
};
var tokenizeMediaFeature = function tokenizeMediaFeature(rawTokens) {
  if (rawTokens.length < 3 || rawTokens[0].type !== '<(-token>' || rawTokens[rawTokens.length - 1].type !== '<)-token>') {
    throw new Error('Invalid media feature');
  }

  var tokens = [rawTokens[0]];

  for (var i = 1; i < rawTokens.length; i++) {
    if (i < rawTokens.length - 2) {
      var a = rawTokens[i];
      var b = rawTokens[i + 1];
      var c = rawTokens[i + 2];

      if (a.type === '<number-token>' && a.value > 0 && b.type === '<delim-token>' && b.value === 0x002f && c.type === '<number-token>' && c.value > 0) {
        tokens.push({
          type: '<ratio-token>',
          numerator: a.value,
          denominator: c.value,
          wsBefore: a.wsBefore,
          wsAfter: c.wsAfter
        });
        i += 2;
        continue;
      }
    }

    tokens.push(rawTokens[i]);
  }

  var nextToken = tokens[1];

  if (nextToken.type === '<ident-token>' && tokens.length === 3) {
    return {
      context: 'boolean',
      feature: nextToken.value
    };
  } else if (tokens.length === 5 && tokens[1].type === '<ident-token>' && tokens[2].type === '<colon-token>') {
    var valueToken = tokens[3];

    if (valueToken.type === '<number-token>' || valueToken.type === '<dimension-token>' || valueToken.type === '<ratio-token>' || valueToken.type === '<ident-token>') {
      var feature = tokens[1].value;
      var prefix = null;
      var slice = feature.slice(0, 4);

      if (slice === 'min-') {
        prefix = 'min';
        feature = feature.slice(4);
      } else if (slice === 'max-') {
        prefix = 'max';
        feature = feature.slice(4);
      }

      valueToken.wsBefore;
          valueToken.wsAfter;
          var value = __rest(valueToken, ["wsBefore", "wsAfter"]);

      return {
        context: 'value',
        prefix: prefix,
        feature: feature,
        value: value
      };
    }
  } else if (tokens.length >= 5) {
    try {
      var range = tokenizeRange(tokens);
      return {
        context: 'range',
        feature: range.featureName,
        range: range
      };
    } catch (err) {
      throw createError('Invalid media feature', err);
    }
  }

  throw new Error('Invalid media feature');
};
var tokenizeRange = function tokenizeRange(tokens) {
  var _a, _b, _c, _d;

  if (tokens.length < 5 || tokens[0].type !== '<(-token>' || tokens[tokens.length - 1].type !== '<)-token>') {
    throw new Error('Invalid range');
  }

  var range = {
    leftToken: null,
    leftOp: null,
    featureName: '',
    rightOp: null,
    rightToken: null
  };
  var hasLeft = tokens[1].type === '<number-token>' || tokens[1].type === '<dimension-token>' || tokens[1].type === '<ratio-token>' || tokens[1].type === '<ident-token>' && tokens[1].value === 'infinite';

  if (tokens[2].type === '<delim-token>') {
    if (tokens[2].value === 0x003c) {
      if (tokens[3].type === '<delim-token>' && tokens[3].value === 0x003d && !tokens[3].wsBefore) {
        range[hasLeft ? 'leftOp' : 'rightOp'] = '<=';
      } else {
        range[hasLeft ? 'leftOp' : 'rightOp'] = '<';
      }
    } else if (tokens[2].value === 0x003e) {
      if (tokens[3].type === '<delim-token>' && tokens[3].value === 0x003d && !tokens[3].wsBefore) {
        range[hasLeft ? 'leftOp' : 'rightOp'] = '>=';
      } else {
        range[hasLeft ? 'leftOp' : 'rightOp'] = '>';
      }
    } else if (tokens[2].value === 0x003d) {
      range[hasLeft ? 'leftOp' : 'rightOp'] = '=';
    } else {
      throw new Error('Invalid range');
    }

    if (hasLeft) {
      range.leftToken = tokens[1];
    } else if (tokens[1].type === '<ident-token>') {
      range.featureName = tokens[1].value;
    } else {
      throw new Error('Invalid range');
    }

    var tokenIndexAfterFirstOp = 2 + ((_b = (_a = range[hasLeft ? 'leftOp' : 'rightOp']) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0);
    var tokenAfterFirstOp = tokens[tokenIndexAfterFirstOp];

    if (hasLeft) {
      if (tokenAfterFirstOp.type === '<ident-token>') {
        range.featureName = tokenAfterFirstOp.value;

        if (tokens.length >= 7) {
          var secondOpToken = tokens[tokenIndexAfterFirstOp + 1];
          var followingToken = tokens[tokenIndexAfterFirstOp + 2];

          if (secondOpToken.type === '<delim-token>') {
            var charCode = secondOpToken.value;

            if (charCode === 0x003c) {
              if (followingToken.type === '<delim-token>' && followingToken.value === 0x003d && !followingToken.wsBefore) {
                range.rightOp = '<=';
              } else {
                range.rightOp = '<';
              }
            } else if (charCode === 0x003e) {
              if (followingToken.type === '<delim-token>' && followingToken.value === 0x003d && !followingToken.wsBefore) {
                range.rightOp = '>=';
              } else {
                range.rightOp = '>';
              }
            } else {
              throw new Error('Invalid range');
            }

            var tokenAfterSecondOp = tokens[tokenIndexAfterFirstOp + 1 + ((_d = (_c = range.rightOp) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0)];
            range.rightToken = tokenAfterSecondOp;
          } else {
            throw new Error('Invalid range');
          }
        } else if (tokenIndexAfterFirstOp + 2 !== tokens.length) {
          throw new Error('Invalid range');
        }
      } else {
        throw new Error('Invalid range');
      }
    } else {
      range.rightToken = tokenAfterFirstOp;
    }

    var validRange = null;
    var lt = range.leftToken,
        leftOp = range.leftOp,
        featureName = range.featureName,
        rightOp = range.rightOp,
        rt = range.rightToken;
    var leftToken = null;

    if (lt !== null) {
      if (lt.type === '<ident-token>') {
        var type = lt.type,
            value = lt.value;

        if (value === 'infinite') {
          leftToken = {
            type: type,
            value: value
          };
        }
      } else if (lt.type === '<number-token>' || lt.type === '<dimension-token>' || lt.type === '<ratio-token>') {
        lt.wsBefore;
            lt.wsAfter;
            var ltNoWS = __rest(lt, ["wsBefore", "wsAfter"]);

        leftToken = ltNoWS;
      }
    }

    var rightToken = null;

    if (rt !== null) {
      if (rt.type === '<ident-token>') {
        var type = rt.type,
            value = rt.value;

        if (value === 'infinite') {
          rightToken = {
            type: type,
            value: value
          };
        }
      } else if (rt.type === '<number-token>' || rt.type === '<dimension-token>' || rt.type === '<ratio-token>') {
        rt.wsBefore;
            rt.wsAfter;
            var rtNoWS = __rest(rt, ["wsBefore", "wsAfter"]);

        rightToken = rtNoWS;
      }
    }

    if (leftToken !== null && rightToken !== null) {
      if ((leftOp === '<' || leftOp === '<=') && (rightOp === '<' || rightOp === '<=')) {
        validRange = {
          leftToken: leftToken,
          leftOp: leftOp,
          featureName: featureName,
          rightOp: rightOp,
          rightToken: rightToken
        };
      } else if ((leftOp === '>' || leftOp === '>=') && (rightOp === '>' || rightOp === '>=')) {
        validRange = {
          leftToken: leftToken,
          leftOp: leftOp,
          featureName: featureName,
          rightOp: rightOp,
          rightToken: rightToken
        };
      } else {
        throw new Error('Invalid range');
      }
    } else if (leftToken === null && leftOp === null && rightOp !== null && rightToken !== null) {
      validRange = {
        leftToken: leftToken,
        leftOp: leftOp,
        featureName: featureName,
        rightOp: rightOp,
        rightToken: rightToken
      };
    } else if (leftToken !== null && leftOp !== null && rightOp === null && rightToken === null) {
      validRange = {
        leftToken: leftToken,
        leftOp: leftOp,
        featureName: featureName,
        rightOp: rightOp,
        rightToken: rightToken
      };
    }

    return validRange;
  } else {
    throw new Error('Invalid range');
  }
};

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function forEach(obj, fn) {
  for (var _key in obj) {
    fn(obj[_key], _key);
  }
}
function omit(obj, omitKeys) {
  var result = {};

  for (var _key2 in obj) {
    if (omitKeys.indexOf(_key2) === -1) {
      result[_key2] = obj[_key2];
    }
  }

  return result;
}
function mapKeys(obj, fn) {
  var result = {};

  for (var _key3 in obj) {
    result[fn(obj[_key3], _key3)] = obj[_key3];
  }

  return result;
}

function composeStylesIntoSet(set) {
  for (var _len = arguments.length, classNames = new Array(_len > 1 ? _len - 1 : 0), _key5 = 1; _key5 < _len; _key5++) {
    classNames[_key5 - 1] = arguments[_key5];
  }

  for (var className of classNames) {
    if (className.length === 0) {
      continue;
    }

    if (typeof className === 'string') {
      if (className.includes(' ')) {
        composeStylesIntoSet(set, ...className.trim().split(' '));
      } else {
        set.add(className);
      }
    } else if (Array.isArray(className)) {
      composeStylesIntoSet(set, ...className);
    }
  }
}

function dudupeAndJoinClassList(classNames) {
  var set = new Set();
  composeStylesIntoSet(set, ...classNames);
  return Array.from(set).join(' ');
}

var _templateObject$1;

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var validateSelector = (selector, targetClassName) => {
  var replaceTarget = () => {
    var targetRegex = new RegExp(".".concat(escapeRegex(cssesc_1(targetClassName, {
      isIdentifier: true
    }))), 'g');
    return selector.replace(targetRegex, '&');
  };

  var selectorParts;

  try {
    selectorParts = lib.parse(selector);
  } catch (err) {
    throw new Error("Invalid selector: ".concat(replaceTarget()));
  }

  selectorParts.forEach(tokens => {
    try {
      for (var i = tokens.length - 1; i >= -1; i--) {
        if (!tokens[i]) {
          throw new Error();
        }

        var token = tokens[i];

        if (token.type === 'child' || token.type === 'parent' || token.type === 'sibling' || token.type === 'adjacent' || token.type === 'descendant') {
          throw new Error();
        }

        if (token.type === 'attribute' && token.name === 'class' && token.value === targetClassName) {
          return; // Found it
        }
      }
    } catch (err) {
      throw new Error(defaultOutdent(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(["\n        Invalid selector: ", "\n    \n        Style selectors must target the '&' character (along with any modifiers), e.g. ", " or ", ".\n        \n        This is to ensure that each style block only affects the styling of a single class.\n        \n        If your selector is targeting another class, you should move it to the style definition for that class, e.g. given we have styles for 'parent' and 'child' elements, instead of adding a selector of ", ") to 'parent', you should add ", " to 'child').\n        \n        If your selector is targeting something global, use the 'globalStyle' function instead, e.g. if you wanted to write ", ", you should instead write 'globalStyle(", ", { ... })'\n      "])), replaceTarget(), '`${parent} &`', '`${parent} &:hover`', '`& ${child}`', '`${parent} &`', '`& h1`', '`${parent} h1`'));
    }
  });
};

class ConditionalRuleset {
  /**
   * Stores information about where conditions must in relation to other conditions
   *
   * e.g. mobile -> tablet, desktop
   */
  constructor() {
    this.ruleset = [];
    this.precedenceLookup = new Map();
  }

  findOrCreateCondition(conditionQuery) {
    var targetCondition = this.ruleset.find(cond => cond.query === conditionQuery);

    if (!targetCondition) {
      // No target condition so create one
      targetCondition = {
        query: conditionQuery,
        rules: [],
        children: new ConditionalRuleset()
      };
      this.ruleset.push(targetCondition);
    }

    return targetCondition;
  }

  getConditionalRulesetByPath(conditionPath) {
    var currRuleset = this;

    for (var query of conditionPath) {
      var condition = currRuleset.findOrCreateCondition(query);
      currRuleset = condition.children;
    }

    return currRuleset;
  }

  addRule(rule, conditionQuery, conditionPath) {
    var ruleset = this.getConditionalRulesetByPath(conditionPath);
    var targetCondition = ruleset.findOrCreateCondition(conditionQuery);

    if (!targetCondition) {
      throw new Error('Failed to add conditional rule');
    }

    targetCondition.rules.push(rule);
  }

  addConditionPrecedence(conditionPath, conditionOrder) {
    var ruleset = this.getConditionalRulesetByPath(conditionPath);

    for (var i = 0; i < conditionOrder.length; i++) {
      var _ruleset$precedenceLo;

      var condition = conditionOrder[i];
      var conditionPrecedence = (_ruleset$precedenceLo = ruleset.precedenceLookup.get(condition)) !== null && _ruleset$precedenceLo !== void 0 ? _ruleset$precedenceLo : new Set();

      for (var lowerPrecedenceCondition of conditionOrder.slice(i + 1)) {
        conditionPrecedence.add(lowerPrecedenceCondition);
      }

      ruleset.precedenceLookup.set(condition, conditionPrecedence);
    }
  }

  isCompatible(incomingRuleset) {
    var _this = this;

    for (var [condition, orderPrecedence] of this.precedenceLookup.entries()) {
      for (var lowerPrecedenceCondition of orderPrecedence) {
        var _incomingRuleset$prec;

        if ((_incomingRuleset$prec = incomingRuleset.precedenceLookup.get(lowerPrecedenceCondition)) !== null && _incomingRuleset$prec !== void 0 && _incomingRuleset$prec.has(condition)) {
          return false;
        }
      }
    } // Check that children are compatible


    var _loop = function _loop(query, children) {
      var matchingCondition = _this.ruleset.find(cond => cond.query === query);

      if (matchingCondition && !matchingCondition.children.isCompatible(children)) {
        return {
          v: false
        };
      }
    };

    for (var {
      query,
      children
    } of incomingRuleset.ruleset) {
      var _ret = _loop(query, children);

      if (typeof _ret === "object") return _ret.v;
    }

    return true;
  }

  merge(incomingRuleset) {
    var _this2 = this;

    var _loop2 = function _loop2(query, rules, children) {
      var matchingCondition = _this2.ruleset.find(cond => cond.query === query);

      if (matchingCondition) {
        matchingCondition.rules.push(...rules);
        matchingCondition.children.merge(children);
      } else {
        _this2.ruleset.push({
          query,
          rules,
          children
        });
      }
    };

    // Merge rulesets into one array
    for (var {
      query,
      rules,
      children
    } of incomingRuleset.ruleset) {
      _loop2(query, rules, children);
    } // Merge order precedences


    for (var [condition, incomingOrderPrecedence] of incomingRuleset.precedenceLookup.entries()) {
      var _this$precedenceLooku;

      var orderPrecedence = (_this$precedenceLooku = this.precedenceLookup.get(condition)) !== null && _this$precedenceLooku !== void 0 ? _this$precedenceLooku : new Set();
      this.precedenceLookup.set(condition, new Set([...orderPrecedence, ...incomingOrderPrecedence]));
    }
  }
  /**
   * Merge another ConditionalRuleset into this one if they are compatible
   *
   * @returns true if successful, false if the ruleset is incompatible
   */


  mergeIfCompatible(incomingRuleset) {
    if (!this.isCompatible(incomingRuleset)) {
      return false;
    }

    this.merge(incomingRuleset);
    return true;
  }

  sort() {
    this.ruleset.sort((a, b) => {
      var aWeights = this.precedenceLookup.get(a.query);

      if (aWeights !== null && aWeights !== void 0 && aWeights.has(b.query)) {
        // A is higher precedence
        return -1;
      }

      var bWeights = this.precedenceLookup.get(b.query);

      if (bWeights !== null && bWeights !== void 0 && bWeights.has(a.query)) {
        // B is higher precedence
        return 1;
      }

      return 0;
    });
  }

  renderToArray() {
    // Sort rulesets according to required rule order
    this.sort();
    var arr = [];

    for (var {
      query,
      rules,
      children
    } of this.ruleset) {
      var selectors = {};

      for (var rule of rules) {
        selectors[rule.selector] = rule.rule;
      }

      Object.assign(selectors, ...children.renderToArray());
      arr.push({
        [query]: selectors
      });
    }

    return arr;
  }

}

var simplePseudoMap = {
  ':-moz-any-link': true,
  ':-moz-full-screen': true,
  ':-moz-placeholder': true,
  ':-moz-read-only': true,
  ':-moz-read-write': true,
  ':-ms-fullscreen': true,
  ':-ms-input-placeholder': true,
  ':-webkit-any-link': true,
  ':-webkit-full-screen': true,
  '::-moz-placeholder': true,
  '::-moz-progress-bar': true,
  '::-moz-range-progress': true,
  '::-moz-range-thumb': true,
  '::-moz-range-track': true,
  '::-moz-selection': true,
  '::-ms-backdrop': true,
  '::-ms-browse': true,
  '::-ms-check': true,
  '::-ms-clear': true,
  '::-ms-fill': true,
  '::-ms-fill-lower': true,
  '::-ms-fill-upper': true,
  '::-ms-reveal': true,
  '::-ms-thumb': true,
  '::-ms-ticks-after': true,
  '::-ms-ticks-before': true,
  '::-ms-tooltip': true,
  '::-ms-track': true,
  '::-ms-value': true,
  '::-webkit-backdrop': true,
  '::-webkit-input-placeholder': true,
  '::-webkit-progress-bar': true,
  '::-webkit-progress-inner-value': true,
  '::-webkit-progress-value': true,
  '::-webkit-resizer': true,
  '::-webkit-scrollbar-button': true,
  '::-webkit-scrollbar-corner': true,
  '::-webkit-scrollbar-thumb': true,
  '::-webkit-scrollbar-track-piece': true,
  '::-webkit-scrollbar-track': true,
  '::-webkit-scrollbar': true,
  '::-webkit-slider-runnable-track': true,
  '::-webkit-slider-thumb': true,
  '::after': true,
  '::backdrop': true,
  '::before': true,
  '::cue': true,
  '::first-letter': true,
  '::first-line': true,
  '::grammar-error': true,
  '::placeholder': true,
  '::selection': true,
  '::spelling-error': true,
  ':active': true,
  ':after': true,
  ':any-link': true,
  ':before': true,
  ':blank': true,
  ':checked': true,
  ':default': true,
  ':defined': true,
  ':disabled': true,
  ':empty': true,
  ':enabled': true,
  ':first': true,
  ':first-child': true,
  ':first-letter': true,
  ':first-line': true,
  ':first-of-type': true,
  ':focus': true,
  ':focus-visible': true,
  ':focus-within': true,
  ':fullscreen': true,
  ':hover': true,
  ':in-range': true,
  ':indeterminate': true,
  ':invalid': true,
  ':last-child': true,
  ':last-of-type': true,
  ':left': true,
  ':link': true,
  ':only-child': true,
  ':only-of-type': true,
  ':optional': true,
  ':out-of-range': true,
  ':placeholder-shown': true,
  ':read-only': true,
  ':read-write': true,
  ':required': true,
  ':right': true,
  ':root': true,
  ':scope': true,
  ':target': true,
  ':valid': true,
  ':visited': true
};
var simplePseudos = Object.keys(simplePseudoMap);
var simplePseudoLookup = simplePseudoMap;

var _templateObject;

var createMediaQueryError = (mediaQuery, msg) => new Error(defaultOutdent(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    Invalid media query: \"", "\"\n\n    ", "\n\n    Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries\n  "])), mediaQuery, msg));

var validateMediaQuery = mediaQuery => {
  // Empty queries will start with '@media '
  if (mediaQuery === '@media ') {
    throw createMediaQueryError(mediaQuery, 'Query is empty');
  }

  try {
    toAST(mediaQuery);
  } catch (e) {
    throw createMediaQueryError(mediaQuery, e.message);
  }
};

var _excluded = ["vars"],
    _excluded2 = ["content"];
var UNITLESS = {
  animationIterationCount: true,
  borderImage: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  gridArea: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnStart: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowStart: true,
  initialLetter: true,
  lineClamp: true,
  lineHeight: true,
  maxLines: true,
  opacity: true,
  order: true,
  orphans: true,
  scale: true,
  tabSize: true,
  WebkitLineClamp: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // svg properties
  fillOpacity: true,
  floodOpacity: true,
  maskBorder: true,
  maskBorderOutset: true,
  maskBorderSlice: true,
  maskBorderWidth: true,
  shapeImageThreshold: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};

function dashify(str) {
  return str.replace(/([A-Z])/g, '-$1').replace(/^ms-/, '-ms-').toLowerCase();
}

var DOUBLE_SPACE = '  ';
var specialKeys = [...simplePseudos, '@media', '@supports', 'selectors'];

class Stylesheet {
  constructor(localClassNames, composedClassLists) {
    this.rules = [];
    this.conditionalRulesets = [new ConditionalRuleset()];
    this.fontFaceRules = [];
    this.keyframesRules = [];
    this.localClassNameRegex = localClassNames.length > 0 ? RegExp("(".concat(localClassNames.map(escapeStringRegexp).join('|'), ")"), 'g') : null; // Class list compositions should be priortized by Newer > Older
    // Therefore we reverse the array as they are added in sequence

    this.composedClassLists = composedClassLists.map(_ref => {
      var {
        identifier,
        classList
      } = _ref;
      return {
        identifier,
        regex: RegExp("(".concat(classList, ")"), 'g')
      };
    }).reverse();
  }

  processCssObj(root) {
    if (root.type === 'fontFace') {
      this.fontFaceRules.push(root.rule);
      return;
    }

    if (root.type === 'keyframes') {
      this.keyframesRules.push(root);
      return;
    } // Add main styles


    var mainRule = omit(root.rule, specialKeys);
    this.addRule({
      selector: root.selector,
      rule: mainRule
    });
    this.currConditionalRuleset = new ConditionalRuleset();
    this.transformMedia(root, root.rule['@media']);
    this.transformSupports(root, root.rule['@supports']);
    this.transformSimplePseudos(root, root.rule);
    this.transformSelectors(root, root.rule);
    var activeConditionalRuleset = this.conditionalRulesets[this.conditionalRulesets.length - 1];

    if (!activeConditionalRuleset.mergeIfCompatible(this.currConditionalRuleset)) {
      // Ruleset merge failed due to incompatibility. We now deopt by starting a fresh ConditionalRuleset
      this.conditionalRulesets.push(this.currConditionalRuleset);
    }
  }

  addConditionalRule(cssRule, conditions) {
    // Run `pixelifyProperties` before `transformVars` as we don't want to pixelify CSS Vars
    var rule = this.transformVars(this.transformContent(this.pixelifyProperties(cssRule.rule)));
    var selector = this.transformSelector(cssRule.selector);

    if (!this.currConditionalRuleset) {
      throw new Error("Couldn't add conditional rule");
    }

    var conditionQuery = conditions[conditions.length - 1];
    var parentConditions = conditions.slice(0, conditions.length - 1);
    this.currConditionalRuleset.addRule({
      selector,
      rule
    }, conditionQuery, parentConditions);
  }

  addRule(cssRule) {
    // Run `pixelifyProperties` before `transformVars` as we don't want to pixelify CSS Vars
    var rule = this.transformVars(this.transformContent(this.pixelifyProperties(cssRule.rule)));
    var selector = this.transformSelector(cssRule.selector);
    this.rules.push({
      selector,
      rule
    });
  }

  pixelifyProperties(cssRule) {
    forEach(cssRule, (value, key) => {
      if (typeof value === 'number' && value !== 0 && !UNITLESS[key]) {
        // @ts-expect-error Any ideas?
        cssRule[key] = "".concat(value, "px");
      }
    });
    return cssRule;
  }

  transformVars(_ref2) {
    var {
      vars
    } = _ref2,
        rest = _objectWithoutProperties(_ref2, _excluded);

    if (!vars) {
      return rest;
    }

    return _objectSpread2(_objectSpread2({}, mapKeys(vars, (_value, key) => getVarName(key))), rest);
  }

  transformContent(_ref3) {
    var {
      content
    } = _ref3,
        rest = _objectWithoutProperties(_ref3, _excluded2);

    if (typeof content === 'undefined') {
      return rest;
    } // Handle fallback arrays:


    var contentArray = Array.isArray(content) ? content : [content];
    return _objectSpread2({
      content: contentArray.map(value => // This logic was adapted from Stitches :)
      value && (value.includes('"') || value.includes("'") || /^([A-Za-z\-]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)(\s|$)/.test(value)) ? value : "\"".concat(value, "\""))
    }, rest);
  }

  transformSelector(selector) {
    // Map class list compositions to single identifiers
    var transformedSelector = selector;

    var _loop = function _loop(identifier, regex) {
      transformedSelector = transformedSelector.replace(regex, () => {
        markCompositionUsed(identifier);
        return identifier;
      });
    };

    for (var {
      identifier,
      regex
    } of this.composedClassLists) {
      _loop(identifier, regex);
    }

    return this.localClassNameRegex ? transformedSelector.replace(this.localClassNameRegex, (_, className, index) => {
      if (index > 0 && transformedSelector[index - 1] === '.') {
        return className;
      }

      return ".".concat(cssesc_1(className, {
        isIdentifier: true
      }));
    }) : transformedSelector;
  }

  transformSelectors(root, rule, conditions) {
    forEach(rule.selectors, (selectorRule, selector) => {
      if (root.type !== 'local') {
        throw new Error("Selectors are not allowed within ".concat(root.type === 'global' ? '"globalStyle"' : '"selectors"'));
      }

      var transformedSelector = this.transformSelector(selector.replace(RegExp('&', 'g'), root.selector));
      validateSelector(transformedSelector, root.selector);
      var rule = {
        selector: transformedSelector,
        rule: omit(selectorRule, specialKeys)
      };

      if (conditions) {
        this.addConditionalRule(rule, conditions);
      } else {
        this.addRule(rule);
      }

      var selectorRoot = {
        type: 'selector',
        selector: transformedSelector,
        rule: selectorRule
      };
      this.transformSupports(selectorRoot, selectorRule['@supports'], conditions);
      this.transformMedia(selectorRoot, selectorRule['@media'], conditions);
    });
  }

  transformMedia(root, rules) {
    var parentConditions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (rules) {
      var _this$currConditional;

      (_this$currConditional = this.currConditionalRuleset) === null || _this$currConditional === void 0 ? void 0 : _this$currConditional.addConditionPrecedence(parentConditions, Object.keys(rules).map(query => "@media ".concat(query)));
      forEach(rules, (mediaRule, query) => {
        var mediaQuery = "@media ".concat(query);
        validateMediaQuery(mediaQuery);
        var conditions = [...parentConditions, mediaQuery];
        this.addConditionalRule({
          selector: root.selector,
          rule: omit(mediaRule, specialKeys)
        }, conditions);

        if (root.type === 'local') {
          this.transformSimplePseudos(root, mediaRule, conditions);
          this.transformSelectors(root, mediaRule, conditions);
        }

        this.transformSupports(root, mediaRule['@supports'], conditions);
      });
    }
  }

  transformSupports(root, rules) {
    var parentConditions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (rules) {
      var _this$currConditional2;

      (_this$currConditional2 = this.currConditionalRuleset) === null || _this$currConditional2 === void 0 ? void 0 : _this$currConditional2.addConditionPrecedence(parentConditions, Object.keys(rules).map(query => "@supports ".concat(query)));
      forEach(rules, (supportsRule, query) => {
        var conditions = [...parentConditions, "@supports ".concat(query)];
        this.addConditionalRule({
          selector: root.selector,
          rule: omit(supportsRule, specialKeys)
        }, conditions);

        if (root.type === 'local') {
          this.transformSimplePseudos(root, supportsRule, conditions);
          this.transformSelectors(root, supportsRule, conditions);
        }

        this.transformMedia(root, supportsRule['@media'], conditions);
      });
    }
  }

  transformSimplePseudos(root, rule, conditions) {
    for (var key of Object.keys(rule)) {
      // Process simple pseudos
      if (simplePseudoLookup[key]) {
        if (root.type !== 'local') {
          throw new Error("Simple pseudos are not valid in ".concat(root.type === 'global' ? '"globalStyle"' : '"selectors"'));
        }

        if (conditions) {
          this.addConditionalRule({
            selector: "".concat(root.selector).concat(key),
            rule: rule[key]
          }, conditions);
        } else {
          this.addRule({
            conditions,
            selector: "".concat(root.selector).concat(key),
            rule: rule[key]
          });
        }
      }
    }
  }

  toCss() {
    var css = []; // Render font-face rules

    for (var fontFaceRule of this.fontFaceRules) {
      css.push(renderCss({
        '@font-face': fontFaceRule
      }));
    } // Render keyframes


    for (var keyframe of this.keyframesRules) {
      css.push(renderCss({
        ["@keyframes ".concat(keyframe.name)]: keyframe.rule
      }));
    } // Render unconditional rules


    for (var rule of this.rules) {
      css.push(renderCss({
        [rule.selector]: rule.rule
      }));
    } // Render conditional rules


    for (var conditionalRuleset of this.conditionalRulesets) {
      for (var conditionalRule of conditionalRuleset.renderToArray()) {
        css.push(renderCss(conditionalRule));
      }
    }

    return css.filter(Boolean);
  }

}

function renderCss(v) {
  var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var rules = [];

  var _loop2 = function _loop2(key) {
    var value = v[key];

    if (value && Array.isArray(value)) {
      rules.push(...value.map(v => renderCss({
        [key]: v
      }, indent)));
    } else if (value && typeof value === 'object') {
      var isEmpty = Object.keys(value).length === 0;

      if (!isEmpty) {
        rules.push("".concat(indent).concat(key, " {\n").concat(renderCss(value, indent + DOUBLE_SPACE), "\n").concat(indent, "}"));
      }
    } else {
      rules.push("".concat(indent).concat(key.startsWith('--') ? key : dashify(key), ": ").concat(value, ";"));
    }
  };

  for (var key of Object.keys(v)) {
    _loop2(key);
  }

  return rules.join('\n');
}

function transformCss(_ref4) {
  var {
    localClassNames,
    cssObjs,
    composedClassLists
  } = _ref4;
  var stylesheet = new Stylesheet(localClassNames, composedClassLists);

  for (var root of cssObjs) {
    stylesheet.processCssObj(root);
  }

  return stylesheet.toCss();
}

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

var localClassNames = new Set();
var composedClassLists = [];
var bufferedCSSObjs = [];
var browserRuntimeAdapter = {
  appendCss: cssObj => {
    bufferedCSSObjs.push(cssObj);
  },
  registerClassName: className => {
    localClassNames.add(className);
  },
  registerComposition: composition => {
    composedClassLists.push(composition);
  },
  markCompositionUsed: () => {},
  onEndFileScope: fileScope => {
    var css = transformCss({
      localClassNames: Array.from(localClassNames),
      composedClassLists,
      cssObjs: bufferedCSSObjs
    }).join('\n');
    injectStyles({
      fileScope,
      css
    });
    bufferedCSSObjs = [];
  },
  getIdentOption: () => process.env.NODE_ENV === 'production' ? 'short' : 'debug'
};

if (typeof window !== 'undefined') {
  setAdapterIfNotSet(browserRuntimeAdapter);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _wrapRegExp() {
  _wrapRegExp = function (re, groups) {
    return new BabelRegExp(re, undefined, groups);
  };

  var _super = RegExp.prototype;

  var _groups = new WeakMap();

  function BabelRegExp(re, flags, groups) {
    var _this = new RegExp(re, flags);

    _groups.set(_this, groups || _groups.get(re));

    return _setPrototypeOf(_this, BabelRegExp.prototype);
  }

  _inherits(BabelRegExp, RegExp);

  BabelRegExp.prototype.exec = function (str) {
    var result = _super.exec.call(this, str);

    if (result) result.groups = buildGroups(result, this);
    return result;
  };

  BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
    if (typeof substitution === "string") {
      var groups = _groups.get(this);

      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
        return "$" + groups[name];
      }));
    } else if (typeof substitution === "function") {
      var _this = this;

      return _super[Symbol.replace].call(this, str, function () {
        var args = arguments;

        if (typeof args[args.length - 1] !== "object") {
          args = [].slice.call(args);
          args.push(buildGroups(args, _this));
        }

        return substitution.apply(this, args);
      });
    } else {
      return _super[Symbol.replace].call(this, str, substitution);
    }
  };

  function buildGroups(result, re) {
    var g = _groups.get(re);

    return Object.keys(g).reduce(function (groups, name) {
      groups[name] = result[g[name]];
      return groups;
    }, Object.create(null));
  }

  return _wrapRegExp.apply(this, arguments);
}

function getDevPrefix(debugId) {
  var parts = debugId ? [debugId.replace(/\s/g, '_')] : [];
  var {
    filePath
  } = getFileScope();
  var matches = filePath.match( /*#__PURE__*/_wrapRegExp(/((?:(?![\/\\])[\s\S])*)?[\/\\]?((?:(?![\/\\])[\s\S])*)\.css\.(ts|js|tsx|jsx)$/, {
    dir: 1,
    file: 2
  }));

  if (matches && matches.groups) {
    var {
      dir,
      file
    } = matches.groups;
    parts.unshift(file && file !== 'index' ? file : dir);
  }

  return parts.join('_');
}

function generateIdentifier(debugId) {
  // Convert ref count to base 36 for optimal hash lengths
  var refCount = getAndIncrementRefCounter().toString(36);
  var {
    filePath,
    packageName
  } = getFileScope();
  var fileScopeHash = murmur2(packageName ? "".concat(packageName).concat(filePath) : filePath);
  var identifier = "".concat(fileScopeHash).concat(refCount);

  if (getIdentOption() === 'debug') {
    var devPrefix = getDevPrefix(debugId);

    if (devPrefix) {
      identifier = "".concat(devPrefix, "__").concat(identifier);
    }
  }

  return identifier.match(/^[0-9]/) ? "_".concat(identifier) : identifier;
}

function composedStyle(rules, debugId) {
  var className = generateIdentifier(debugId);
  registerClassName(className);
  var classList = [];
  var styleRules = [];

  for (var rule of rules) {
    if (typeof rule === 'string') {
      classList.push(rule);
    } else {
      styleRules.push(rule);
    }
  }

  var result = className;

  if (classList.length > 0) {
    result = "".concat(className, " ").concat(dudupeAndJoinClassList(classList));
    registerComposition({
      identifier: className,
      classList: result
    });

    if (styleRules.length > 0) {
      // If there are styles attached to this composition then it is
      // always used and should never be removed
      markCompositionUsed(className);
    }
  }

  if (styleRules.length > 0) {
    var _rule = cjs.all(styleRules, {
      // Replace arrays rather than merging
      arrayMerge: (_, sourceArray) => sourceArray
    });

    appendCss({
      type: 'local',
      selector: className,
      rule: _rule
    }, getFileScope());
  }

  return result;
}

function style(rule, debugId) {
  if (Array.isArray(rule)) {
    return composedStyle(rule, debugId);
  }

  var className = generateIdentifier(debugId);
  registerClassName(className);
  appendCss({
    type: 'local',
    selector: className,
    rule
  }, getFileScope());
  return className;
}

setFileScope("src/components/SectionRoot.css.ts", "react-slide-sections");
var SectionRootStyle = style({
  width: "100%",
  height: "100vh"
}, "SectionRootStyle");
var SectionRootItemWrapperStyle = style({
  width: "100%",
  height: "100vh"
}, "SectionRootItemWrapperStyle");

endFileScope();

var scrollThrottle;
var SectionRoot = function SectionRoot(_ref) {
  var children = _ref.children;
  var rootElementRef = useRef(null);

  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      activeIdx = _useState2[0],
      setActiveIdx = _useState2[1];

  var _useState3 = useState(window.pageYOffset || window.scrollY),
      _useState4 = _slicedToArray(_useState3, 2),
      lastScrollY = _useState4[0],
      setLastScrollY = _useState4[1];

  var _useState5 = useState(true),
      _useState6 = _slicedToArray(_useState5, 2),
      scrollable = _useState6[0],
      setScrollable = _useState6[1];

  var detectScrollDirection = useCallback(function (e) {
    var currentWindow = e.currentTarget;
    var isScrollUp = lastScrollY > currentWindow.scrollTop;
    var isScrollDown = lastScrollY < currentWindow.scrollTop;

    if (isScrollDown) {
      return "SCROLL_DOWN";
    }

    if (isScrollUp) {
      return "SCROLL_UP";
    }

    return;
  }, [lastScrollY]);

  var handleScrollThrottle = function handleScrollThrottle() {
    // TODO
    scrollThrottle = true;
    setTimeout(function () {
      scrollThrottle = false;
    }, 1000);
  };

  var setScreenNotScrollableDuringScrollThrottle = useCallback(function () {
    setScrollable(false);
    setTimeout(function () {
      setScrollable(true);
    }, 1200);
  }, [scrollable]);

  var windowScrollTo = function windowScrollTo(position) {
    rootElementRef.current.scrollTo({
      left: 0,
      top: position,
      behavior: "smooth"
    });
    return;
  };

  var handleScroll = useCallback(function (e) {
    if (scrollThrottle) {
      // scroll Action Processing Throttle
      return;
    } // if not processing scroll Action


    handleScrollThrottle(); // Detect Scroll Direction

    var scrollDirection = detectScrollDirection(e);

    if (scrollDirection === "SCROLL_DOWN") {
      var nextActiveIdx = activeIdx < children.length - 1 ? activeIdx + 1 : children.length - 1;
      setActiveIdx(nextActiveIdx);
      setLastScrollY(nextActiveIdx * rootElementRef.current.clientHeight);
      setScreenNotScrollableDuringScrollThrottle();
      windowScrollTo(nextActiveIdx * rootElementRef.current.clientHeight);
      return;
    }

    if (scrollDirection === "SCROLL_UP") {
      var _nextActiveIdx = activeIdx > 0 ? activeIdx - 1 : 0;

      setActiveIdx(_nextActiveIdx);
      setLastScrollY(_nextActiveIdx * rootElementRef.current.clientHeight);
      setScreenNotScrollableDuringScrollThrottle();
      windowScrollTo(_nextActiveIdx * rootElementRef.current.clientHeight); // console.log(
      //   "scroll Up To:",
      //   nextActiveIdx * rootElementRef.current.clientHeight
      // );

      return;
    }
  }, [rootElementRef, detectScrollDirection, setScreenNotScrollableDuringScrollThrottle, activeIdx, children]);
  useEffect(function () {
    rootElementRef.current.addEventListener("scroll", handleScroll);
    return function () {
      rootElementRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
  return /*#__PURE__*/React.createElement("main", {
    ref: rootElementRef,
    className: SectionRootStyle,
    style: {
      overflow: scrollable ? "auto" : "hidden"
    }
  }, React.Children.map(children, function (child, idx) {
    return /*#__PURE__*/React.createElement("section", {
      className: SectionRootItemWrapperStyle,
      style: {
        zIndex: 100 - idx
      }
    }, child);
  }));
};

export { SectionRoot };
//# sourceMappingURL=index.mjs.map
