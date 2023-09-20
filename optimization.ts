import * as fs from 'fs';
import * as turf from '@turf/turf';
import _localStreets from './streetClasses/arterials.geo.json';

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
        tolerance: 5,
        highQuality: false,
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
simplifyDirectory('streetClasses');