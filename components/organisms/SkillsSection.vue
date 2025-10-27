<template>
	<section class="skills-section">
		<div class="container">
			<h2 class="skills-section__title">
				<q-icon name="mdi-code-tags" color="primary" />
				Core Competencies & Technical Skills
			</h2>

			<div class="skills-section__grid">
				<q-card flat bordered class="skills-section__card">
					<q-card-section>
						<SkillsList
							:skills="competencies.programming_languages"
							title="Programming Languages"
						/>
					</q-card-section>
				</q-card>

				<q-card flat bordered class="skills-section__card">
					<q-card-section>
						<SkillsList
							:skills="competencies.front_end_frameworks"
							title="Front-End Frameworks"
						/>
					</q-card-section>
				</q-card>

				<q-card flat bordered class="skills-section__card">
					<q-card-section>
						<SkillsList
							:skills="competencies.back_end_technologies"
							title="Back-End Technologies"
						/>
					</q-card-section>
				</q-card>

				<q-card flat bordered class="skills-section__card">
					<q-card-section>
						<SkillsList :skills="competencies.databases" title="Databases" />
					</q-card-section>
				</q-card>

				<q-card flat bordered class="skills-section__card">
					<q-card-section>
						<SkillsList :skills="competencies.tools_dev_ops" title="Tools & DevOps" />
					</q-card-section>
				</q-card>

				<q-card flat bordered class="skills-section__card">
					<q-card-section>
						<SkillsList :skills="competencies.testing" title="Testing" />
					</q-card-section>
				</q-card>

				<q-card flat bordered class="skills-section__card">
					<q-card-section>
						<SkillsList
							:skills="competencies.emerging_technologies"
							title="Emerging Technologies"
						/>
					</q-card-section>
				</q-card>

				<q-card flat bordered class="skills-section__card">
					<q-card-section>
						<SkillsList :skills="competencies.methodologies" title="Methodologies" />
					</q-card-section>
				</q-card>

				<q-card flat bordered class="skills-section__card">
					<q-card-section>
						<SkillsList :skills="competencies.debugging" title="Debugging" />
					</q-card-section>
				</q-card>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	import type { CoreCompetencies } from '~/types/cv'
	import SkillsList from '~/components/molecules/SkillsList.vue'

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

	.skills-section__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.skills-section__card {
		background: var(--background);
	}

	@media (min-width: 768px) {
		.skills-section__grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.skills-section__grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 767px) {
		.skills-section {
			padding: 2rem 0;
		}

		.skills-section__title {
			font-size: 1.5rem;
		}
	}
</style>
