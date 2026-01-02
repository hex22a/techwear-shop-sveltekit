<script lang="ts">
  import './layout.css';
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <!-- Satoshi -->
  <link
    rel="preload"
    href="/fonts/Satoshi_Complete/Satoshi-Regular.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Satoshi_Complete/Satoshi-Bold.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Satoshi_Complete/Satoshi-Black.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Satoshi_Complete/Satoshi-BlackItalic.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Satoshi_Complete/Satoshi-Light.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Satoshi_Complete/Satoshi-LightItalic.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Satoshi_Complete/Satoshi-Medium.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Satoshi_Complete/Satoshi-MediumItalic.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Satoshi_Complete/Satoshi-BoldItalic.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />

  <!-- Integral -->
  <link
    rel="preload"
    href="/fonts/Integral_CF/integralcf-regular.otf"
    as="font"
    type="font/otf"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Integral_CF/integralcf-medium.otf"
    as="font"
    type="font/otf"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    href="/fonts/Integral_CF/integralcf-bold.otf"
    as="font"
    type="font/otf"
    crossorigin="anonymous"
  />
</svelte:head>

<Header/>
{@render children()}
<Footer/>
