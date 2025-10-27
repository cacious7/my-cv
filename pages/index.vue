<template>
	<div class="cv-page">
		<CVHeader :contact-info="personalInfo" @download="handleDownloadPDF" />
		<SummarySection :summary="executiveSummary" />
		<SkillsSection :competencies="coreCompetencies" />
		<ExperienceSection :experience="experience" />

		<!-- Projects Section -->
		<section class="projects-section">
			<div class="container">
				<h2 class="section-title">
					<q-icon name="mdi-rocket-launch" color="primary" />
					Key Projects
				</h2>

				<div class="projects-grid">
					<q-card
						v-for="(project, index) in projects.connexcs_internal_projects"
						:key="index"
						flat
						bordered
					>
						<q-card-section>
							<h3 class="project-title">{{ project.name }}</h3>
							<p class="project-description">{{ project.description }}</p>
						</q-card-section>
					</q-card>
				</div>

				<h3 class="subsection-title">Open Source Contributions</h3>
				<div class="projects-grid">
					<q-card
						v-for="(contribution, index) in projects.open_source_contributions"
						:key="index"
						flat
						bordered
					>
						<q-card-section>
							<h3 class="project-title">{{ contribution.project_name }}</h3>
							<p class="project-description">{{ contribution.role_impact }}</p>
							<div v-if="contribution.url" class="project-link">
								<a :href="contribution.url" target="_blank" rel="noopener noreferrer">
									<q-icon name="mdi-link" />
									View Project
								</a>
							</div>
						</q-card-section>
					</q-card>
				</div>
			</div>
		</section>

		<!-- Education Section -->
		<section class="education-section">
			<div class="container">
				<h2 class="section-title">
					<q-icon name="mdi-school" color="primary" />
					Education & Continuous Learning
				</h2>

				<div class="education-grid">
					<q-card flat bordered>
						<q-card-section>
							<h3 class="subsection-title">Formal Education</h3>
							<div
								v-for="(edu, index) in education.formal_education"
								:key="index"
								class="education-item"
							>
								<h4 class="education-institution">{{ edu.institution }}</h4>
								<p class="education-degree">{{ edu.degree_course }}</p>
								<p class="education-dates">{{ edu.dates }}</p>
								<p v-if="edu.activities" class="education-activities">
									<q-icon name="mdi-star" size="xs" />
									{{ edu.activities }}
								</p>
							</div>
						</q-card-section>
					</q-card>

					<q-card flat bordered>
						<q-card-section>
							<h3 class="subsection-title">Self-Directed Learning</h3>
							<div
								v-for="(learning, index) in education.self_directed_learning"
								:key="index"
								class="education-item"
							>
								<h4 class="education-platform">{{ learning.platform_topic }}</h4>
								<p class="education-details">{{ learning.details }}</p>
							</div>
						</q-card-section>
					</q-card>
				</div>
			</div>
		</section>

		<!-- Footer -->
		<footer class="cv-footer no-print">
			<div class="container">
				<p class="cv-footer__text">
					Last Updated: {{ lastUpdated }} | Built with Nuxt 3, Quasar, and TypeScript
				</p>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useCVData } from '~/composables/useCVData'
	import CVHeader from '~/components/organisms/CVHeader.vue'
	import SummarySection from '~/components/organisms/SummarySection.vue'
	import SkillsSection from '~/components/organisms/SkillsSection.vue'
	import ExperienceSection from '~/components/organisms/ExperienceSection.vue'

	const {
		cvData,
		personalInfo,
		executiveSummary,
		coreCompetencies,
		experience,
		projects,
		education
	} = useCVData()

	const lastUpdated = computed(() => {
		return new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	})

	const handleDownloadPDF = async () => {
		if (import.meta.client) {
			const { downloadPDF } = await import('~/utils/pdfGenerator')
			downloadPDF(cvData.value)
		}
	}

	useHead({
		title: `${personalInfo.value.full_name} - CV`,
		meta: [
			{
				name: 'description',
				content: executiveSummary.value.substring(0, 160)
			}
		]
	})
</script>

<style scoped>
	.cv-page {
		min-height: 100vh;
		background: var(--background);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: var(--text-color);
	}

	.subsection-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 1.5rem 0 1rem;
		color: var(--text-color);
	}

	.projects-section {
		padding: 3rem 0;
		background: var(--background);
	}

	.projects-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.project-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--primary-color);
		margin-bottom: 0.75rem;
	}

	.project-description {
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.project-link {
		margin-bottom: 1rem;
	}

	.project-link a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
	}

	.project-link a:hover {
		text-decoration: underline;
	}

	.project-tech {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.education-section {
		padding: 3rem 0;
		background: var(--background-alt);
	}

	.education-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.education-item {
		margin-bottom: 1.5rem;
	}

	.education-item:last-child {
		margin-bottom: 0;
	}

	.education-institution,
	.education-platform {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--primary-color);
		margin-bottom: 0.5rem;
	}

	.education-degree,
	.education-details {
		margin-bottom: 0.25rem;
		line-height: 1.6;
	}

	.education-dates {
		color: var(--text-light);
		font-size: 0.875rem;
	}

	.education-activities {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-color);
		font-style: italic;
	}

	.cv-footer {
		background: var(--background);
		border-top: 2px solid var(--border-color);
		padding: 2rem 0;
		text-align: center;
	}

	.cv-footer__text {
		color: var(--text-light);
		font-size: 0.875rem;
	}

	@media (min-width: 768px) {
		.projects-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.education-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 767px) {
		.section-title {
			font-size: 1.5rem;
		}

		.projects-section,
		.education-section {
			padding: 2rem 0;
		}
	}
</style>
