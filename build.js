#!/usr/bin/env node
const esbuild = require('esbuild')
const child_process = require('child_process')
const { future } = require('fp-future')
const { builtinModules } = require('module')

const WATCH_MODE = process.argv.includes('--watch')
const PRODUCTION = process.argv.includes('--production')

// the following modules will not be embedded in the NodeJs bundle.
// we create a bundle because many dependencies are exported as ESM and Node
// is not ready yet to support them OOTB
const externalModulesArray = getNotBundledModules()

async function buildCommonJsDistributable() {
  const context = await esbuild.context({
    entryPoints: ['src/index.ts'],
    bundle: true,
    format: 'cjs',
    platform: 'browser',
    outfile: 'dist/index.js',
    sourcemap: 'linked',
    minify: false,
    treeShaking: true,
    external: externalModulesArray
  })

  await runTypeChecker()

  if (WATCH_MODE) {
    await context.watch()
  } else {
    console.time(`> Building NodeJs bundle`)
    await context.rebuild()
    await context.dispose()
    console.timeEnd(`> Building NodeJs bundle`)
  }
}

buildCommonJsDistributable().catch(err => {
  process.exitCode = 1
  console.error(err)
  process.exit(1)
})

function runTypeChecker() {
  const args = [require.resolve('typescript/lib/tsc'), '-p', 'tsconfig.json']
  if (WATCH_MODE) args.push('--watch')

  console.time('> Running typechecker')
  const ts = child_process.spawn('node', args, { env: process.env, cwd: process.cwd(), encoding: 'utf8' })
  const typeCheckerFuture = future()

  ts.on('close', (code) => {
    console.timeEnd('> Running typechecker')
    console.log('  Type checker exit code:', code)
    if (code !== 0) {
      typeCheckerFuture.reject(new Error(`Typechecker exited with code ${code}.`))
      return
    }

    typeCheckerFuture.resolve(code)
  })

  ts.stdout.pipe(process.stdout)
  ts.stderr.pipe(process.stderr)

  if (WATCH_MODE) {
    typeCheckerFuture.resolve()
  }

  return typeCheckerFuture
}

function getNotBundledModules() {
  // || true is added because `npm ls` fails installing a package from S3
  const child = child_process.execSync("npm ls --all --production --json || true", {})
  const ret = JSON.parse(child.toString())

  const externalModules = new Set()
  function traverseDependencies(obj) {
    if (obj.dependencies)
      for (let depName in obj.dependencies) {
        const dep = obj.dependencies[depName]
        externalModules.add(depName)
        traverseDependencies(dep)
      }
  }
  traverseDependencies(ret)

  // now remove the ESM dependencies
  const esmModulesToBundle = ['ipfs-unixfs-importer', 'multiformats']
  return Array.from(externalModules).concat(builtinModules).filter($ => !esmModulesToBundle.includes($))
}