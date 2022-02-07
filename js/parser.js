// Split incoming SQL by ; where it is not commented, part of a regex or string literal
// Replace block comments with line comments when neither part of a string "/' nor commented
function parseThenSplit (code) {
  // State
  let isInRegExp  = false;
  let isInString  = false;
  let terminator  =  null; // To hold the string terminator
  let escape      = false; // Last char was an escape
  let isInComment = false;
  let c = code.split('');  // Input
  let o = [];              // Output
  let querySepar = '\n;split_here;\n';
  for (let i = 0; i < c.length; i++) {
    if (isInString) {  // Handle string literal case
      if (c[i] === terminator && escape === false) {
        isInString = false;
        o.push(c[i]);
      } else if (c[i] === '\\') { // Escape
        escape = true;
      } else {
        escape = false;
        o.push(c[i]); 
      }
    } else if (isInRegExp) { // Regular expression case
      if (c[i] === '/' && escape === false) {
        isInRegExp = false;
        o.push(c[i]);
      } else if (c[i] === '\\') {
        escape = true;
      } else { 
        escape = false;
        o.push(c[i]);
      }
    } else if (isInComment) { // Comment case
      if (c[i] === '*' && c[i+1] === '/') {
        isInComment = false;
        o.push('*/\n');
        i++;
      } else if (c[i] === '\n') {
        o.push('\n');
      } else {
        o.push(c[i]);
      }
    } else { // Not in a literal
      if (c[i] === '-' && c[i+1] === '-') { // Single line comment
        o.push('\n--');
        if (c[i+2] !== ' ' && c[i+2] !== '\n') o.push(' '); // Space after comments if not existing already
        i = i + 2;
        while (c[i] !== '\n' && c[i] !== undefined) {
          o.push(c[i]);
          i++; // End or new line
        };
        o.push('\n');
      } else if (c[i] === '/' && c[i+1] === '*') { // Start comment
        let cToNL = blockIsOnOneLine(code.slice(i));
        if (cToNL) {// Turn this into a single line comment if it is only one one line
          let asLineComm = code.slice(i+2, i+cToNL).trim();
          o.push('\n-- ' + asLineComm + '\n');
          i += cToNL + 1; // Skip past comment chars
        } else { // Else treat this as a proper multi-line comment
          o.push('\n/*');
          isInComment = true;
          if (c[i+2] !== ' ' && c[i+2] !== '\n') o.push(' '); // Add a space per spec if it's missing
          i++; // Skip past comment chars
        }
      } else if (c[i] === '/') { // Start regexp literal
        isInRegExp = true;
        o.push(c[i]);
      } else if (c[i] === "'" || c[i] === '"') { // String literal
        isInString = true;
        o.push(c[i]);
        terminator = c[i];
      } else { // Code
        if (c[i] === ';') {
          o.push(querySepar);
        } else {
          o.push(c[i]);
        }
      }
    }
  }
  o = o.join('')
        .replace(/ +\n/g, '\n')                          // No hanging spaces
        .replaceAll('-- custom fields to be added here', '--custom fields to be added here')
        .split(querySepar)                               // Split into queries
        .filter(v => v.replaceAll(/\s/g, '').length > 1) // Only real queries 
        .map(q => q.replace(/;+$/, ''));                 // Trim any trailing ;
  return o;
}
function blockIsOnOneLine (str) {
  // Given a string starting with a block comment start /*
  // Return true or false - do we see the comment end before we see a new line?
  let charsToNewLine = str.indexOf('\n');
  let charsToCommEnd = str.indexOf('*/');
  if (charsToCommEnd === -1) return false;
  return charsToCommEnd < charsToNewLine ? charsToCommEnd : false;
}