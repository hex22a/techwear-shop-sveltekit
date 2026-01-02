<script lang="ts">
  interface Props {
    height?: number;
    width?: number;
    class?: string;
  }

  let { height = 16, width = 16, class: className = '' }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" {height} {width} class={className} fill="none"
  ><path
    d="m13.53 6.53-5 5a.751.751 0 0 1-1.062 0l-5-5a.751.751 0 1 1 1.063-1.062L8 9.938l4.47-4.47a.751.751 0 0 1 1.062 1.062h-.001Z"
  /></svg
>
