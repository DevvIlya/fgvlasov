// index.js
const Mustache = require('mustache');
const fs = require('fs');
const MUSTACHE_MAIN_DIR = './main.mustache';
/**
  * DATA is the object that contains all
  * the data to be provided to Mustache
  * Notice the "name" and "date" property.
*/
let DATA = {
  name: 'Fedor',
  date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Moscow',
  }),
};

// Добавляем дату последнего обновления
DATA.refresh_date = new Date().toLocaleString('en-GB');


/**
  * A - We open 'main.mustache'
  * B - We ask Mustache to render our file with the data
  * C - We create a README.md file with the generated output
  */
async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}
generateReadMe();