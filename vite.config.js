import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
	alias: {
		'@': path.resolve(__dirname, './src'),
	},
	plugins: [vue()],
});
