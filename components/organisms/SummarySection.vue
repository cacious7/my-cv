<template>
	<section class="summary-section">
		<div class="container">
			<h2 class="summary-section__title">
				<q-icon name="mdi-account-details" color="primary" />
				Executive Summary
			</h2>
			<q-card flat bordered class="summary-section__card">
				<q-card-section>
					<p class="summary-section__text">{{ summary }}</p>
				</q-card-section>
			</q-card>
		</div>
	</section>
</template>

<script setup lang="ts">
	interface Props {
		summary: string
	}

	defineProps<Props>()
</script>

<style scoped>
	.summary-section {
		padding: 3rem 0;
		background: var(--background-alt);
	}

	.summary-section__title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: var(--text-color);
	}

	.summary-section__card {
		background: var(--background);
	}

	.summary-section__text {
		font-size: 1.05rem;
		line-height: 1.8;
		text-align: justify;
		margin: 0;
	}

	@media (max-width: 767px) {
		.summary-section {
			padding: 2rem 0;
		}

		.summary-section__title {
			font-size: 1.5rem;
		}

		.summary-section__text {
			font-size: 1rem;
			text-align: left;
		}
	}
</style>
