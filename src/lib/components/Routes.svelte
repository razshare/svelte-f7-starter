<Router>
  <Route path="/" component="{HomePage}" />
  <Route path="*" component="{FallbackPage}" />
</Router>
<script lang="ts">
import { Router, Route } from "svelte-routing";
import FallbackPage from "../pages/FallbackPage.svelte";
import HomePage from "../pages/HomePage.svelte";
</script>