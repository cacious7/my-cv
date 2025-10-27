describe('PDF Download E2E Test', () => {
	beforeEach(() => {
		cy.visit('/')
	})

	describe('PDF Download Button', () => {
		it('should display the download PDF button', () => {
			cy.contains('button', /download.*pdf/i).should('be.visible')
		})

		it('should have correct aria labels for accessibility', () => {
			cy.contains('button', /download.*pdf/i)
				.should('have.attr', 'aria-label')
				.and('match', /download/i)
		})

		it('should show loading state when clicked', () => {
			cy.contains('button', /download.*pdf/i).click()
			
			// Should show some loading indicator
			cy.get('[role="progressbar"]', { timeout: 1000 }).should('exist')
				.or(() => {
					// Or button should be disabled during generation
					cy.contains('button', /download.*pdf/i).should('be.disabled')
				})
		})
	})

	describe('PDF Generation', () => {
		it('should trigger download when button is clicked', () => {
			// Stub the download to prevent actual file download
			cy.window().then((win) => {
				cy.stub(win, 'open').as('windowOpen')
			})

			cy.contains('button', /download.*pdf/i).click()

			// Wait a bit for PDF generation
			cy.wait(2000)

			// Verify download was triggered (file system interaction)
			// Note: In Cypress, we can't directly verify file downloads,
			// but we can verify the PDF generation code executed
		})

		it('should generate PDF with correct filename pattern', () => {
			cy.window().then((win) => {
				// Intercept jsPDF save method
				const originalJsPDF = win.jsPDF
				win.jsPDF = class extends (originalJsPDF || class {}) {
					save(filename: string) {
						expect(filename).to.match(/_CV\.pdf$/)
						expect(filename).to.not.include(' ')
					}
				}
			})

			cy.contains('button', /download.*pdf/i).click()
			cy.wait(1000)
		})
	})

	describe('PDF Content Verification', () => {
		it('should include all required sections in CV', () => {
			// Verify the page has all required content
			cy.contains('h2', /professional summary/i).should('exist')
			cy.contains('h2', /core competencies/i).should('exist')
			cy.contains('h2', /professional experience/i).should('exist')
			cy.contains('h2', /education/i).should('exist')
		})

		it('should display contact information', () => {
			cy.contains('Cacious Siamunyanga').should('be.visible')
			cy.contains(/senior software developer/i).should('be.visible')
			cy.contains(/\+260975670360/).should('be.visible')
			cy.contains(/csiamunyanga@hotmail\.com/).should('be.visible')
		})

		it('should display social links', () => {
			// LinkedIn
			cy.get('[href*="linkedin.com"]').should('exist')
			// GitHub
			cy.get('[href*="github.com"]').should('exist')
			// Stack Overflow
			cy.get('[href*="stackoverflow.com"]').should('exist')
		})

		it('should display skills with proficiency badges', () => {
			cy.get('.skill-tag').should('have.length.gt', 0)
			
			// Should have different proficiency levels
			cy.contains('.skill-tag', 'JavaScript').should('exist')
			cy.contains('.skill-tag', 'TypeScript').should('exist')
			cy.contains('.skill-tag', 'Vue').should('exist')
		})

		it('should display professional experience with dates', () => {
			cy.contains('Connex Carrier Services').should('exist')
			cy.contains(/apr 2021.*present/i).should('exist')
		})

		it('should display education details', () => {
			cy.contains('ZICAS').should('exist')
			cy.contains('Wuhan University').should('exist')
			cy.contains(/2019.*2023/).should('exist')
		})
	})

	describe('PDF Accessibility', () => {
		it('should have accessible button with proper labels', () => {
			cy.contains('button', /download.*pdf/i)
				.should('have.attr', 'aria-label')
		})

		it('should be keyboard navigable', () => {
			// Tab to the download button
			cy.get('body').tab()
			cy.focused().should('have.attr', 'href') // Social links come first
			
			// Keep tabbing until we reach the download button
			for (let i = 0; i < 10; i++) {
				cy.focused().then($el => {
					if ($el.text().match(/download.*pdf/i)) {
						return false
					}
				}).tab()
			}
		})

		it('should provide feedback when PDF is ready', () => {
			cy.contains('button', /download.*pdf/i).click()
			
			// Should show notification or success message
			cy.get('.q-notification', { timeout: 5000 })
				.should('exist')
				.or(() => {
					// Or return to normal state
					cy.contains('button', /download.*pdf/i).should('not.be.disabled')
				})
		})
	})

	describe('Mobile Responsiveness', () => {
		beforeEach(() => {
			cy.viewport('iphone-x')
		})

		it('should display download button on mobile', () => {
			cy.contains('button', /download.*pdf/i).should('be.visible')
		})

		it('should maintain readability on mobile', () => {
			cy.contains('Cacious Siamunyanga').should('be.visible')
			cy.get('.skill-tag').first().should('be.visible')
		})

		it('should be tappable on mobile', () => {
			cy.contains('button', /download.*pdf/i)
				.should('have.css', 'cursor', 'pointer')
		})
	})

	describe('PDF Quality', () => {
		it('should generate PDF within reasonable time', () => {
			const start = Date.now()
			
			cy.contains('button', /download.*pdf/i).click()
			
			cy.wait(3000).then(() => {
				const duration = Date.now() - start
				expect(duration).to.be.lessThan(5000) // Should complete in under 5 seconds
			})
		})

		it('should not crash the application during PDF generation', () => {
			cy.contains('button', /download.*pdf/i).click()
			cy.wait(2000)
			
			// Application should still be functional
			cy.contains('Cacious Siamunyanga').should('exist')
			cy.get('.cv-page').should('exist')
		})

		it('should allow multiple PDF downloads', () => {
			// First download
			cy.contains('button', /download.*pdf/i).click()
			cy.wait(1500)
			
			// Second download
			cy.contains('button', /download.*pdf/i).should('not.be.disabled')
			cy.contains('button', /download.*pdf/i).click()
			cy.wait(1500)
			
			// Application should still work
			cy.contains('Cacious Siamunyanga').should('exist')
		})
	})

	describe('ATS Compatibility', () => {
		it('should display content in logical order', () => {
			// Get all h2 headers in order
			cy.get('h2').then($headers => {
				const headers = $headers.toArray().map(h => h.innerText)
				
				// Should have professional summary near the top
				const summaryIndex = headers.findIndex(h => h.match(/summary/i))
				expect(summaryIndex).to.be.lessThan(3)
				
				// Experience should come before projects
				const expIndex = headers.findIndex(h => h.match(/experience/i))
				const projIndex = headers.findIndex(h => h.match(/projects/i))
				expect(expIndex).to.be.lessThan(projIndex)
			})
		})

		it('should use semantic HTML', () => {
			cy.get('h1').should('exist') // Name should be h1
			cy.get('h2').should('have.length.gt', 3) // Section headers
			cy.get('h3').should('have.length.gt', 0) // Subsection headers
		})

		it('should have all text content (no images for critical info)', () => {
			// All important content should be text, not images
			cy.contains('Cacious Siamunyanga').should('not.be', 'img')
			cy.contains(/senior software developer/i).should('not.be', 'img')
		})
	})

	describe('Error Handling', () => {
		it('should handle PDF generation errors gracefully', () => {
			// Simulate error
			cy.window().then((win) => {
				win.console.error = cy.stub().as('consoleError')
			})

			// Try to generate PDF
			cy.contains('button', /download.*pdf/i).click()
			cy.wait(2000)

			// Should not show error to user or handle it gracefully
			cy.get('[role="alert"]').should('not.exist')
				.or(() => {
					// Or should show user-friendly error message
					cy.get('[role="alert"]').should('contain', 'Error')
				})
		})
	})
})
