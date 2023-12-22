


/** @type {import("prettier").Config} */
const config = {
    plugins: [
        'prettier-plugin-tailwindcss',
        'prettier-plugin-astro'
    ],
    overrides: [
        {
            files: "*.astro",
            options: { parser: "astro" }
        }
    ],
    trailingComma: "es5",
    tabWidth: 4,
    semi: false,
    singleQuote: true,
};

export default config;