import fs from 'fs';

const _streetsData = fs.readFileSync("./chicagostreets.geo.json");

const streetsData = JSON.parse(_streetsData);

