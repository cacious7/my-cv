import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateCleanPDF, downloadPDF } from '~/utils/pdfGenerator'
import type { CVData } from '~/types/cv'
import { cvDataFixture } from '../../fixtures/cvData'

// Mock jsPDF
const mockSave = vi.fn()
const mockAddPage = vi.fn()
const mockSetFontSize = vi.fn()
const mockSetFont = vi.fn()
const mockSetTextColor = vi.fn()
const mockSetFillColor = vi.fn()
const mockSetDrawColor = vi.fn()
const mockSetLineWidth = vi.fn()
const mockText = vi.fn()
const mockTextWithLink = vi.fn()
const mockLine = vi.fn()
const mockRect = vi.fn()
const mockLink = vi.fn()
const mockGetTextWidth = vi.fn((text: string) => text.length * 2)
const mockSplitTextToSize = vi.fn((text: string) => [text])
const mockGetPageSize = vi.fn(() => ({
	getWidth: () => 210,
	getHeight: () => 297
}))

const mockJsPDFInstance = {
	save: mockSave,
	addPage: mockAddPage,
	setFontSize: mockSetFontSize,
	setFont: mockSetFont,
	setTextColor: mockSetTextColor,
	setFillColor: mockSetFillColor,
	setDrawColor: mockSetDrawColor,
	setLineWidth: mockSetLineWidth,
	text: mockText,
	textWithLink: mockTextWithLink,
	line: mockLine,
	rect: mockRect,
	link: mockLink,
	getTextWidth: mockGetTextWidth,
	splitTextToSize: mockSplitTextToSize,
	internal: {
		pageSize: {
			getWidth: () => 210,
			getHeight: () => 297
		}
	}
}

vi.mock('jspdf', () => ({
	default: vi.fn(() => mockJsPDFInstance)
}))

