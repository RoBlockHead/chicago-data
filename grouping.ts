import * as fs from 'fs';
import * as turf from '@turf/turf';
type StreetCollection = {
    type: "FeatureCollection",
    features: turf.Feature<turf.MultiLineString, {
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
    [name: string]: turf.FeatureCollection<turf.Geometry, {
        street_nam?: string,
        street_typ?: string,
        tiered?: "Y" | "N",
        class: number,
        length: number,
    }>
}
type GroupedContinuousStreets = {
    [name: string]: turf.Feature<turf.MultiLineString,{
        street_nam?: string,
        street_typ?: string,
        tiered?: "Y" | "N",
        class: string,
        length: string,
    }>
}

// const groupedStreets: GroupedStreets = {

// }
// const streetsData = JSON.parse(fs.readFileSync("./simpleStreetsMin.geo.json").toString()) as StreetCollection;

// const streets = streetsData.features;
// streets.forEach((street) => {
//     const streetName = street.properties.street_nam;
//     if(!groupedStreets[streetName]) groupedStreets[streetName] = turf.featureCollection([street]);
//     else groupedStreets[streetName]?.features.push(street);
// })
// fs.writeFileSync('./groupedStreets.json', JSON.stringify(groupedStreets), {encoding: 'utf-8'});
const shouldTakeClassPrecedence = (current: string, newClass: string) => {
    if(current == "1") return false;
    if(newClass == "1") return true;
    if(current == "2") return false;
    if(newClass == "2") return true;
    if(current == "3") return false;
    if(newClass == "3") return true;
    if(current == "4") return false;
    if(newClass == "4") return true;
    if(current == "5") return false;
    if(newClass == "5") return true;
    if(current == "7") return false;
    if(newClass == "7") return true;
    if(current == "9") return false;
    if(newClass == "9") return true;
    if(current == "E") return false;
    if(newClass == "E") return true;
    if(current == "RIV") return false;
    if(newClass == "RIV") return true;
    if(current == "S") return false;
    if(newClass == "S") return true;
    if(current == "99") return false;
    if(newClass == "99") return true;
    return false;
}
const findParentStreetName = (name: string) => {
    if(name.startsWith("DAN RYAN")) return "DAN RYAN";
    if(name.startsWith("KENNEDY") || name.startsWith("I190")) return "KENNEDY";
    if(name.startsWith("EISENHOWER") || name.startsWith("I290")) return "EISENHOWER";
    if(name.startsWith("STEVENSON") || name.startsWith("I55")) return "STEVENSON";
    if(name.startsWith("I57")) return "I57";
    if(name.startsWith("RANDOLPH")) return "RANDOLPH";
    if(name.startsWith("WACKER")) return "WACKER";
    if(name.startsWith("EDENS")) return "EDENS";
    if(name.startsWith("CHICAGO SKYWAY")) return "CHICAGO SKYWAY";
    if(name.startsWith("BISHOP FORD")) return "BISHOP FORD";
    if(name.startsWith("LAKE SHORE") || name.includes("LSD")) return "LAKE SHORE";
    if(name.startsWith("SOUTH WATER")) return "SOUTH WATER";
    if(name.includes("JFK")) return "KENNEDY";
    if(name.endsWith("LOWER")) return name.slice(0, name.length - 6);
    if(name.endsWith("RAMP")) return name.slice(0, name.length - 5);
    if(name.endsWith("EXT") || name.endsWith("SUB")) return name.slice(0, name.length - 4);
    if(name.startsWith("OB") || name.startsWith("IB") || name.startsWith("CTA") || name.endsWith("ACCESS")) return false;
    else return name;

}
const groupedStreets: GroupedContinuousStreets = {}
const streetsData = JSON.parse(fs.readFileSync("./continuousStreets.geo.json").toString()) as StreetCollection;
const streets = streetsData.features
streets.forEach((street) => {
    if(!street.properties.street_nam) return;
    let name = findParentStreetName(street.properties.street_nam);
    if(!name) return
    if(groupedStreets[name] != undefined) {
        groupedStreets[name].geometry.coordinates = groupedStreets[name].geometry.coordinates.concat(street.geometry.coordinates);
        groupedStreets[name].properties.length += parseInt(street.properties.length);
        if(shouldTakeClassPrecedence(groupedStreets[name].properties.class.toString(), street.properties.class)) {
            groupedStreets[name].properties.class = street.properties.class;
        }
    } else {
        groupedStreets[name] = turf.feature(street.geometry, {
            class: street.properties.class,
            length: street.properties.length
        });
    }
})

fs.writeFileSync('./groupedContinuousStreets.json', JSON.stringify(groupedStreets), {encoding: 'utf-8'});