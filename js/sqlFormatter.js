// Based on https://github.com/zeroturnaround/sql-formatter
// Adapted for Vector & PX Standards by https://github.com/cafread

(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if (typeof define === 'function' && define.amd)
    define([], factory);
  else if (typeof exports === 'object')
    exports.sqlFormatter = factory();
  else
    root.sqlFormatter = factory();
})(window, function() {
return  (function(modules) { // webpackBootstrap
   // The module cache
   let installedModules = {};
   // The require function
   function _wprq_(moduleId) {
     // Check if module is in cache
     if (installedModules[moduleId]) {
       return installedModules[moduleId].exports;
     }
     // Create a new module (and put it into the cache)
     let module = installedModules[moduleId] = {
       i: moduleId,
       l: false,
       exports: {}
     };
     // Execute the module function
     modules[moduleId].call(module.exports, module, module.exports, _wprq_);
     // Flag the module as loaded
     module.l = true;
     // Return the exports of the module
     return module.exports;
   }
   // expose the modules object (__webpack_modules__)
   _wprq_.m = modules;
   // expose the module cache
   _wprq_.c = installedModules;
   // define getter function for harmony exports
   _wprq_.d = function(exports, name, getter) {
     if (!_wprq_.o(exports, name)) {
       Object.defineProperty(exports, name, {enumerable: true, get: getter});
     }
   };
   // define __esModule on exports
   _wprq_.r = function(exports) {
     if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
       Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
     }
     Object.defineProperty(exports, '__esModule', {value: true});
   };
   // create a fake namespace object
   // mode & 1: value is a module id, require it
   // mode & 2: merge all properties of value into the ns
   // mode & 4: return value when already ns object
   // mode & 8|1: behave like require
   _wprq_.t = function(value, mode) {
     if (mode & 1) value = _wprq_(value);
     if (mode & 8) return value;
     if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
     let ns = Object.create(null);
     _wprq_.r(ns);
     Object.defineProperty(ns, 'vector', { enumerable: true, value: value });
     if (mode & 2 && typeof value != 'string') for(let key in value) _wprq_.d(ns, key, function(key) { return value[key]; }.bind(null, key));
     return ns;
   };
   // getDefaultExport function for compatibility with non-harmony modules
   _wprq_.n = function(module) {
    let getter = module && module.__esModule ?
       function getDefault() { return module['vector']; } :
       function getModuleExports() { return module; };
     _wprq_.d(getter, 'a', getter);
     return getter;
   };
   // Object.prototype.hasOwnProperty.call
   _wprq_.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
   // __webpack_public_path__
   _wprq_.p = "";
   // Load entry module and return exports
   return _wprq_(_wprq_.s = "./src/sqlFormatter.js");
 })
({
  "./src/core/Formatter.js":
  (function(module, _wpex_, _wprq_) {
    "use strict";
    _wprq_.r(_wpex_);
    _wprq_.d(_wpex_, "vector", function() {return Formatter;});
    let _tokenTypes_WIM0__  = _wprq_("./src/core/tokenTypes.js");
    let _Indentation_WIM1__ = _wprq_("./src/core/Indentation.js");
    let _InlineBlock_WIM2__ = _wprq_("./src/core/InlineBlock.js");
    let _Params_WIM3__      = _wprq_("./src/core/Params.js");
    let _utils_WIM4__       = _wprq_("./src/utils.js");
    let _token_WIM5__       = _wprq_("./src/core/token.js");
    function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj;}
    function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function"); }}
    function _defineProperties(target, props) {for (let i = 0; i < props.length; i++) {let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); }}
    function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor;}
    const Formatter = function () {
      /**
       * @param {Object} cfg
       *  @param {String} cfg.language
       *  @param {String} cfg.indent
       *  @param {Boolean} cfg.uppercase
       *  @param {Integer} cfg.linesBetweenQueries
       *  @param {Object} cfg.params
       */
      function Formatter(cfg) {
        _classCallCheck(this, Formatter);
        this.cfg = cfg;
        this.indentation = new _Indentation_WIM1__.vector(this.cfg.indent);
        this.inlineBlock = new _InlineBlock_WIM2__.vector();
        this.params = new _Params_WIM3__.vector(this.cfg.params);
        this.previousReservedToken = {};
        this.tokens = [];
        this.index = 0;
      }
      // SQL Tokenizer for this formatter, provided by subclasses.
      _createClass(Formatter, [{
        key: "tokenizer",
        value: function tokenizer() {
          throw new Error('tokenizer() not implemented by subclass');
        }
        /**
         * Reprocess and modify a token based on parsed context.
         *
         * @param {Object} token The token to modify
         *  @param {String} token.type
         *  @param {String} token.value
         * @return {Object} new token or the original
         *  @return {String} token.type
         *  @return {String} token.value
         */
      }, {
        key: "tokenOverride",
        value: function tokenOverride(token) {
          // subclasses can override this to modify tokens during formatting
          return token;
        }
        /**
         * Formats whitespace in a SQL string to make it easier to read.
         *
         * @param {String} query The SQL query string
         * @return {String} formatted query
         */
      }, {
        key: "format",
        value: function format(query) {
          this.tokens = this.tokenizer().tokenize(query);
          let formattedQuery = this.getFormattedQueryFromTokens();
          return formattedQuery.trim();
        }
      }, {
        key: "getFormattedQueryFromTokens",
        value: function getFormattedQueryFromTokens() {
          let _this = this;
          let formattedQuery = '';
          let inCreate = 0;
          let prevToken = undefined;
          this.tokens.forEach(function (token, index) {
            _this.index = index;
            token = _this.tokenOverride(token);
            if (token.value.toUpperCase() === 'CREATE' && token.type !== 'string') {
              inCreate = 1;
            } else if (inCreate === 1 && token.value === '(' && token.type !== 'string') { // && Not CTAS
              // If we can find 'SELECT' between the last 'CREATE' and the end of formattedQuery
              // need regex so we don't end up matching something in an alias / table name of best_selections etc.
              let splitByCreate = formattedQuery.split(/\bCREATE\b/gi);
              let afterCreate = splitByCreate[splitByCreate.length - 1];
              let isCTAS = afterCreate.match(/\bSELECT\b/gi) !== null || afterCreate.match(/\bWITH\b/gi) !== null;
              inCreate = isCTAS ? 0 : 2;
            } else if (inCreate === 2 && token.value === ';' && token.type !== 'string') {
              inCreate = 0;
              // If someone is daft enough to have fields that share names with reserved words and not quote them, fix that
            } else if (inCreate === 2 && token.type === 'reserved' && [',', '('].indexOf(prevToken.value) !== -1 && token.value.toUpperCase() !== 'PRIMARY') {
              token.value = '"' + token.value.toLowerCase() + '"';
              token.type = 'string';
            }
            if (token.type === _tokenTypes_WIM0__.vector.LINE_COMMENT) {
              formattedQuery = _this.formatLineComment(token, formattedQuery);
            } else if (token.type === _tokenTypes_WIM0__.vector.BLOCK_COMMENT) {
              formattedQuery = _this.formatBlockComment(token, formattedQuery);
            } else if (token.type === _tokenTypes_WIM0__.vector.RESERVED_TOP_LEVEL) {
              formattedQuery = _this.formatTopLevelReservedWord(token, formattedQuery);
              _this.previousReservedToken = token;
            } else if (token.type === _tokenTypes_WIM0__.vector.RESERVED_TOP_LEVEL_NO_INDENT) {
              formattedQuery = _this.formatTopLevelReservedWordNoIndent(token, formattedQuery);
              _this.previousReservedToken = token;
            } else if (token.type === _tokenTypes_WIM0__.vector.RESERVED_NEWLINE) {
              formattedQuery = _this.formatNewlineReservedWord(token, formattedQuery);
              _this.previousReservedToken = token;
            } else if (token.type === _tokenTypes_WIM0__.vector.RESERVED) {
              // Want SELECT FIRST 10 on a single line and SELECT DISTINCT AND SELECT FIRST 10 DISTINCT
              let isDF = ['DISTINCT', 'FIRST'].indexOf(token.value.toUpperCase()) > -1;
              let prSF = ['SELECT', 'FIRST'].indexOf(_this.previousReservedToken.value) > -1;
              let selE = (formattedQuery.match(/SELECT[ |\n]+(FIRST)?[0-9| |\n]+$/gi) || []).length > 0;
              if (isDF && prSF && selE) {
                formattedQuery = formattedQuery.replace(/SELECT[ |\n]+(FIRST)?[0-9| |\n]+$/gi, v => v.replace(/[\s\n]+/g, ' '));
                let curIndent = '\n' + (' ').repeat(2 + formattedQuery.split('\n').pop().indexOf('SELECT'));
                formattedQuery = formattedQuery.trim() + ' ' + token.value + curIndent;
              } else if (inCreate === 2 && reservedDataTypes.indexOf(token.value.toUpperCase()) > -1) {
                // Try to align data type in table create statement
                token.value = (' ').repeat(Math.max(0, dataTypeChPos - (formattedQuery.length - formattedQuery.lastIndexOf('\n')))) + token.value;
                formattedQuery = _this.formatWithSpaces(token, formattedQuery);
              } else if (inCreate === 2 && token.value.toUpperCase() === 'PRIMARY' && prevToken.value === ',') {
                // Align PRIMARY KEY (field...) at the end as if it were another field
                formattedQuery = _this.formatWithSpaces(token, formattedQuery);
              } else if (inCreate === 2 && reservedConstraints.indexOf(token.value.toUpperCase()) > -1) {
                // Align PRIMARY KEY (on one field), NULL, NOT NULL a bit further along
                token.value = (' ').repeat(Math.max(0, constraintChPos - (formattedQuery.length - formattedQuery.lastIndexOf('\n')))) + token.value;
                formattedQuery = _this.formatWithSpaces(token, formattedQuery);
              } else {
                formattedQuery = _this.formatWithSpaces(token, formattedQuery);
              }
              _this.previousReservedToken = token;
            } else if (token.type === _tokenTypes_WIM0__.vector.OPEN_PAREN) {
              formattedQuery = _this.formatOpeningParentheses(token, formattedQuery);
            } else if (token.type === _tokenTypes_WIM0__.vector.CLOSE_PAREN) {
              formattedQuery = _this.formatClosingParentheses(token, formattedQuery);
            } else if (token.type === _tokenTypes_WIM0__.vector.PLACEHOLDER) {
              formattedQuery = _this.formatPlaceholder(token, formattedQuery);
            } else if (token.value === ',') {
              formattedQuery = _this.formatComma(token, formattedQuery);
            } else if (token.value === ':') {
              formattedQuery = _this.formatWithSpaceAfter(token, formattedQuery);
            } else if (token.value === '.') {
              formattedQuery = _this.formatWithoutSpaces(token, formattedQuery);
            } else if (token.value === ';') {
              formattedQuery = _this.formatQuerySeparator(token, formattedQuery);
            } else {
              // In create statements, wrap field names with quotes, if they aren't already.  Don't wrap vector values / data types!
              if (inCreate === 2 && isNaN(parseInt(token.value)) && (["'", '"']).indexOf(token.value.substring(0, 1)) === -1) {
                token.value = '"' + token.value.toLowerCase() + '"';
              } else if (inCreate === 2 && isNaN(parseInt(token.value)) && (["'"]).indexOf(token.value.substring(0, 1)) === -1) {
                token.value = token.value.toLowerCase();
              }
              if (token.type === 'number' && formattedQuery.trim().slice(-12) === 'SELECT FIRST') {
                // Current query is already terminated with something like '\n  ' which we will reuse
                let qA = formattedQuery.split('\n');
                let ending = '\n' + qA[qA.length - 1];
                formattedQuery = formattedQuery.trim() + ' ' + token.value + ending;
              } else {
                formattedQuery = _this.formatWithSpaces(token, formattedQuery);
              }
            }
            prevToken = token;
          });
          // Put it on a single line if sensible to do so and get rid of unquoted whitespace
          if (formattedQuery.length < INLINE_MAX_LENGTH) {
            // If there are line comments (not -- in a quoted string) don't risk bugs
            if (!formattedQuery.replace(/"[^"]+"|(\*)/g, '').replace(/'[^']+'|(\*)/g, '').includes('--')) {
              formattedQuery = formattedQuery.replaceAll('\n', ' ').trim();
              // Clean up unquoted whitespace
              formattedQuery = formattedQuery.replace(/ {2,}(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/g, ' ');
            } else if (formattedQuery.replace('\n', '').substring(0, 2) === '--') {
              // If first line is a comment, collapse subsequent lines
              // if the rest does not contain --
              let qA = formattedQuery.split(/\n/g).filter(v => v != ''); // Query as array
              let qC = qA[0] + '\n';                                     // Comment on line 1
              let qn = qA.slice(1).map(e => e.trim()).join(' ');         // The rest
              // Regex match candidates, trim and check for --
              let qs = qn.match(/"[^"]*"|'[^']*'|\s+AS\s+|\s*((?:(?!\sAS\s)[^\s,])+)/gi).filter(e=>e.trim()==='--');
              if (qs.length === 0) formattedQuery = qC + qn;
              // Clean up unquoted whitespace
              formattedQuery = formattedQuery.replace(/ {2,}(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/g, ' ');
            }
            // No space before the semicolon at the end
            formattedQuery = formattedQuery.replace(/ ;$/, ';');
          }
          return formattedQuery;
        }
      }, {
        key: "formatLineComment",
        value: function formatLineComment(token, query) {
          return this.addNewline(query + this.show(token));
        }
      }, {
        key: "formatBlockComment",
        value: function formatBlockComment(token, query) {
          return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
        }
      }, {
        key: "indentComment",
        value: function indentComment(comment) {
          return comment.replace(/\n[\t ]*/g, '\n' + this.indentation.getIndent() + ' ');
        }
      }, {
        key: "formatTopLevelReservedWordNoIndent",
        value: function formatTopLevelReservedWordNoIndent(token, query) {
          this.indentation.decreaseTopLevel();
          query = this.addNewline(query) + this.equalizeWhitespace(this.show(token));
          return this.addNewline(query);
        }
      }, {
        key: "formatTopLevelReservedWord",
        value: function formatTopLevelReservedWord(token, query) {
          this.indentation.decreaseTopLevel();
          query = this.addNewline(query);
          this.indentation.increaseTopLevel();
          query += this.equalizeWhitespace(this.show(token));
          if (reservedTopLevelWordsNoLineAfter.includes(token.value.toUpperCase()) ) {
            return query + ' ';
          } else {
            return this.addNewline(query);
          }
        }
      }, {
        key: "formatNewlineReservedWord",
        value: function formatNewlineReservedWord(token, query) {
          if (Object(_token_WIM5__["isAnd"])(token) && Object(_token_WIM5__["isBetween"])(this.tokenLookBehind(2))) {
            return this.formatWithSpaces(token, query);
          }
          return this.addNewline(query) + this.equalizeWhitespace(this.show(token)) + (token.value.toUpperCase() === 'ON' ? '  ' : ' ');
        } // Replace any sequence of whitespace characters with single space
      }, {
        key: "equalizeWhitespace",
        value: function equalizeWhitespace(string) {
          return string.replace(/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/g, ' ');
        } // Opening parentheses increase the block indent level and start a new line
      }, {
        key: "formatOpeningParentheses",
        value: function formatOpeningParentheses(token, query) {
          let _preserveWhitespaceFo, _this$tokenLookBehind;
          // Take out the preceding space unless there was whitespace there in the original query
          // or another opening parens or line comment
          let preserveWhitespaceFor = (_preserveWhitespaceFo = {}, _defineProperty(_preserveWhitespaceFo, _tokenTypes_WIM0__.vector.OPEN_PAREN, true), _defineProperty(_preserveWhitespaceFo, _tokenTypes_WIM0__.vector.LINE_COMMENT, true), _defineProperty(_preserveWhitespaceFo, _tokenTypes_WIM0__.vector.OPERATOR, true), _preserveWhitespaceFo);
          if (token.whitespaceBefore.length === 0 && !preserveWhitespaceFor[(_this$tokenLookBehind = this.tokenLookBehind()) === null || _this$tokenLookBehind === void 0 ? void 0 : _this$tokenLookBehind.type]) {
            query = Object(_utils_WIM4__.trimSpacesEnd)(query);
          }
          // if the previous token was CHAR, VARCHAR, DECIMAL etc. don't include a space before the open bracket
          if (this.tokenLookBehind() && reservedDataTypes.indexOf(this.tokenLookBehind().value.toUpperCase()) > -1 && query.substring(-1) === ' ') {
            query = query.trimEnd();
          }
          // if the previous token was a function that takes arguments don't include a space before the open bracket
          if (this.tokenLookBehind() && reservedFuncTypes.indexOf(this.tokenLookBehind().value.toUpperCase()) > -1 && query.substring(-1) === ' ') {
            query = query.trimEnd();
          }
          query += this.show(token);
          this.inlineBlock.beginIfPossible(this.tokens, this.index);
          if (!this.inlineBlock.isActive()) {
            this.indentation.increaseBlockLevel();
            query = this.addNewline(query);
          }
          return query;
        } // Closing parentheses decrease the block indent level
      }, {
        key: "formatClosingParentheses",
        value: function formatClosingParentheses(token, query) {
          if (this.inlineBlock.isActive()) {
            this.inlineBlock.end();
            return this.formatWithSpaceAfter(token, query);
          } else {
            this.indentation.decreaseBlockLevel();
            return this.formatWithSpaces(token, this.addNewline(query));
          }
        }
      }, {
        key: "formatPlaceholder",
        value: function formatPlaceholder(token, query) {
          return query + this.params.get(token) + ' ';
        } // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
      }, {
        key: "formatComma",
        value: function formatComma(token, query) {
          query = Object(_utils_WIM4__.trimSpacesEnd)(query) + this.show(token) + ' ';
          if (this.inlineBlock.isActive()) {
            return query;
          } else if (Object(_token_WIM5__.isLimit)(this.previousReservedToken)) {
            return query;
          } else {
            return this.addNewline(query);
          }
        }
      }, {
        key: "formatWithSpaceAfter",
        value: function formatWithSpaceAfter(token, query) {
          return Object(_utils_WIM4__.trimSpacesEnd)(query) + this.show(token) + ' ';
        }
      }, {
        key: "formatWithoutSpaces",
        value: function formatWithoutSpaces(token, query) {
          return Object(_utils_WIM4__.trimSpacesEnd)(query) + this.show(token);
        }
      }, {
        key: "formatWithSpaces",
        value: function formatWithSpaces(token, query) {
          // When fields / tables / aliases are mentioned, they can come through as strings '"aBc"'
          // These should be set to lower case when the count of " is even and balanced at the ends
          if (token.type === 'string' && token.value[0] === '"' && token.value[token.value.length-1] === '"') {
            // if value has no internal " then set it to lower case
            if (!token.value.substring(1,token.value.length-2).includes('"')) token.value = token.value.toLowerCase();
          }
          // SQL standards dictate use of != rather than <> when it appears as an operator
          if (token.value === '<>' && token.type === 'operator') token.value = '!=';
          // When aliasing, the alias name should be lower case & quoted, take care not to catch CAST('1' AS INT) or numpas INT, also beware CTE in CTAS
          let qAs = '';
          let testAs = this.tokenLookBehind() && this.tokenLookBehind().value.toUpperCase() === 'AS';
          let tetNotDataType = reservedDataTypes.indexOf(token.value.toUpperCase()) === -1;
          let testNotCtasCte = token.value.toUpperCase() !== 'WITH' && query.replace(/^CREATE TABLE .+ AS $/, '') !== '';
          if (testAs && tetNotDataType && testNotCtasCte) {
            qAs = token.value.substring(0, 1) !== '"' ? '"' : '';
            token.value = token.value.toLowerCase();
          } else if (testAs && tetNotDataType && !testNotCtasCte) {
            return query.trim() + '\nWITH ';
          } else if (token.type === 'word') {
            // PX lower case handling for Vector before case sensitive allowed - table and field names in lower case, but not strings!
            token.value = token.value.toLowerCase();
          }
          return query + qAs + this.show(token) + qAs + ' ';
        }
      }, {
        key: "formatQuerySeparator",
        value: function formatQuerySeparator(token, query) {
          this.indentation.resetIndentation();
          // Prefix ; with a newline only when it's at least n characters to the previous new line
          let prefixWithNewLine = query.length - query.lastIndexOf('\n') < 10 ? '' : '\n';
          return Object(_utils_WIM4__.trimSpacesEnd)(query) + prefixWithNewLine + this.show(token);
        } // Converts token to string (uppercasing it if needed)
      }, {
        key: "show",
        value: function show(_ref) {
          let type = _ref.type;
          let value = _ref.value;
          if (this.cfg.uppercase && (type === _tokenTypes_WIM0__.vector.RESERVED || type === _tokenTypes_WIM0__.vector.RESERVED_TOP_LEVEL || type === _tokenTypes_WIM0__.vector.RESERVED_TOP_LEVEL_NO_INDENT || type === _tokenTypes_WIM0__.vector.RESERVED_NEWLINE || type === _tokenTypes_WIM0__.vector.OPEN_PAREN || type === _tokenTypes_WIM0__.vector.CLOSE_PAREN)) {
            return value.toUpperCase();
          } else {
            return value;
          }
        }
      }, {
        key: "addNewline",
        value: function addNewline(query) {
          query = Object(_utils_WIM4__.trimSpacesEnd)(query);
          if (!query.endsWith('\n')) query += '\n';
          return query + this.indentation.getIndent();
        }
      }, {
        key: "tokenLookBehind",
        value: function tokenLookBehind() {
          let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
          return this.tokens[this.index - n];
        }
      }, {
        key: "tokenLookAhead",
        value: function tokenLookAhead() {
          let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
          return this.tokens[this.index + n];
        }
      }]);
      return Formatter;
    }();
}),

 "./src/core/Indentation.js":
(function(module, _wpex_, _wprq_) {
    "use strict";
    _wprq_.r(_wpex_);
    _wprq_.d(_wpex_, "vector", function() { return Indentation; });
    let _utils_WIM0__ = _wprq_("./src/utils.js");
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    function _defineProperties(target, props) { for (let i = 0; i < props.length; i++) { let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    const INDENT_TYPE_TOP_LEVEL = 'top-level';
    const INDENT_TYPE_BLOCK_LEVEL = 'block-level';
    /**
     * Manages indentation levels.
     * There are two types of indentation levels:
     * - BLOCK_LEVEL : increased by open-parenthesis
     * - TOP_LEVEL : increased by RESERVED_TOP_LEVEL words
     */
    const Indentation = function () {
      /**
       * @param {String} indent Indent value, vector is "  " (2 spaces)
       */
      function Indentation(indent) {
        _classCallCheck(this, Indentation);
        this.indent = indent || '  ';
        this.indentTypes = [];
      }
      /**
       * Returns current indentation string.
       * @return {String}
       */
      _createClass(Indentation, [{
        key: "getIndent",
        value: function getIndent() {
          return this.indent.repeat(this.indentTypes.length);
        }
        // Increases indentation by one top-level indent.
      }, {
        key: "increaseTopLevel",
        value: function increaseTopLevel() {
          this.indentTypes.push(INDENT_TYPE_TOP_LEVEL);
        }
        // Increases indentation by one block-level indent.
      }, {
        key: "increaseBlockLevel",
        value: function increaseBlockLevel() {
          this.indentTypes.push(INDENT_TYPE_BLOCK_LEVEL);
        }
        // Decreases indentation by one top-level indent.
        // Does nothing when the previous indent is not top-level.
      }, {
        key: "decreaseTopLevel",
        value: function decreaseTopLevel() {
          if (this.indentTypes.length > 0 && Object(_utils_WIM0__["last"])(this.indentTypes) === INDENT_TYPE_TOP_LEVEL) {
            this.indentTypes.pop();
          }
        }
        /**
         * Decreases indentation by one block-level indent.
         * If there are top-level indents within the block-level indent,
         * throws away these as well.
         */
      }, {
        key: "decreaseBlockLevel",
        value: function decreaseBlockLevel() {
          while (this.indentTypes.length > 0) {
            const type = this.indentTypes.pop();
            if (type !== INDENT_TYPE_TOP_LEVEL) {
              break;
            }
          }
        }
      }, {
        key: "resetIndentation",
        value: function resetIndentation() {
          this.indentTypes = [];
        }
      }]);
      return Indentation;
    }();
}),

 "./src/core/InlineBlock.js":
 (function(module, _wpex_, _wprq_) {
  "use strict";
  _wprq_.r(_wpex_);
  _wprq_.d(_wpex_, "vector", function() {return InlineBlock;});
  let _tokenTypes_WIM0__ = _wprq_("./src/core/tokenTypes.js");
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function _defineProperties(target, props) { for (let i = 0; i < props.length; i++) { let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
  /**
   * Bookkeeper for inline blocks.
   *
   * Inline blocks are parenthized expressions that are shorter than INLINE_MAX_LENGTH.
   * These blocks are formatted on a single line, unlike longer parenthized
   * expressions where open-parenthesis causes newline and increase of indentation.
   */
  const InlineBlock = function () {
    function InlineBlock() {
      _classCallCheck(this, InlineBlock);

      this.level = 0;
    }
    /**
     * Begins inline block when lookahead through upcoming tokens determines
     * that the block would be smaller than INLINE_MAX_LENGTH.
     * @param  {Object[]} tokens Array of all tokens
     * @param  {Number} index Current token position
     */
    _createClass(InlineBlock, [{
      key: "beginIfPossible",
      value: function beginIfPossible(tokens, index) {
        if (this.level === 0 && this.isInlineBlock(tokens, index)) {
          this.level = 1;
        } else if (this.level > 0) {
          this.level++;
        } else {
          this.level = 0;
        }
      }
      /**
       * Finishes current inline block.
       * There might be several nested ones.
       */
    }, {
      key: "end",
      value: function end() {
        this.level--;
      }
      /**
       * True when inside an inline block
       * @return {Boolean}
       */
    }, {
      key: "isActive",
      value: function isActive() {
        return this.level > 0;
      } // Check if this should be an inline parentheses block
      // Examples are "NOW()", "COUNT(*)", "int(10)", key(`somecolumn`), DECIMAL(7,2)
    }, {
      key: "isInlineBlock",
      value: function isInlineBlock(tokens, index) {
        let length = 0;
        let level = 0;
        for (let i = index; i < tokens.length; i++) {
          let token = tokens[i];
          length += token.value.length; // Overran max length
          if (length > (INLINE_MAX_LENGTH - 30)) return false;
          if (token.type === _tokenTypes_WIM0__.vector.OPEN_PAREN) {
            level++;
          } else if (token.type === _tokenTypes_WIM0__.vector.CLOSE_PAREN) {
            level--;
            if (level === 0) return true;
          }
          if (this.isForbiddenToken(token)) return false;
        }
        return false;
      } // Reserved words that cause newlines, comments and semicolons
      // are not allowed inside inline parentheses block
    }, {
      key: "isForbiddenToken",
      value: function isForbiddenToken(_ref) {
        let type = _ref.type;
        let value = _ref.value;
        return type === _tokenTypes_WIM0__.vector.RESERVED_TOP_LEVEL || type === _tokenTypes_WIM0__.vector.RESERVED_NEWLINE || type === _tokenTypes_WIM0__.vector.COMMENT || type === _tokenTypes_WIM0__.vector.BLOCK_COMMENT || value === ';';
      }
    }]);
    return InlineBlock;
  }();
}),

 "./src/core/Params.js":
 (function(module, _wpex_, _wprq_) {
    "use strict";
    _wprq_.r(_wpex_);
    _wprq_.d(_wpex_, "vector", function() { return Params; });
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    function _defineProperties(target, props) { for (let i = 0; i < props.length; i++) { let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    // Handles placeholder replacement with given params.
    const Params = function () {
      /**
       * @param {Object} params
       */
      function Params(params) {
        _classCallCheck(this, Params);
        this.params = params;
        this.index = 0;
      }
      /**
       * Returns param value that matches given placeholder with param key.
       * @param {Object} token
       *   @param {String} token.key Placeholder key
       *   @param {String} token.value Placeholder value
       * @return {String} param or token.value when params are missing
       */
      _createClass(Params, [{
        key: "get",
        value: function get(_ref) {
          if (!this.params) return _ref.value;
          if (_ref.key) return this.params[_ref.key];
          return this.params[this.index++];
        }
      }]);
      return Params;
    }();
}),

 "./src/core/Tokenizer.js":
(function(module, _wpex_, _wprq_) {
    "use strict";
    _wprq_.r(_wpex_);
    _wprq_.d(_wpex_, "vector", function() {return Tokenizer;});
    let _tokenTypes_WIM0__ = _wprq_("./src/core/tokenTypes.js");
    let _regexFactory_WIM1__ = _wprq_("./src/core/regexFactory.js");
    let _utils_WIM2__ = _wprq_("./src/utils.js");
    function ownKeys(object, enumerableOnly) { let keys = Object.keys(object); if (Object.getOwnPropertySymbols) { let symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }
    function _objectSpread(target) { for (let i = 1; i < arguments.length; i++) { let source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); let n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }
    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
    function _arrayLikeToArray (arr, len) {if (len == null || len > arr.length) len = arr.length; let arr2 = new Array(len); for (let i = 0; i < len; i++) {arr2[i] = arr[i];} return arr2;}
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    function _defineProperties(target, props) { for (let i = 0; i < props.length; i++) { let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    const Tokenizer = function () {
      /**
       * @param {Object} cfg
       *  @param {String[]} cfg.reservedWords Reserved words in SQL
       *  @param {String[]} cfg.reservedTopLevelWords Words that are set to new line separately
       *  @param {String[]} cfg.reservedNewlineWords Words that are set to newline
       *  @param {String[]} cfg.reservedTopLevelWordsNoIndent Words that are top level but have no indentation
       *  @param {String[]} cfg.stringTypes String types to enable: "", '', ``, [], N''
       *  @param {String[]} cfg.openParens Opening parentheses to enable, like (, [
       *  @param {String[]} cfg.closeParens Closing parentheses to enable, like ), ]
       *  @param {String[]} cfg.indexedPlaceholderTypes Prefixes for indexed placeholders, like ?
       *  @param {String[]} cfg.namedPlaceholderTypes Prefixes for named placeholders, like @ and :
       *  @param {String[]} cfg.lineCommentTypes Line comments to enable, like # and --
       *  @param {String[]} cfg.specialWordChars Special chars that can be found inside of words, like @ and #
       *  @param {String[]} [cfg.operator] Additional operators to recognize
       */
      function Tokenizer(cfg) {
        _classCallCheck(this, Tokenizer);
        this.WHITESPACE_REGEX                   = /^([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+)/;
        this.NUMBER_REGEX                       = /^((\x2D[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)?[0-9]+(\.[0-9]+)?([Ee]\x2D?[0-9]+(\.[0-9]+)?)?|0x[0-9A-Fa-f]+|0b[01]+)\b/;
        this.OPERATOR_REGEX                     = _regexFactory_WIM1__.createOperatorRegex(['<>', '<=', '>='].concat(_toConsumableArray(cfg.operators || [])));
        this.BLOCK_COMMENT_REGEX                = /^(\/\*(?:(?![])[\s\S])*?(?:\*\/|$))/;
        this.LINE_COMMENT_REGEX                 = _regexFactory_WIM1__.createLineCommentRegex (cfg.lineCommentTypes);
        this.RESERVED_TOP_LEVEL_REGEX           = _regexFactory_WIM1__.createReservedWordRegex(cfg.reservedTopLevelWords);
        this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX = _regexFactory_WIM1__.createReservedWordRegex(cfg.reservedTopLevelWordsNoIndent);
        this.RESERVED_NEWLINE_REGEX             = _regexFactory_WIM1__.createReservedWordRegex(cfg.reservedNewlineWords);
        this.RESERVED_PLAIN_REGEX               = _regexFactory_WIM1__.createReservedWordRegex(cfg.reservedWords);
        this.WORD_REGEX                         = _regexFactory_WIM1__.createWordRegex        (cfg.specialWordChars);
        this.STRING_REGEX                       = _regexFactory_WIM1__.createStringRegex      (cfg.stringTypes);
        this.OPEN_PAREN_REGEX                   = _regexFactory_WIM1__.createParenRegex       (cfg.openParens);
        this.CLOSE_PAREN_REGEX                  = _regexFactory_WIM1__.createParenRegex       (cfg.closeParens);
        this.INDEXED_PLACEHOLDER_REGEX          = _regexFactory_WIM1__.createPlaceholderRegex (cfg.indexedPlaceholderTypes, '[0-9]*');
        this.IDENT_NAMED_PLACEHOLDER_REGEX      = _regexFactory_WIM1__.createPlaceholderRegex (cfg.namedPlaceholderTypes, '[a-zA-Z0-9._$]+');
        this.STRING_NAMED_PLACEHOLDER_REGEX     = _regexFactory_WIM1__.createPlaceholderRegex (cfg.namedPlaceholderTypes, _regexFactory_WIM1__["createStringPattern"](cfg.stringTypes));
      }
      /**
       * Takes a SQL string and breaks it into tokens.
       * Each token is an object with type and value.
       *
       * @param {String} input The SQL string
       * @return {Object[]} tokens An array of tokens.
       *  @return {String} token.type
       *  @return {String} token.value
       *  @return {String} token.whitespaceBefore Preceding whitespace
       */
      _createClass(Tokenizer, [{
        key: "tokenize",
        value: function tokenize(input) {
          let tokens = [];
          let token; // Keep processing the string until it is empty
          while (input.length) {
            // Grab any preceding whitespace
            let whitespaceBefore = this.getWhitespace(input);
            input = input.substring(whitespaceBefore.length);
            if (input.length) {
              // Get the next token and the token type
              token = this.getNextToken(input, token); // Advance the string
              input = input.substring(token.value.length);
              tokens.push(_objectSpread(_objectSpread({}, token), {}, {
                whitespaceBefore: whitespaceBefore
              }));
            }
          }
          return tokens;
        }
      }, {
        key: "getWhitespace",
        value: function getWhitespace(input) {
          let matches = input.match(this.WHITESPACE_REGEX);
          return matches ? matches[1] : '';
        }
      }, {
        key: "getNextToken",
        value: function getNextToken(input, previousToken) {
          return this.getCommentToken(input) ||
                 this.getStringToken(input) ||
                 this.getOpenParenToken(input) ||
                 this.getCloseParenToken(input) ||
                 this.getPlaceholderToken(input) ||
                 this.getNumberToken(input) ||
                 this.getReservedWordToken(input, previousToken) ||
                 this.getWordToken(input) ||
                 this.getOperatorToken(input);
        }
      }, {
        key: "getCommentToken",
        value: function getCommentToken(input) {
          return this.getLineCommentToken(input) || this.getBlockCommentToken(input);
        }
      }, {
        key: "getLineCommentToken",
          value: function getLineCommentToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.LINE_COMMENT,
            regex: this.LINE_COMMENT_REGEX
          });
        }
      }, {
        key: "getBlockCommentToken",
        value: function getBlockCommentToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.BLOCK_COMMENT,
            regex: this.BLOCK_COMMENT_REGEX
          });
        }
      }, {
        key: "getStringToken",
        value: function getStringToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.STRING,
            regex: this.STRING_REGEX
          });
        }
      }, {
        key: "getOpenParenToken",
        value: function getOpenParenToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.OPEN_PAREN,
            regex: this.OPEN_PAREN_REGEX
          });
        }
      }, {
        key: "getCloseParenToken",
        value: function getCloseParenToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.CLOSE_PAREN,
            regex: this.CLOSE_PAREN_REGEX
          });
        }
      }, {
        key: "getPlaceholderToken",
        value: function getPlaceholderToken(input) {
          let a = this.IDENT_NAMED_PLACEHOLDER_REGEX  === false ? undefined : this.getIdentNamedPlaceholderToken(input);
          let b = this.STRING_NAMED_PLACEHOLDER_REGEX === false ? undefined : this.getStringNamedPlaceholderToken(input);
          let c = this.INDEXED_PLACEHOLDER_REGEX      === false ? undefined : this.getIndexedPlaceholderToken(input);
          return a || b || c;
          //return this.getIdentNamedPlaceholderToken(input) || this.getStringNamedPlaceholderToken(input) || this.getIndexedPlaceholderToken(input);
        }
      }, {
        key: "getIdentNamedPlaceholderToken",
        value: function getIdentNamedPlaceholderToken(input) {
          return this.getPlaceholderTokenWithKey({
            input: input,
            regex: this.IDENT_NAMED_PLACEHOLDER_REGEX,
            parseKey: function parseKey(v) {return v.slice(1);}
          });
        }
      }, {
        key: "getStringNamedPlaceholderToken",
        value: function getStringNamedPlaceholderToken(input) {
          let _this = this;
          return this.getPlaceholderTokenWithKey({
            input: input,
            regex: this.STRING_NAMED_PLACEHOLDER_REGEX,
            parseKey: function parseKey(v) {
              return _this.getEscapedPlaceholderKey({
                key: v.slice(2, -1),
                quoteChar: v.slice(-1)
              });
            }
          });
        }
      }, {
        key: "getIndexedPlaceholderToken",
        value: function getIndexedPlaceholderToken(input) {
          return this.getPlaceholderTokenWithKey({
            input: input,
            regex: this.INDEXED_PLACEHOLDER_REGEX,
            parseKey: function parseKey(v) {
              return v.slice(1);
            }
          });
        }
      }, {
        key: "getPlaceholderTokenWithKey",
        value: function getPlaceholderTokenWithKey(_ref) {
          const token = this.getTokenOnFirstMatch({
            input: _ref.input,
            regex: _ref.regex,
            type: _tokenTypes_WIM0__.vector.PLACEHOLDER
          });
          if (token) token.key = _ref.parseKey(token.value);
          return token;
        }
      }, {
        key: "getEscapedPlaceholderKey",
        value: function getEscapedPlaceholderKey(_ref2) {
          return _ref2.key.replace(new RegExp(Object(_utils_WIM2__.escapeRegExp)('\\' + _ref2.quoteChar), 'gu'), _ref2.quoteChar);
        } // Decimal, binary, or hex numbers
      }, {
        key: "getNumberToken",
        value: function getNumberToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.NUMBER,
            regex: this.NUMBER_REGEX
          });
        } // Punctuation and symbols
      }, {
        key: "getOperatorToken",
        value: function getOperatorToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.OPERATOR,
            regex: this.OPERATOR_REGEX
          });
        }
      }, {
        key: "getReservedWordToken",
        value: function getReservedWordToken(input, previousToken) {
          // A reserved word cannot be preceded by a "."
          // this makes it so in "mytable.from", "from" is not considered a reserved word
          if (previousToken && previousToken.value && previousToken.value === '.') {
            return undefined;
          }
          return this.getTopLevelReservedToken(input) || this.getNewlineReservedToken(input) || this.getTopLevelReservedTokenNoIndent(input) || this.getPlainReservedToken(input);
        }
      }, {
        key: "getTopLevelReservedToken",
        value: function getTopLevelReservedToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.RESERVED_TOP_LEVEL,
            regex: this.RESERVED_TOP_LEVEL_REGEX
          });
        }
      }, {
        key: "getNewlineReservedToken",
        value: function getNewlineReservedToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.RESERVED_NEWLINE,
            regex: this.RESERVED_NEWLINE_REGEX
          });
        }
      }, {
        key: "getTopLevelReservedTokenNoIndent",
        value: function getTopLevelReservedTokenNoIndent(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.RESERVED_TOP_LEVEL_NO_INDENT,
            regex: this.RESERVED_TOP_LEVEL_NO_INDENT_REGEX
          });
        }
      }, {
        key: "getPlainReservedToken",
        value: function getPlainReservedToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.RESERVED,
            regex: this.RESERVED_PLAIN_REGEX
          });
        }
      }, {
        key: "getWordToken",
        value: function getWordToken(input) {
          return this.getTokenOnFirstMatch({
            input: input,
            type: _tokenTypes_WIM0__.vector.WORD,
            regex: this.WORD_REGEX
          });
        }
      }, {
        key: "getTokenOnFirstMatch",
        value: function getTokenOnFirstMatch(_ref3) {
          const matches = _ref3.input.match(_ref3.regex);
          return matches ? {
            type: _ref3.type,
            value: matches[1]
          } : undefined;
        }
      }]);
      return Tokenizer;
    }();
 }),
 "./src/core/regexFactory.js":
 (function(module, _wpex_, _wprq_) {
    "use strict";
    _wprq_.r(_wpex_);
    _wprq_.d(_wpex_, "createOperatorRegex",     () => createOperatorRegex    );
    _wprq_.d(_wpex_, "createLineCommentRegex",  () => createLineCommentRegex );
    _wprq_.d(_wpex_, "createReservedWordRegex", () => createReservedWordRegex);
    _wprq_.d(_wpex_, "createWordRegex",         () => createWordRegex        );
    _wprq_.d(_wpex_, "createStringRegex",       () => createStringRegex      );
    _wprq_.d(_wpex_, "createStringPattern",     () => createStringPattern    );
    _wprq_.d(_wpex_, "createParenRegex",        () => createParenRegex       );
    _wprq_.d(_wpex_, "createPlaceholderRegex",  () => createPlaceholderRegex );
    let _utils_WIM0__ = _wprq_("./src/utils.js");
    function createOperatorRegex(multiLetterOperators) {
      return new RegExp("^(".concat(Object(_utils_WIM0__.sortByLengthDesc)(multiLetterOperators).map(_utils_WIM0__.escapeRegExp).join('|'), "|.)"), 'u');
    }
    function createLineCommentRegex(lineCommentTypes) {
      return new RegExp("^((?:".concat(lineCommentTypes.map(function (c) {
        return Object(_utils_WIM0__.escapeRegExp)(c);
      }).join('|'), ").*?)(?:\r\n|\r|\n|$)"), 'u');
    }
    function createReservedWordRegex(reservedWords) {
      if (reservedWords.length === 0) {
        return new RegExp("^\b$", 'u');
      }
      let reservedWordsPattern = Object(_utils_WIM0__.sortByLengthDesc)(reservedWords).join('|').replace(/ /g, '\\s+');
      return new RegExp("^(".concat(reservedWordsPattern, ")\\b"), 'iu');
    }
    function createWordRegex() {
      let specialChars = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return new RegExp("^([\\p{Alphabetic}\\p{Mark}\\p{Decimal_Number}\\p{Connector_Punctuation}\\p{Join_Control}".concat(specialChars.join(''), "]+)"), 'u');
    }
    function createStringRegex(stringTypes) {
      return new RegExp('^(' + createStringPattern(stringTypes) + ')', 'u');
    } // This enables the following string patterns:
    // 1. backtick quoted string using `` to escape
    // 2. square bracket quoted string (SQL Server) using ]] to escape
    // 3. double quoted string using "" or \" to escape
    // 4. single quoted string using '' or \' to escape
    // 5. national character quoted string using N'' or N\' to escape
    // 6. Unicode single-quoted string using \' to escape
    // 7. Unicode double-quoted string using \" to escape
    // 8. PostgreSQL dollar-quoted strings
    function createStringPattern(stringTypes) {
      const patterns = {
        '``': '((`[^`]*($|`))+)',
        '{}': '((\\{[^\\}]*($|\\}))+)',
        '[]': '((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)',
        '""': '(("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
        "''": "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
        "N''": "((N'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
        "U&''": "((U&'[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
        'U&""': '((U&"[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
        $$: '((?<tag>\\$\\w*\\$)[\\s\\S]*?(?:\\k<tag>|$))'
      };
      return stringTypes.map(function (t) {
        return patterns[t];
      }).join('|');
    }
    function createParenRegex(parens) {
      return new RegExp('^(' + parens.map(escapeParen).join('|') + ')', 'iu');
    }
    function escapeParen(paren) {
      if (paren.length === 1) {
        // A single punctuation character
        return Object(_utils_WIM0__.escapeRegExp)(paren);
      } else {
        // longer word
        return '\\b' + paren + '\\b';
      }
    }
    function createPlaceholderRegex(types, pattern) {
      if (Object(_utils_WIM0__.isEmpty)(types)) return false;
      let typesRegex = types.map(_utils_WIM0__.escapeRegExp).join('|');
      return new RegExp("^((?:".concat(typesRegex, ")(?:").concat(pattern, "))"), 'u');
    }
 }),

 "./src/core/token.js":
 (function(module, _wpex_, _wprq_) {
  "use strict";
  _wprq_.r(_wpex_);
  _wprq_.d(_wpex_, "isAnd", function() { return isAnd; });
  _wprq_.d(_wpex_, "isBetween", function() { return isBetween; });
  _wprq_.d(_wpex_, "isLimit", function() { return isLimit; });
  _wprq_.d(_wpex_, "isSet", function() { return isSet; });
  _wprq_.d(_wpex_, "isBy", function() { return isBy; });
  _wprq_.d(_wpex_, "isWindow", function() { return isWindow; });
  _wprq_.d(_wpex_, "isEnd", function() { return isEnd; });
  let _tokenTypes_WIM0__ = _wprq_("./src/core/tokenTypes.js");
  let isToken = function isToken(type, regex) {
    return function (token) {
      return (token === null || token === void 0 ? void 0 : token.type) === type && regex.test(token === null || token === void 0 ? void 0 : token.value);
    };
  };
  let isAnd     = isToken(_tokenTypes_WIM0__.vector.RESERVED_NEWLINE, /^AND$/i);
  let isBetween = isToken(_tokenTypes_WIM0__.vector.RESERVED, /^BETWEEN$/i);
  let isLimit   = isToken(_tokenTypes_WIM0__.vector.RESERVED_TOP_LEVEL, /^LIMIT$/i);
  let isSet     = isToken(_tokenTypes_WIM0__.vector.RESERVED_TOP_LEVEL, /^[S\u017F]ET$/i);
  let isBy      = isToken(_tokenTypes_WIM0__.vector.RESERVED, /^BY$/i);
  let isWindow  = isToken(_tokenTypes_WIM0__.vector.RESERVED_TOP_LEVEL, /^WINDOW$/i);
  let isEnd     = isToken(_tokenTypes_WIM0__.vector.CLOSE_PAREN, /^END$/i);
}),

 "./src/core/tokenTypes.js":
