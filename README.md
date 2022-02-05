# ![icon](favicon-32x32.png) sql-format-vector
## See it live: https://cafread.github.io/sql-format-vector/

Existing SQL formatters don't deal with all Vector keywords, align things poorly, slow down with longer chains of queries and frequently output ugly code.  Vector is also moving from all lower case table & field names to allowing both, which risks breaking existing queries.

Formats Actian Vector SQL nicely, based on the work here: https://github.com/zeroturnaround/sql-formatter
* Adds Vector keywords and opinionated standards
* Formats short queries as single lines
* Quotes aliases, sets table, field and alias names to lower case
* Aligns join terms and other parts to make code more visually appealing
* Splits input into queries and caches results, so editing chained statements isn't laggy
* Debounces input, so the user's CPU doesn't fry
* Runs in browser without node as code may include sensitive information
* Runs garbage collection when it would be useful, so the user's RAM isn't all used up

Paste the raw query on the left, copy the result on the right.
No options, as it's meant to return roughly style guide compliant code.
Aligning some of the result to maximise human readability is still advised.
