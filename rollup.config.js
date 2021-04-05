import typescript from "@rollup/plugin-typescript";
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: './src/pair-simmon.ts',
  output: { file: './pair-simmon.js', format: 'esm' },
  plugins: [typescript(), nodeResolve()]
}