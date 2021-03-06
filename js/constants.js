// These should probably be key : object pairs where the object has properties like name, isFunction, lineBefore, lineAfter, noIndent, isDataType
// Unfortunately, that would require reworking a lot of the code base that this was built upon
const reservedWords = [
  'ABS', 'ACOS', 'ADD_MONTHS', 'ALL', 'ALTER', 'AND', 'ANSIDATE', 'ANY', 'AS', 'ASCII', 'ASIN', 'AT', 'ATAN', 'ATAN2', 'AVG', 'BEGINNING', 'BETWEEN', 'BIGINT', 'BIT_AND', 'BIT_NOT', 'BIT_OR', 
  'BIT_XOR', 'BOOLEAN', 'BOTH', 'BY', 'CALL', 'CALLED', 'CARDINALITY', 'CASE', 'CAST', 'CEIL', 'CEILING', 'CHAR', 'CHARACTER', 'CHARACTER_LENGTH', 'CHAREXTRACT', 'CHAR_LENGTH', 'CHR', 'CLOSE', 
  'COALESCE', 'COLLATE', 'COLLECT', 'COLUMN', 'COMBINE', 'COMMIT', 'CONCAT', 'CONDITION', 'CONNECT', 'CONSTRAINT', 'CONTAINING', 'CONVERT', 'COPY', 'CORR', 'COS', 'COUNT', 'COVAR_POP', 'COVAR_SAMP', 
  'CREATE', 'CUBE', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'DATE', 'DATE_FORMAT', 'DATE_PART', 'DATE_TRUNC', 'DAY', 'DAYOFMONTH', 'DAYOFWEEK', 'DAYOFYEAR', 'DBMSINFO', 'DEC', 'DECIMAL', 
  'DECLARE', 'DECODE', 'DEFAULT', 'DELETE', 'DENSE_RANK', 'DIACRITICAL', 'DISTINCT', 'DOW', 'DOY', 'DROP', 'DYNAMIC', 'EACH', 'ELSE', 'END', 'ENDING', 'EPOCH', 'ESCAPE', 'EVERY', 'EXCEPT', 'EXISTS',
  'EXP', 'EXTERNAL', 'EXTRACT', 'FALSE', 'FETCH', 'FIRST_VALUE', 'FLOAT', 'FLOAT4', 'FLOAT8', 'FLOOR', 'FOLLOWING', 'FOR', 'FOREIGN', 'FROM', 'FROM_UNIXTIME', 'FULL', 'GET', 'GRANT', 'GREATER',
  'GREATEST', 'GROUP', 'GROUPING', 'HASH', 'HAVING', 'HEX', 'HOLD', 'HOUR', 'IDENTITY', 'IFNULL', 'IGNORE', 'IN', 'INDICATOR', 'INET6_NTOP', 'INET6_PTON', 'INET_NTOP', 'INET_PTON', 'INITCAP',
  'INNER', 'INSERT', 'INT', 'INT1', 'INT2', 'INT4', 'INT8', 'INTEGER', 'INTERSECT', 'INTERSECTION', 'INTERVAL', 'INTERVAL_DIFF', 'INTERVAL_DTOS', 'INTERVAL_YTOM', 'INTO', 'IPV4', 'IPV6', 'IS',
  'ISO_WEEK', 'JARO_WINKLER', 'JOIN', 'LAG', 'LAST_DAY', 'LAST_VALUE', 'LEAD', 'LEADING', 'LEAST', 'LEFT', 'LENGTH', 'LESSER', 'LEVENSHTEIN', 'LIKE', 'LISTAGG', 'LN', 'LOCAL', 'LOCATE', 'LOG',
  'LOWER', 'LOWERCASE', 'LPAD', 'LTRIM', 'MATCH', 'MAX', 'MERGE', 'MICROSECOND', 'MICROSECONDS', 'MILLISECOND', 'MIN', 'MINUTE', 'MOD', 'MODIFY', 'MODULE', 'MONEY', 'MONTH', 'MONTHS_BETWEEN',
  'NANOSECOND', 'NANOSECONDS', 'NATURAL', 'NCHAR', 'NEW', 'NO', 'NONE', 'NOT', 'NOTRIM', 'NTILE', 'NULL', 'NULLIF', 'NULLS', 'NUMERIC', 'NVARCHAR', 'NVL', 'NVL2', 'OCTET_LENGTH', 'OF', 'OPEN', 'OR',
  'ORDER', 'OUTER', 'OVER', 'PARAMETER', 'PARTITION', 'PERCENT_RANK', 'PI', 'POSITION', 'POWER', 'PRECEDING', 'PRIMARY', 'PROCEDURE', 'PUBLIC', 'QUARTER', 'RANDOM', 'RANDOMF', 'RANGE', 'RANK',
  'REFERENCES', 'REGR_AVGX', 'REGR_AVGY', 'REGR_COUNT', 'REGR_INTERCEPT', 'REGR_R2', 'REGR_SXX', 'REGR_SYY', 'REPEAT', 'REPLACE', 'RESPECT', 'RESTRICT', 'RETURN', 'REVOKE', 'RIGHT', 'ROLLBACK',
  'ROUND', 'ROWS', 'ROW_NUMBER', 'RPAD', 'SEARCH', 'SECOND', 'SELECT', 'SET', 'SHIFT', 'SIGN', 'SIMILAR', 'SIN', 'SMALLINT', 'SOME', 'SOUNDEX', 'SQL', 'SQRT', 'SQUEEZE', 'STDDEV_POP', 'STDDEV_SAMP',
  'STR_TO_DATE', 'SUBSTR', 'SUBSTRING', 'SUBSTRING_INDEX', 'SUM', 'SYMMETRIC', 'SYSTEM', 'SYSTEM_USER', 'TABLE', 'TAN', 'THEN', 'TIME', 'TIME WITH TIME ZONE', 'TIME WITHOUT TIME ZONE', 'TIMESTAMP',
  'TIMESTAMP WITH TIME ZONE', 'TIMESTAMP WITHOUT TIME ZONE', 'TIMESTAMPADD', 'TIMESTAMPDIFF', 'TIMESTAMP_LOCAL', 'TIMESTAMP_WITH_TZ', 'TIMESTAMP_WO_TZ', 'TIMEZONE_HOUR', 'TIMEZONE_MINUTE',
  'TIME_FORMAT', 'TIME_LOCAL', 'TIME_WITH_TZ', 'TIME_WO_TZ', 'TINYINT', 'TO', 'TO_CHAR', 'TO_DATE', 'TO_TIME', 'TO_TIMESTAMP', 'TO_TIMESTAMP_TZ', 'TRAILING', 'TRIM', 'TRUE', 'TRUNC', 'UNBOUNDED',
  'UNION', 'UNIQUE', 'UNIX_TIMESTAMP', 'UNKNOWN', 'UPDATE', 'UPPER', 'UPPERCASE', 'USERNAME', 'USING', 'UUID', 'UUID_COMPARE', 'UUID_CREATE', 'UUID_FROM_CHAR', 'UUID_TO_CHAR', 'VALUE', 'VALUES',
  'VARCHAR', 'VAR_POP', 'VAR_SAMP', 'VIEW', 'WEEK', 'WEEK_ISO', 'WHEN', 'WHERE', 'WINDOW', 'WITH', 'WITHIN', 'WITHOUT', 'YEAR', 'YEARWEEK', 'FIRST', 'LAST', 'KEY', 'DESC', 'ASC', 'TRUNCATED',
  'ENCRYPT', 'RECONSTRUCT', 'PASSPHRASE', 'NEW_PASSPHRASE', 'RAISE', 'DBEVENT', 'SHARE', 'NOSHARE', 'REGISTER', 'REMOVE', 'INQUIRE_SQL', 'SYNONYM', 'INDEX', 'SAVE', 'COMMENT', 'IMPORT', 'RENAME',
  'OPTION', 'CURRENT', 'INSTALLATION', 'CASCADE', 'PRIVILEGES', 'ACCESS', 'COPY_INTO', 'COPY_FROM', 'EXCLUDING', 'EXECUTE', 'SEQUENCE', 'NEXT', 'NOCREATE_TABLE', 'DATABASE', 'IF', 'INTEGER1',
  'INTEGER2', 'INTEGER4', 'INTEGER8'
];
const reservedTopLevelWords = [
    'ADD', 'ALTER COLUMN', 'ALTER TABLE', 'CASE', 'DELETE FROM', 'END', 'GROUP BY', 'LEFT JOIN', 'JOIN', 'FROM', 'HAVING', 'INSERT INTO', 'ORDER BY', 'SELECT', 'SET', 'UPDATE', 'VALUES', 'WHERE',
    'INNER JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'
];
const reservedTopLevelWordsNoLineAfter = [
    'ADD', 'ALTER COLUMN', 'ALTER TABLE', 'CASE', 'DELETE FROM', 'END', 'GROUP BY', 'LEFT JOIN', 'JOIN', 'FROM', 'HAVING', 'INSERT INTO', 'ORDER BY', 'SET', 'UPDATE', 'WHERE',
    'INNER JOIN', 'LEFT OUTER JOIN', 'RIGHT JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'
];
const reservedTopLevelWordsNoIndent = ['INTERSECT', 'UNION', 'UNION ALL', 'UNION DISTINCT', 'EXCEPT'];
const reservedNewlineWords = ['ON', 'AND', 'ELSE', 'OR', 'WHEN'];
const reservedDataTypes = [
  'INT', 'INTEGER', 'INT1', 'INT2', 'INT4', 'INT8', 'TINYINT', 'SMALLINT', 'BIGINT', 'CHAR', 'NCHAR', 'VARCHAR', 'NVARCHAR', 'BOOLEAN', 'DEC', 'NUMERIC', 'MONEY', 'DECIMAL', 'TIME',
  'TIME WITH TIME ZONE', 'TIME WITHOUT TIME ZONE', 'DATE', 'ANSIDATE', 'TIMESTAMP', 'TIMESTAMP WITH TIME ZONE', 'TIMESTAMP WITHOUT TIME ZONE', 'FLOAT', 'FLOAT4', 'FLOAT8', 'IPV4', 'IPV6', 'UUID',
  'TIMESTAMP_WITH_TZ', 'TIMESTAMP_WO_TZ', 'TIME_WITH_TZ', 'TIME_WO_TZ', 'INTEGER1', 'INTEGER2', 'INTEGER4', 'INTEGER8'
];
// Functions, if a bracket follows this, there should be no gap e.g. MAX(duration)
const reservedFuncTypes = [
  'CAST', 'LEFT', 'RIGHT', 'UPPER', 'LOWER', 'IFNULL', 'NULLIF', 'COALESCE', 'NVL', 'NVL2', 'RANDOM', 'ACOS', 'ABS', 'ADD_MONTHS', 'ANSIDATE', 'ANY', 'ASCII', 'ASIN', 'ATAN', 'ATAN2', 'AVG',
  'BIGINT', 'BOOLEAN', 'CEIL', 'CEILING', 'CHAR', 'CHARACTER_LENGTH', 'CHAREXTRACT', 'CHAR_LENGTH', 'CHR', 'CONCAT', 'CORR', 'COS', 'COUNT', 'COVAR_POP', 'COVAR_SAMP', 'DATE', 'DATE_FORMAT',
  'DATE_PART', 'DATE_TRUNC', 'DAY', 'DAYOFMONTH', 'DAYOFWEEK', 'DAYOFYEAR', 'DBMSINFO', 'DENSE_RANK', 'DOW', 'DOY', 'ELSE', 'END', 'ENDING', 'EPOCH', 'ESCAPE', 'EVERY', 'EXP', 'EXTRACT',
  'FIRST_VALUE', 'FLOAT', 'FLOAT4', 'FLOAT8', 'FLOOR', 'FROM_UNIXTIME', 'GREATER', 'GREATEST', 'HASH', 'HEX', 'HOUR', 'INET6_NTOP', 'INET6_PTON', 'INET_NTOP',  'INET_PTON', 'INITCAP', 'INT',
  'INT1', 'INT2', 'INT4', 'INT8', 'INTEGER', 'INTERVAL_DIFF', 'INTERVAL_DTOS', 'INTERVAL_YTOM', 'IPV4', 'IPV6', 'JARO_WINKLER', 'LAG', 'LAST_DAY', 'LAST_VALUE', 'LEAD', 'LEAST', 'LEFT',
  'LENGTH', 'LESSER', 'LEVENSHTEIN', 'LIKE', 'LISTAGG', 'LN', 'LOCATE', 'LOG', 'LOWER', 'LOWERCASE', 'LPAD', 'LTRIM', 'MATCH', 'MAX', 'MICROSECOND', 'MILLISECOND', 'MIN', 'MINUTE', 'MOD',
  'MONEY', 'MONTH', 'MONTHS_BETWEEN', 'NANOSECOND', 'NCHAR', 'NOT', 'NOTRIM', 'NTILE', 'NUMERIC', 'NVARCHAR', 'OCTET_LENGTH', 'PERCENT_RANK', 'PI', 'POSITION', 'POWER', 'QUARTER', 'RANDOM',
  'RANDOMF', 'RANGE', 'RANK', 'REGR_AVGX', 'REGR_AVGY', 'REGR_COUNT', 'REGR_INTERCEPT', 'REGR_R2', 'REGR_SXX', 'REGR_SYY', 'REPEAT', 'REPLACE', 'RIGHT', 'ROUND', 'ROW_NUMBER', 'RPAD',
  'SEARCH', 'SECOND', 'SHIFT', 'SIGN', 'SIN', 'SMALLINT', 'SOUNDEX', 'SQRT', 'SQUEEZE', 'STDDEV_POP', 'STDDEV_SAMP', 'STR_TO_DATE', 'SUBSTR', 'SUBSTRING', 'SUBSTRING_INDEX', 'SUM', 'TAN',
  'TIME', 'TIMESTAMP', 'TIMESTAMPADD', 'TIMESTAMPDIFF', 'TIMESTAMP_LOCAL', 'TIMESTAMP_WITH_TZ', 'TIMESTAMP_WO_TZ', 'TIME_FORMAT', 'TIME_LOCAL', 'TIME_WITH_TZ', 'TIME_WO_TZ', 'TINYINT',
  'TO_CHAR', 'TO_DATE', 'TO_TIME', 'TO_TIMESTAMP', 'TO_TIMESTAMP_TZ', 'TRIM', 'TRUNC', 'UNIX_TIMESTAMP', 'UPPER', 'UPPERCASE', 'UUID_COMPARE', 'UUID_CREATE', 'UUID_FROM_CHAR', 'UUID_TO_CHAR',
  'VARCHAR', 'VAR_POP', 'VAR_SAMP', 'WEEK', 'WEEK_ISO', 'YEAR', 'YEARWEEK', 'IF'
];
const reservedConstraints = [
  'NULL', 'NOT', 'PRIMARY', 'FOREIGN'
];
const dataTypeChPos = 35;
const constraintChPos = 63;
const INLINE_MAX_LENGTH = 70;