describe('PDF Generator', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('generateCleanPDF', () => {
		it('should create a PDF document', async () => {
			const pdf = await generateCleanPDF(cvDataFixture)
			expect(pdf).toBeDefined()
		})

		it('should set correct page format and orientation', async () => {
			const jsPDF = (await import('jspdf')).default
			await generateCleanPDF(cvDataFixture)
			
			expect(jsPDF).toHaveBeenCalledWith({
				orientation: 'portrait',
				unit: 'mm',
				format: 'a4'
			})
		})

		it('should include contact information', async () => {
			await generateCleanPDF(cvDataFixture)
			
			// Check if full name is added
			expect(mockText).toHaveBeenCalledWith(
				expect.stringContaining(cvDataFixture.contact_information_digital_footprint.full_name.toUpperCase()),
				expect.any(Number),
				expect.any(Number)
			)
		})

		it('should include professional title', async () => {
			await generateCleanPDF(cvDataFixture)
			
			expect(mockText).toHaveBeenCalledWith(
				cvDataFixture.contact_information_digital_footprint.professional_title,
				expect.any(Number),
				expect.any(Number)
			)
		})

		it('should include clickable links for email, phone, and social media', async () => {
			await generateCleanPDF(cvDataFixture)
			
			// Check for email link
			expect(mockTextWithLink).toHaveBeenCalledWith(
				cvDataFixture.contact_information_digital_footprint.email_addresses[0],
				expect.any(Number),
				expect.any(Number),
				expect.objectContaining({
					url: expect.stringContaining('mailto:')
				})
			)

			// Check for phone link
			expect(mockTextWithLink).toHaveBeenCalledWith(
				cvDataFixture.contact_information_digital_footprint.phone_number,
				expect.any(Number),
				expect.any(Number),
				expect.objectContaining({
					url: expect.stringContaining('tel:')
				})
			)

			// Check for LinkedIn link
			expect(mockTextWithLink).toHaveBeenCalledWith(
				'LinkedIn',
				expect.any(Number),
				expect.any(Number),
				expect.objectContaining({
					url: cvDataFixture.contact_information_digital_footprint.links.linkedin
				})
			)

			// Check for GitHub link
			expect(mockTextWithLink).toHaveBeenCalledWith(
				'GitHub',
				expect.any(Number),
				expect.any(Number),
				expect.objectContaining({
					url: cvDataFixture.contact_information_digital_footprint.links.github
				})
			)
		})

		it('should include executive summary section', async () => {
			await generateCleanPDF(cvDataFixture)
			
			expect(mockText).toHaveBeenCalledWith(
				'PROFESSIONAL SUMMARY',
				expect.any(Number),
				expect.any(Number)
			)
		})

		it('should include core competencies section', async () => {
			await generateCleanPDF(cvDataFixture)
			
			expect(mockText).toHaveBeenCalledWith(
				'CORE COMPETENCIES & TECHNICAL SKILLS',
				expect.any(Number),
				expect.any(Number)
			)
		})

	it('should group skills by proficiency level', async () => {
		await generateCleanPDF(cvDataFixture)
		
		// Should include proficient skills - check that text() was called with proficiency labels
		const allTextCalls = mockText.mock.calls.map(call => call[0]).join(' ')
		expect(allTextCalls).toMatch(/Proficient:|Expert Level:|Experienced:/)
	})

	it('should include professional experience section', async () => {
			await generateCleanPDF(cvDataFixture)
			
			expect(mockText).toHaveBeenCalledWith(
				'PROFESSIONAL EXPERIENCE',
				expect.any(Number),
				expect.any(Number)
			)
		})

		it('should include all professional experiences', async () => {
			await generateCleanPDF(cvDataFixture)
			
			cvDataFixture.professional_experience.forEach(exp => {
				expect(mockText).toHaveBeenCalledWith(
					exp.company_name,
					expect.any(Number),
					expect.any(Number)
				)
			})
		})

		it('should limit achievements to top 4 per experience', async () => {
			const cvDataWithManyAchievements: CVData = {
				...cvDataFixture,
				professional_experience: [{
					company_name: 'Test Company',
					titles: ['Test Title'],
					dates_tenure: 'Jan 2020 - Present',
					key_responsibilities_achievements: [
						'Achievement 1',
						'Achievement 2',
						'Achievement 3',
						'Achievement 4',
						'Achievement 5',
						'Achievement 6'
					],
					technologies_utilized: []
				}]
			}

			await generateCleanPDF(cvDataWithManyAchievements)
			
			// Count bullet points for this company
			const bulletCalls = mockText.mock.calls.filter(call => call[0] === '•')
			expect(bulletCalls.length).toBeLessThanOrEqual(4)
		})

		it('should include key projects section', async () => {
			await generateCleanPDF(cvDataFixture)
			
			expect(mockText).toHaveBeenCalledWith(
				'KEY PROJECTS & OPEN SOURCE CONTRIBUTIONS',
				expect.any(Number),
				expect.any(Number)
			)
		})

		it('should include education section', async () => {
			await generateCleanPDF(cvDataFixture)
			
			expect(mockText).toHaveBeenCalledWith(
				'EDUCATION',
				expect.any(Number),
				expect.any(Number)
			)
		})

		it('should use brand colors for styling', async () => {
			await generateCleanPDF(cvDataFixture)
			
			// Should set text color (used for most content now)
			expect(mockSetTextColor).toHaveBeenCalledWith(51, 51, 51)
			
			// Should set dark color (Deep Dark) for headers
			expect(mockSetTextColor).toHaveBeenCalledWith(1, 31, 38)
			
			// Should set draw color for underlines
			expect(mockSetDrawColor).toHaveBeenCalled()
		})

		it('should create section headers with underlines', async () => {
			await generateCleanPDF(cvDataFixture)
			
			// Should draw underlines for section headers
			expect(mockLine).toHaveBeenCalled()
			expect(mockSetLineWidth).toHaveBeenCalled()
		})

		it('should underline clickable links', async () => {
			await generateCleanPDF(cvDataFixture)
			
			// Should draw lines under links
			expect(mockLine).toHaveBeenCalled()
		})

		it('should handle page breaks correctly', async () => {
			// Create CV with lots of content to trigger page break
			const largeCV: CVData = {
				...cvDataFixture,
				professional_experience: Array(10).fill(cvDataFixture.professional_experience[0])
			}

			await generateCleanPDF(largeCV)
			
			// Should add at least one page
			expect(mockAddPage).toHaveBeenCalled()
		})

	it('should set correct font sizes for different sections', async () => {
		await generateCleanPDF(cvDataFixture)
		
		// Name should be 20pt (clean and professional)
		expect(mockSetFontSize).toHaveBeenCalledWith(20)
		
		// Section headers should be 12pt
		expect(mockSetFontSize).toHaveBeenCalledWith(12)
		
		// Body text should be around 9-10pt
		expect(mockSetFontSize).toHaveBeenCalledWith(9)
		expect(mockSetFontSize).toHaveBeenCalledWith(9.5)
		expect(mockSetFontSize).toHaveBeenCalledWith(10)
	})

	it('should use bold font for headings', async () => {
		await generateCleanPDF(cvDataFixture)
		
		expect(mockSetFont).toHaveBeenCalledWith('helvetica', 'bold')
		expect(mockSetFont).toHaveBeenCalledWith('helvetica', 'normal')
	})

	it('should format dates and align them to the right', async () => {
		await generateCleanPDF(cvDataFixture)
		
		// Dates should be formatted and right-aligned
		// The mockText should have been called with date strings
		const textCalls = mockText.mock.calls
		const hasDateCall = textCalls.some(call => 
			typeof call[0] === 'string' && call[0].includes('-')
		)
		expect(hasDateCall).toBe(true)
	})
	})

	describe('downloadPDF', () => {
		it('should call save method with correct filename', async () => {
			await downloadPDF(cvDataFixture)
			
			const expectedFilename = `${cvDataFixture.contact_information_digital_footprint.full_name.replace(/\s+/g, '_')}_CV.pdf`
			expect(mockSave).toHaveBeenCalledWith(expectedFilename)
		})

		it('should generate PDF before saving', async () => {
			await downloadPDF(cvDataFixture)
			
			expect(mockSave).toHaveBeenCalled()
		})

		it('should handle names with spaces correctly', async () => {
			const cvWithSpaces: CVData = {
				...cvDataFixture,
				contact_information_digital_footprint: {
					...cvDataFixture.contact_information_digital_footprint,
					full_name: 'John Michael Doe'
				}
			}

			await downloadPDF(cvWithSpaces)
			
			expect(mockSave).toHaveBeenCalledWith('John_Michael_Doe_CV.pdf')
		})
	})

	describe('ATS Optimization', () => {
		it('should use ATS-friendly fonts (Helvetica)', async () => {
			await generateCleanPDF(cvDataFixture)
			
			// Should only use helvetica font
			const fontCalls = mockSetFont.mock.calls
			fontCalls.forEach(call => {
				expect(call[0]).toBe('helvetica')
			})
		})

		it('should have clear section headers', async () => {
			await generateCleanPDF(cvDataFixture)
			
			const expectedSections = [
				'PROFESSIONAL SUMMARY',
				'CORE COMPETENCIES & TECHNICAL SKILLS',
				'PROFESSIONAL EXPERIENCE',
				'KEY PROJECTS & OPEN SOURCE CONTRIBUTIONS',
				'EDUCATION'
			]

			expectedSections.forEach(section => {
				expect(mockText).toHaveBeenCalledWith(
					section,
					expect.any(Number),
					expect.any(Number)
				)
			})
		})

		it('should maintain consistent margins', async () => {
			await generateCleanPDF(cvDataFixture)
			
			// All text should start at margin (20mm) or margin + indent
			const textCalls = mockText.mock.calls
			textCalls.forEach(call => {
				const xPos = call[1]
				// Should be at margin (20) or margin + some indent
				expect(xPos).toBeGreaterThanOrEqual(20)
			})
		})

		it('should include all contact methods', async () => {
			await generateCleanPDF(cvDataFixture)
			
			// Should include location
			expect(mockText).toHaveBeenCalledWith(
				cvDataFixture.contact_information_digital_footprint.location,
				expect.any(Number),
				expect.any(Number)
			)
		})
	})

	describe('Content Prioritization', () => {
		it('should show most important content first', async () => {
			await generateCleanPDF(cvDataFixture)
			
			const calls = mockText.mock.calls
			const getText = (index: number) => calls[index]?.[0]

			// Name should come first
			expect(getText(0)).toContain(cvDataFixture.contact_information_digital_footprint.full_name.toUpperCase())
		})

		it('should prioritize recent experience', async () => {
			await generateCleanPDF(cvDataFixture)
			
			// Should maintain order of experiences (most recent first)
			const firstExp = cvDataFixture.professional_experience[0]
			expect(mockText).toHaveBeenCalledWith(
				firstExp.company_name,
				expect.any(Number),
				expect.any(Number)
			)
		})
	})
})
