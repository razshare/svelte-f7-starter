<script lang="ts">
import { App, View } from "framework7-svelte";
import { onMount } from "svelte";
import { initWebApp } from "./lib/scripts/app/app";
import Routes from "./lib/components/Routes.svelte";
import Snackbar from "./lib/components/Snackbar.svelte";
import message from "./lib/stores/message";
onMount(initWebApp)
</script>

<App
    name='My App'
    theme='auto'
    id='com.website'
    statusbar={{
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
    }}
>
    <View>
        <Routes/>
        {#if $message}
            <Snackbar message={$message}/>
        {/if}
    </View>
</App>