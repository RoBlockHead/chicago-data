import * as fs from "fs";
import _streetsData from "./streetsmin.geo.json";

const streetsData = _streetsData as StreetCollection;

type StreetCollection = {
    type: "FeatureCollection",
    features: {
        type: "Feature",
        properties: {
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
        },
        geometry: any
    }[]
}
// const _streetsData = fs.readFileSync("./streetsmin.geo.json");

// const streetsData = JSON.parse(_streetsData);

const streets = streetsData.features;

const unnamedStreets: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const expressways: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const arterials: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const collectors: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const local: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const namedAlleys: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const tiered: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const ramps: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const extents: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const rivers: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const sidewalks: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

const unclassified: StreetCollection = {
    type: "FeatureCollection",
    features: []
}

streets.forEach(street => {
    if(!street.properties.street_nam) return unnamedStreets.features.push(street);
    switch(street.properties.class) {
        case "1":
            return expressways.features.push(street);
        case "2":
            return arterials.features.push(street);
        case "3":
            return collectors.features.push(street);
        case "4":
            return local.features.push(street);
        case "5":
            return namedAlleys.features.push(street);
        case "7":
            return tiered.features.push(street);
        case "9":
            return ramps.features.push(street);
        case "E":
            return extents.features.push(street);
        case "RIV":
            return rivers.features.push(street);
        case "S":
            return sidewalks.features.push(street);
        case "99":
            return unclassified.features.push(street);
        default:
            return unclassified.features.push(street);
    }
});

fs.writeFileSync("./streetClasses/unnamedStreets.geo.json", JSON.stringify(unnamedStreets));
fs.writeFileSync("./streetClasses/expressways.geo.json", JSON.stringify(expressways));
fs.writeFileSync("./streetClasses/arterials.geo.json", JSON.stringify(arterials));
fs.writeFileSync("./streetClasses/collectors.geo.json", JSON.stringify(collectors));
fs.writeFileSync("./streetClasses/local.geo.json", JSON.stringify(local));
fs.writeFileSync("./streetClasses/namedAlleys.geo.json", JSON.stringify(namedAlleys));
fs.writeFileSync("./streetClasses/tiered.geo.json", JSON.stringify(tiered));
fs.writeFileSync("./streetClasses/ramps.geo.json", JSON.stringify(ramps));
fs.writeFileSync("./streetClasses/extents.geo.json", JSON.stringify(extents));
fs.writeFileSync("./streetClasses/rivers.geo.json", JSON.stringify(rivers));
fs.writeFileSync("./streetClasses/sidewalks.geo.json", JSON.stringify(sidewalks));
fs.writeFileSync("./streetClasses/unclassified.geo.json", JSON.stringify(unclassified));