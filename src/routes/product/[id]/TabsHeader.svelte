<script lang="ts">
  interface Props {
    activeTab: number;
    onTabChange: (tab: number) => void;
  }

  let { activeTab, onTabChange }: Props = $props();

  const handleProductDetailsClick = () => onTabChange(0);
  const handleReviewsClick = () => onTabChange(1);
  const handleFaqsClick = () => onTabChange(2);
</script>

<div class="flex flex-row items-center justify-evenly border-b border-b-gray-200">
  <button
    onclick={handleProductDetailsClick}
    class={`${activeTab === 0 && 'border-b-2 border-b-black'} flex-grow text-center`}
    >Product Details</button
  >
  <button
    onclick={handleReviewsClick}
    class={`${activeTab === 1 && 'border-b-2 border-b-black'} flex-grow text-center`}
    >Rating & Reviews</button
  >
  <button
    onclick={handleFaqsClick}
    class={`${activeTab === 2 && 'border-b-2 border-b-black'} flex-grow text-center`}>FAQs</button
  >
</div>
