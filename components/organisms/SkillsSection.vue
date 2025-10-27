<template>
	<section class="skills-section">
		<div class="container">
			<h2 class="skills-section__title">
				<q-icon name="mdi-code-tags" color="primary" />
				Core Competencies & Technical Skills
			</h2>

			<q-card flat bordered class="skills-section__card">
				<q-card-section>
					<div class="skills-section__list">
						<SkillTag
							v-for="(skill, index) in competencies.skills"
							:key="index"
							:skill="skill.skill"
							:proficiency="skill.proficiency"
						/>
					</div>
				</q-card-section>
			</q-card>
		</div>
	</section>
</template>

<script setup lang="ts">
	import type { CoreCompetencies } from '~/types/cv'
	import SkillTag from '~/components/atoms/SkillTag.vue'

	interface Props {
		competencies: CoreCompetencies
	}

	defineProps<Props>()
</script>

<style scoped>
	.skills-section {
		padding: 3rem 0;
		background: var(--background);
	}

	.skills-section__title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: var(--text-color);
	}

	.skills-section__card {
		background: var(--background);
	}

	.skills-section__list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	@media (max-width: 767px) {
		.skills-section {
			padding: 2rem 0;
		}

		.skills-section__title {
			font-size: 1.5rem;
		}

		.skills-section__list {
			gap: 0.5rem;
		}
	}
</style>
