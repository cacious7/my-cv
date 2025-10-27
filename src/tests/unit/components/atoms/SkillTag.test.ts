import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import SkillTag from '~/components/atoms/SkillTag.vue'

describe('SkillTag', () => {
	const createWrapper = (props = {}) => {
		return mount(SkillTag, {
			props,
			global: {
				plugins: [Quasar]
			}
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
			const tooltip = wrapper.findComponent({ name: 'QTooltip' })
			expect(tooltip.exists()).toBe(true)
		})

		it('should not render tooltip when proficiency is not provided', () => {
			const wrapper = createWrapper({ skill: 'JavaScript' })
			const tooltip = wrapper.findComponent({ name: 'QTooltip' })
			expect(tooltip.exists()).toBe(false)
		})
	})

	describe('Chip Color', () => {
		it('should use green color for Excellent proficiency', () => {
			const wrapper = createWrapper({
				skill: 'Debugging',
				proficiency: 'Excellent'
			})
			const chip = wrapper.findComponent({ name: 'QChip' })
			expect(chip.props('color')).toBe('green')
		})

		it('should use blue color for Proficient proficiency', () => {
			const wrapper = createWrapper({
				skill: 'Vue.js',
				proficiency: 'Proficient'
			})
			const chip = wrapper.findComponent({ name: 'QChip' })
			expect(chip.props('color')).toBe('blue')
		})

		it('should use default color when no proficiency is provided', () => {
			const wrapper = createWrapper({
				skill: 'React',
				color: 'secondary'
			})
			const chip = wrapper.findComponent({ name: 'QChip' })
			expect(chip.props('color')).toBe('secondary')
		})
	})

	describe('Icons', () => {
		it('should display star icon for Excellent proficiency', () => {
			const wrapper = createWrapper({
				skill: 'Test',
				proficiency: 'Excellent'
			})
			const chip = wrapper.findComponent({ name: 'QChip' })
			expect(chip.props('icon')).toBe('mdi-star')
		})

		it('should display check-circle icon for Proficient proficiency', () => {
			const wrapper = createWrapper({
				skill: 'Test',
				proficiency: 'Proficient'
			})
			const chip = wrapper.findComponent({ name: 'QChip' })
			expect(chip.props('icon')).toBe('mdi-check-circle')
		})

		it('should not display icon when proficiency is not provided', () => {
			const wrapper = createWrapper({ skill: 'Test' })
			const chip = wrapper.findComponent({ name: 'QChip' })
			expect(chip.props('icon')).toBeUndefined()
		})
	})

	describe('Outline Mode', () => {
		it('should render in outline mode when outline prop is true', () => {
			const wrapper = createWrapper({
				skill: 'Docker',
				outline: true
			})
			const chip = wrapper.findComponent({ name: 'QChip' })
			expect(chip.props('outline')).toBe(true)
		})
	})
})
