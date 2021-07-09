import Framework7 from 'framework7/lite-bundle'
import Framework7Svelte from "framework7-svelte"
import App from './main.svelte'

import 'framework7/framework7-bundle.css'
import './main.scss'

Framework7.use(Framework7Svelte)

const app = new App({
  target: document.getElementById("app")
})

export default app
