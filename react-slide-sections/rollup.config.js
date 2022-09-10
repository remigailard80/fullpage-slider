import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

const extensions = ["js", "jsx", "ts", "tsx"];
const external = ["react", "react-dom", /@babel\/runtime/];

process.env.BABEL_ENV = "production";

export const settings = {
  input: "./src/index.tsx",
  output: [
    {
      file: "./lib/index.cjs",
      format: "cjs",
      sourcemap: false,
    },
    {
      file: "./lib/index.mjs",
      format: "esm",
      sourcemap: false,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions }),
    babel({
      extensions,
      include: ["./src/**/*"],
      exclude: /node_modules/,
      babelHelpers: "runtime",
    }),
    commonjs({
      include: /node_modules/,
    }),
    typescript({ declaration: false, useTsconfigDeclarationDir: false }),
  ],
  external,
};

export default settings;
