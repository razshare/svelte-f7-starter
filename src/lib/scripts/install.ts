import message from '../stores/message';
import worker from '../stores/worker';
import {Writable, writable} from 'svelte/store';
const isInstallable:Writable<any> = writable(false);

let request;

window.addEventListener('beforeinstallprompt', (r:any) => {
	// Prevent Chrome 67 and earlier from automatically showing the prompt
	r.preventDefault()
	request = r
	isInstallable.set(true)
});




async function install():Promise<boolean>{
	if(!request){
		let $isInstallable;
		isInstallable.subscribe(x=>$isInstallable=x)()
		if(!$isInstallable){
			message.set(
				{
					text:[
						"This application is not installable.",
						"Perhaps you've already installed it?"
					]
				}
			)
		}else if(!["127.0.0.1","localhost"].includes(location.hostname) && !location.protocol.startsWith("https")){
			message.set({text:"You cannot install a Progressive Web Application from a non secure domain."})
		}else{
			message.set({text:"Unknown error."})
		}
		return;
	}
	let installResponse = await request.prompt();
	console.info({installResponse});
	return installResponse.outcome === 'accepted';
}


export {
	isInstallable,
	install,
}