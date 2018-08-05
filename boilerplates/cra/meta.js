const path = require('path')
const { installDependencies, runLintFix, printMessage, init } = require('./utils')

module.exports = {
  metalsmith: {
    after: init('create-react-app app')
  },
  helpers: {
    if_or(v1, v2, options) {
      console.log(v1)
      console.log(v2)
      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    }
  },

  prompts: {
    name: {
      type: 'string',
      required: false,
      message: 'Project folder',
      default: 'app'
    },
    description: {
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A Vue.js project'
    },
    author: {
      type: 'string',
      message: 'Author'
    },
    css: {
      type: 'list',
      message: 'css pre-processors',
      choices: [
        {
          name: 'less',
          value: 'less',
          short: 'less'
        },
        {
          name: 'sass',
          value: 'sass',
          short: 'sass'
        }
      ]
    },
    store: {
      type: 'list',
      message: 'state management',
      choices: [
        {
          name: 'mobx',
          value: 'mobx',
          short: 'mobx'
        },
        {
          name: 'redux',
          value: 'redux',
          short: 'redux'
        }
      ]
    }
  },
  filters: {
    // 'config-overrides': 'unit'
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    // sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    installDependencies(cwd, false, green)
      .then(() => {
        return runLintFix(cwd, data, green)
      })
      .then(() => {
        printMessage(data, green)
      })
      .catch(e => {
        console.log(chalk.red('Error:'), e)
      })
  }
}
