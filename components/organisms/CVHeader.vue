<template>
	<header class="cv-header">
		<div class="container">
			<ContactInfo :contact-info="contactInfo" />
			
			<div class="cv-header__actions no-print">
				<AppButton
					label="Download PDF"
					icon="mdi-download"
					color="primary"
					:loading="isDownloading"
					@click="handleDownload"
				/>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import type { ContactInformation } from '~/types/cv'
	import ContactInfo from '~/components/molecules/ContactInfo.vue'
	import AppButton from '~/components/atoms/AppButton.vue'

	interface Props {
		contactInfo: ContactInformation
	}

	defineProps<Props>()

	interface Emits {
		(e: 'download'): void
	}

	const emit = defineEmits<Emits>()

	const isDownloading = ref(false)

	const handleDownload = async () => {
		isDownloading.value = true
		emit('download')
		setTimeout(() => {
			isDownloading.value = false
		}, 2000)
	}
</script>

<style scoped>
	.cv-header {
		background: var(--background);
		border-bottom: 2px solid var(--border-color);
		padding: 2rem 0;
	}

	.cv-header__actions {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}

	@media (min-width: 768px) {
		.cv-header {
			padding: 3rem 0;
		}
	}
</style>
