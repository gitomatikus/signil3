import localforage from "localforage";

export default async function getByKey(key: string) {
    console.log('getByKey', key)
    return await localforage.getItem(key);
}