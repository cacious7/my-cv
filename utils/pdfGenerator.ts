import type { CVData, ProfessionalExperience, FormalEducation, Project } from '~/types/cv'

export async function generateCleanPDF(cvData: CVData) {
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

	const colors = {
		text: [0, 0, 0],
		link: [0, 0, 0]
	}

	function checkPage() {
		if (yPos > pageHeight - margin - 15) {
			pdf.addPage()
			yPos = margin
		}
	}

	function addTxt(text: string, size: number, bold = false, indent = 0, color: number[] = colors.text, lineSpacing = 1.4) {
		checkPage()
		pdf.setFontSize(size)
		pdf.setFont('helvetica', bold ? 'bold' : 'normal')
		pdf.setTextColor(color[0], color[1], color[2])
		const lines = pdf.splitTextToSize(text, contentWidth - indent)
		pdf.text(lines, margin + indent, yPos)
		yPos += lines.length * size * 0.35 * lineSpacing + 1
	}

	function addBulletWithBoldMetrics(text: string, size: number, indent: number) {
		checkPage()
		pdf.setFontSize(size)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		
		pdf.text('•', margin + 1, yPos)
		
		const lines = pdf.splitTextToSize(text, contentWidth - indent - 4)
		
		let currentY = yPos
		lines.forEach((line: string) => {
			const boldPatterns = [
				/Led developer team of \d+\+ engineers for \d+ years/gi,
				/Recruited and onboarded \d+ high-performing developers/gi,
				/migration of \d+ major production applications/gi,
				/from Vue 2\.5 to Vue 3/gi,
				/reducing technical debt and improving developer velocity by \d+%/gi,
				/TypeScript across \d+\+ critical projects/gi,
				/reducing production runtime errors by \d+%/gi,
				/improving page load speed by \d+% and Core Web Vitals scores/gi,
				/Built \d+ production-grade internal tools/gi,
				/reducing call setup time by \d+%/gi,
				/Service Workers across \d+ web applications/gi,
				/100K\+ monthly active users/gi,
				/reducing perceived load times by \d+%/gi,
				/achieving \d+%\+ code coverage and reducing production bugs by \d+%/gi,
				/Conducted \d+\+ code reviews/gi,
				/reducing average troubleshooting time from \d+ hours to \d+ minutes/gi,
				/supporting \d+\+ local vendors and \d+\+ product listings/gi,
				/Delivered \d+\+ web development projects/gi,
				/agency partnership for \d+ months/gi
			]
			
			const matches: Array<{start: number, end: number, text: string}> = []
			boldPatterns.forEach(pattern => {
				let match
				const regex = new RegExp(pattern.source, pattern.flags)
				while ((match = regex.exec(line)) !== null) {
					matches.push({
						start: match.index,
						end: match.index + match[0].length,
						text: match[0]
					})
				}
			})
			
			matches.sort((a, b) => a.start - b.start)
			
			const cleanMatches: typeof matches = []
			matches.forEach(match => {
				const overlaps = cleanMatches.some(cm => 
					(match.start >= cm.start && match.start < cm.end) ||
					(match.end > cm.start && match.end <= cm.end) ||
					(match.start <= cm.start && match.end >= cm.end)
				)
				if (!overlaps) {
					cleanMatches.push(match)
				} else {
					const overlappingIndex = cleanMatches.findIndex(cm =>
						(match.start >= cm.start && match.start < cm.end) ||
						(match.end > cm.start && match.end <= cm.end) ||
						(match.start <= cm.start && match.end >= cm.end)
					)
					if (overlappingIndex !== -1 && match.text.length > cleanMatches[overlappingIndex].text.length) {
						cleanMatches[overlappingIndex] = match
					}
				}
			})
			
			cleanMatches.sort((a, b) => a.start - b.start)
			
			let xPos = margin + indent
			let lastEnd = 0
			
			cleanMatches.forEach(match => {
				if (match.start > lastEnd) {
					const beforeText = line.substring(lastEnd, match.start)
					pdf.setFont('helvetica', 'normal')
					pdf.text(beforeText, xPos, currentY)
					xPos += pdf.getTextWidth(beforeText)
				}
				
				pdf.setFont('helvetica', 'bold')
				pdf.text(match.text, xPos, currentY)
				xPos += pdf.getTextWidth(match.text)
				
				lastEnd = match.end
			})
			
			if (lastEnd < line.length) {
				const afterText = line.substring(lastEnd)
				pdf.setFont('helvetica', 'normal')
				pdf.text(afterText, xPos, currentY)
			}
			
			currentY += size * 0.35 * 1.5
		})
		
		yPos = currentY + 1
	}

	function addLink(text: string, url: string, size: number, xPos: number) {
		pdf.setFontSize(size)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		const textWidth = pdf.getTextWidth(text)
		pdf.textWithLink(text, xPos, yPos, { url: url })
		pdf.setDrawColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.setLineWidth(0.2)
		pdf.line(xPos, yPos + 0.5, xPos + textWidth, yPos + 0.5)
		return textWidth
	}

	function addSectionHeader(title: string) {
		checkPage()
		pdf.setFontSize(12)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.text(title, margin, yPos)
		const titleWidth = pdf.getTextWidth(title)
		yPos += 1
		pdf.setDrawColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.setLineWidth(0.5)
		pdf.line(margin, yPos, margin + titleWidth, yPos)
		yPos += 4.5  // Reduced spacing after section header
	}

	const contact = cvData.contact_information_digital_footprint
	
	pdf.setFontSize(20)
	pdf.setFont('helvetica', 'bold')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text(contact.full_name.toUpperCase(), margin, yPos)
	yPos += 6

	pdf.setFontSize(12)
	pdf.setFont('helvetica', 'bold')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('Developer Department Head', margin, yPos)
	yPos += 4

	pdf.setFontSize(11)
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('Senior Software Developer', margin, yPos)
	yPos += 7

	pdf.setFontSize(9)
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	let xOffset = margin
	
	pdf.setFont('helvetica', 'normal')
	pdf.text(contact.location, xOffset, yPos)
	xOffset += pdf.getTextWidth(contact.location) + 3
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	const phoneWidth = addLink(contact.phone_number, `tel:${contact.phone_number}`, 10, xOffset)
	xOffset += phoneWidth + 3
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	addLink(contact.email_addresses[0], `mailto:${contact.email_addresses[0]}`, 10, xOffset)
	yPos += 5

	xOffset = margin
	addLink('LinkedIn', contact.links.linkedin, 10, xOffset)
	xOffset += pdf.getTextWidth('LinkedIn') + 3
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	addLink('GitHub', contact.links.github, 10, xOffset)
	xOffset += pdf.getTextWidth('GitHub') + 3
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	addLink('Stack Overflow', contact.links.stack_overflow, 10, xOffset)
	xOffset += pdf.getTextWidth('Stack Overflow') + 3
	pdf.setFont('helvetica', 'normal')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	
	addLink('FreeCodeCamp', contact.links.free_code_camp, 10, xOffset)
	yPos += 7

	addSectionHeader('Summary')
	addTxt(cvData.executive_summary, 10, false, 0, colors.text, 1.6)
	yPos += 4  // Reduced space before next section

	addSectionHeader('Skills')
	const comp = cvData.core_competencies_technical_acumen
	
	const softSkills = comp.skills.filter((s: any) => s.proficiency === 'Soft Skill').map((s: any) => s.skill)
	const proficientSkills = comp.skills.filter((s: any) => s.proficiency === 'Proficient').map((s: any) => s.skill)
	const experiencedSkills = comp.skills.filter((s: any) => s.proficiency === 'Experienced').map((s: any) => s.skill)
	
	pdf.setFontSize(10)
	pdf.setFont('helvetica', 'bold')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('Soft Skills:', margin, yPos)
	yPos += 4.5  // Spacing after label
	pdf.setFontSize(10)
	pdf.setFont('helvetica', 'normal')
	const softSkillsList = ['Excellent Debugging', ...softSkills]
	addTxt(softSkillsList.join(', '), 10, false, 0, colors.text, 1.5)
	yPos += 5  // More spacing between skill groups
	
	pdf.setFontSize(10)
	pdf.setFont('helvetica', 'bold')
	pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
	pdf.text('Technical Skills:', margin, yPos)
	yPos += 4.5  // Same spacing as soft skills
	pdf.setFontSize(10)
	pdf.setFont('helvetica', 'normal')
	const allTechSkills = [...proficientSkills, ...experiencedSkills]
	addTxt(allTechSkills.join(', '), 10, false, 0, colors.text, 1.5)
	yPos += 4  // Reduced spacing before next section

	addSectionHeader('Experience')
	
	cvData.professional_experience.forEach((exp: ProfessionalExperience) => {
		checkPage()
		
		pdf.setFontSize(11)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		const titleText = exp.titles.join(' / ')
		pdf.text(titleText, margin, yPos)
		pdf.setFont('helvetica', 'normal')
		pdf.setFontSize(10)
		const dateWidth = pdf.getTextWidth(exp.dates_tenure)
		pdf.text(exp.dates_tenure, pageWidth - margin - dateWidth, yPos)
		yPos += 5  // More space after job title line
		
		pdf.setFontSize(10)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		const companyText = `${exp.company_name} - Remote`
		pdf.text(companyText, margin, yPos)
		yPos += 5.5  // More space before bullet points
		
		const topAch = exp.key_responsibilities_achievements.slice(0, 5)
		topAch.forEach((ach: string) => {
			addBulletWithBoldMetrics(ach, 10, 5)
		})
		
		yPos += 4  // Reduced spacing between job entries
	})

	addSectionHeader('Projects')
	
	const projects = cvData.key_projects_open_source_contributions.projects || []
	projects.forEach((proj: any) => {
		checkPage()
		pdf.setFontSize(11)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		
		if (proj.url) {
			pdf.text(proj.name, margin, yPos)
			const nameWidth = pdf.getTextWidth(proj.name)
			pdf.line(margin, yPos + 0.5, margin + nameWidth, yPos + 0.5)
			pdf.link(margin, yPos - 3, nameWidth, 4, { url: proj.url })
		} else {
			pdf.text(proj.name, margin, yPos)
		}
		
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
		yPos += 4.5
		
		pdf.setFontSize(10)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.text('•', margin + 1, yPos)
		const lines = pdf.splitTextToSize(proj.description, contentWidth - 6)
		pdf.text(lines, margin + 5, yPos)
		yPos += lines.length * 10 * 0.35 * 1.5 + 2
		
		yPos += 2
	})

	addSectionHeader('Education')
	cvData.education_continuous_learning.formal_education.forEach((edu: FormalEducation) => {
		checkPage()
		pdf.setFontSize(11)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2])
		pdf.text(edu.institution, margin, yPos)
		
		pdf.setFont('helvetica', 'normal')
		pdf.setFontSize(10)
		const dateWidth = pdf.getTextWidth(edu.dates)
		pdf.text(edu.dates, pageWidth - margin - dateWidth, yPos)
		yPos += 4
		
		pdf.setFontSize(10)
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
