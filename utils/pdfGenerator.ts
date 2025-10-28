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
	const margin = 20
	const contentWidth = pageWidth - 2 * margin
	let yPos = margin

	// Colors using RGB values from our palette
	const colors = {
		primary: [2, 94, 115],      // #025E73 - Dark Teal
		accent: [242, 102, 139],    // #F2668B - Pink
		dark: [1, 31, 38],          // #011F26 - Deep Dark
		text: [51, 51, 51],         // #333333 - Text
		lightText: [102, 102, 102]  // #666666 - Light Text
	}

	function checkPage() {
		if (yPos > pageHeight - margin - 15) {
			pdf.addPage()
			yPos = margin
		}
	}

	function addTxt(text: string, size: number, bold = false, indent = 0, color: number[] = colors.text) {
		checkPage()
		pdf.setFontSize(size)
		pdf.setFont('helvetica', bold ? 'bold' : 'normal')
		pdf.setTextColor(color[0], color[1], color[2])
		const lines = pdf.splitTextToSize(text, contentWidth - indent)
		pdf.text(lines, margin + indent, yPos)
		yPos += lines.length * size * 0.35 + 1
	}

	function addLink(text: string, url: string, size: number, xPos: number) {
		pdf.setFontSize(size)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		const textWidth = pdf.getTextWidth(text)
		pdf.textWithLink(text, xPos, yPos, { url: url })
		// Simple underline
		pdf.setDrawColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.setLineWidth(0.2)
		pdf.line(xPos, yPos + 0.5, xPos + textWidth, yPos + 0.5)
		return textWidth
	}

	function addSectionHeader(title: string) {
		checkPage()
		pdf.setFontSize(12)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
		pdf.text(title, margin, yPos)
		const titleWidth = pdf.getTextWidth(title)
		yPos += 1
		// Simple underline
		pdf.setDrawColor(colors.dark[0], colors.dark[1], colors.dark[2])
		pdf.setLineWidth(0.3)
		pdf.line(margin, yPos, margin + titleWidth, yPos)
		yPos += 5
	}

	// === HEADER SECTION ===
	const contact = cvData.contact_information_digital_footprint
	
	// Name - Large, bold, and prominent
	pdf.setFontSize(20)
	pdf.setFont('helvetica', 'bold')
	pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
	pdf.text(contact.full_name.toUpperCase(), margin, yPos)
	yPos += 6

	// Title - Professional subtitle
	pdf.setFontSize(11)
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text(contact.professional_title, margin, yPos)
	yPos += 6

	// Contact Information - clean and simple
	pdf.setFontSize(9)
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	let xOffset = margin
	
	// Location
	pdf.setFont('helvetica', 'normal')
	pdf.text(contact.location, xOffset, yPos)
	xOffset += pdf.getTextWidth(contact.location) + 3
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	// Phone (clickable)
	const phoneWidth = addLink(contact.phone_number, `tel:${contact.phone_number}`, 9, xOffset)
	xOffset += phoneWidth + 3
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	// Email (clickable)
	addLink(contact.email_addresses[0], `mailto:${contact.email_addresses[0]}`, 9, xOffset)
	yPos += 4

	// Social Links - clean single line
	xOffset = margin
	addLink('LinkedIn', contact.links.linkedin, 9, xOffset)
	xOffset += pdf.getTextWidth('LinkedIn') + 3
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	addLink('GitHub', contact.links.github, 9, xOffset)
	xOffset += pdf.getTextWidth('GitHub') + 3
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	addLink('Stack Overflow', contact.links.stack_overflow, 9, xOffset)
	xOffset += pdf.getTextWidth('Stack Overflow') + 3
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	addLink('FreeCodeCamp', contact.links.free_code_camp, 9, xOffset)
	yPos += 7

	// === PROFESSIONAL SUMMARY ===
	addSectionHeader('PROFESSIONAL SUMMARY')
	addTxt(cvData.executive_summary, 9.5, false, 0)
	yPos += 5

	// === CORE COMPETENCIES - Simple and clean ===
	addSectionHeader('CORE COMPETENCIES & TECHNICAL SKILLS')
	const comp = cvData.core_competencies_technical_acumen
	
	// Group skills by proficiency for better readability
	const excellentSkills = comp.skills.filter((s: any) => s.proficiency === 'Excellent').map((s: any) => s.skill)
	const proficientSkills = comp.skills.filter((s: any) => s.proficiency === 'Proficient').map((s: any) => s.skill)
	const experiencedSkills = comp.skills.filter((s: any) => s.proficiency === 'Experienced').map((s: any) => s.skill)
	
	// Expert Level
	if (excellentSkills.length > 0) {
		pdf.setFontSize(9.5)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.text('Expert Level:', margin, yPos)
		yPos += 3.5
		pdf.setFont('helvetica', 'normal')
		addTxt(excellentSkills.join(' • '), 9.5, false, 0)
		yPos += 0.5
	}
	
	// Proficient
	if (proficientSkills.length > 0) {
		pdf.setFontSize(9.5)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.text('Proficient:', margin, yPos)
		yPos += 3.5
		pdf.setFont('helvetica', 'normal')
		addTxt(proficientSkills.join(' • '), 9.5, false, 0)
		yPos += 0.5
	}
	
	// Experienced
	if (experiencedSkills.length > 0) {
		pdf.setFontSize(9.5)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.text('Experienced:', margin, yPos)
		yPos += 3.5
		pdf.setFont('helvetica', 'normal')
		addTxt(experiencedSkills.join(' • '), 9.5, false, 0)
	}
	yPos += 3

	// === PROFESSIONAL EXPERIENCE ===
	addSectionHeader('PROFESSIONAL EXPERIENCE')
	
	cvData.professional_experience.forEach((exp: ProfessionalExperience, idx: number) => {
		checkPage()
		
		// Company name
		pdf.setFontSize(10.5)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
		pdf.text(exp.company_name, margin, yPos)
		yPos += 4.5
		
		// Position title(s) and dates on same line
		pdf.setFontSize(10)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.text(exp.titles.join(' / '), margin, yPos)
		
		// Dates - right aligned
		pdf.setFont('helvetica', 'normal')
		pdf.setFontSize(10)
		const dateWidth = pdf.getTextWidth(exp.dates_tenure)
		pdf.text(exp.dates_tenure, pageWidth - margin - dateWidth, yPos)
		yPos += 4
		
		// Key achievements - clean bullets
		const topAch = exp.key_responsibilities_achievements.slice(0, 4)
		topAch.forEach((ach: string) => {
			checkPage()
			pdf.setFontSize(9.5)
			pdf.setFont('helvetica', 'normal')
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
			pdf.text('•', margin + 1, yPos)
			const lines = pdf.splitTextToSize(ach, contentWidth - 6)
			pdf.text(lines, margin + 5, yPos)
			yPos += lines.length * 9.5 * 0.35 + 1.5
		})
		
		yPos += 2
	})

	// === KEY PROJECTS ===
	addSectionHeader('KEY PROJECTS & OPEN SOURCE CONTRIBUTIONS')
	
	// All projects in one flat list
	const projects = cvData.key_projects_open_source_contributions.projects || []
	projects.forEach((proj: any) => {
		checkPage()
		pdf.setFontSize(10)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
		
		// Project name with clickable link
		if (proj.url) {
			pdf.text(proj.name, margin, yPos)
			const nameWidth = pdf.getTextWidth(proj.name)
			pdf.line(margin, yPos + 0.5, margin + nameWidth, yPos + 0.5)
			pdf.link(margin, yPos - 3, nameWidth, 4, { url: proj.url })
		} else {
			pdf.text(proj.name, margin, yPos)
		}
		
		// Add NPM link on same line if available
		if (proj.npm) {
			const nameWidth = pdf.getTextWidth(proj.name)
			pdf.setFontSize(9)
			pdf.setFont('helvetica', 'normal')
			const npmText = 'npm'
			const xPos = margin + nameWidth + 5
			pdf.text(npmText, xPos, yPos)
			const npmWidth = pdf.getTextWidth(npmText)
			pdf.setLineWidth(0.2)
			pdf.line(xPos, yPos + 0.5, xPos + npmWidth, yPos + 0.5)
			pdf.link(xPos, yPos - 3, npmWidth, 4, { url: proj.npm })
		}
		yPos += 4
		
		// Description
		pdf.setFontSize(9.5)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.text('•', margin + 1, yPos)
		const lines = pdf.splitTextToSize(proj.description, contentWidth - 6)
		pdf.text(lines, margin + 5, yPos)
		yPos += lines.length * 9.5 * 0.35 + 3
		
		yPos += 1 // Space between projects
	})

	// === EDUCATION ===
	addSectionHeader('EDUCATION')
	cvData.education_continuous_learning.formal_education.forEach((edu: FormalEducation) => {
		checkPage()
		pdf.setFontSize(10)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
		pdf.text(edu.institution, margin, yPos)
		
		// Dates - right aligned
		pdf.setFont('helvetica', 'normal')
		const dateWidth = pdf.getTextWidth(edu.dates)
		pdf.text(edu.dates, pageWidth - margin - dateWidth, yPos)
		yPos += 4
		
		pdf.setFontSize(9.5)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.text(edu.degree_course, margin, yPos)
		yPos += 5
	})

	return pdf
}

export async function downloadPDF(cvData: CVData) {
	const pdf = await generateCleanPDF(cvData)
	const filename = `${cvData.contact_information_digital_footprint.full_name.replace(/\s+/g, '_')}_CV.pdf`
	pdf.save(filename)
}
