<template>
	<div>
		<NuxtPage />
	</div>
</template>

<script setup lang="ts">
	useHead({
		htmlAttrs: {
			lang: 'en'
		},
		link: [
			{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
		]
	})
</script>
