<template>
	<div class="contact-info">
		<div class="contact-info__primary">
			<h1 class="contact-info__name">{{ contactInfo.full_name }}</h1>
			<p class="contact-info__title">{{ contactInfo.professional_title }}</p>
		</div>

		<div class="contact-info__details">
			<div class="contact-info__item">
				<q-icon name="mdi-map-marker" color="primary" />
				<span>{{ contactInfo.location }}</span>
			</div>

			<div class="contact-info__item">
				<q-icon name="mdi-phone" color="primary" />
				<a :href="`tel:${contactInfo.phone_number}`">{{ contactInfo.phone_number }}</a>
			</div>

			<div class="contact-info__item">
				<q-icon name="mdi-email" color="primary" />
				<a :href="`mailto:${contactInfo.email_addresses[0]}`">
					{{ contactInfo.email_addresses[0] }}
				</a>
			</div>
		</div>

		<div class="contact-info__social">
			<SocialLink
				v-for="(url, platform) in contactInfo.links"
				:key="platform"
				:platform="formatPlatform(platform)"
				:url="url"
				:show-label="showLabels"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { ContactInformation } from '~/types/cv'
	import SocialLink from '~/components/atoms/SocialLink.vue'

	interface Props {
		contactInfo: ContactInformation
		showLabels?: boolean
	}

	withDefaults(defineProps<Props>(), {
		showLabels: false
	})

	const formatPlatform = (platform: string): string => {
		const formatted = platform
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
		return formatted
	}
</script>

<style scoped>
	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem 0;
	}

	.contact-info__primary {
		text-align: center;
	}

	.contact-info__name {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--primary-color);
		margin-bottom: 0.5rem;
	}

	.contact-info__title {
		font-size: 1.25rem;
		color: var(--text-light);
		margin: 0;
	}

	.contact-info__details {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: center;
	}

	.contact-info__item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.contact-info__item a {
		color: inherit;
		text-decoration: none;
	}

	.contact-info__item a:hover {
		color: var(--primary-color);
	}

	.contact-info__social {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* Tablet and up */
	@media (min-width: 768px) {
		.contact-info__details {
			flex-direction: row;
			justify-content: center;
			gap: 2rem;
		}

		.contact-info__name {
			font-size: 3rem;
		}
	}

	/* Desktop */
	@media (min-width: 1024px) {
		.contact-info {
			gap: 2rem;
		}

		.contact-info__social {
			gap: 1.5rem;
		}
	}
</style>
