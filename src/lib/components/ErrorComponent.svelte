<script lang="ts">
	import CrossIcon from '$lib/icons/cross.svelte'

	interface Props {
		message: string;
		onClose: () => void;
	}

	let { message, onClose } : Props = $props();
</script>

<div class="relative rounded-xl border border-red-500 bg-red-100 p-4 text-red-500">
	{message}
	<button onclick={onClose} class="absolute top-4 right-1">
		<CrossIcon class="fill-red-500 opacity-60" width={24} height={24} />
	</button>
</div>
