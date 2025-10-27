<template>
	<a
		:href="url"
		target="_blank"
		rel="noopener noreferrer"
		class="social-link"
		:aria-label="`Visit ${platform} profile`"
	>
		<q-icon :name="icon" :size="size" :color="color" />
		<span v-if="showLabel" class="social-link__label">{{ platform }}</span>
	</a>
</template>

<script setup lang="ts">
	import { computed } from 'vue'

	interface Props {
		platform: string
		url: string
		size?: string
		color?: string
		showLabel?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {
		size: 'md',
		color: 'primary',
		showLabel: false
	})

	const icon = computed(() => {
		const iconMap: Record<string, string> = {
			'LinkedIn': 'mdi-linkedin',
			'GitHub': 'mdi-github',
			'Stack Overflow': 'mdi-stack-overflow',
			'FreeCodeCamp': 'mdi-free-code-camp',
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
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		transition: transform 0.2s ease;
	}

	.social-link:hover {
		transform: translateY(-2px);
	}

	.social-link__label {
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.social-link__label {
			display: none;
		}
	}
</style>
