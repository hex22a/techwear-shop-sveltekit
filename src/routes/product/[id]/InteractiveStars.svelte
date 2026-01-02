<script lang="ts">
  const ACTIVE_COLOR = '#ff8c00';
  const DEFAULT_COLOR = '#eee';

  interface Props {
    rating: number;
    onChange: (rating: number) => void;
  }

  let hoverRating = $state(1);

  const getColor = (value: number) => {
    if (hoverRating !== -1) {
      return value <= hoverRating ? ACTIVE_COLOR : DEFAULT_COLOR;
    }
    return value <= rating ? ACTIVE_COLOR : DEFAULT_COLOR;
  };

  let { rating, onChange }: Props = $props();
  const ratingsArray = [1, 2, 3, 4, 5];
</script>

{#each ratingsArray as value (value)}
  <span
    onclick={() => onChange(value)}
    onmouseenter={() => (rating = value)}
    onmouseleave={() => (rating = -1)}
    style="cursor: 'pointer'; color: {getColor(value)}"
    aria-label={`${value} Star${value > 1 ? 's' : ''}`}
  >
    ★
  </span>
{/each}
<span>{rating}/5</span>