(function(module, _wpex_, _wprq_) {
    "use strict";
    _wprq_.r(_wpex_);
    _wpex_.vector = ({
      WORD: 'word',
      STRING: 'string',
      RESERVED: 'reserved',
      RESERVED_TOP_LEVEL: 'reserved-top-level',
      RESERVED_TOP_LEVEL_NO_INDENT: 'reserved-top-level-no-indent',
      RESERVED_NEWLINE: 'reserved-newline',
      OPERATOR: 'operator',
      OPEN_PAREN: 'open-paren',
      CLOSE_PAREN: 'close-paren',
      LINE_COMMENT: 'line-comment',
      BLOCK_COMMENT: 'block-comment',
      NUMBER: 'number',
      PLACEHOLDER: 'placeholder'
    });
}),

 "./src/languages/StandardSqlFormatter.js":
 (function(module, _wpex_, _wprq_) {
    "use strict";
    _wprq_.r(_wpex_);
    _wprq_.d(_wpex_, "vector", function() { return StandardSqlFormatter; });
    let _core_Formatter_WIM0__ = _wprq_("./src/core/Formatter.js");
    let _core_Tokenizer_WIM1__ = _wprq_("./src/core/Tokenizer.js");
    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}
    function _defineProperties(target, props) {for (let i = 0; i < props.length; i++) { let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }
    function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p; return o;}; return _setPrototypeOf(o, p);}
    function _createSuper(Derived) { let hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() {let Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { let NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
    function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self);}
    function _assertThisInitialized(self) {if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called");} return self;}
    function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
    function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o);}

    const StandardSqlFormatter = function (_Formatter) {
      _inherits(StandardSqlFormatter, _Formatter);
      let _super = _createSuper(StandardSqlFormatter);
      function StandardSqlFormatter() {
        _classCallCheck(this, StandardSqlFormatter);
        return _super.apply(this, arguments);
      }
      _createClass(StandardSqlFormatter, [{
        key: "tokenizer",
        value: function tokenizer() {
          return new _core_Tokenizer_WIM1__.vector({
            reservedWords: reservedWords,
            reservedTopLevelWords: reservedTopLevelWords,
            reservedNewlineWords: reservedNewlineWords,
            reservedTopLevelWordsNoIndent: reservedTopLevelWordsNoIndent,
            stringTypes: ["\"\"", "''"],
            openParens: ['(', 'CASE'],
            closeParens: [')', 'END'],
            indexedPlaceholderTypes: ['?'],
            namedPlaceholderTypes: [],
            operators: ['!=', '||'],
            lineCommentTypes: ['--']
          });
        }
      }]);
      return StandardSqlFormatter;
    }(_core_Formatter_WIM0__.vector);
 }),

 "./src/sqlFormatter.js":
 (function(module, _wpex_, _wprq_) {
    "use strict";
    _wprq_.r(_wpex_);
    _wprq_.d(_wpex_, "format", function() { return format; });
    _wprq_.d(_wpex_, "supportedDialects", function() { return supportedDialects; });
    const _languages_StandardSqlFormatter_WIM8__ = _wprq_("./src/languages/StandardSqlFormatter.js");
    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    const formatters = {vector: _languages_StandardSqlFormatter_WIM8__.vector};
    /**
     * Format whitespace in a query to make it easier to read.
     *
     * @param {String} query
     * @param {Object} cfg
     *  @param {String} cfg.language Query language, vector is Standard SQL
     *  @param {String} cfg.indent Characters used for indentation, vector is "  " (2 spaces)
     *  @param {Boolean} cfg.uppercase Converts keywords to uppercase
     *  @param {Integer} cfg.linesBetweenQueries How many line breaks between queries
     *  @param {Object} cfg.params Collection of params for placeholder replacement
     * @return {String}
     */
    function format(query) {
      let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (typeof query !== 'string') {
        throw new Error('Invalid query argument. Extected string, instead got ' + _typeof(query));
      }
      let Formatter = _languages_StandardSqlFormatter_WIM8__.vector;
      if (cfg.language !== undefined) {
        Formatter = formatters[cfg.language];
      }
      if (Formatter === undefined) {
        throw Error("Unsupported SQL dialect: ".concat(cfg.language));
      }
      return new Formatter(cfg).format(query);
    };
    let supportedDialects = Object.keys(formatters);
 }),
 "./src/utils.js":
 (function(module, _wpex_, _wprq_) {
    "use strict";
    _wprq_.r(_wpex_);
    _wprq_.d(_wpex_, "trimSpacesEnd", function() { return trimSpacesEnd; });
    _wprq_.d(_wpex_, "last", function() { return last; });
    _wprq_.d(_wpex_, "isEmpty", function() { return isEmpty; });
    _wprq_.d(_wpex_, "escapeRegExp", function() { return escapeRegExp; });
    _wprq_.d(_wpex_, "sortByLengthDesc", function() { return sortByLengthDesc; });
    // Only removes spaces, not newlines
    function trimSpacesEnd(str) {
      return str.replace(/[\t ]+$/, '');
    } // Last element from array
    function last(arr) {
      return arr[arr.length - 1];
    } // True array is empty, or it's not an array at all
    function isEmpty(arr) {
      return !Array.isArray(arr) || arr.length === 0;
    } // Escapes regex special chars
    function escapeRegExp(string) {
      return string.replace(/[\$\(-\+\.\?\[-\^\{-\}]/g, '\\$&');
    } // Sorts strings by length, so that longer ones are first
    // Also sorts alphabetically after sorting by length.
    function sortByLengthDesc(strings) {
      return strings.sort((a, b) => b.length - a.length || a.localeCompare(b));
    }
 })
 });
});
