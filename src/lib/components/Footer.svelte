<script lang="ts">
  import styles from './Footer.module.css';

  import Twitter from '$lib/icons/twitter.svelte';
  import Facebook from '$lib/icons/facebook.svelte';
  import Instagram from '$lib/icons/instagram.svelte';
  import Github from '$lib/icons/github.svelte';
</script>

<footer class="relative">
  <div class="mx-auto my-0 max-w-96 md:max-w-[78rem]">
    <div
      class="mb-14 flex flex-col items-center justify-between rounded-3xl bg-black px-6 py-8 md:flex-row md:px-16 md:py-11"
    >
      <h1 class="mb-8 w-full text-4xl text-white md:w-1/2">
        STAY UPTO DATE ABOUT OUR LATEST OFFERS
      </h1>
      <form class="w-full md:w-1/3">
        <label class={`${styles.email} relative block`} for="email_footer"></label>
        <input
          id="email_footer"
          class="mb-3 w-full rounded-full bg-white py-3 pl-14 text-black"
          type="text"
          placeholder="Enter your email address"
        />
        <button class="w-full rounded-full bg-white py-3 text-black"
          >Subscribe to Newsletter
        </button>
      </form>
    </div>
    <div class="flex flex-col items-start justify-between md:flex-row">
      <div class="mb-6 w-full md:w-1/4">
        <h1 class="mb-6 text-4xl">TECH SHOP</h1>
        <p class="mb-9 text-lg">
          We have clothes that suits your style and which you’re proud to wear. From women to men.
        </p>
        <div>
          <a class="mr-3 inline-block" href="#">
            <Twitter />
          </a>
          <a class="mr-3 inline-block" href="#">
            <Facebook />
          </a>
          <a class="mr-3 inline-block" href="#">
            <Instagram />
          </a>
          <a class="inline-block" href="#">
            <Github />
          </a>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-x-10 md:grid-cols-4">
        <div>
          <h3 class="mb-7">Company</h3>
          <a class="mb-5 block" href="#">About</a>
          <a class="mb-5 block" href="#">Features</a>
          <a class="mb-5 block" href="#">Works</a>
          <a class="mb-5 block" href="#">Career</a>
        </div>
        <div>
          <h3 class="mb-7">Help</h3>
          <a class="mb-5 block" href="#">Customers Support</a>
          <a class="mb-5 block" href="#">Delivery Details</a>
          <a class="mb-5 block" href="#">Terms & Conditions</a>
          <a class="mb-5 block" href="#">Privacy Policy</a>
        </div>
        <div>
          <h3 class="mb-7">FAQ</h3>
          <a class="mb-5 block" href="#">Account</a>
          <a class="mb-5 block" href="#">Manage Deliveries</a>
          <a class="mb-5 block" href="#">Orders</a>
          <a class="mb-5 block" href="#">Payments</a>
        </div>
        <div>
          <h3 class="mb-7">Resources</h3>
          <a class="mb-5 block" href="#">Free eBooks</a>
          <a class="mb-5 block" href="#">Development Tutorial</a>
          <a class="mb-5 block" href="#">How to - Blog</a>
          <a class="mb-5 block" href="#">Youtube playlist</a>
        </div>
      </div>
    </div>
    <hr class="mt-12 mb-6" />
    <div class="flex flex-col items-center justify-between pb-20 md:flex-row">
      <div class="mb-4 md:mb-0">Tech Shop © 2025, All Rights Reserved</div>
      <div>
        <img class="inline-block" src="/vector/visa.svg" alt="visa logo" width={66} height={49} />
        <img
          class="inline-block"
          src="/vector/mc.svg"
          alt="mastercard logo"
          width={66}
          height={49}
        />
        <img
          class="inline-block"
          src="/vector/paypal.svg"
          alt="paypal logo"
          width={66}
          height={49}
        />
        <img
          class="inline-block"
          src="/vector/apple-pay.svg"
          alt="apple pay logo"
          width={66}
          height={49}
        />
        <img
          class="inline-block"
          src="/vector/google-pay.svg"
          alt="google pay logo"
          width={66}
          height={49}
        />
      </div>
    </div>
    <div class="absolute right-0 bottom-0 left-0 -z-10 h-5/6 bg-[rgba(240,240,240,1)]"></div>
  </div>
</footer>
