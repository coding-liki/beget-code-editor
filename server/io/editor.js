export default function(socket, io) { 
    return Object.freeze({
        addTransaction(transaction){
            socket.clients.every((client) => {
//                client.send()
            });
            return {status: 'ok', transaction: transaction};
        }
    })
}