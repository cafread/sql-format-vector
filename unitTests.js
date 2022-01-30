/***
As results being acceptable are subjective in cases like line length, use the browser console to display results for more complex tests
Single function tests can still use assert, but the purpose here is to test the adaptation for vector, not the base repository
***/
const testInputs = [
  {"testFor": 'no final semicolon', "inpStr": 'select 1'},
  {"testFor": 'awkward comments', "inpStr": 'select 1;\n/*--*/select 2;\nselect 3; -- ;\nselect 4;\n--/*select 5;*/\nselect 6;\n/*select 7--;*/\nselect 8;\n--/*\nselect 9;\n--*/\nselect 0;'},
  {"testFor": 'quote aliases', "inpStr": 'select a.x as b from tbl a;'},
  {"testFor": 'quote create fields', "inpStr": 'create table tbl (s char(1) primary key, t int not null, x int not null);'},
  {"testFor": 'CTAS', "inpStr": 'create table tbl as select d as aa, e as ff, g as hh from other_tbl where d < 100;'},
  {"testFor": 'limit line length', "inpStr": 'CREATE TABLE tbl (\n  "s"             CHAR(1)                     PRIMARY KEY,\n  "t"             INT                         NOT NULL,\n  "x"             INT                         NOT NULL\n);'},
  {"testFor": 'quoted semicolon', "inpStr": "select ';' as f from t"},
  {"testFor": 'quoted semicolon', "inpStr": "create table xx as select ';' as f from t"},
  {"testFor": 'quoted semicolon', "inpStr": "create table xx as select ';--' as f from t"},
  {"testFor": 'aliased semicolon', "inpStr": 'select 1 as "f;" from t'},
  {"testFor": 'complexity', "inpStr": `select '[{[");|_-+=' f from x`},
  {"testFor": 'complexity 2', "inpStr": `SELECT ';' AS "a", 's' AS "s;" from x;`}
];
async function unitTest() {
  // Find where we are in the test process
  let leftText = input.doc.getValue();
  let i = testInputs.findIndex(q => q.inpStr === leftText) + 1;
  if (i >= testInputs.length) {
    testInfo.innerHTML = "Tests complete";
  } else {
    runTests(i);
    testInfo.innerHTML = "Showing results for test " + i.toString();
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
    let testResults = [];
    for (let test of testInputs) {
      input.doc.setValue(test.inpStr);
      format();
      testResults.push({"testFor": test.testFor, "formRes": output.doc.getValue()});
    }
    console.log(testResults);
  }
}