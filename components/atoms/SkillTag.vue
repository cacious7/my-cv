<template>
	<q-chip
		:label="skill"
		:color="chipColor"
		:text-color="textColor"
		:outline="outline"
		:icon="icon"
		class="skill-tag"
	>
		<q-tooltip v-if="proficiency" anchor="top middle" self="bottom middle">
			{{ proficiency }}
		</q-tooltip>
	</q-chip>
</template>

<script setup lang="ts">
	import { computed } from 'vue'

	interface Props {
		skill: string
		proficiency?: string
		color?: string
		outline?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {
		proficiency: '',
		color: 'primary',
		outline: false
	})

	const chipColor = computed(() => {
		if (props.proficiency) {
			const proficiencyMap: Record<string, string> = {
				'Excellent': 'green',
				'Proficient': 'blue',
				'Core Competency': 'purple',
				'Strong Values': 'deep-purple',
				'Medium Proficiency': 'cyan',
				'Experienced': 'teal',
				'Exploring': 'orange',
				'Familiar': 'amber',
				'Foundational': 'grey'
			}
			return proficiencyMap[props.proficiency] || props.color
		}
		return props.color
	})

	const textColor = computed(() => {
		return props.outline ? chipColor.value : 'white'
	})

	const icon = computed(() => {
		if (!props.proficiency) return undefined
		
		const proficiencyIcons: Record<string, string> = {
			'Excellent': 'mdi-star',
			'Proficient': 'mdi-check-circle',
			'Core Competency': 'mdi-trophy',
			'Strong Values': 'mdi-medal',
			'Medium Proficiency': 'mdi-chart-line',
			'Experienced': 'mdi-thumb-up',
			'Exploring': 'mdi-compass',
			'Familiar': 'mdi-book-open-variant',
			'Foundational': 'mdi-school'
		}
		return proficiencyIcons[props.proficiency]
	})
</script>

<style scoped>
	.skill-tag {
		margin: 0.25rem;
		font-weight: 500;
	}
</style>
