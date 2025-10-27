import type { CVData, ProfessionalExperience, FormalEducation, Project } from '~/types/cv'

export async function generateCleanPDF(cvData: CVData) {
	// Dynamic import to avoid SSR issues
	const jsPDF = (await import('jspdf')).default
	const pdf = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4'
	})

	const pageWidth = pdf.internal.pageSize.getWidth()
	const pageHeight = pdf.internal.pageSize.getHeight()
	const margin = 15
	const contentWidth = pageWidth - 2 * margin
	let yPos = margin

	function checkPage() {
		if (yPos > pageHeight - margin) {
			pdf.addPage()
			yPos = margin
		}
	}

	function addTxt(text: string, size: number, bold = false, ind = 0) {
		checkPage()
		pdf.setFontSize(size)
		pdf.setFont('helvetica', bold ? 'bold' : 'normal')
		const lines = pdf.splitTextToSize(text, contentWidth - ind)
		pdf.text(lines, margin + ind, yPos)
		yPos += lines.length * size * 0.35 + 2
	}

	function addSeparator() {
		pdf.setDrawColor(200, 200, 200)
		pdf.line(margin, yPos, pageWidth - margin, yPos)
		yPos += 3
	}

	// Header
	const contact = cvData.contact_information_digital_footprint
	addTxt(contact.full_name, 16, true)
	yPos -= 2
	addTxt(contact.professional_title, 11, false)
	yPos -= 1
	const contactLine = `${contact.location} | ${contact.phone_number} | ${contact.email_addresses[0]}`
	addTxt(contactLine, 9, false)
	const linksLine = `LinkedIn: ${contact.links.linkedin} | GitHub: ${contact.links.github}`
	addTxt(linksLine, 8, false)
	addSeparator()
	yPos += 2

	// Executive Summary
	addTxt('EXECUTIVE SUMMARY', 12, true)
	addTxt(cvData.executive_summary, 9, false)
	yPos += 3

	// Core Skills
	addTxt('CORE COMPETENCIES', 12, true)
	const comp = cvData.core_competencies_technical_acumen
	
	const topSkills = comp.skills
		.filter(s => ['Proficient', 'Excellent', 'Experienced'].includes(s.proficiency))
		.map(s => s.skill)
		.slice(0, 20)
		.join(', ')
	
	if (topSkills) {
		addTxt(topSkills, 9, false, 5)
	}

	yPos += 3	// Professional Experience
	addTxt('PROFESSIONAL EXPERIENCE', 12, true)
	
	cvData.professional_experience.forEach((exp: ProfessionalExperience, idx: number) => {
		if (idx > 0) yPos += 2
		
		addTxt(exp.company_name, 11, true)
		yPos -= 2
		addTxt(exp.titles.join(' | '), 10, false)
		yPos -= 2
		addTxt(exp.dates_tenure, 9, false)
		yPos += 1
		
		const topAch = exp.key_responsibilities_achievements.slice(0, 5)
		topAch.forEach((ach: string) => {
			const shortAch = ach.length > 200 ? ach.substring(0, 197) + '...' : ach
			addTxt(`• ${shortAch}`, 9, false, 3)
		})
		
		if (exp.technologies_utilized.length > 0) {
			const techs = exp.technologies_utilized.slice(0, 10).join(', ')
			addTxt(`Technologies: ${techs}`, 8, false)
		}
	})

	// Key Projects
	if (yPos < pageHeight - 50) {
		yPos += 3
		addTxt('KEY PROJECTS', 12, true)
		const projects = cvData.key_projects_open_source_contributions.connexcs_internal_projects
		projects.slice(0, 3).forEach((proj: Project) => {
			if (yPos < pageHeight - margin - 15) {
				addTxt(proj.name, 10, true)
				yPos -= 2
				const shortDesc = proj.description.length > 120 ? proj.description.substring(0, 117) + '...' : proj.description
				addTxt(shortDesc, 9, false)
			}
		})
	}

	// Education
	if (yPos < pageHeight - 30) {
		yPos += 3
		addTxt('EDUCATION', 12, true)
		cvData.education_continuous_learning.formal_education.forEach((edu: FormalEducation) => {
			if (yPos < pageHeight - margin - 10) {
				const eduLine = `${edu.institution} - ${edu.degree_course || 'Computer Science'}`
				addTxt(eduLine, 9, false)
			}
		})
	}

	return pdf
}

export async function downloadPDF(cvData: CVData) {
	const pdf = await generateCleanPDF(cvData)
	const filename = `${cvData.contact_information_digital_footprint.full_name.replace(/\s+/g, '_')}_CV.pdf`
	pdf.save(filename)
}
