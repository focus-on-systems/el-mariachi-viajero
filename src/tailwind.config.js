module.exports = {
	darkMode: "class",
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true
	},
	purge: {
		enabled: process.env.NODE_ENV === "production",
		content: [
			"./app/**/*.html",
			"./app/**/*.ts",
		]
	},
	theme: {
		extend: {
			transitionProperty: {
				"b-radius": "border-radius"
			}
		},
	},
	variants: {
		extend: {
			borderRadius: ["hover"]
		}
	},
	plugins: [],
}
