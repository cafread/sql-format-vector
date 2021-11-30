const testInputs = [
  {"testFor": 'no final semicolon', "inpStr": 'select 1'},
  {"testFor": 'awkward comments', "inpStr": 'select 1;\n/*--*/select 2;\nselect 3; -- ;\nselect 4;\n--/*select 5;*/\nselect 6;\n/*select 7--;*/\nselect 8;\n--/*\nselect 9;\n--*/\nselect 0;'},
  {"testFor": 'quote aliases', "inpStr": 'select a.x as b from tbl a;'},
  {"testFor": 'quote create fields', "inpStr": 'create table tbl (s char(1) primary key, t int not null, x int not null);'},
  {"testFor": 'CTAS', "inpStr": 'create table tbl as select d as aa, e as ff, g as hh from other_tbl where d < 100;'},
  {"testFor": 'limit line length', "inpStr": 'CREATE TABLE tbl (\n  "s"             CHAR(1)                     PRIMARY KEY,\n  "t"             INT                         NOT NULL,\n  "x"             INT                         NOT NULL\n);'}
];
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

