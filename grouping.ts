import * as fs from 'fs';

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
