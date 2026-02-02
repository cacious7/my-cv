<template>
	<q-btn
		:label="label"
		:icon="icon"
		:color="color"
		:size="size"
		:flat="flat"
		:outline="outline"
		:rounded="rounded"
		:disable="disable"
		:loading="loading"
		@click="handleClick"
		class="app-button"
	/>
</template>

<script setup lang="ts">
	interface Props {
		label?: string
		icon?: string
		color?: string
		size?: string
		flat?: boolean
		outline?: boolean
		rounded?: boolean
		disable?: boolean
		loading?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {
		label: '',
		icon: '',
		color: 'primary',
		size: 'md',
		flat: false,
		outline: false,
		rounded: false,
		disable: false,
		loading: false
	})

	interface Emits {
		(e: 'click', event: Event): void
	}

	const emit = defineEmits<Emits>()

	const handleClick = (event: Event) => {
		if (!props.disable && !props.loading) {
			emit('click', event)
		}
	}
</script>

<style scoped>
	.app-button {
		text-transform: none;
		font-weight: 500;
	}
</style>
