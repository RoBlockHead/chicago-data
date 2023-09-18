"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const streetsmin_geo_json_1 = __importDefault(require("./streetsmin.geo.json"));
const streetsData = streetsmin_geo_json_1.default;
// const _streetsData = fs.readFileSync("./streetsmin.geo.json");
// const streetsData = JSON.parse(_streetsData);
const streets = streetsData.features;
const unnamedStreets = {
    type: "FeatureCollection",
    features: []
};
const expressways = {
    type: "FeatureCollection",
    features: []
};
const arterials = {
    type: "FeatureCollection",
    features: []
};
const collectors = {
    type: "FeatureCollection",
    features: []
};
const local = {
    type: "FeatureCollection",
    features: []
};
const namedAlleys = {
    type: "FeatureCollection",
    features: []
};
const tiered = {
    type: "FeatureCollection",
    features: []
};
const ramps = {
    type: "FeatureCollection",
    features: []
};
const extents = {
    type: "FeatureCollection",
    features: []
};
const rivers = {
    type: "FeatureCollection",
    features: []
};
const sidewalks = {
    type: "FeatureCollection",
    features: []
};
const unclassified = {
    type: "FeatureCollection",
    features: []
};
streets.forEach(street => {
    if (!street.properties.street_nam)
        return unnamedStreets.features.push(street);
    switch (street.properties.class) {
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
