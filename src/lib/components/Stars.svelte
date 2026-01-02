<script lang="ts">
  import styles from './Stars.module.css';

  interface Props {
    rating: number;
  }

  let { rating }: Props = $props();
</script>

<i class={`${styles.star} mr-3`} style={`{"--rating": ${rating}`}></i>
<span>{rating}/5</span>
