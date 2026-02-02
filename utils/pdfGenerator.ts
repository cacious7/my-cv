import type { CVData, ProfessionalExperience, FormalEducation } from '~/types/cv'

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

	// Spacing standards from cv-standards.instructions.md (in mm)
	const spacing = {
		afterName: 6,
		afterJobTitle: 6,
		afterContactInfo: 7,
		betweenSections: 6,
		afterSectionHeader: 4.5,
		afterJobHeader: 5,
		betweenBullets: 2.5,
		betweenJobs: 6,
		afterProjectTitle: 3,
		betweenProjects: 4,
		afterInstitution: 3,
		betweenEducation: 4
	}

	function checkPageBreak() {
		if (yPos > pageHeight - margin - 20) {
			pdf.addPage()
			yPos = margin
			return true
		}
		return false
	}

	function addText(text: string, fontSize: number, bold = false, indent = 0) {
		checkPageBreak()
		pdf.setFontSize(fontSize)
		pdf.setFont('helvetica', bold ? 'bold' : 'normal')
		pdf.setTextColor(0, 0, 0)
		const lines = pdf.splitTextToSize(text, contentWidth - indent)
		pdf.text(lines, margin + indent, yPos)
		// Line height calculation: 4-4.5mm per line for 10pt
		const lineHeight = fontSize === 10 ? 4.5 : fontSize * 0.45
		yPos += lines.length * lineHeight
	}

	function addBullet(text: string, indent = 5) {
		checkPageBreak()
		pdf.setFontSize(10)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(0, 0, 0)
		
		// Add bullet
		pdf.text('•', margin + 1, yPos)
		
		// Split text into lines
		const lines = pdf.splitTextToSize(text, contentWidth - indent - 3)
		
		// Process each line for bold metrics
		let currentY = yPos
		lines.forEach((line: string) => {
			// Find patterns to bold
			const patterns = [
				/\d+\+?\s*(engineers?|developers?|users?|years?|months?|projects?|vendors?|products?|reviews?|tools?|applications?|hours?|minutes?)/gi,
				/\d+%/g,
				/Vue 2\.5 to Vue 3/gi,
				/Nuxt 2 to Nuxt 3/gi,
				/TypeScript/gi,
				/Service Workers/gi,
				/Vitest/gi,
				/Cypress/gi,
				/E2E testing/gi,
				/unit testing/gi,
				/MCP \(Model Context Protocol\)/gi,
				/n8n/gi,
				/CI\/CD pipeline/gi,
				/AI-assisted/gi,
				/reducing technical debt and improving developer/gi,
				/reducing production runtime errors/gi,
				/Nuxt 2, then led migration to Nuxt 3/gi,
				/multi-vendor marketplace platform using WordPress and Dokan/gi,
				/hands-on experience in startup operations/gi,
			]
			
			const segments: Array<{text: string, bold: boolean, start: number, end: number}> = []
			let lastIndex = 0
			
			patterns.forEach(pattern => {
				const regex = new RegExp(pattern.source, pattern.flags)
				let match
				while ((match = regex.exec(line)) !== null) {
					if (match.index > lastIndex) {
						segments.push({
							text: line.substring(lastIndex, match.index),
							bold: false,
							start: lastIndex,
							end: match.index
						})
					}
					segments.push({
						text: match[0],
						bold: true,
						start: match.index,
						end: match.index + match[0].length
					})
					lastIndex = match.index + match[0].length
				}
			})
			
			// Add remaining text
			if (lastIndex < line.length) {
				segments.push({
					text: line.substring(lastIndex),
					bold: false,
					start: lastIndex,
					end: line.length
				})
			}
			
			// Sort segments and merge overlaps
			segments.sort((a, b) => a.start - b.start)
			const mergedSegments: typeof segments = []
			segments.forEach(seg => {
				if (mergedSegments.length === 0) {
					mergedSegments.push(seg)
				} else {
					const last = mergedSegments[mergedSegments.length - 1]
					if (seg.start < last.end) {
						// Overlapping - prefer bold
						if (seg.bold && !last.bold) {
							last.text = line.substring(last.start, seg.end)
							last.bold = true
							last.end = seg.end
						}
					} else {
						mergedSegments.push(seg)
					}
				}
			})
			
			// Render line with segments
			let xPos = margin + indent
			if (mergedSegments.length === 0) {
				// No special formatting needed
				pdf.text(line, xPos, currentY)
			} else {
				mergedSegments.forEach(seg => {
					pdf.setFont('helvetica', seg.bold ? 'bold' : 'normal')
					pdf.text(seg.text, xPos, currentY)
					xPos += pdf.getTextWidth(seg.text)
				})
			}
			
			currentY += 4.5 // Line height for bullets
		})
		
		yPos = currentY + spacing.betweenBullets
	}

	function addLink(text: string, url: string, fontSize: number, xPos: number) {
		pdf.setFontSize(fontSize)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(0, 0, 0)
		const textWidth = pdf.getTextWidth(text)
		pdf.textWithLink(text, xPos, yPos, { url })
		pdf.setDrawColor(0, 0, 0)
		pdf.setLineWidth(0.2)
		pdf.line(xPos, yPos + 0.5, xPos + textWidth, yPos + 0.5)
		return textWidth
	}

	function addSectionHeader(title: string) {
		checkPageBreak()
		pdf.setFontSize(12)
		pdf.setFont('helvetica', 'normal')
		pdf.setTextColor(0, 0, 0)
		pdf.text(title, margin, yPos)
		const titleWidth = pdf.getTextWidth(title)
		yPos += 1
		pdf.setDrawColor(0, 0, 0)
		pdf.setLineWidth(0.5)
		pdf.line(margin, yPos, margin + titleWidth, yPos)
		yPos += spacing.afterSectionHeader
	}

	// === HEADER ===
	const contact = cvData.contact_information_digital_footprint
	
	// Name
	pdf.setFontSize(18)
	pdf.setFont('helvetica', 'bold')
	pdf.setTextColor(0, 0, 0)
	pdf.text(contact.full_name.toUpperCase(), margin, yPos)
	yPos += spacing.afterName

	// Job Title
	pdf.setFontSize(14)
	pdf.setFont('helvetica', 'normal')
	pdf.text('Senior Software Developer | Developer Department Head', margin, yPos)
	yPos += spacing.afterJobTitle

	// Contact Info - Line 1
	pdf.setFontSize(9)
	let xOffset = margin
	pdf.text(contact.location, xOffset, yPos)
	xOffset += pdf.getTextWidth(contact.location) + 3
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	const phoneWidth = addLink(contact.phone_number, `tel:${contact.phone_number}`, 9, xOffset)
	xOffset += phoneWidth + 3
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	addLink(contact.email_addresses[0], `mailto:${contact.email_addresses[0]}`, 9, xOffset)
	yPos += 4.5

	// Contact Info - Line 2
	xOffset = margin
	const liWidth = addLink('LinkedIn', contact.links.linkedin, 9, xOffset)
	xOffset += liWidth + 3
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	const ghWidth = addLink('GitHub', contact.links.github, 9, xOffset)
	xOffset += ghWidth + 3
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	const soWidth = addLink('Stack Overflow', contact.links.stack_overflow, 9, xOffset)
	xOffset += soWidth + 3
	pdf.text('|', xOffset, yPos)
	xOffset += 5
	addLink('Portfolio', 'https://thunderous-druid-b48de5.netlify.app/', 9, xOffset)
	yPos += spacing.afterContactInfo

	// === SUMMARY ===
	addSectionHeader('Summary')
	addText(cvData.executive_summary, 10)
	yPos += spacing.betweenSections

	// === SKILLS ===
	addSectionHeader('Skills')
	const comp = cvData.core_competencies_technical_acumen
	
	// Soft Skills
	pdf.setFontSize(10)
	pdf.setFont('helvetica', 'bold')
	pdf.text('Soft Skills:', margin, yPos)
	yPos += 3.5
	const softSkills = comp.skills.filter((s: any) => s.proficiency === 'Soft Skill').map((s: any) => s.skill)
	const softSkillsList = ['Excellent Debugging', ...softSkills].join(', ')
	addText(softSkillsList, 10)
	yPos += 2

	// Technical Skills
	pdf.setFontSize(10)
	pdf.setFont('helvetica', 'bold')
	pdf.text('Technical Skills:', margin, yPos)
	yPos += 3.5
	const proficientSkills = comp.skills.filter((s: any) => s.proficiency === 'Proficient').map((s: any) => s.skill)
	const experiencedSkills = comp.skills.filter((s: any) => s.proficiency === 'Experienced').map((s: any) => s.skill)
	const allTechSkills = [...proficientSkills, ...experiencedSkills].join(', ')
	addText(allTechSkills, 10)
	yPos += spacing.betweenSections

	// === EXPERIENCE ===
	addSectionHeader('Experience')
	
	// Only show first 3 experiences in PDF (ConnexCS, Gulait, Dephlex) - skip freelance
	const experiencesToShow = cvData.professional_experience.slice(0, 3)
	
	experiencesToShow.forEach((exp: ProfessionalExperience, index: number) => {
		checkPageBreak()
		
		// Job title and dates on same line
		pdf.setFontSize(11)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(0, 0, 0)
		const titleText = exp.titles.join(' / ')
		pdf.text(titleText, margin, yPos)
		
		pdf.setFont('helvetica', 'normal')
		pdf.setFontSize(10)
		const dateWidth = pdf.getTextWidth(exp.dates_tenure)
		pdf.text(exp.dates_tenure, pageWidth - margin - dateWidth, yPos)
		yPos += spacing.afterJobHeader
		
		// Company name
		pdf.setFontSize(10)
		pdf.setFont('helvetica', 'normal')
		pdf.text(`${exp.company_name} - Remote`, margin, yPos)
		yPos += spacing.afterJobHeader
		
		// Achievements - show more for ConnexCS (first job), fewer for others
		const maxAchievements = index === 0 ? 6 : 4
		const achievements = exp.key_responsibilities_achievements.slice(0, maxAchievements)
		achievements.forEach((ach: string) => {
			addBullet(ach)
		})
		
		// Space between jobs (not after last)
		if (index < experiencesToShow.length - 1) {
			yPos += spacing.betweenJobs
		}
	})
	
	yPos += spacing.betweenSections

	// === PROJECTS ===
	addSectionHeader('Projects')
	
	const projects = cvData.key_projects_open_source_contributions.projects || []
	projects.forEach((proj: any, index: number) => {
		checkPageBreak()
		
		pdf.setFontSize(11)
		pdf.setFont('helvetica', 'bold')
		pdf.setTextColor(0, 0, 0)
		
		const nameWidth = pdf.getTextWidth(proj.name)
		if (proj.url) {
			pdf.textWithLink(proj.name, margin, yPos, { url: proj.url })
			pdf.setLineWidth(0.2)
			pdf.line(margin, yPos + 0.5, margin + nameWidth, yPos + 0.5)
		} else {
			pdf.text(proj.name, margin, yPos)
		}
		
		// npm link if exists
		if (proj.npm) {
			pdf.setFontSize(9)
			pdf.setFont('helvetica', 'normal')
			const xPos = margin + nameWidth + 5
			const npmWidth = pdf.getTextWidth('npm')
			pdf.textWithLink('npm', xPos, yPos, { url: proj.npm })
			pdf.line(xPos, yPos + 0.5, xPos + npmWidth, yPos + 0.5)
		}
		
		yPos += spacing.afterProjectTitle + 1.5  // Extra 1.5mm space after project title underline
		
		// Description
		pdf.setFontSize(10)
		pdf.setFont('helvetica', 'normal')
		const descLines = pdf.splitTextToSize(proj.description, contentWidth - 5)
		pdf.text('•', margin + 1, yPos)
		pdf.text(descLines, margin + 5, yPos)
		yPos += descLines.length * 4.5
		
		// Space between projects (not after last)
		if (index < projects.length - 1) {
			yPos += spacing.betweenProjects
		}
	})
	
	yPos += spacing.betweenSections

	// === EDUCATION ===
	addSectionHeader('Education')
	
	cvData.education_continuous_learning.formal_education.forEach((edu: FormalEducation, index: number) => {
		checkPageBreak()
		
		pdf.setFontSize(11)
		pdf.setFont('helvetica', 'bold')
		pdf.text(edu.institution, margin, yPos)
		
		pdf.setFont('helvetica', 'normal')
		pdf.setFontSize(10)
		const dateWidth = pdf.getTextWidth(edu.dates)
		pdf.text(edu.dates, pageWidth - margin - dateWidth, yPos)
		yPos += spacing.afterInstitution
		
		pdf.setFontSize(10)
		pdf.setFont('helvetica', 'normal')
		pdf.text(edu.degree_course, margin, yPos)
		yPos += 4
		
		// Space between education entries (not after last)
		if (index < cvData.education_continuous_learning.formal_education.length - 1) {
			yPos += spacing.betweenEducation
		}
	})

	return pdf
}

export async function downloadPDF(cvData: CVData) {
	const pdf = await generateCleanPDF(cvData)
	const filename = `${cvData.contact_information_digital_footprint.full_name.replace(/\s+/g, '_')}_CV.pdf`
	pdf.save(filename)
}
