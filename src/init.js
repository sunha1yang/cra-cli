const { join, basename } = require('path')
const vfs = require('vinyl-fs')
const { renameSync } = require('fs')
const through = require('through2')
const { sync} = require('empty-dir')
const leftPad  = require('left-pad')
const chalk  = require('left-chalk')

function info(type, message) {
  console.log(`${chalk.green.bold(leftPad(type, 12))}  ${message}`)
}

function error(message) {
  console.error(chalk.red(message))
}

function success(message) {
  console.error(chalk.green(message))
}

function init({ ts, install }) {
  console.log(ts)
  const type = ts ? 'ts' : 'js'
  const cwd = join(__dirname, '../boilerplates', type)
  const dest = process.cwd()
  const projectName = basename(dest)

  if (!sync(dest)) {
    error('Existing files here, please run init command in an empty folder!')
    process.exit(1)
  }

  console.log(`Creating a new react app in ${dest}.`)
  console.log()

  vfs
    .src(['**/*', '!node_modules/**/*'], { cwd: cwd, cwdbase: true, dot: true })
    .pipe(template(dest, cwd))
    .pipe(vfs.dest(dest))
    .on('end', function() {
      info('rename', 'gitignore -> .gitignore')
      renameSync(join(dest, 'gitignore'), join(dest, '.gitignore'))
      printSuccess()
    })
    .resume()

  function printSuccess() {
    success(`
Success! Created ${projectName} at ${dest}.
We suggest that you begin by typing:
  cd ${dest}
  npm start
Happy hacking!`)
  }
}

function template(dest, cwd) {
  return through.obj(function(file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb()
    }

    info('create', file.path.replace(cwd + '/', ''))
    this.push(file)
    cb()
  })
}

export default init
