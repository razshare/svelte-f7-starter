declare global {
    interface Window { cordova: any; }
}

export default class Permission{
	static requestLocalNotificationPermission():Promise<boolean>{
		return new Promise(async resolve=>{
			Notification
			.requestPermission()
			.then(function(permission) {
				resolve(permission==="granted")
			});
		});
	}
}

