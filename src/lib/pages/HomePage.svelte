<script>
import { Block, Button, Page } from "framework7-svelte";
import InstallButton from "../components/InstallButton.svelte"
import SveltePNG from '../../assets/svelte.png?url'
import notify from "../scripts/notify";
</script>
<style lang="scss">
    .wrapper{
        padding: 2rem;
    }
</style>
<Page>
    <Block class="grid grid-x-center grid-y-center">
        <div class="wrapper">
            <img alt='svelte logo' src={SveltePNG}/>
        </div>
    </Block>
    <Block>
        <Button on:click={()=>{
            notify("title","body")
        }}>
            Test notifications
        </Button>
    </Block>

    <InstallButton text='Install'/>
</Page>