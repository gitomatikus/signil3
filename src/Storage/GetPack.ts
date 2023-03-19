import {Pack} from "../Pack/Pack";
import localforage from "localforage";
import getByKey from "./GetByKey";

export default async function getPack(): Promise<Pack> {

    let pack = await getByKey('pack');
    if (pack) {
        console.log('pack found in localforage');
        return pack as Pack;
    }

    console.log('pack not found in localforage, loading from server');
    const request = new XMLHttpRequest();
    request.open('GET', '/pack.json', false);  // `false` makes the request synchronous
    request.send(null);
    let packJson = request.responseText;
    pack = JSON.parse(packJson)
    localforage.setItem('pack', pack);
    return pack as Pack;
}
