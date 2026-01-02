<script lang="ts">
  interface Props {
    name: string;
    initialQuantity: number;
  }

  const min = 1;
  const max = 100;

  let { name, initialQuantity }: Props = $props();

  let quantity = $state(initialQuantity);

  function addQuantity() {
    quantity = quantity + 1;
  }

  function subtractQuantity() {
    quantity = quantity - 1;
  }
</script>

<div class="flex items-center justify-around">
  <button type="button" class="text-2xl" onclick={subtractQuantity} disabled={quantity === min}>
    -
  </button>
  <input
    class="bg-gray-200 text-center"
    type="number"
    {name}
    readOnly={true}
    value={quantity}
    {min}
    {max}
  />
  <button class="text-2xl" type="button" onclick={addQuantity} disabled={quantity === max}>
    +
  </button>
</div>
