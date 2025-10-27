import type { CVData } from '~/types/cv'

export const cvDataFixture: CVData = {
	executive_summary: 'Test executive summary',
	contact_information_digital_footprint: {
		full_name: 'Test User',
		professional_title: 'Test Developer',
		phone_number: '+1234567890',
		email_addresses: ['test@example.com'],
		location: 'Test City',
		links: {
			linkedin: 'https://linkedin.com/in/test',
			github: 'https://github.com/test',
			stack_overflow: 'https://stackoverflow.com/users/test',
			free_code_camp: 'https://freecodecamp.org/test',
			codepen: 'https://codepen.io/test'
		}
	},
	core_competencies_technical_acumen: {
		programming_languages: [
			{ skill: 'JavaScript', proficiency: 'Proficient' },
			{ skill: 'TypeScript', proficiency: 'Proficient' }
		],
		front_end_frameworks: [{ skill: 'Vue.js', proficiency: 'Proficient' }],
		back_end_technologies: [{ skill: 'Node.js', proficiency: 'Proficient' }],
		databases: [{ skill: 'SQL', proficiency: 'Proficient' }],
		tools_dev_ops: [{ skill: 'Docker', proficiency: 'Experienced' }],
		testing: [{ skill: 'Vitest', proficiency: 'Medium Proficiency' }],
		emerging_technologies: [{ skill: 'AI', proficiency: 'Exploring' }],
		methodologies: [{ skill: 'TDD', proficiency: 'Strong Values' }],
		debugging: [{ skill: 'Debugging', proficiency: 'Excellent' }]
	},
	professional_experience: [
		{
			company_name: 'Test Company',
			titles: ['Senior Developer'],
			dates_tenure: '2020 - Present',
			key_responsibilities_achievements: ['Built awesome software', 'Led great team'],
			technologies_utilized: ['Vue.js', 'TypeScript', 'Node.js']
		}
	],
	key_projects_open_source_contributions: {
		connexcs_internal_projects: [
			{
				name: 'Test Project',
				description: 'A test project description',
				technologies: ['Vue.js', 'TypeScript']
			}
		],
		open_source_contributions: [
			{
				project_name: 'Test OSS',
				role_impact: 'Contributed to testing',
				technologies: ['JavaScript']
			}
		]
	},
	education_continuous_learning: {
		formal_education: [
			{
				institution: 'Test University',
				degree_course: 'Computer Science',
				dates: '2015-2019'
			}
		],
		self_directed_learning: [
			{
				platform_topic: 'FreeCodeCamp',
				details: 'Completed full stack certification'
			}
		]
	}
}
