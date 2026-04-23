const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, '..', 'google-cloud-key.json');
const content = fs.readFileSync(keyPath, 'utf8');

// The file currently has literal \\n (escaped backslash n)
// We want it to have literal \n (escaped newline)
// Wait, if it's a JSON file, and we see \\n in the text, it means the parsed string has \n.
// BUT, if the user sees \\n in the `view_file` output, and `view_file` shows the raw file content...
// Let's check if the string has double backslashes or single.

const json = JSON.parse(content);
console.log('Original private_key snippet:', json.private_key.substring(0, 50));

// If the private_key string contains literal '\n' (backslash n), we need to replace it with actual newlines.
// PEM format in service account JSONs uses \n to represent newlines.
// If it has \\n, it's doubly escaped.

json.private_key = json.private_key.replace(/\\n/g, '\n');

fs.writeFileSync(keyPath, JSON.stringify(json, null, 2));
console.log('Fixed google-cloud-key.json');
