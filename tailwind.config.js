/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brandpink: "oklch(0.73 0.1752 349.76)",
                brandviolet: "oklch(0.68 0.1583 276.93)",
                brandyellow: "oklch(0.86 0.1731 91.94)",
                brandpurple: "oklch(0.71 0.1592 293.54)"
            },
        },
    },
    plugins: [],
}
