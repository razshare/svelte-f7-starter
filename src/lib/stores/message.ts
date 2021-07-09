import { Writable, writable } from 'svelte/store';
import type { RichMessage } from '../interfaces/message';

const message:Writable<RichMessage|null> = writable(null);

export default message;