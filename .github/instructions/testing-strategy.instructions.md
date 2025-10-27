# Testing Strategy

## Overview

Our testing approach follows **Test-Driven Development (TDD)** principles with a **bottom-up approach**, ensuring that all child components are fully tested before testing parent components. We prioritize **integration-style tests** over mocked tests to verify real-world behavior.

## Testing Principles

### 1. Bottom-Up Approach
- Test smallest components first (atoms)
- Move up to composite components (molecules)
- Finally test complex components (organisms)
- Test pages last
- Ensures all dependencies are verified before testing dependent code

### 2. Real Components Over Mocks
- **Mount actual components** instead of stubbing
- **Avoid mock data** when possible - use real data structures
- **Test integration** between components
- Only mock external APIs and third-party services

### 3. Test-Driven Development
- Write tests before implementation when possible
- Red → Green → Refactor cycle
- Tests should drive the design of components

## Test Structure

### Location
All tests are located in: `src/tests/`

### Organization
```
src/tests/
├── unit/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button.test.ts
│   │   │   └── Input.test.ts
│   │   ├── molecules/
│   │   │   ├── FormField.test.ts
│   │   │   └── Card.test.ts
│   │   └── organisms/
│   │       ├── Header.test.ts
│   │       └── ContactForm.test.ts
│   ├── composables/
│   │   └── useAuth.test.ts
│   └── utils/
│       └── formatDate.test.ts
├── integration/
│   └── pages/
│       └── Index.test.ts
└── fixtures/
    └── cvData.ts
```

## Testing Tools

### Stack
- **Vitest**: Fast, Vite-native test runner
- **@vue/test-utils**: Official Vue.js testing utilities
- **@testing-library/vue**: User-centric testing utilities
- **happy-dom** or **jsdom**: DOM implementation for Node.js

### Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { quasar } from '@quasar/vite-plugin'

export default defineConfig({
	plugins: [vue(), quasar()],
	test: {
		environment: 'happy-dom',
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'src/tests/',
				'*.config.ts'
			]
		}
	}
})
```

## Writing Tests

### Test Structure
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import ComponentName from '~/components/ComponentName.vue'

describe('ComponentName', () => {
	// Setup function to reduce duplication
	const createWrapper = (props = {}) => {
		return mount(ComponentName, {
			props,
			global: {
				plugins: [Quasar]
			}
		})
	}

	describe('Rendering', () => {
		it('should render with default props', () => {
			const wrapper = createWrapper()
			expect(wrapper.exists()).toBe(true)
		})

		it('should display the title prop', () => {
			const wrapper = createWrapper({ title: 'Test Title' })
			expect(wrapper.text()).toContain('Test Title')
		})
	})

	describe('User Interactions', () => {
		it('should emit update event when button is clicked', async () => {
			const wrapper = createWrapper()
			await wrapper.find('button').trigger('click')
			expect(wrapper.emitted('update')).toBeTruthy()
		})
	})

	describe('Computed Properties', () => {
		it('should compute full name correctly', () => {
			const wrapper = createWrapper({
				firstName: 'John',
				lastName: 'Doe'
			})
			expect(wrapper.vm.fullName).toBe('John Doe')
		})
	})
})
```

### Component Testing Guidelines

#### 1. Atomic Components (Atoms)
Test in isolation with all possible prop combinations.

```typescript
// src/tests/unit/components/atoms/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import Button from '~/components/atoms/Button.vue'

describe('Button', () => {
	const createWrapper = (props = {}) => {
		return mount(Button, {
			props,
			global: {
				plugins: [Quasar]
			}
		})
	}

	it('should render with label', () => {
		const wrapper = createWrapper({ label: 'Click Me' })
		expect(wrapper.text()).toBe('Click Me')
	})

	it('should emit click event', async () => {
		const wrapper = createWrapper()
		await wrapper.trigger('click')
		expect(wrapper.emitted('click')).toBeTruthy()
	})

	it('should be disabled when disabled prop is true', () => {
		const wrapper = createWrapper({ disabled: true })
		expect(wrapper.find('button').attributes('disabled')).toBeDefined()
	})

	it('should apply variant classes', () => {
		const wrapper = createWrapper({ variant: 'primary' })
		expect(wrapper.classes()).toContain('button--primary')
	})
})
```

