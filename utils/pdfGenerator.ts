import jsPDF from 'jspdf'
import type { CVData } from '~/types/cv'

export const generateCleanPDF = (cvData: CVData) => {
	const pdf = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4'
	})

	const pageWidth = pdf.internal.pageSize.getWidth()
	const pageHeight = pdf.internal.pageSize.getHeight()
	const margin = 15
	const contentWidth = pageWidth - 2 * margin
	let yPosition = margin

	const addText = (
		text: string,
		fontSize: number,
		isBold = false,
		indent = 0
	): void => {
		if (yPosition > pageHeight - margin) {
			pdf.addPage()
			yPosition = margin
		}

		pdf.setFontSize(fontSize)
		pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
		
		const lines = pdf.splitTextToSize(text, contentWidth - indent)
		pdf.text(lines, margin + indent, yPosition)
		yPosition += lines.length * fontSize * 0.35 + 2
	}

	const addLine = (): void => {
		pdf.setDrawColor(200, 200, 200)
		pdf.line(margin, yPosition, pageWidth - margin, yPosition)
		yPosition += 3
	}

	// Header
	const contact = cvData.contact_information_digital_footprint
	addText(contact.full_name, 16, true)
	yPosition -= 2
	addText(contact.professional_title, 11, false)
	yPosition -= 1
	addText(
		`${contact.location} | ${contact.phone_number} | ${contact.email_addresses[0]}`,
		9,
		false
	)
	addText(
		`LinkedIn: ${contact.links.linkedin.replace('https://', '')} | GitHub: ${contact.links.github.replace('https://', '')}`,
		9,
		false
	)
	yPosition += 2
	addLine()

	// Executive Summary
	addText('EXECUTIVE SUMMARY', 12, true)
	addText(cvData.executive_summary, 9, false)
	yPosition += 2
	addLine()

	// Core Competencies - Compact
	addText('CORE COMPETENCIES', 12, true)
	const competencies = cvData.core_competencies_technical_acumen
	
	const formatSkills = (skills: { skill: string; proficiency: string }[]): string => {
		return skills
			.filter(s => ['Proficient', 'Excellent', 'Experienced', 'Core Competency', 'Strong Values'].includes(s.proficiency))
			.map(s => s.skill)
			.join(', ')
	}

	const languages = formatSkills(competencies.programming_languages)
	if (languages) addText(`Languages: ${languages}`, 9, false)

	const frameworks = formatSkills(competencies.front_end_frameworks)
	if (frameworks) addText(`Frameworks: ${frameworks}`, 9, false)

	const backend = formatSkills(competencies.back_end_technologies)
	if (backend) addText(`Backend: ${backend}`, 9, false)

	const tools = formatSkills(competencies.tools_dev_ops)
	if (tools) addText(`Tools & DevOps: ${tools}`, 9, false)

	const testing = formatSkills(competencies.testing)
	if (testing) addText(`Testing: ${testing}`, 9, false)

	const emerging = formatSkills(competencies.emerging_technologies)
	if (emerging) addText(`Emerging Tech: ${emerging}`, 9, false)

	yPosition += 2
	addLine()

	// Professional Experience
	addText('PROFESSIONAL EXPERIENCE', 12, true)

	cvData.professional_experience.forEach((exp, index) => {
		if (index > 0) yPosition += 2

		addText(`${exp.company_name}`, 11, true)
		yPosition -= 2
		addText(`${exp.titles.join(' | ')}`, 10, false)
		yPosition -= 2
		addText(exp.dates_tenure, 9, false)
		yPosition += 1

		// Add only top 5-6 achievements for conciseness
		const topAchievements = exp.key_responsibilities_achievements.slice(0, 6)
		topAchievements.forEach(achievement => {
			if (yPosition > pageHeight - margin - 20) {
				// Check if we need page break
				pdf.addPage()
				yPosition = margin
			}
			const shortAchievement = achievement.length > 250 
				? achievement.substring(0, 247) + '...' 
				: achievement
			addText(`• ${shortAchievement}`, 9, false, 0)
		})

		if (exp.technologies_utilized.length > 0) {
			const techs = exp.technologies_utilized.slice(0, 10).join(', ')
			addText(`Technologies: ${techs}`, 8, false)
		}
	})

	// Key Projects - Only if space on page 2
	if (yPosition < pageHeight - 50) {
		yPosition += 2
		addLine()
		addText('KEY PROJECTS', 12, true)

		const topProjects = cvData.key_projects_open_source_contributions.connexcs_internal_projects.slice(0, 3)
		topProjects.forEach(project => {
			if (yPosition < pageHeight - margin - 10) {
				addText(project.name, 10, true)
				yPosition -= 2
				const shortDesc = project.description.length > 150 
					? project.description.substring(0, 147) + '...'
					: project.description
				addText(shortDesc, 9, false)
			}
		})
	}

	// Education - Compact
	if (yPosition < pageHeight - 30) {
		yPosition += 2
		addLine()
		addText('EDUCATION', 12, true)
		cvData.education_continuous_learning.formal_education.forEach(edu => {
			if (yPosition < pageHeight - margin - 10) {
				addText(`${edu.institution} - ${edu.degree_course || 'Computer Science'}`, 9, false)
			}
		})
	}

	// Save
	pdf.save(`${contact.full_name.replace(/\s+/g, '_')}_CV.pdf`)
}
