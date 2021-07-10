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
        //This is very important.
        //When the abvove fetch request fails, your client may be offline or the version file is mssing.
        //In that case the application should continue working as usual.
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