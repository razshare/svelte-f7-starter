import {Writable, writable} from 'svelte/store';

const worker:Writable<ServiceWorkerRegistration|null> = writable(null);

export default worker;