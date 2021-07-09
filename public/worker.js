var workbox = {}
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');


const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;

registerRoute(
  ({url}) => (
    !url.pathname.endsWith("version")
    && !url.pathname.endsWith("worker.js")
  ),
  new CacheFirst()
);

let notificationPermission = false

async function requestNotificationPermission(){
	let granted = (await Notification.requestPermission()) === 'granted'
	return granted
}


async function notify(title,body,vibrate=[200, 100, 200],icon='',tag=''){
  this.registration.showNotification(title, {
      body: body,
      icon: icon,
      vibrate: vibrate,
      tag: tag
  })
}

let vars = {
  notificationPermission:false
};

self.addEventListener('message', async function(event){
  let data = JSON.parse(event.data);
  console.log("Service worker recieved a message:",{data});
  switch(data.action){
      case "set-vars":
          for(let key in event.data.body) {
            vars[key] = event.data.body[key];
            console.log(`vars['${key}'] set to `,event.data.body[key]);
          }
      break;
      case "send-notification":
        notify(
          data.body.title,
          data.body.body,
          data.body.vibrate,
          data.body.icon,
          data.body.tag
        );
      break;
  }
});

self.addEventListener('install', function (e) {
  console.log("Website saved locally.");
});

(async function poll(){
  if(vars.notificationPermission)
    try{
      console.log("updating notifications...");
      let response = await fetch("http://127.0.0.1/get-notifications.php");
      let notifications = await response.json();
      notifications.forEach((notification)=>{
        notify(notification.titolo,notification.testo);
      })
    }catch(e){
      console.warn(e);
    }

  setTimeout(poll,10000)
})();