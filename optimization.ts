import * as fs from 'fs';
import * as turf from '@turf/turf';
import _localStreets from './simpleStreetsMin.geo.json';

const locals = _localStreets as turf.FeatureCollection;

type StreetData = {
    type: "Feature",
    properties: any,
    geometry: {
        type: "MultiLineString",
        coordinates: number[][][]
    }
}

const simplifyStreet = (street: StreetData | turf.Feature<turf.MultiLineString>) => {
    const streetFeature: turf.Feature<turf.MultiLineString> = turf.feature(street.geometry, street.properties);
    return turf.simplify(streetFeature, {
        tolerance: 0.001,
        highQuality: true,
        mutate: true,
    })
}
const simplifyLocals = () => {
    let sizeBefore = JSON.stringify(locals).length;
    const streetsCollection = turf.featureCollection(locals.features);
    const newStreetsCollection = turf.featureCollection([]);
    streetsCollection.features.forEach((val) => {
        newStreetsCollection.features.push(
            simplifyStreet(val as turf.Feature<turf.MultiLineString>)
        );
    })
    let sizeAfter = JSON.stringify(newStreetsCollection).length;
    console.log(`Size before: ${sizeBefore/1000}KB; Size after: ${sizeAfter/1000}KB (${((sizeAfter/sizeBefore)*100).toFixed(3)}% the size!)`)
}
const simplifyDirectory = (directoryPath: string) => {
    fs.readdir(directoryPath, (err, files) => {
        if(err) {
            return console.error(err);
        }
        files.forEach(file => {
            if(!file.endsWith("geo.json")) return;
            const fileContents = fs.readFileSync(directoryPath + '/' + file, {encoding: 'utf-8'});
            const fileSizePre = fileContents.length;
            
            const streetsCollection = JSON.parse(fileContents) as turf.FeatureCollection;
            const newStreetsCollection = turf.featureCollection([]);
            streetsCollection.features.forEach(val => {
                newStreetsCollection.features.push(
                    simplifyStreet(val as turf.Feature<turf.MultiLineString>)
                )
            })
            const newFile = JSON.stringify(newStreetsCollection);
            const fileSizePost = newFile.length;
            console.log(`${file}: was ${fileSizePre/1000}KB, now ${fileSizePost/1000}KB (${((fileSizePost/fileSizePre)*100).toFixed(3)} the size!)`)
            fs.writeFileSync("./simpleStreets/" + file, newFile, {encoding: 'utf-8'});
        })
    })
}
// simplifyDirectory('streetClasses');
const simplifyStreetsMin = () => {
    const streetsminData = fs.readFileSync("./streetsmin.geo.json", {encoding: 'utf-8'});
    const streetsmin = JSON.parse(streetsminData) as turf.FeatureCollection;
    const newStreetsmin = turf.featureCollection([]);
    streetsmin.features.forEach(val => {
        newStreetsmin.features.push(
            simplifyStreet(val as turf.Feature<turf.MultiLineString>)
        )
    })
    fs.writeFileSync("./simpleStreetsMin.geo.json", JSON.stringify(newStreetsmin), {encoding: 'utf-8'});
}
// simplifyStreetsMin();

const detectContinuousStreets = (streets: turf.FeatureCollection<turf.MultiLineString, {
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
}>) => {
    // use turf.js to find MultiLineStrings that should be joined at the ends, but aren't, and join them into a single MultiLineString.
    // this will make the streets easier to work with.
    // combine two streets if:
    // 1. they have the same name
    // 2. they have the same class
    // 3. they share an endpoint
    // 4. they are continuous (i.e. they are not separated by a gap)
    const streetsCollection = streets;
    const newStreets = turf.featureCollection<turf.MultiLineString, {
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
    }>([]);
    const streetsDone: string[] = [];
    streets.features.forEach((street, ind, arr) => {
        // if(street.properties.street_nam !== "95TH") return;
        const streetID = street.properties.street_nam + " " + street.properties.street_typ
        if(streetsDone.includes(streetID)) return;
        // console.log(streetID)
        streets.features.forEach((street2, ind2) => {
            if(!(street2.properties.street_nam == street.properties.street_nam && street2.properties.street_typ == street.properties.street_typ)) return;
            arr[ind].geometry.coordinates = arr[ind].geometry.coordinates.concat(street2.geometry.coordinates);
            // newStreet.geometry.coordinates.concat(street2.geometry.coordinates);
        });

        const newStreet = turf.feature(arr[ind].geometry, street.properties);
        newStreet.properties.length = turf.length(newStreet).toString();
        newStreet.properties.shape_len = turf.length(newStreet).toString();
        newStreets.features.push(newStreet);
        streetsDone.push(street.properties.street_nam + " " + street.properties.street_typ);
    });
    console.log(streets.features.length);
    console.log(newStreets.features.length);
    fs.writeFileSync("./continuousStreets.geo.json", JSON.stringify(newStreets), {encoding: 'utf-8'});
}
detectContinuousStreets(locals as turf.FeatureCollection<turf.MultiLineString, {
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
}>);