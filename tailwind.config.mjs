
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		container: {
			center: true
		},
		extend: {

			colors: {
				iqraelitext: '#d29f7e',
				primary: "#6b6e64"
			},
			fontFamily: {
				sans: ["Uthman", "Uthman", "sans-serif"],
				decorative: ["Noto Nastaliq Urdu"]
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		// ...
	],

}
