import worker from '../stores/worker';
import message from '../stores/message';

async function requestNotificationPermission():Promise<boolean>{
	return (await Notification.requestPermission()) === 'granted';
}


export default async function notify(
	title:string,
	body:string,
	delay:number=1,
	vibrate:Array<number>=[200, 100, 200],
	icon:string='static/images/logo.png',
	tag:string=''
):Promise<void>{
	if(!await requestNotificationPermission()){
		console.warn("Notification won't be sent because notification permission has not been granted.");
		return;
	}
	
	(worker.subscribe($worker=>{
		if($worker === null){
			console.warn("You need to install the main worker before sending a notification.");
			message.set({text:"Non puoi utilizzare il sistema di notifiche senza un service worker."})
			return;
		}
		$worker.active.postMessage(JSON.stringify({
			action: "send-notification",
			body: {
				title,
				body,
				vibrate,
				icon,
				tag
			}
		}));
	}))();
}