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
		if (yPos > pageHeight - margin - 10) {
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
		yPos += lines.length * size * 0.35 + 1.5
	}

	function addLink(text: string, url: string, size: number, xPos: number) {
		pdf.setFontSize(size)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
		const textWidth = pdf.getTextWidth(text)
		pdf.textWithLink(text, xPos, yPos, { url: url })
		// Underline the link
		pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2])
		pdf.line(xPos, yPos + 0.5, xPos + textWidth, yPos + 0.5)
		return textWidth
	}

	function addSectionHeader(title: string) {
		checkPage()
		pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2])
		pdf.rect(margin, yPos - 2, contentWidth, 7, 'F')
		pdf.setFontSize(11)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(255, 255, 255)
		pdf.text(title, margin + 2, yPos + 2)
		yPos += 9
	}

	// === HEADER SECTION ===
	const contact = cvData.contact_information_digital_footprint
	
	// Name - Large, bold, and prominent
	pdf.setFontSize(22)
	pdf.setFont('helvetica', 'bold')
	pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
	pdf.text(contact.full_name.toUpperCase(), margin, yPos)
	yPos += 7

	// Title - slightly larger and bolder
	pdf.setFontSize(13)
	pdf.setFont('helvetica', 'bold')
	pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
	pdf.text(contact.professional_title, margin, yPos)
	yPos += 7

	// Contact Information - better spacing and more prominent
	pdf.setFontSize(9.5)
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	let xOffset = margin
	
	// Location
	pdf.setFont('helvetica', 'normal')
	pdf.text(contact.location, xOffset, yPos)
	xOffset += pdf.getTextWidth(contact.location) + 5
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	// Phone (clickable with visual emphasis)
	pdf.setFont('helvetica', 'bold')
	const phoneWidth = addLink(contact.phone_number, `tel:${contact.phone_number}`, 9.5, xOffset)
	xOffset += phoneWidth + 5
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	// Email (clickable with visual emphasis)
	pdf.setFont('helvetica', 'bold')
	addLink(contact.email_addresses[0], `mailto:${contact.email_addresses[0]}`, 9.5, xOffset)
	yPos += 5

	// Social Links - all clickable with better spacing
	xOffset = margin
	pdf.setFont('helvetica', 'bold')
	addLink('LinkedIn', contact.links.linkedin, 9.5, xOffset)
	xOffset += pdf.getTextWidth('LinkedIn') + 8
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('•', xOffset, yPos)
	xOffset += 6
	
	pdf.setFont('helvetica', 'bold')
	addLink('GitHub', contact.links.github, 9.5, xOffset)
	xOffset += pdf.getTextWidth('GitHub') + 8
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('•', xOffset, yPos)
	xOffset += 6
	
	pdf.setFont('helvetica', 'bold')
	addLink('Stack Overflow', contact.links.stack_overflow, 9.5, xOffset)
	xOffset += pdf.getTextWidth('Stack Overflow') + 8
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('•', xOffset, yPos)
	xOffset += 6
	
	pdf.setFont('helvetica', 'bold')
	addLink('FreeCodeCamp', contact.links.free_code_camp, 9.5, xOffset)
	yPos += 9

	// === PROFESSIONAL SUMMARY ===
	addSectionHeader('PROFESSIONAL SUMMARY')
	addTxt(cvData.executive_summary, 9.5, false, 0)
	yPos += 4

	// === CORE COMPETENCIES - Make this stand out! ===
	addSectionHeader('CORE COMPETENCIES & TECHNICAL SKILLS')
	const comp = cvData.core_competencies_technical_acumen
	
	// Group skills by proficiency for better readability
	const excellentSkills = comp.skills.filter((s: any) => s.proficiency === 'Excellent').map((s: any) => s.skill)
	const proficientSkills = comp.skills.filter((s: any) => s.proficiency === 'Proficient').map((s: any) => s.skill)
	const experiencedSkills = comp.skills.filter((s: any) => s.proficiency === 'Experienced').map((s: any) => s.skill)
	
	// Expert Level - Most prominent
	if (excellentSkills.length > 0) {
		pdf.setFontSize(9.5)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
		pdf.text('⭐ Expert Level:', margin, yPos)
		yPos += 4
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		addTxt(excellentSkills.join(' • '), 9.5, true, 0)
		yPos += 1
	}
	
	// Proficient - Second tier
	if (proficientSkills.length > 0) {
		pdf.setFontSize(9.5)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
		pdf.text('✓ Proficient:', margin, yPos)
		yPos += 4
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		addTxt(proficientSkills.join(' • '), 9.5, false, 0)
		yPos += 1
	}
	
	// Experienced - Third tier
	if (experiencedSkills.length > 0) {
		pdf.setFontSize(9.5)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
		pdf.text('◆ Experienced:', margin, yPos)
		yPos += 4
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		addTxt(experiencedSkills.join(' • '), 9.5, false, 0)
	}
	yPos += 4

	// === PROFESSIONAL EXPERIENCE ===
	addSectionHeader('PROFESSIONAL EXPERIENCE')
	
	cvData.professional_experience.forEach((exp: ProfessionalExperience, idx: number) => {
		checkPage()
		
		// Company name - larger and more prominent
		pdf.setFontSize(11)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
		pdf.text(exp.company_name, margin, yPos)
		yPos += 5
		
		// Position title(s) - with accent color for emphasis
		pdf.setFontSize(10.5)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
		pdf.text(exp.titles.join(' / '), margin, yPos)
		
		// Dates - right aligned and more prominent
		pdf.setFont('helvetica', 'bold')
		pdf.setFontSize(9.5)
		pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
		const dateWidth = pdf.getTextWidth(exp.dates_tenure)
		pdf.text(exp.dates_tenure, pageWidth - margin - dateWidth, yPos)
		yPos += 5.5
		
		// Key achievements - only show top 4, make them powerful
		const topAch = exp.key_responsibilities_achievements.slice(0, 4)
		topAch.forEach((ach: string) => {
			checkPage()
			pdf.setFontSize(9.5)
			pdf.setFont('helvetica', 'normal')
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
			const bullet = '▸'
			pdf.setFont('helvetica', 'bold')
			pdf.text(bullet, margin + 2, yPos)
			pdf.setFont('helvetica', 'normal')
			const lines = pdf.splitTextToSize(ach, contentWidth - 8)
			pdf.text(lines, margin + 6, yPos)
			yPos += lines.length * 9.5 * 0.35 + 2.5
		})
		
		yPos += 2.5
	})

	// === KEY PROJECTS ===
	if (yPos < pageHeight - 60) {
		addSectionHeader('KEY PROJECTS & OPEN SOURCE CONTRIBUTIONS')
		
		// All projects in a flat structure with tags for differentiation
		const projects = cvData.key_projects_open_source_contributions.projects || []
		projects.forEach((proj: any) => {
			checkPage()
			pdf.setFontSize(10.5)
			pdf.setFont('helvetica', 'bold')
			pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
			
			// Project name with clickable link
			if (proj.url) {
				addLink(proj.name, proj.url, 10.5, margin)
			} else {
				pdf.text(proj.name, margin, yPos)
			}
			yPos += 4
			
			// NPM link if available (in addition to GitHub)
			if (proj.npm) {
				pdf.setFontSize(8.5)
				pdf.setFont('helvetica', 'italic')
				pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2])
				addLink('📦 NPM Package', proj.npm, 8.5, margin + 2)
				yPos += 3.5
			}
			
			// Tags - make them prominent
			if (proj.tags && proj.tags.length > 0) {
				pdf.setFontSize(8.5)
				pdf.setFont('helvetica', 'bold')
				pdf.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
				const tags = proj.tags.join(' • ')
				pdf.text(`[${tags}]`, margin + 2, yPos)
				yPos += 4
			}
			
			// Description
			pdf.setFontSize(9)
			pdf.setFont('helvetica', 'normal')
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
			const lines = pdf.splitTextToSize(proj.description, contentWidth - 4)
			pdf.text(lines, margin + 2, yPos)
			yPos += lines.length * 9 * 0.35 + 3
			
			// Technologies
			if (proj.technologies && proj.technologies.length > 0) {
				pdf.setFontSize(8.5)
				pdf.setFont('helvetica', 'italic')
				pdf.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2])
				pdf.text(`Tech: ${proj.technologies.join(', ')}`, margin + 2, yPos)
				yPos += 5
			}
		})
	}
			}
			yPos += 4
			
			// Role or description
			pdf.setFontSize(9)
			pdf.setFont('helvetica', 'normal')
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
			const content = proj.role_impact || proj.description
			const lines = pdf.splitTextToSize(content, contentWidth - 4)
			pdf.text(lines, margin + 2, yPos)
			yPos += lines.length * 9 * 0.35 + 3
		})
	}

	// === EDUCATION ===
	if (yPos < pageHeight - 40) {
		addSectionHeader('EDUCATION')
		cvData.education_continuous_learning.formal_education.forEach((edu: FormalEducation) => {
			checkPage()
			pdf.setFontSize(10)
			pdf.setFont('helvetica', 'bold')
			pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2])
			pdf.text(edu.institution, margin, yPos)
			yPos += 4
			
			pdf.setFontSize(9)
			pdf.setFont('helvetica', 'normal')
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
			pdf.text(edu.degree_course, margin, yPos)
			
			// Dates - right aligned
			pdf.setFont('helvetica', 'italic')
			pdf.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2])
			const dateWidth = pdf.getTextWidth(edu.dates)
			pdf.text(edu.dates, pageWidth - margin - dateWidth, yPos)
			yPos += 5
		})
	}

	return pdf
}

export async function downloadPDF(cvData: CVData) {
	const pdf = await generateCleanPDF(cvData)
	const filename = `${cvData.contact_information_digital_footprint.full_name.replace(/\s+/g, '_')}_CV.pdf`
	pdf.save(filename)
}
