const fs = require('fs');

const _streetsData = fs.readFileSync("./streetsmin.geo.json");

const streetsData = JSON.parse(_streetsData);

const streets = streetsData.features;

const newContents = {
    type: "FeatureCollection",
    features: []
}

streets.forEach(street => {
    if(street.properties.class == "99") newContents.features.push(street);
});

fs.writeFileSync("./unclassified.geo.json", JSON.stringify(newContents));
