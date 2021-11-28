var reservedWords = [
  "ABS", "ACOS", "ADD_MONTHS", "ALL", "ALTER", "AND", "ANSIDATE", "ANY", "AS", "ASCII", "ASIN", "AT", "ATAN", "ATAN2", "AVG", "BEGINNING", "BETWEEN", "BIGINT", "BIT_AND", "BIT_NOT", "BIT_OR", 
  "BIT_XOR", "BOOLEAN", "BOTH", "BY", "CALL", "CALLED", "CARDINALITY", "CASE", "CAST", "CEIL", "CEILING", "CHAR", "CHARACTER", "CHARACTER_LENGTH", "CHAREXTRACT", "CHAR_LENGTH", "CHR", "CLOSE", 
  "COALESCE", "COLLATE", "COLLECT", "COLUMN", "COMBINE", "COMMIT", "CONCAT", "CONDITION", "CONNECT", "CONSTRAINT", "CONTAINING", "CONVERT", "COPY", "CORR", "COS", "COUNT", "COVAR_POP", "COVAR_SAMP", 
  "CREATE", "CUBE", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP", "DATE", "DATE_FORMAT", "DATE_PART", "DATE_TRUNC", "DAY", "DAYOFMONTH", "DAYOFWEEK", "DAYOFYEAR", "DBMSINFO", "DEC", "DECIMAL", 
  "DECLARE", "DECODE", "DEFAULT", "DELETE", "DENSE_RANK", "DIACRITICAL", "DISTINCT", "DOUBLE", "DOW", "DOY", "DROP", "DYNAMIC", "EACH", "ELEMENT", "ELSE", "END", "ENDING", "EPOCH", "ESCAPE", "EVERY", 
  "EXCEPT", "EXISTS", "EXP", "EXTERNAL", "EXTRACT", "FALSE", "FETCH", "FILTER", "FIRST_VALUE", "FLOAT", "FLOAT4", "FLOAT8", "FLOOR", "FOLLOWING", "FOR", "FOREIGN", "FROM", "FROM_UNIXTIME", "FULL", 
  "GET", "GRANT", "GREATER", "GREATEST", "GROUP", "GROUPING", "HASH", "HAVING", "HEX", "HOLD", "HOUR", "IDENTITY", "IFNULL", "IGNORE", "IN", "INDICATOR", "INET6_NTOP", "INET6_PTON", "INET_NTOP", 
  "INET_PTON", "INITCAP", "INNER", "INSERT", "INT", "INT1", "INT2", "INT4", "INT8", "INTEGER", "INTERSECT", "INTERSECTION", "INTERVAL", "INTERVAL_DIFF", "INTERVAL_DTOS", "INTERVAL_YTOM", "INTO", 
  "IPV4", "IS", "ISO_WEEK", "JARO_WINKLER", "JOIN", "LAG", "LARGE", "LAST_DAY", "LAST_VALUE", "LATERAL", "LEAD", "LEADING", "LEAST", "LEFT", "LENGTH", "LESSER", "LEVENSHTEIN", "LIKE", "LISTAGG", "LN", 
  "LOCAL", "LOCALTIME", "LOCALTIMESTAMP", "LOCATE", "LOG", "LOWER", "LOWERCASE", "LPAD", "LTRIM", "MATCH", "MAX", "MEMBER", "MERGE", "MICROSECOND", "MICROSECONDS", "MILLISECOND", "MIN", "MINUTE", 
  "MOD", "MODIFIES", "MODIFY", "MODULE", "MONEY", "MONTH", "MONTHS_BETWEEN", "NANOSECOND", "NANOSECONDS", "NATURAL", "NCHAR", "NEW", "NO", "NONE", "NOT", "NOTRIM", "NTILE", "NULL", "NULLIF", "NULLS", 
  "NUMERIC", "NVARCHAR", "NVL", "NVL2", "OCTET_LENGTH", "OF", "OLD", "ONLY", "OPEN", "OR", "ORDER", "OUT", "OUTER", "OVER", "PARAMETER", "PARTITION", "PERCENT_RANK", "PI", "POSITION", "POWER", 
  "PRECEDING", "PRECISION", "PRIMARY", "PROCEDURE", "PUBLIC", "QUARTER", "RANDOM", "RANDOMF", "RANGE", "RANK", "REAL", "REF", "REFERENCES", "REFERENCING", "REGR_AVGX", "REGR_AVGY", "REGR_COUNT", 
  "REGR_INTERCEPT", "REGR_R2", "REGR_SXX", "REGR_SYY", "REPEAT", "REPLACE", "RESPECT", "RESTRICT", "RETURN", "REVOKE", "RIGHT", "ROLLBACK", "ROUND", "ROWS", "ROW_NUMBER", "RPAD", "SEARCH", "SECOND", 
  "SELECT", "SENSITIVE", "SET", "SHIFT", "SIGN", "SIMILAR", "SIN", "SIZE", "SIZE", "SMALLINT", "SOME", "SOUNDEX", "SQL", "SQRT", "SQUEEZE", "STDDEV_POP", "STDDEV_SAMP", "STR_TO_DATE", "SUBSTR", 
  "SUBSTRING", "SUBSTRING_INDEX", "SUM", "SYMMETRIC", "SYSTEM", "SYSTEM_USER", "TABLE", "TAN", "THEN", "TIME", "TIME WITH TIME ZONE", "TIME WITHOUT TIME ZONE", "TIMESTAMP", "TIMESTAMP WITH TIME ZONE", 
  "TIMESTAMP WITHOUT TIME ZONE", "TIMESTAMPADD", "TIMESTAMPDIFF", "TIMESTAMP_LOCAL", "TIMESTAMP_WITH_TZ", "TIMESTAMP_WO_TZ", "TIMEZONE_HOUR", "TIMEZONE_MINUTE", "TIME_FORMAT", "TIME_LOCAL", 
  "TIME_WITH_TZ", "TIME_WO_TZ", "TINYINT", "TO", "TO_CHAR", "TO_DATE", "TO_TIME", "TO_TIMESTAMP", "TO_TIMESTAMP_TZ", "TRAILING", "TRANSLATE", "TRIM", "TRUE", "TRUNC", "UNBOUNDED", "UNION", "UNIQUE", 
  "UNIX_TIMESTAMP", "UNKNOWN", "UPDATE", "UPPER", "UPPERCASE", "USERNAME", "USING", "UUID_COMPARE", "UUID_CREATE", "UUID_FROM_CHAR", "UUID_TO_CHAR", "VALUE", "VALUES", "VARCHAR", "VAR_POP", "VAR_SAMP", 
  "VIEW", "WEEK", "WEEK_ISO", "WHEN", "WHERE", "WINDOW", "WITH", "WITHIN", "WITHOUT", "YEAR", "YEARWEEK"
];
var reservedTopLevelWords = [
    'ADD', 'ALTER COLUMN', 'ALTER TABLE', 'CASE', 'DELETE FROM', 'END', 'GROUP BY', 'LEFT JOIN', 'JOIN', 'FROM', 'HAVING', 'INSERT INTO', 'ORDER BY', 'SELECT', 'SET',
    'UPDATE', 'VALUES', 'WHERE', 'INNER JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'
];
var reservedTopLevelWordsNoIndent = ['INTERSECT', 'UNION', 'UNION ALL', 'UNION DISTINCT', 'EXCEPT'];
var reservedNewlineWords = ['ON', 'AND', 'ELSE', 'OR', 'WHEN'];