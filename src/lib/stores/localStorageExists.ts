import { Writable, writable } from 'svelte/store';
import uuid from '../scripts/uuid';

let test = uuid();
let store = false;
try {
	localStorage.setItem(test, test);
	localStorage.removeItem(test);
	store = true;
} catch(e) {
	console.warn("This browser does not support the localStorage API.");
	store = false;
}

const localStorageExists:Writable<any> = writable(store);

export default localStorageExists;