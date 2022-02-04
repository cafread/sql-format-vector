/***
As results being acceptable are subjective in cases like line length, use the browser console to display results for more complex tests
Single function tests can still use assert, but the purpose here is to test the adaptation for vector, not the base repository
***/
const testInputs = [
  {"testFor": 'no final semicolon', "inpStr": 'select 1', "expStr": "SELECT 1"},
  {"testFor": 'awkward comments', "inpStr": 'select 1;\n/*--*/select 2;\nselect 3; -- ;\nselect 4;\n--/*select 5;*/\nselect 6;\n/*select 7--;*/\nselect 8;\n--/*\nselect 9;\n--*/\nselect 0;', "expStr": 'SELECT 1;\n-- --\nSELECT 2;\nSELECT 3;\n-- ;\nSELECT 4;\n-- /*select 5;*/\nSELECT 6;\n-- select 7--;\nSELECT 8;\n-- /*\nSELECT 9;\n-- */\nSELECT 0;'},
  {"testFor": 'quote aliases', "inpStr": 'select a.x as b from tbl a;', "expStr": 'SELECT a.x AS "b" FROM tbl a;'},
  {"testFor": 'quote create fields', "inpStr": 'create table tbl (s char(1) primary key, t int not null, x int not null);', "expStr": 'CREATE TABLE tbl (\n  "s"                             CHAR(1)                     PRIMARY KEY,\n  "t"                             INT                         NOT NULL,\n  "x"                             INT                         NOT NULL\n);'},
  {"testFor": 'CTAS', "inpStr": 'create table tbl as select d as aa, e as ff, g as hh from other_tbl where d < 100;', "expStr": 'CREATE TABLE tbl AS\nSELECT\n  d AS "aa",\n  e AS "ff",\n  g AS "hh"\nFROM other_tbl\nWHERE d < 100\n;'},
  {"testFor": 'limit line length', "inpStr": 'CREATE TABLE tbl (\n  "s"             CHAR(1)                     PRIMARY KEY,\n  "t"             INT                         NOT NULL,\n  "x"             INT                         NOT NULL\n);', "expStr": 'CREATE TABLE tbl (\n  "s"                             CHAR(1)                     PRIMARY KEY,\n  "t"                             INT                         NOT NULL,\n  "x"                             INT                         NOT NULL\n);'},
  {"testFor": 'quoted semicolon', "inpStr": "select ';' as f from t", "expStr": `SELECT ';' AS "f" FROM t`},
  {"testFor": 'quoted semicolon in CTAS', "inpStr": "create table xx as select ';' as f from t", "expStr": `CREATE TABLE xx AS SELECT ';' AS "f" FROM t`},
  {"testFor": 'CTE in CTAS', "inpStr": `CREATE TABLE some_ctas AS WITH some_cte AS (\n  SELECT\n    id,\n    MAX(invoice_date) AS "li",\n    SUM(VALUE) AS "v"\n  FROM inv\n)\nSELECT\n  *\nFROM some_cte\nWHERE v > 100\n;`},
  {"testFor": 'quoted semicolon and comment', "inpStr": "create table xx as select ';--' as f from t", "expStr": `CREATE TABLE xx AS SELECT ';--' AS "f" FROM t`},
  {"testFor": 'aliased semicolon', "inpStr": 'select 1 as "f;" from t', "expStr": `SELECT 1 AS "f;" FROM t`},
  {"testFor": 'complexity', "inpStr": `select '[{[");|_-+=' f from x`, "expStr": `SELECT '[{[");|_-+=' f FROM x`},
  {"testFor": 'complexity 2', "inpStr": `SELECT ';' AS "a", 's' AS "s;" from x;`, "expStr": `SELECT ';' AS "a", 's' AS "s;" FROM x;`},
  {"testFor": 'table and field alias case', "inpStr": `SELECT\n	UPPER("FiElD") AS "x",\n	'OK' AS "Y",\n  CASE\n		WHEN UPPER(custom."Trip Purpose Description") IN (\n    		'REC', 'AbC', 'ASAA', 'ETER', 'ETEA', 'ZZZ'\n    	)\n      THEN 'Yes'\n    END AS s\nFROM SsSs\n;`, "expStr": `SELECT\n  UPPER("field") AS "x",\n  'OK' AS "y",\n  CASE\n    WHEN UPPER(custom."trip purpose description") IN ('REC', 'AbC', 'ASAA', 'ETER', 'ETEA', 'ZZZ') THEN 'Yes'\n  END AS "s"\nFROM ssss\n;`},
  {"testFor": 'block to single line comments', "inpStr": `SELECT\n/* I should be a single line comment*/ 'String of Evil',\n/* I should be a single line comment*/ --'Extra Evil',\n/* I am a multi line comment\n   good luck! */\n/* I should be a single line comment*/ "Field of Evil",\n/* I should be a single line comment*/ 1 AS "value of evil",\n"the end"\nFROM evil`, "expStr": `SELECT\n  -- I should be a single line comment\n  'String of Evil',\n  -- I should be a single line comment\n  -- 'Extra Evil',\n  -- I am a multi line comment\n  --    good luck!\n  -- I should be a single line comment\n  "field of evil",\n  -- I should be a single line comment\n  1 AS "value of evil",\n  "the end"\nFROM evil`},
  {"testFor": 'short statement block comments', "inpStr": `SELECT \n/* x */ 1 AS "pure evil"\nFROM evil`, "expStr": `SELECT\n  -- x\n  1 AS "pure evil"\nFROM evil`},
  {"testFor": 'spacey strings', "inpStr": `'a     b' AS "long   space"`, "expStr": `'a     b' AS "long   space"`},
  {"testFor": 'custom comment', "inpStr": `SELECT\n1,\n--custom fields to be added here\nFROM a`, "expStr": `SELECT\n  1,\n  --custom fields to be added here\nFROM a`},
  {"testFor": 'select first n distinct on one line', "inpStr": `SELECT FIRST 20 DISTINCT\n  abcdefghijklmnopqrstuvwxyz\nFROM some_long_table_name\n;\nSELECT FIRST 20\n  abcdefghijklmnopqrstuvwxyz\nFROM some_long_table_name\n;\nSELECT DISTINCT\n  abcdefghijklmnopqrstuvwxyz\nFROM some_long_table_name\n;`},
  {"testFor": 'select first n distinct on one line 2', "inpStr": `SELECT FIRST 20 DISTINCT\n  abcdefghijklmnopqrstuvwxyz,\n  abcdefghijklmnopqrstuvwxyz\nFROM some_long_table_name\n;\nSELECT FIRST 20\n  abcdefghijklmnopqrstuvwxyz,\n  abcdefghijklmnopqrstuvwxyz\nFROM some_long_table_name\n;\nSELECT\n  *\nFROM (\n    SELECT DISTINCT\n      abcdefghijklmnopqrstuvwxyz,\n      abcdefghijklmnopqrstuvwxyz\n    FROM some_long_table_name\n  ) AS "i_q"\n;\nCREATE TABLE zxcvbnm AS\nSELECT FIRST 20\n  abcdefghijklmnopqrstuvwxyz,\n  abcdefghijklmnopqrstuvwxyz\nFROM some_long_table_name\n;`},
  {"testFor": 'message', "inpStr": 'tests complete', "expStr": 'tests complete'}
];
async function unitTest() {
  // Find where we are in the test process
  let leftText = input.doc.getValue();
  let i = testInputs.findIndex(q => q.inpStr === leftText) + 1; // +1 as start with -1 and we're always off by one
  if (i >= testInputs.length || testInputs[i].inpStr === 'tests complete') {
    runTests(i);
    testInfo.innerHTML = 'Tests complete';
    testInfo.style['background-color'] = '#ccc';
    testInfo.style['cursor'] = 'not-allowed';
  } else {
    runTests(i);
    testInfo.innerHTML = 'Showing results for test ' + i + ' of ' + (testInputs.length - 2) + ': ' + testInputs[i].testFor;
    let expStr = testInputs[i].expStr || testInputs[i].inpStr; // Default to test non-mutation of input if no output specified
    let testPass = expStr === output.doc.getValue();
    testInfo.style['background-color'] = testPass ? '#bfb' : '#fbb';
    if (!testPass) console.log('Test ' & i & 'failed', testInputs[i].expStr, output.doc.getValue());
  }
}
function runTests(n=null) {
  gcCache();
  if (n !== null) {
    if (!testInputs[n]) return 'Invalid test selection';
    input.doc.setValue(testInputs[n].inpStr);
    format();
    return testInputs[n].testFor;
  } else {
    for (let test of testInputs) {
      input.doc.setValue(test.inpStr);
      format();
    }
  }
}