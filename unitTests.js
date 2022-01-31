/***
As results being acceptable are subjective in cases like line length, use the browser console to display results for more complex tests
Single function tests can still use assert, but the purpose here is to test the adaptation for vector, not the base repository
***/
const testInputs = [
  {"testFor": 'no final semicolon', "inpStr": 'select 1', "expStr": "SELECT 1"},
  {"testFor": 'awkward comments', "inpStr": 'select 1;\n/*--*/select 2;\nselect 3; -- ;\nselect 4;\n--/*select 5;*/\nselect 6;\n/*select 7--;*/\nselect 8;\n--/*\nselect 9;\n--*/\nselect 0;', "expStr": 'SELECT 1;\n/*--*/\nSELECT 2;\nSELECT 3;\n-- ;\nSELECT 4;\n-- /*select 5;*/\nSELECT 6;\n/*select 7--;*/\nSELECT 8;\n-- /*\nSELECT 9;\n-- */\nSELECT 0;'},
  {"testFor": 'quote aliases', "inpStr": 'select a.x as b from tbl a;', "expStr": 'SELECT a.x AS "b" FROM tbl a;'},
  {"testFor": 'quote create fields', "inpStr": 'create table tbl (s char(1) primary key, t int not null, x int not null);', "expStr": 'CREATE TABLE tbl (\n  "s"                             CHAR(1)                     PRIMARY KEY,\n  "t"                             INT                         NOT NULL,\n  "x"                             INT                         NOT NULL\n);'},
  {"testFor": 'CTAS', "inpStr": 'create table tbl as select d as aa, e as ff, g as hh from other_tbl where d < 100;', "expStr": 'CREATE TABLE tbl AS\nSELECT\n  d AS "aa",\n  e AS "ff",\n  g AS "hh"\nFROM other_tbl\nWHERE d < 100\n;'},
  {"testFor": 'limit line length', "inpStr": 'CREATE TABLE tbl (\n  "s"             CHAR(1)                     PRIMARY KEY,\n  "t"             INT                         NOT NULL,\n  "x"             INT                         NOT NULL\n);', "expStr": 'CREATE TABLE tbl (\n  "s"                             CHAR(1)                     PRIMARY KEY,\n  "t"                             INT                         NOT NULL,\n  "x"                             INT                         NOT NULL\n);'},
  {"testFor": 'quoted semicolon', "inpStr": "select ';' as f from t", "expStr": `SELECT\n  ';' AS "f"\nFROM t`},
  {"testFor": 'quoted semicolon', "inpStr": "create table xx as select ';' as f from t", "expStr": `CREATE TABLE xx AS\nSELECT\n  ';' AS "f"\nFROM t`},
  {"testFor": 'quoted semicolon', "inpStr": "create table xx as select ';--' as f from t", "expStr": `CREATE TABLE xx AS\nSELECT\n  ';--' AS "f"\nFROM t`},
  {"testFor": 'aliased semicolon', "inpStr": 'select 1 as "f;" from t', "expStr": `SELECT\n  1 AS "f;"\nFROM t`},
  {"testFor": 'complexity', "inpStr": `select '[{[");|_-+=' f from x`, "expStr": `SELECT\n  '[{[");|_-+=' f\nFROM x`},
  {"testFor": 'complexity 2', "inpStr": `SELECT ';' AS "a", 's' AS "s;" from x;`, "expStr": `SELECT\n  ';' AS "a",\n  's' AS "s;"\nFROM x;`},
  {"testFor": 'message', "inpStr": 'tests complete', "expStr": 'tests complete'}
];
async function unitTest() {
  // Find where we are in the test process
  let leftText = input.doc.getValue();
  let i = testInputs.findIndex(q => q.inpStr === leftText) + 1; // +1 as start with -1 and we're always off by one
  if (i >= testInputs.length || testInputs[i].inpStr === 'tests complete') {
    runTests(i);
    testInfo.innerHTML = "Tests complete";
    testInfo.style['background-color'] = '#ccc';
    testInfo.style['cursor'] = 'not-allowed';
  } else {
    runTests(i);
    testInfo.innerHTML = "Showing results for test " + i.toString();
    let testPass = testInputs[i].expStr === output.doc.getValue();
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