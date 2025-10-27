# Coding Standards

## General Principles

### Code Quality
- **DRY (Don't Repeat Yourself)**: Avoid code duplication by creating reusable components, composables, and utilities
- **Modular Code**: Break down complex functionality into smaller, manageable modules
- **Mobile First**: Design and implement features starting with mobile viewport, then scale up
- **Test Driven Development (TDD)**: Write tests before implementation when possible

## Formatting Rules

### Indentation
- **Use TABS only** (tab size: 4)
- **NO spaces for indentation**
- Configure your editor to use tabs with a display width of 4 spaces

### Semicolons
- **NO semicolons** in TypeScript/JavaScript code
- **Semicolons allowed ONLY** in `<style scoped>` blocks

### Whitespace
- **NO trailing spaces** at the end of lines
- **NO trailing empty lines** at the end of files (single newline at EOF is acceptable)
- Consistent spacing around operators and after commas

## Component Structure

### File Organization
```
ComponentName/
├── ComponentName.vue       # Main component file
├── ComponentName.test.ts   # Component tests (if complex)
└── types.ts                # Component-specific types (if needed)
```

### Component Requirements
1. **Each component must have its own styles**
2. **All styles must be scoped** using `<style scoped>`
3. **Use TypeScript** for all script blocks: `<script setup lang="ts">`
4. **Use Composition API** with `<script setup>`

### Component Template
```vue
<template>
	<div class="component-name">
		<!-- Component content -->
	</div>
</template>

<script setup lang="ts">
// Imports
import { ref, computed } from 'vue'

// Props
interface Props {
	title: string
	isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	isActive: false
})

// Emits
interface Emits {
	(e: 'update', value: string): void
}

const emit = defineEmits<Emits>()

// Component logic
</script>

<style scoped>
.component-name {
	/* Component styles */
	display: flex;
	flex-direction: column;
}

/* Mobile First - base styles for mobile */
@media (min-width: 768px) {
	/* Tablet styles */
}

@media (min-width: 1024px) {
	/* Desktop styles */
}
</style>
```

## TypeScript Standards

### Type Definitions
- Always define types for props, emits, and component data
- Use interfaces over types for object definitions
- Create reusable types in `types/` directory
- Avoid `any` type - use `unknown` if type is truly unknown

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)

## CSS/Styling Standards

### Quasar Components
- Prefer Quasar components over custom HTML elements
- Use Quasar's utility classes when appropriate
- Maintain consistent spacing using Quasar's spacing system

### Custom Styles
- Use BEM methodology when needed for clarity
- Prefer CSS Grid and Flexbox for layouts
- Use CSS variables for theming
- Mobile-first media queries

### Example
```css
/* Mobile first - base styles */
.card {
	display: flex;
	flex-direction: column;
	padding: 1rem;
}

.card__header {
	font-size: 1.125rem;
	margin-bottom: 0.5rem;
}

/* Tablet and up */
@media (min-width: 768px) {
	.card {
		flex-direction: row;
		padding: 1.5rem;
	}
}
```

## Icons

### MDI Icons
- Use Material Design Icons (MDI) via Quasar's icon integration
- Icon naming: `mdi-icon-name` format
- Example: `<q-icon name="mdi-account" />`

## Composables

### Structure
- Place in `composables/` directory
- Export a single function with `use` prefix
- Return reactive state and methods

### Example
```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export const useCounter = (initialValue = 0) => {
	const count = ref(initialValue)
	
	const doubleCount = computed(() => count.value * 2)
	
	const increment = () => {
		count.value++
	}
	
	const decrement = () => {
		count.value--
	}
	
	return {
		count,
		doubleCount,
		increment,
		decrement
	}
}
```

## Imports

### Order
1. Vue core imports
2. Nuxt/framework imports
3. Third-party libraries
4. Local components
5. Composables
6. Utilities
7. Types
8. Assets/styles

### Example
```typescript
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import UserCard from '~/components/UserCard.vue'
import { useAuth } from '~/composables/useAuth'
import { formatDate } from '~/utils/dateUtils'
import type { User } from '~/types/user'
```

## Git Commit Messages

### Format
```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Example
```
feat(cv): add download PDF functionality

Implemented PDF generation using jsPDF library with clean formatting
for ATS compatibility. PDF is limited to 2 pages maximum.

Closes #123
```

## Performance

- Lazy load components when possible using `defineAsyncComponent`
- Use `v-memo` for expensive list rendering
- Implement virtual scrolling for long lists
- Optimize images (WebP format, lazy loading)
- Use Vite's code splitting capabilities

## Accessibility

- Use semantic HTML elements
- Include ARIA labels where necessary
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

## Documentation

- Add JSDoc comments for complex functions
- Document component props and emits
- Keep README.md up to date
- Document any non-obvious logic

## Code Review Checklist

Before submitting code:
- [ ] No trailing spaces
- [ ] No semicolons (except in `<style scoped>`)
- [ ] Using tabs (size 4) for indentation
- [ ] All styles are scoped
- [ ] TypeScript types are defined
- [ ] Mobile-first approach used
- [ ] Tests written and passing
- [ ] No console.logs left in code
- [ ] Code is DRY and modular
- [ ] Follows naming conventions
