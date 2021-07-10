import worker from "../../stores/worker";
import filename from '../../../../service-worker?url';

async function findServiceWorker(registrations){
	if(registrations.length > 0){
		let reg = null;
		for(let i = 0; i < registrations.length; i++){
			//if(registrations[i].active && window.location.origin+"/worker.js" === registrations[i].active.scriptURL){
			if(registrations[i].active && window.location.origin+filename === registrations[i].active.scriptURL){
				reg = registrations[i];
				break;
			}
		}
		if(reg === null)
			console.info(`Service worker '${filename}' not found!`);
		else{
			console.info(`Service worker '${filename}' found!`);
			worker.set(reg);
		}
	}else{
		console.info("No service worker registered on this website.");
		console.log(`New worker registration request created for '${filename}'.`);
		await navigator.serviceWorker.register(filename);
		let wk:ServiceWorkerRegistration = await navigator.serviceWorker.ready;
		worker.set(wk);
	}
}


export {
    findServiceWorker
};