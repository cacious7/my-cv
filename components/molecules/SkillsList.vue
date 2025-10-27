<template>
	<div class="skills-list">
		<h3 v-if="title" class="skills-list__title">{{ title }}</h3>
		<div class="skills-list__items">
			<SkillTag
				v-for="(skill, index) in skills"
				:key="index"
				:skill="skill.skill"
				:proficiency="skill.proficiency"
				:outline="outline"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { Skill } from '~/types/cv'
	import SkillTag from '~/components/atoms/SkillTag.vue'

	interface Props {
		skills: Skill[]
		title?: string
		outline?: boolean
	}

	withDefaults(defineProps<Props>(), {
		title: '',
		outline: false
	})
</script>

<style scoped>
	.skills-list {
		margin-bottom: 1.5rem;
	}

	.skills-list__title {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--text-color);
	}

	.skills-list__items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
