// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("./codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";
CodeMirror.defineMode("sql", function(config, parserConfig) {
  var client         = parserConfig.client || {},
      atoms          = parserConfig.atoms || {"false": true, "true": true, "null": true},
      builtin        = parserConfig.builtin || set(defaultBuiltin),
      keywords       = parserConfig.keywords || set(sqlKeywords),
      operatorChars  = parserConfig.operatorChars || /^[*+\-%<>!=&|~^\/]/,
      support        = parserConfig.support || {},
      hooks          = parserConfig.hooks || {},
      dateSQL        = parserConfig.dateSQL || {"date" : true, "time" : true, "timestamp" : true},
      backslashStringEscapes = parserConfig.backslashStringEscapes !== false,
      brackets       = parserConfig.brackets || /^[\{}\(\)\[\]]/,
      punctuation    = parserConfig.punctuation || /^[;.,:]/
  function tokenBase(stream, state) {
    var ch = stream.next();
    // call hooks from the mime type
    if (hooks[ch]) {
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (support.hexNumber &&
      ((ch == "0" && stream.match(/^[xX][0-9a-fA-F]+/))
      || (ch == "x" || ch == "X") && stream.match(/^'[0-9a-fA-F]+'/))) {
      // hex
      // ref: http://dev.mysql.com/doc/refman/5.5/en/hexadecimal-literals.html
      return "number";
    } else if (support.binaryNumber &&
      (((ch == "b" || ch == "B") && stream.match(/^'[01]+'/))
      || (ch == "0" && stream.match(/^b[01]+/)))) {
      // bitstring
      // ref: http://dev.mysql.com/doc/refman/5.5/en/bit-field-literals.html
      return "number";
    } else if (ch.charCodeAt(0) > 47 && ch.charCodeAt(0) < 58) {
      // numbers
      // ref: http://dev.mysql.com/doc/refman/5.5/en/number-literals.html
      stream.match(/^[0-9]*(\.[0-9]+)?([eE][-+]?[0-9]+)?/);
      support.decimallessFloat && stream.match(/^\.(?!\.)/);
      return "number";
    } else if (ch == "?" && (stream.eatSpace() || stream.eol() || stream.eat(";"))) {
      // placeholders
      return "variable-3";
    } else if (ch == "'" || (ch == '"' && support.doubleQuote)) {
      // strings
      // ref: http://dev.mysql.com/doc/refman/5.5/en/string-literals.html
      state.tokenize = tokenLiteral(ch);
      return state.tokenize(stream, state);
    } else if ((((support.nCharCast && (ch == "n" || ch == "N"))
        || (support.charsetCast && ch == "_" && stream.match(/[a-z][a-z0-9]*/i)))
        && (stream.peek() == "'" || stream.peek() == '"'))) {
      // charset casting: _utf8'str', N'str', n'str'
      // ref: http://dev.mysql.com/doc/refman/5.5/en/string-literals.html
      return "keyword";
    } else if (support.escapeConstant && (ch == "e" || ch == "E")
        && (stream.peek() == "'" || (stream.peek() == '"' && support.doubleQuote))) {
      // escape constant: E'str', e'str'
      // ref: https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-STRINGS-ESCAPE
      state.tokenize = function(stream, state) {
        return (state.tokenize = tokenLiteral(stream.next(), true))(stream, state);
      }
      return "keyword";
    } else if (support.commentSlashSlash && ch == "/" && stream.eat("/")) {
      // 1-line comment
      stream.skipToEnd();
      return "comment";
    } else if ((support.commentHash && ch == "#")
        || (ch == "-" && stream.eat("-") && (!support.commentSpaceRequired || stream.eat(" ")))) {
      // 1-line comments
      // ref: https://kb.askmonty.org/en/comment-syntax/
      stream.skipToEnd();
      return "comment";
    } else if (ch == "/" && stream.eat("*")) {
      // multi-line comments
      // ref: https://kb.askmonty.org/en/comment-syntax/
      state.tokenize = tokenComment(1);
      return state.tokenize(stream, state);
    } else if (ch == ".") {
      // .1 for 0.1
      if (support.zerolessFloat && stream.match(/^(?:\d+(?:e[+-]?\d+)?)/i))
        return "number";
      if (stream.match(/^\.+/))
        return null
      // .table_name (ODBC)
      // // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
      if (support.ODBCdotTable && stream.match(/^[\w\d_$#]+/))
        return "variable-2";
    } else if (operatorChars.test(ch)) {
      // operators
      stream.eatWhile(operatorChars);
      return "operator";
    } else if (brackets.test(ch)) {
      // brackets
      return "bracket";
    } else if (punctuation.test(ch)) {
      // punctuation
      stream.eatWhile(punctuation);
      return "punctuation";
    } else if (ch == '{' &&
        (stream.match(/^( )*(d|D|t|T|ts|TS)( )*'[^']*'( )*}/) || stream.match(/^( )*(d|D|t|T|ts|TS)( )*"[^"]*"( )*}/))) {
      // dates (weird ODBC syntax)
      // ref: http://dev.mysql.com/doc/refman/5.5/en/date-and-time-literals.html
      return "number";
    } else {
      stream.eatWhile(/^[_\w\d]/);
      var word = stream.current().toLowerCase();
      // dates (standard SQL syntax)
      // ref: http://dev.mysql.com/doc/refman/5.5/en/date-and-time-literals.html
      if (dateSQL.hasOwnProperty(word) && (stream.match(/^( )+'[^']*'/) || stream.match(/^( )+"[^"]*"/)))
        return "number";
      if (atoms.hasOwnProperty(word)) return "atom";
      if (builtin.hasOwnProperty(word)) return "builtin";
      if (keywords.hasOwnProperty(word)) return "keyword";
      if (client.hasOwnProperty(word)) return "string-2";
      return null;
    }
  }
  // 'string', with char specified in quote escaped by '\'
  function tokenLiteral(quote, backslashEscapes) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = (backslashStringEscapes || backslashEscapes) && !escaped && ch == "\\";
      }
      return "string";
    };
  }
  function tokenComment(depth) {
    return function(stream, state) {
      var m = stream.match(/^.*?(\/\*|\*\/)/)
      if (!m) stream.skipToEnd()
      else if (m[1] == "/*") state.tokenize = tokenComment(depth + 1)
      else if (depth > 1) state.tokenize = tokenComment(depth - 1)
      else state.tokenize = tokenBase
      return "comment"
    }
  }
  function pushContext(stream, state, type) {
    state.context = {
      prev: state.context,
      indent: stream.indentation(),
      col: stream.column(),
      type: type
    };
  }
  function popContext(state) {
    state.indent = state.context.indent;
    state.context = state.context.prev;
  }
  return {
    startState: function() {return {tokenize: tokenBase, context: null};},
    token: function(stream, state) {
      if (stream.sol()) {
        if (state.context && state.context.align == null) state.context.align = false;
      }
      if (state.tokenize == tokenBase && stream.eatSpace()) return null;

      var style = state.tokenize(stream, state);
      if (style == "comment") return style;
      if (state.context && state.context.align == null) state.context.align = true;
      var tok = stream.current();
      if (tok == "(") 
        pushContext(stream, state, ")");
      else if (tok == "[")
        pushContext(stream, state, "]");
      else if (state.context && state.context.type == tok)
        popContext(state);
      return style;
    },
    indent: function(state, textAfter) {
      var cx = state.context;
      if (!cx) return CodeMirror.Pass;
      var closing = textAfter.charAt(0) == cx.type;
      if (cx.align) return cx.col + (closing ? 0 : 1);
      else return cx.indent + (closing ? 0 : config.indentUnit);
    },
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: support.commentSlashSlash ? "//" : support.commentHash ? "#" : "--",
    closeBrackets: "()[]{}''\"\"``"
  };
});

  // `identifier`
  function hookIdentifier(stream) {
    // MySQL/MariaDB identifiers
    // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
    var ch;
    while ((ch = stream.next()) != null) {
      if (ch == "`" && !stream.eat("`")) return "variable-2";
    }
    stream.backUp(stream.current().length - 1);
    return stream.eatWhile(/\w/) ? "variable-2" : null;
  }

  // "identifier"
  function hookIdentifierDoublequote(stream) {
    // Standard SQL /SQLite identifiers
    // ref: http://web.archive.org/web/20160813185132/http://savage.net.au/SQL/sql-99.bnf.html#delimited%20identifier
    // ref: http://sqlite.org/lang_keywords.html
    var ch;
    while ((ch = stream.next()) != null) {
      if (ch == "\"" && !stream.eat("\"")) return "variable-2";
    }
    stream.backUp(stream.current().length - 1);
    return stream.eatWhile(/\w/) ? "variable-2" : null;
  }
  // variable token
  function hookVar(stream) {
    // variables
    // @@prefix.varName @varName
    // varName can be quoted with ` or ' or "
    // ref: http://dev.mysql.com/doc/refman/5.5/en/user-variables.html
    if (stream.eat("@")) {
      stream.match('session.');
      stream.match('local.');
      stream.match('global.');
    }
    if (stream.eat("'")) {
      stream.match(/^.*'/);
      return "variable-2";
    } else if (stream.eat('"')) {
      stream.match(/^.*"/);
      return "variable-2";
    } else if (stream.eat("`")) {
      stream.match(/^.*`/);
      return "variable-2";
    } else if (stream.match(/^[0-9a-zA-Z$\.\_]+/)) {
      return "variable-2";
    }
    return null;
  };

  // short client keyword token
  function hookClient(stream) {
    // \N means NULL
    // ref: http://dev.mysql.com/doc/refman/5.5/en/null-values.html
    if (stream.eat("N")) {
        return "atom";
    }
    // \g, etc
    // ref: http://dev.mysql.com/doc/refman/5.5/en/mysql-commands.html
    return stream.match(/^[a-zA-Z.#!?]/) ? "variable-2" : null;
  }
  var sqlKeywords = "alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit ";
  function set (str) {
    let obj = {}, words = str.split(" ");
    for (let i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }
  var defaultBuiltin = "bool boolean bit blob enum long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision real date datetime year unsigned signed decimal numeric"
  CodeMirror.defineMIME("text/x-vector", {
    name: "sql",
    client: set("source"),
    keywords: set(sqlKeywords + "abs acos add_months all alter and ansidate any as ascii asin at atan atan2 avg beginning between bigint bit_and bit_not bit_or bit_xor boolean both by call called cardinality case cast ceil ceiling char character character_length charextract char_length chr close coalesce collate collect column combine commit concat condition connect constraint containing convert copy corr cos count covar_pop covar_samp create cube current_date current_time current_timestamp date date_format date_part date_trunc day dayofmonth dayofweek dayofyear dbmsinfo dec decimal declare decode default delete dense_rank diacritical distinct dow doy drop dynamic each else end ending epoch escape every except exists exp external extract false fetch first_value float float4 float8 floor following for foreign from from_unixtime full get grant greater greatest group grouping hash having hex hold hour identity ifnull ignore in indicator inet6_ntop inet6_pton inet_ntop inet_pton initcap inner insert int int1 int2 int4 int8 integer intersect intersection interval interval_diff interval_dtos interval_ytom into ipv4 ipv6 is iso_week jaro_winkler join lag last_day last_value lead leading least left length lesser levenshtein like listagg ln local locate log lower lowercase lpad ltrim match max merge microsecond microseconds millisecond min minute mod modify module money month months_between nanosecond nanoseconds natural nchar new no none not notrim ntile null nullif nulls numeric nvarchar nvl nvl2 octet_length of open or order outer over parameter partition percent_rank pi position power preceding primary procedure public quarter random randomf range rank references regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_sxx regr_syy repeat replace respect restrict return revoke right rollback round rows row_number rpad search second select set shift sign similar sin smallint some soundex sql sqrt squeeze stddev_pop stddev_samp str_to_date substr substring substring_index sum symmetric system system_user table tan then time with zone without timestamp timestampadd timestampdiff timestamp_local timestamp_with_tz timestamp_wo_tz timezone_hour timezone_minute time_format time_local time_with_tz time_wo_tz tinyint to to_char to_date to_time to_timestamp to_timestamp_tz trailing trim true trunc unbounded union unique unix_timestamp unknown update upper uppercase username using uuid uuid_compare uuid_create uuid_from_char uuid_to_char value values varchar var_pop var_samp view week week_iso when where window within year yearweek first last key desc asc truncated encrypt reconstruct passphrase new_passphrase raise dbevent share noshare register remove inquire_sql synonym index save comment import rename option current installation cascade privileges access copy_into copy_from excluding execute sequence next nocreate_table database if"),
    builtin: set("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float8 inet integer int int4 interval json jsonb line lseg macaddr macaddr8 money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time without zone with timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"),
    atoms: set("int, integer, int1, int2, int4, int8, tinyint, smallint, bigint, char, nchar, varchar, nvarchar, boolean, dec, numeric, money, decimal, time, 'time with time zone', 'time without time zone', date, ansidate, timestamp, 'timestamp with time zone', 'timestamp without time zone', float, float4, float8, ipv4, ipv6, uuid, timestamp_with_tz, timestamp_wo_tz, time_with_tz, time_wo_tz"),
    operatorChars: /^[*\/+\-%<>!=&|^\/#@?~]/,
    backslashStringEscapes: false,
    dateSQL: set("date time timestamp time_wo_tz time_with_tz timestamp_wo_tz timestamp_with_tz"),
    support: set("")
  });
});