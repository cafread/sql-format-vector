# sql-format-vector
Demo: https://cafread.github.io/sql-format-vector/

Existing SQL formatters don't deal with all the keywords, align things poorly, get very slow with longer chains of a few dozen queries and frequently output code which isn't even nice to look at.  Manually fixing code sent to me was wasting time, so I built this one weekend.

Formats Actian Vector SQL nicely, based on the work here: https://github.com/zeroturnaround/sql-formatter
* Adds reserved words
* Formats short queries as single lines
* Quotes aliases
* Aligns join terms
* Splits input into queries and caches results, so editing large statements isn't laggy
* Debounces input, so the user's CPU doesn't fry
* Runs in browser without node as code may include sensitive information
* Runs garbage collection when it would be useful, so the user's RAM isn't all used up

Paste the raw query on the left, copy the result on the right.
No options, as it's meant to return roughly style guide compliant code.
Aligning some of the result to maximise human readability is still advised.
