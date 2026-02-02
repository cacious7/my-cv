export interface Skill {
	skill: string
	proficiency: string
}

export interface Link {
	linkedin: string
	github: string
	stack_overflow: string
	free_code_camp: string
	codepen: string
}

export interface ContactInformation {
	full_name: string
	professional_title: string
	phone_number: string
	email_addresses: string[]
	location: string
	links: Link
}

export interface ProfessionalExperience {
	company_name: string
	titles: string[]
	dates_tenure: string
	key_responsibilities_achievements: string[]
	technologies_utilized: string[]
}

export interface Project {
	name: string
	url?: string
	npm?: string
	description: string
	technologies: string[]
	tags: string[]
}

export interface KeyProjects {
	projects: Project[]
}

export interface FormalEducation {
	institution: string
	degree_course: string
	dates: string
}

export interface SelfDirectedLearning {
	platform_topic: string
	details: string
}

export interface EducationContinuousLearning {
	formal_education: FormalEducation[]
	self_directed_learning: SelfDirectedLearning[]
}

export interface CoreCompetencies {
	skills: Skill[]
}

export interface CVData {
	executive_summary: string
	contact_information_digital_footprint: ContactInformation
	core_competencies_technical_acumen: CoreCompetencies
	professional_experience: ProfessionalExperience[]
	key_projects_open_source_contributions: KeyProjects
	education_continuous_learning: EducationContinuousLearning
}
