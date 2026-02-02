<template>
	<q-card class="experience-card" flat bordered>
		<q-card-section>
			<div class="experience-card__header">
				<div>
					<div class="experience-card__company-row">
						<h3 class="experience-card__company">{{ experience.company_name }}</h3>
						<q-chip
							label="Remote"
							color="primary"
							text-color="white"
							size="sm"
							icon="mdi-laptop"
							class="experience-card__remote-chip"
						/>
					</div>
					<div class="experience-card__titles">
						<q-chip
							v-for="(title, index) in experience.titles"
							:key="index"
							:label="title"
							color="accent"
							text-color="white"
							size="sm"
						/>
					</div>
				</div>
				<div class="experience-card__dates">
					<q-icon name="mdi-calendar" />
					<span>{{ experience.dates_tenure }}</span>
				</div>
			</div>
		</q-card-section>

		<q-separator />

		<q-card-section>
			<h4 class="experience-card__section-title">Key Achievements</h4>
			<ul class="experience-card__achievements">
				<li
					v-for="(achievement, index) in experience.key_responsibilities_achievements"
					:key="index"
				>
					{{ achievement }}
				</li>
			</ul>
		</q-card-section>
	</q-card>
</template>

<script setup lang="ts">
	import type { ProfessionalExperience } from '~/types/cv'

	interface Props {
		experience: ProfessionalExperience
	}

	defineProps<Props>()
</script>

<style scoped>
	.experience-card {
		margin-bottom: 1.5rem;
	}

	.experience-card__header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.experience-card__company-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.experience-card__company {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--primary-color);
		margin: 0;
	}

	.experience-card__remote-chip {
		font-size: 0.75rem;
	}

	.experience-card__titles {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.experience-card__dates {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-light);
		font-size: 0.875rem;
	}

	.experience-card__section-title {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--text-color);
	}

	.experience-card__achievements {
		list-style-type: disc;
		padding-left: 1.5rem;
		line-height: 1.8;
	}

	.experience-card__achievements li {
		margin-bottom: 0.5rem;
	}

	@media (min-width: 768px) {
		.experience-card__header {
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-start;
		}
	}
</style>
