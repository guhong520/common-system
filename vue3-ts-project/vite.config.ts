import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { visualizer } from "rollup-plugin-visualizer"; //打包分析
import minipic from "vite-plugin-minipic"; //图片压缩
import compression from "vite-plugin-compression"; //gzip压缩
const pathResolve = (dir: string) => resolve(__dirname, dir);
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: "src/components.d.ts",
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/svg")],
      symbolId: "icon-[dir]-[name]",
    }),
    visualizer({
      open: true, //在默认用户代理中打开生成的文件
      gzipSize: true, // 收集 gzip 大小并将其显示
      brotliSize: true, // 收集 brotli 大小并将其显示
      filename: "stats.html", // 分析图生成的文件名
    }),
    // 图片压缩
    minipic({}),
    // gzip压缩
    compression({
      algorithm: "gzip", // 指定压缩算法为gzip,[ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      ext: ".gz", // 指定压缩后的文件扩展名为.gz
      threshold: 10240, // 仅对文件大小大于threshold的文件进行压缩，默认为10KB
      deleteOriginFile: false, // 是否删除原始文件，默认为false
      filter: /\.(js|css|json|html|ico|svg)(\?.*)?$/i, // 匹配要压缩的文件的正则表达式，默认为匹配.js、.css、.json、.html、.ico和.svg文件
      compressionOptions: { level: 9 }, // 指定gzip压缩级别，默认为9（最高级别）
      verbose: true, //是否在控制台输出压缩结果
      disable: false, //是否禁用插件
    }),
  ],
  build: {
    minify: "terser", // 启用 terser 压缩
    terserOptions: {
      compress: {
        pure_funcs: ["console.log"], // 只删除 console.log
        //drop_console: true, // 删除所有 console
        drop_debugger: true, // 删除 debugger
      },
    },
    rollupOptions: {
      output: {
        // 最小化拆分包
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 通过拆分包的方式将所有来自node_modules的模块打包到单独的chunk中
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
        // 设置chunk的文件名格式
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split("/")
            : [];
          const fileName1 =
            facadeModuleId[facadeModuleId.length - 2] || "[name]";
          // 根据chunk的facadeModuleId（入口模块的相对路径）生成chunk的文件名
          return `js/${fileName1}/[name].[hash].js`;
        },
        // 设置入口文件的文件名格式
        entryFileNames: "js/[name].[hash].js",
        // 设置静态资源文件的文件名格式
        assetFileNames: "[ext]/[name].[hash:4].[ext]",
      },
    },
  },
  server: {
    port: 8081,
    open: true, //自动打开浏览器
    cors: true, //允许跨域
  },
  resolve: {
    alias: {
      "@": pathResolve("./src"),
    },
  },
});