#### 2. Composite Components (Molecules)
Test with real child components mounted.

```typescript
// src/tests/unit/components/molecules/FormField.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import FormField from '~/components/molecules/FormField.vue'
// Import actual child components - NO STUBS
import Input from '~/components/atoms/Input.vue'
import Label from '~/components/atoms/Label.vue'

describe('FormField', () => {
	const createWrapper = (props = {}) => {
		return mount(FormField, {
			props,
			global: {
				plugins: [Quasar],
				components: {
					Input,
					Label
				}
			}
		})
	}

	it('should render label and input', () => {
		const wrapper = createWrapper({
			label: 'Email',
			modelValue: 'test@example.com'
		})
		expect(wrapper.findComponent(Label).exists()).toBe(true)
		expect(wrapper.findComponent(Input).exists()).toBe(true)
	})

	it('should pass value to input component', () => {
		const wrapper = createWrapper({
			label: 'Email',
			modelValue: 'test@example.com'
		})
		const input = wrapper.findComponent(Input)
		expect(input.props('modelValue')).toBe('test@example.com')
	})

	it('should emit update:modelValue when input changes', async () => {
		const wrapper = createWrapper({ label: 'Email' })
		const input = wrapper.findComponent(Input)
		await input.vm.$emit('update:modelValue', 'new@example.com')
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new@example.com'])
	})
})
```

#### 3. Complex Components (Organisms)
Test with all child components mounted to verify integration.

```typescript
// src/tests/unit/components/organisms/ContactForm.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import ContactForm from '~/components/organisms/ContactForm.vue'

describe('ContactForm', () => {
	const createWrapper = (props = {}) => {
		return mount(ContactForm, {
			props,
			global: {
				plugins: [Quasar]
			}
		})
	}

	it('should render all form fields', () => {
		const wrapper = createWrapper()
		expect(wrapper.find('input[name="name"]').exists()).toBe(true)
		expect(wrapper.find('input[name="email"]').exists()).toBe(true)
		expect(wrapper.find('textarea[name="message"]').exists()).toBe(true)
	})

	it('should validate email format', async () => {
		const wrapper = createWrapper()
		const emailInput = wrapper.find('input[name="email"]')
		
		await emailInput.setValue('invalid-email')
		await wrapper.find('form').trigger('submit')
		
		expect(wrapper.text()).toContain('Invalid email format')
	})

	it('should emit submit event with form data', async () => {
		const wrapper = createWrapper()
		
		await wrapper.find('input[name="name"]').setValue('John Doe')
		await wrapper.find('input[name="email"]').setValue('john@example.com')
		await wrapper.find('textarea[name="message"]').setValue('Hello')
		await wrapper.find('form').trigger('submit')
		
		expect(wrapper.emitted('submit')?.[0]).toEqual([{
			name: 'John Doe',
			email: 'john@example.com',
			message: 'Hello'
		}])
	})
})
```

### Composables Testing

Test composables independently with real reactive data.

```typescript
// src/tests/unit/composables/useCV.test.ts
import { describe, it, expect } from 'vitest'
import { useCV } from '~/composables/useCV'
import cvData from '~/fixtures/cvData'

describe('useCV', () => {
	it('should load CV data', () => {
		const { data, isLoading } = useCV()
		expect(isLoading.value).toBe(false)
		expect(data.value).toBeDefined()
	})

	it('should filter experience by years', () => {
		const { filterByYears, filteredExperience } = useCV()
		filterByYears(2020)
		expect(filteredExperience.value.length).toBeGreaterThan(0)
		expect(filteredExperience.value.every(exp => 
			exp.startYear >= 2020
		)).toBe(true)
	})
})
```

### Utils Testing

Test utility functions with various inputs.

```typescript
// src/tests/unit/utils/formatDate.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '~/utils/formatDate'

describe('formatDate', () => {
	it('should format date to YYYY-MM-DD', () => {
		const date = new Date('2024-01-15')
		expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15')
	})

	it('should handle invalid dates', () => {
		expect(formatDate(new Date('invalid'), 'YYYY-MM-DD')).toBe('Invalid Date')
	})
})
```

