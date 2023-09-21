import Storage from "../storage.js";

export default class ClientStorage extends Storage {
    static addClient(uuid, name, wsClientId) {
        let clients = ClientStorage.get('clients', {});
        let wsClientIdToClientIdMap = ClientStorage.get('wsClientIdToClientIdMap', {});
        clients[uuid] = {
            name: name,
            uuid: uuid,
            wsClientId: wsClientId
        };
        wsClientIdToClientIdMap[wsClientId] = uuid;

        ClientStorage.set('clients', clients);
        ClientStorage.set('wsClientIdToClientIdMap', wsClientIdToClientIdMap);
    }

    static getClient(uuid) {
        let clients = ClientStorage.get('clients', {});

        return clients[uuid];
    }

    static getClientByWsClientId(wsClientId){
        let clients = ClientStorage.get('clients', {});
        let wsClientIdToClientIdMap = ClientStorage.get('wsClientIdToClientIdMap', {});

        let clientUuid =  wsClientIdToClientIdMap[wsClientId];
        if(!clientUuid){
            return undefined;
        }

        return ClientStorage.getClient(clientUuid);
    }

    static setWsClientId(uuid, wsClientId) {
        let clients = ClientStorage.get('clients', {});
        let wsClientIdToClientIdMap = ClientStorage.get('wsClientIdToClientIdMap', {});

        if (clients[uuid]) {
            clients[uuid].wsClientId = wsClientId;
            wsClientIdToClientIdMap[wsClientId] = uuid;

            ClientStorage.set('clients', clients);
            ClientStorage.set('wsClientIdToClientIdMap', wsClientIdToClientIdMap);

        }
    }
}