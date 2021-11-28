# sql-format-vector
Format Actian Vector SQL nicely, based on the excellent work here: https://github.com/zeroturnaround/sql-formatter
* Adds reserved words
* Formats short queries as single lines
* Quotes aliases
* Aligns join terms

Ideally future versions will quote fields in table generation and align field names, types & nullable status.

Run this on a server, paste the raw query on the left, copy the result on the right.
No options, as it's meant to return style guide compliant code.
Aligning some of the result to maximise human readability is still advised.