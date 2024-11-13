#!/usr/bin/env node
const childProcess = require('node:child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const process = require('node:process');
const path = require('node:path');

async function main() {
  yargs(hideBin(process.argv))
    .scriptName('emotion-style-overload-codemod')
    .command(
      '$0 <paths...>',
      '',
      (builder) =>
        builder
          .positional('paths', {
            array: true,
            type: 'string',
          })
          .option('dry', {
            default: false,
            type: 'boolean',
          })
          .option('ignore-pattern', {
            default: '**/node_modules/**',
            type: 'string',
          })
          .demandOption(['paths']),
      async (argv) => {
        const { dry, paths, ignorePattern } = argv;
        const jscodeshiftBin = require.resolve(
          'jscodeshift/bin/jscodeshift.js',
        );

        const args = [
          '--extensions=tsx,ts',
          `--ignore-pattern=${ignorePattern}`,
          `--transform ${path.join(__dirname, '../transforms/emotion-style-overload-codemod.js')}`,
        ];

        if (dry) args.push('--dry');

        args.push(...paths);

        const command = `node ${jscodeshiftBin} ${args.join(' ')}`;
        console.info(`Running ${command}`);
        childProcess.execSync(command, { stdio: 'inherit' });
      },
    )
    .version()
    .strict(true)
    .help()
    .parse();
}

main().catch((error) => {
  console.error(error);
  process.exit();
});
