import message from '../stores/message';
let request;

window.addEventListener('beforeinstallprompt', (r:any) => {
	// Prevent Chrome 67 and earlier from automatically showing the prompt
	r.preventDefault();
	request = r;
});

export default async function install():Promise<boolean>{
	if(!request){
		if(!["127.0.0.1","localhost"].includes(location.hostname) && !location.protocol.startsWith("https")){
			message.set({text:"Non puoi installare la pwa da un dominio non sicuro."})
		}else{
			message.set({text:"Non puoi installare la pwa senza un service worker attivo."})
		}
		return;
	}
	let installResponse = await request.prompt();
	console.info({installResponse});
	return installResponse.outcome === 'accepted';
}
