import { findServiceWorker } from "./findServiceWorker"
import localVersion from '../../stores/localVersion'
import message from "../../stores/message"
import remoteVersionFilename from '../../../main.version?url'


async function initWebApp():Promise<void>{
    let $localVersion:string
    localVersion.subscribe($=>$localVersion=$)()
    try{
        console.log({remoteVersionFilename})
        let remoteVersion:any = await fetch(remoteVersionFilename)
        remoteVersion = await remoteVersion.text()
        
        console.log("versions:",{
            "local":$localVersion,
            "remote":remoteVersion
        })
        
        if($localVersion !== remoteVersion){
            //location.reload(true);
            message.set({
                text: `Nuova versione disponibile ${remoteVersion}`,
                timeout: 1000*60*30, //30 minutes
                buttons:[
                    {
                        text:'Aggiorna',
                        action:()=>{
                            message.set(null)
                            localStorage.clear()
                            console.log(`Updating from version ${$localVersion} to version ${remoteVersion}`)
                            if(window.caches)
                                caches.keys().then((keyList) => {
                                    console.log({keyList});
                                    
                                    Promise.all(keyList.map((key) => caches.delete(key)))
                                });
                            if(window.navigator && window.navigator.serviceWorker)
                                window.navigator.serviceWorker.getRegistrations().then(function(registrations) {
                                    for(let registration of registrations) {
                                        registration.unregister()
                                    }
                                })
                            localVersion.set(remoteVersion)
            
                            location.reload(true)
                        }
                    },
                    {
                        text:'Chiudi',
                        action:()=>message.set(null),
                    }
                ]
            });
            
        }
        
        if(window.navigator && window.navigator.serviceWorker) 
            navigator.serviceWorker.getRegistrations().then(findServiceWorker);
        
    }catch(e){
        console.error(e)
    }
}

export { initWebApp }