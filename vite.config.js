import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADICIONE A SEGUINTE LINHA DENTRO DO defineConfig({})
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/, // Isso garante que .js e .jsx sejam tratados como JSX em src/
    exclude: [],
  },
  // OU, se a versão do Vite for mais antiga e não aceitar 'esbuild', pode ser assim:
  // optimizeDeps: {
  //   esbuildOptions: {
  //     loader: {
  //       '.js': 'jsx',
  //     },
  //   },
  // },
});
