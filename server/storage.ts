export default class Storage{
    static data = {};

    static get(name: string): any{
        return Storage.data[name] ?? undefined;
    }

    static set(name: string, value: any){
        Storage.data[name] = value;
    }
}