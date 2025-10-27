import { ref, computed } from 'vue'
import type { CVData } from '~/types/cv'
import cvDataJson from '~/cv_data.json'

export const useCVData = () => {
	const cvData = ref<CVData>(cvDataJson as CVData)
	const isLoading = ref(false)
	const error = ref<string | null>(null)

	const personalInfo = computed(() => cvData.value.contact_information_digital_footprint)
	const executiveSummary = computed(() => cvData.value.executive_summary)
	const coreCompetencies = computed(() => cvData.value.core_competencies_technical_acumen)
	const experience = computed(() => cvData.value.professional_experience)
	const projects = computed(() => cvData.value.key_projects_open_source_contributions)
	const education = computed(() => cvData.value.education_continuous_learning)

	const allSkills = computed(() => {
		const competencies = coreCompetencies.value
		return [
			...competencies.programming_languages,
			...competencies.front_end_frameworks,
			...competencies.back_end_technologies,
			...competencies.databases,
			...competencies.tools_dev_ops,
			...competencies.testing,
			...competencies.emerging_technologies,
			...competencies.methodologies,
			...competencies.debugging
		]
	})

	const filterSkillsByProficiency = (minProficiency: string) => {
		const proficiencyLevels = ['Foundational', 'Familiar', 'Exploring', 'Experienced', 'Medium Proficiency', 'Proficient', 'Excellent', 'Strong Values', 'Core Competency']
		const minIndex = proficiencyLevels.indexOf(minProficiency)
		
		return allSkills.value.filter(skill => {
			const skillIndex = proficiencyLevels.indexOf(skill.proficiency)
			return skillIndex >= minIndex
		})
	}

	return {
		cvData,
		isLoading,
		error,
		personalInfo,
		executiveSummary,
		coreCompetencies,
		experience,
		projects,
		education,
		allSkills,
		filterSkillsByProficiency
	}
}
