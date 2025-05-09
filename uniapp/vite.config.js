import {
	defineConfig
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
export default defineConfig({
  plugins: [uni()],
  server: {
	  port: 8080,
    proxy: {
      "/aqixuan": {
        target: "http://localhost:9801",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/aqixuan/, ""),
      },
    },
  },
  
});
