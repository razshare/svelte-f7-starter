import { findServiceWorker } from "./findServiceWorker"
import localVersion from '../../stores/localVersion'
import message from "../../stores/message"
import remoteVersionFilename from '../../../main.version?url'

async function initWebApp():Promise<void>{
    let $localVersion:string
    localVersion.subscribe($=>$localVersion=$)()
    let remoteVersion:any

    try{
        console.log({remoteVersionFilename})
        remoteVersion = await fetch(remoteVersionFilename)
        remoteVersion = await remoteVersion.text()
    }catch(e){
        /**
         * This is very important.
         * 
         * The above fetch request is the only request in the whole
         * application (besides API requests perhaps) that does not 
         * hit the local cache storage at all, it will go straight to the server.
         * 
         * This means the above request will always fail when your user is offline.
         * 
         * In that case the application should keep working as usual, thus the 
         * remote version should be set the same as the local version.
         */
        
        remoteVersion = $localVersion
    }


    try{
        console.log("versions:",{
            "local":$localVersion,
            "remote":remoteVersion
        })
        
        if($localVersion !== remoteVersion){
            //location.reload(true);
            message.set({
                text: `New version available ${remoteVersion}`,
                timeout: 1000*60*30, //30 minutes
                buttons:[
                    {
                        text:'Update',
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
                        text:'Close',
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