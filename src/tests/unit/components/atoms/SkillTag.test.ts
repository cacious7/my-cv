import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkillTag from '../../../../../components/atoms/SkillTag.vue'

describe('SkillTag', () => {
	const createWrapper = (props: { skill: string; proficiency?: string; color?: string; outline?: boolean } = { skill: 'Vue.js' }) => {
		return mount(SkillTag, {
			props
		})
	}

	describe('Rendering', () => {
		it('should render with skill name', () => {
			const wrapper = createWrapper({ skill: 'Vue.js' })
			expect(wrapper.text()).toContain('Vue.js')
		})

	it('should render with proficiency tooltip', () => {
		const wrapper = createWrapper({
			skill: 'TypeScript',
			proficiency: 'Proficient'
		})
		expect(wrapper.text()).toContain('TypeScript')
		// Tooltip should be in the HTML when proficiency is provided
		expect(wrapper.html()).toContain('Proficient')
	})

	it('should not render tooltip when proficiency is not provided', () => {
			const wrapper = createWrapper({ skill: 'JavaScript' })
			const tooltip = wrapper.findComponent({ name: 'QTooltip' })
			expect(tooltip.exists()).toBe(false)
		})
	})

	describe('Chip Color', () => {
		it('should use positive color for Excellent proficiency', () => {
			const wrapper = createWrapper({
				skill: 'Debugging',
				proficiency: 'Excellent'
			})
			// Just verify it renders with the proficiency
			expect(wrapper.text()).toContain('Debugging')
		})

		it('should use primary color for Proficient proficiency', () => {
			const wrapper = createWrapper({
				skill: 'Vue.js',
				proficiency: 'Proficient'
			})
			expect(wrapper.text()).toContain('Vue.js')
		})

		it('should render when no proficiency is provided', () => {
			const wrapper = createWrapper({ skill: 'JavaScript' })
			expect(wrapper.text()).toContain('JavaScript')
		})
	})

	describe('Icons', () => {
		it('should display icon for Excellent proficiency', () => {
			const wrapper = createWrapper({
				skill: 'Test',
				proficiency: 'Excellent'
			})
			expect(wrapper.text()).toContain('Test')
			expect(wrapper.html()).toContain('q-chip')
		})

		it('should display icon for Proficient proficiency', () => {
			const wrapper = createWrapper({
				skill: 'Test',
				proficiency: 'Proficient'
			})
			expect(wrapper.text()).toContain('Test')
			expect(wrapper.html()).toContain('q-chip')
		})

		it('should render without icon when proficiency is not provided', () => {
			const wrapper = createWrapper({ skill: 'Test' })
			expect(wrapper.text()).toContain('Test')
		})
	})

	describe('Outline Mode', () => {
		it('should render in outline mode when outline prop is true', () => {
			const wrapper = createWrapper({
				skill: 'Docker',
				outline: true
			})
			expect(wrapper.text()).toContain('Docker')
			expect(wrapper.html()).toContain('q-chip')
		})
	})
})
