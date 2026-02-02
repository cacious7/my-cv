<template>
	<section class="experience-section">
		<div class="container">
			<h2 class="experience-section__title">
				<q-icon name="mdi-briefcase" color="primary" />
				Professional Experience
			</h2>

			<div class="experience-section__list">
				<ExperienceCard
					v-for="(exp, index) in experience"
					:key="index"
					:experience="exp"
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	import type { ProfessionalExperience } from '~/types/cv'
	import ExperienceCard from '~/components/molecules/ExperienceCard.vue'

	interface Props {
		experience: ProfessionalExperience[]
	}

	defineProps<Props>()
</script>

<style scoped>
	.experience-section {
		padding: 3rem 0;
		background: var(--background-alt);
	}

	.experience-section__title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: var(--text-color);
	}

	.experience-section__list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	@media (max-width: 767px) {
		.experience-section {
			padding: 2rem 0;
		}

		.experience-section__title {
			font-size: 1.5rem;
		}
	}
</style>
