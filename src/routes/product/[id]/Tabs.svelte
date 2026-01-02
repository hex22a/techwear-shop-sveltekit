<script lang="ts">
  import TabsHeader from './TabsHeader.svelte';
  import Reviews, { type ReviewsProps } from './Reviews.svelte';
  import Details, { type DetailsProps } from './Details.svelte';
  import FAQs from './FAQs.svelte';

  interface TabsProps extends DetailsProps, ReviewsProps {
    defaultTab?: number;
  }

  let activeTab = $state(0);
  const setActiveTab = (tab: number) => (activeTab = tab);
  let props: TabsProps = $props();
</script>

<div class="mt-20 mb-6">
  <TabsHeader {activeTab} onTabChange={setActiveTab} />
</div>
{#if activeTab === 0}
  <Reviews {...props} />
{:else if activeTab === 1}
  <Details {...props} />
{:else if activeTab === 2}
  <FAQs />
{/if}
