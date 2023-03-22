import {Pack} from "../Pack/Pack";
import localforage from "localforage";
import getByKey from "./GetByKey";
import {loadPack} from "../Game/Game";

export default async function getPack(setDownloadProgressCallback: any = null): Promise<Pack|null>
{
    let pack = await getByKey('pack');
    if (pack) {
        console.log('pack found in localforage');
        return pack as Pack;
    }
    console.log('pack not found in localforage, loading from server');
    let packResult = await loadPack(null, setDownloadProgressCallback);
    console.log('pack loaded from server', packResult.data)
    await localforage.setItem('pack', packResult.data);

    return packResult.data as Pack;
}
