export default class Storage {
    static data = {};

    static get(name, defaultValue = undefined) {
        return Storage.data[name] ??= defaultValue;
    }

    static set(name, value) {
        Storage.data[name] = value;
    }
}