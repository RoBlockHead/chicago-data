import * as fs from 'fs';
import * as turf from '@turf/turf';
type StreetCollection = {
    type: "FeatureCollection",
    features: turf.Feature<turf.Geometry, {
        street_nam: string | null,
        street_typ: string,
        tiered: "Y" | "N",
        suf_dir?: string,
        ewns?: string,
        dir_travel?: "F" | "T",
        ewns_coord?: string,
        class: string,
        length: string,
        shape_len: string
    }>[]
}

type GroupedStreets = {
    [name: string]: StreetCollection
}

const groupedStreets: GroupedStreets = {

}
const streetsData = JSON.parse(fs.readFileSync("./simpleStreetsMin.geo.json").toString()) as StreetCollection;

const streets = streetsData.features;
streets.forEach((street) => {
    const streetName = street.properties.street_nam;
    if(!groupedStreets[streetName]) groupedStreets[streetName] = turf.featureCollection([street]);
    else groupedStreets[streetName]?.features.push(street);
})
fs.writeFileSync('./groupedStreets.json', JSON.stringify(groupedStreets), {encoding: 'utf-8'});
