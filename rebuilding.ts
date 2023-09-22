import * as turf from "@turf/turf";

const testingData = {
    type: "Feature",
    properties:{"class":"3","length":"0.86108609747402480"},
    geometry:{
        type:"MultiLineString",
        coordinates:[
            [[-87.62059279964271,41.873213337691034],[-87.61731255186064,41.87325635835019]],
            [[-87.62059279964271,41.873213337691034],[-87.61731255186064,41.87325635835019]],
            [[-87.6242001519999,41.87316160992384],[-87.62264854173391,41.87318286959021]],
            [[-87.62264854173391,41.87318286959021],[-87.62235737977058,41.87318686298241]],
            [[-87.61731255186064,41.87325635835019],[-87.61708233509034,41.87325906053313]],
            [[-87.62235737977058,41.87318686298241],[-87.62059279964271,41.873213337691034]],
            [[-87.62756611033137,41.873091932621335],[-87.62674248908858,41.873106871444946]],
            [[-87.62756611033137,41.873091932621335],[-87.62674248908858,41.873106871444946]],
            [[-87.62596609541883,41.8731255950031],[-87.6242001519999,41.87316160992384]],
            [[-87.62674248908858,41.873106871444946],[-87.62596609541883,41.8731255950031]]
        ]
    }
} as turf.Feature<turf.MultiLineString>;

const testingGoal = {
    "type":"Feature",
    "properties":{"class":"3","length":"0.86108609747402480"},
    "geometry":{
        "type":"MultiLineString",
        "coordinates":[
            [
                [-87.62756611033137,41.873091932621335],
                [-87.62674248908858,41.873106871444946],
                [-87.62596609541883,41.8731255950031],
                [-87.6242001519999,41.87316160992384],
                [-87.62264854173391,41.87318286959021],
                [-87.62235737977058,41.87318686298241],
                [-87.62059279964271,41.873213337691034],
                [-87.61731255186064,41.87325635835019],
                [-87.61708233509034,41.87325906053313]
            ],
        ]
    }
}

const desegment = (feature: turf.Feature<turf.MultiLineString>) => {
    const lines = feature.geometry.coordinates;
    const desegmented = turf.multiLineString([]);
    lines.forEach((line, ind, arr) => {
        const startCoord = line[0];
        const endCoord = line[line.length - 1];
        arr.forEach((line2, ind2) => {
            if(ind == ind2) return;
            if(line2[0] == endCoord) {
                line = line.concat(line2.slice(1));
                arr.splice(ind2, 1);
                console.log("found a match...", line)
            }
            else if(line2[line2.length - 1] == startCoord) {
                line = line2.concat(line.slice(1));
                arr.splice(ind2, 1);
                console.log("found a match...", line)
            }
        });
        desegmented.geometry.coordinates[ind] = line;
    });
    console.log(desegmented.geometry.coordinates);
}
desegment(testingData);
// define a function, orderCoords that takes an array of turf.Lines in random order and returns an array of coordinate pairs in order.
// the coordinates may have gaps and you must deal with that.
// this is essentially "un-splitting" a line string
// this should work for any coordinates, including geographic coordinates.
// const orderCoords = (lines: turf.Feature<turf.LineString>[]) => {
//     const coords = lines.map((val) => val.geometry.coordinates).flat();
//     const coords2 = coords.slice();
//     const orderedCoords: turf.Position[] = [];
//     let lastCoord = coords2.splice(0, 1)[0];
//     orderedCoords.push(lastCoord);
//     while(coords2.length > 0) {
//         const closestCoord = findClosestPoint(lastCoord, coords2);
//         coords2.splice(coords2.indexOf(closestCoord), 1);
//         orderedCoords.push(closestCoord);
//         lastCoord = closestCoord;
//     }
//     return orderedCoords;
// }

// console.log(orderCoords([
//     [[0,0], [0,1]], 
//     [[9,9], [9,8]],
//     [[0,1], [0,2]],
//     [[0,2], [0,3]],
//     [[9,8], [9,7]],
//     [[0,3], [0,4]],
// ]));