/*
Example how to use:
import storable from "../scripts/storable";

const stayConnected = storable("stayConnected",false);
export default stayConnected;
*/
import { Writable, writable } from 'svelte/store';
import localStorageExists from '../stores/localStorageExists';

let $localStorageExists = false;
const unsubscribe = localStorageExists.subscribe(_localStorageExists=>$localStorageExists=_localStorageExists);
unsubscribe();

export default function storable(storeName:string, store:any):Writable<any>{
	if($localStorageExists && localStorage[storeName]){
		try{
			store = JSON.parse(localStorage[storeName]);
		}catch(e){
			console.error("Could not load store \""+storeName+"\".",e);
			store = null;
		}
	}
	const result = writable(store);
	if($localStorageExists){
		result.subscribe($result=>{
			localStorage.setItem(storeName,JSON.stringify($result));
		});
	}
	return result;
}
