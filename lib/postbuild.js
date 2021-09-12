const fs = require('fs');
const path = require('path');
const ssri = require('ssri');

const base = 'https://barandasdemir-perfanalytics.herokuapp.com';
const files = fs.readdirSync('./dist').filter((f) => f.endsWith('.js'));

const promises = files.map((f) => ssri.fromStream(fs.createReadStream(path.join('./dist', f))));

Promise.all(promises).then((sris) => {
  let text = '';
  files.forEach((file, idx) => {
    text += `<script
  src="${base}/${file}"
  integrity="${sris[idx].toString()}"
  crossorigin="anonymous"
></script>\n\n`;
  });
  fs.writeFileSync(path.join('./dist', 'sri.txt'), text);
});