## Test Fixtures

### Real Data Structures
Create fixtures with real data structures, not mocks.

```typescript
// src/tests/fixtures/cvData.ts
import type { CVData } from '~/types/cv'

export const cvDataFixture: CVData = {
	personalInfo: {
		name: 'John Doe',
		title: 'Senior Software Engineer',
		email: 'john@example.com',
		phone: '+1234567890',
		location: 'San Francisco, CA'
	},
	experience: [
		{
			id: '1',
			company: 'Tech Corp',
			position: 'Senior Developer',
			startDate: '2020-01',
			endDate: 'Present',
			description: 'Leading development team',
			technologies: ['Vue.js', 'TypeScript', 'Node.js']
		}
	],
	education: [
		{
			id: '1',
			institution: 'University of Technology',
			degree: 'BSc Computer Science',
			startYear: 2015,
			endYear: 2019
		}
	],
	skills: ['JavaScript', 'TypeScript', 'Vue.js', 'Nuxt.js']
}
```

## Coverage Requirements

### Minimum Coverage
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### What to Test
✅ Component rendering
✅ Props validation and defaults
✅ Event emissions
✅ User interactions
✅ Computed properties
✅ Watchers
✅ Lifecycle hooks (when critical)
✅ Composables logic
✅ Utility functions
✅ Error handling

### What NOT to Test
❌ Third-party library internals
❌ Quasar component internals
❌ Simple getters/setters
❌ Obvious code (like `return true`)

## Running Tests

### Commands
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test src/tests/unit/components/Button.test.ts

# Run tests matching pattern
npm run test -- --grep="Button"
```

## Continuous Integration

### Pre-commit Hook
```bash
# Run tests before commit
npm run test

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### CI Pipeline
1. Install dependencies
2. Run linter
3. Run type checking
4. Run all tests with coverage
5. Upload coverage report
6. Build application

## Best Practices

1. **Name tests clearly**: Use "should" statements
2. **One assertion per test**: When possible for clarity
3. **Arrange-Act-Assert**: Structure tests consistently
4. **Test behavior, not implementation**: Focus on what, not how
5. **Keep tests simple**: Tests should be easier to understand than the code
6. **Fast tests**: Avoid timeouts and delays when possible
7. **Independent tests**: Each test should run in isolation
8. **Descriptive describes**: Group related tests logically

## Example: Complete Test Flow

```typescript
// 1. Test atom first
// src/tests/unit/components/atoms/SkillTag.test.ts
describe('SkillTag', () => {
	it('should render skill name', () => {
		const wrapper = mount(SkillTag, { props: { skill: 'Vue.js' } })
		expect(wrapper.text()).toBe('Vue.js')
	})
})

// 2. Test molecule using real atom
// src/tests/unit/components/molecules/SkillsList.test.ts
describe('SkillsList', () => {
	it('should render multiple SkillTag components', () => {
		const wrapper = mount(SkillsList, {
			props: { skills: ['Vue.js', 'TypeScript'] }
		})
		expect(wrapper.findAllComponents(SkillTag)).toHaveLength(2)
	})
})

// 3. Test organism using real molecules and atoms
// src/tests/unit/components/organisms/SkillsSection.test.ts
describe('SkillsSection', () => {
	it('should group skills by category', () => {
		const wrapper = mount(SkillsSection, {
			props: { data: cvDataFixture }
		})
		expect(wrapper.findAllComponents(SkillsList).length).toBeGreaterThan(0)
	})
})
```

## Debugging Tests

### Enable Debug Mode
```typescript
import { mount } from '@vue/test-utils'

const wrapper = mount(Component)
console.log(wrapper.html()) // See rendered HTML
console.log(wrapper.vm) // Access component instance
```

### VS Code Debugging
Add to `.vscode/launch.json`:
```json
{
	"type": "node",
	"request": "launch",
	"name": "Debug Vitest Tests",
	"runtimeExecutable": "npm",
	"runtimeArgs": ["run", "test:debug"],
	"console": "integratedTerminal"
}
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils Documentation](https://test-utils.vuejs.org/)
- [Testing Library Vue](https://testing-library.com/docs/vue-testing-library/intro)
- [Kent C. Dodds - Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
