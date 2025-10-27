<template>
	<q-btn
		:href="url"
		target="_blank"
		rel="noopener noreferrer"
		flat
		round
		:icon="icon"
		:color="color"
		size="md"
		class="social-link"
	>
		<q-tooltip :delay="500" anchor="top middle" self="bottom middle">
			{{ platform }}
		</q-tooltip>
	</q-btn>
</template>

<script setup lang="ts">
	import { computed } from 'vue'

	interface Props {
		platform: string
		url: string
		color?: string
		showLabel?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {
		color: 'primary',
		showLabel: false
	})

	const icon = computed(() => {
		const iconMap: Record<string, string> = {
			'Linkedin': 'mdi-linkedin',
			'LinkedIn': 'mdi-linkedin',
			'Github': 'mdi-github',
			'GitHub': 'mdi-github',
			'Stack Overflow': 'mdi-stack-overflow',
			'Free Code Camp': 'mdi-free-code-camp',
			'FreeCodeCamp': 'mdi-free-code-camp',
			'Codepen': 'mdi-codepen',
			'CodePen': 'mdi-codepen',
			'Email': 'mdi-email',
			'Phone': 'mdi-phone',
			'Location': 'mdi-map-marker'
		}
		return iconMap[props.platform] || 'mdi-link'
	})
</script>

<style scoped>
	.social-link {
		transition: transform 0.2s ease, background-color 0.2s ease;
	}

	.social-link:hover {
		transform: scale(1.1);
	}
</style>
