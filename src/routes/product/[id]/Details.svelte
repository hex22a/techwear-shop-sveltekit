<script lang="ts">
  export interface DetailsProps {
    details: string;
  }

  let { details }: DetailsProps = $props();
</script>

<div>{details}</div>
