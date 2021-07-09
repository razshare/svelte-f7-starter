<div class="snack-bar" transition:fly={{y:100,duration:300}}>
    <div class="grid">
        <div class="left">
            {message.text}
        </div>
        <div class="right grid grid-cols-10-auto">
            {#if message.buttons}
                {#each message.buttons as button}
                    <Button style="color:var(----snack-bar-color)" onClick={button.action}>
                        {button.text}
                    </Button>
                {/each}
            {:else}
                <Button style="color:var(----snack-bar-color)" onClick={()=>{
                    messageMaster.set(null)
                }}>
                    OK
                </Button>
            {/if}
        </div>
    </div>
</div>

<style>
    :root{
        --snack-bar-background: #333;
        --snack-bar-color: #f1f1f1;
    }
    .snack-bar{
        position: fixed;
        z-index: var(--super-z-index);
        bottom: 1rem;
        left: 1rem;
        right: 1rem;
        background: var(--snack-bar-background);
        color: var(--snack-bar-color);
        border-radius: 0.4rem;

        box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);

        font-size: .875rem;
        font-weight: 400;
        letter-spacing: .0178571429em;
        line-height: 1.25rem;
        margin-right: auto;
        padding: 7px 16px;
        text-align: initial;
        z-index: 2;
    }
    .grid{
        display: grid;
        grid-template-columns: 1fr auto;
    }
    .left{
        align-self: center;
        text-align: initial;
    }
    .right{
        align-self: center;
    }
</style>
<script lang="ts">
import { Button } from "framework7-svelte";
import { onDestroy,onMount } from "svelte";
import { fly } from "svelte/transition";
import uuid from "../scripts/uuid";
import messageMaster from "../stores/message";
import type { RichMessage } from "../interfaces/message";

export let message:RichMessage|null

let currentCallbackId = '';
onMount(()=>{
    currentCallbackId = uuid();
    let localCallbackId = currentCallbackId;
    setTimeout(()=>{
        if(localCallbackId === currentCallbackId && message.onExpire){ //make sure this is not an old callback
            message.onExpire();
        }
    },message.timeout)
});
onDestroy(()=>{
    currentCallbackId='';
});
</script>