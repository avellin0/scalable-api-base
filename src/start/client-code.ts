import {ServerProtocol} from '../server/Adapter-Server-Protocol'
import {AdapterServer} from '../server/Adapter-Server'

function RunServer(server: ServerProtocol){
    if(server){
        server.isRunning()
        console.log('Server is running...');
    }else{
        console.log('Server is Falled');
    }
}

RunServer(new AdapterServer())
