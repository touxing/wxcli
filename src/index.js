#!/usr/bin/env node
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'
import shelljs from 'shelljs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
function normarizePath(dir) {
  return dir.replace(/\\/g, '/')
}

const templatePath = './template'
const filePath = './src'
const fileType = ['.wxml', '.js', '.json', '.scss']
const encoding = 'utf-8'

const commandMap = {
  open: '打开小程序',
  build: '打包',
  preview: '预览',
  upload: '上传',
}
const envMap = {
  production: '生产',
  test: '测试',
  dev: '开发',
}

const resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}

const resolvePath = (dir) => {
  return path.join(process.cwd(), dir)
}

const init = () => {
  console.log(
    chalk.bold.green(
      figlet.textSync('MINIAPP CLI', {
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  )
}

const askQuestions = () => {
  const questions = [
    {
      type: 'rawlist',
      name: 'Command',
      message: '请选择执行',
      choices: [
        commandMap.open,
        commandMap.build,
        commandMap.preview,
        commandMap.upload,
      ],
      default: commandMap.open,
    },
    {
      type: 'rawlist',
      name: 'Env',
      message: '请选择环境',
      choices: [envMap.production, envMap.test, envMap.dev],
      default: envMap.production,
    },
  ]
  return inquirer.prompt(questions)
}

const askQuestions2 = () => {
  const questions = [
    {
      type: 'input',
      name: 'Version',
      message: '请输入版本号(eg: 2.0.1)',
      default: '2.0.1',
    },
    {
      type: 'input',
      name: 'Desc',
      message: '请输入项目备注',
      default: 'timestamp:' + Date.now(),
    },
  ]
  return inquirer.prompt(questions)
}

const askQuestions3 = () => {
  const questions = [
    {
      type: 'list',
      name: 'Create',
      message: '请选择要创建的类型',
      choices: ['页面', '组件'],
    },
    {
      type: 'input',
      name: 'Input',
      message: '请输入文件路径和名称（相对src路径：例如 pages/demo）',
    },
  ]
  return inquirer.prompt(questions)
}

// 递归创建目录
const mkdir = (dirname, callback) => {
  if (fs.existsSync(dirname)) {
    console.log(chalk.red(`${dirname} 文件已存在`))
    callback(fs.existsSync(dirname))
  } else {
    mkdir(resolvePath(path.dirname(dirname)), function () {
      fs.mkdir(dirname, callback)
    })
  }
}
const rsyncData = async (Type, Input, template) => {
  mkdir(resolvePath(`${filePath}/${Input}`), (err) => {
    if (err) {
      console.log(chalk.red(`创建组件失败 --- ${filePath}/${Input}`))
      return
    }
    console.log(chalk.green(`${filePath}/${Input}文件夹创建成功`))
    fileType.map((item) => {
      fs.readFile(
        resolve(`${templatePath}/${template}/${template}${item}`),
        { encoding },
        function (error, msg) {
          if(error) {
            console.log(chalk.red(error))
            return false
          }
          let fileName = path.basename(Input)
          fs.writeFile(
            resolve(`${filePath}/${Input}/${fileName}${item}`),
            msg,
            encoding,
            function (error) {
              if (error) {
                console.log(chalk.red(error))
                return false
              }
              console.log(
                chalk.green(`${filePath}/${Input}/${fileName}${item}创建成功`)
              )
            }
          )
        }
      )
    })
  })
}
const createTemplate = async () => {
  const answers = await askQuestions3()
  const { Create, Input } = answers
  let Type
  let template = ''
  switch (Create) {
    case '页面':
      Type = 'pages'
      template = 'pages'
      break
    case '组件':
      Type = 'components'
      template = 'components'
      break
  }
  await rsyncData(Type, Input, template)
}

const open = (output) => {
  shelljs.exec(`cli open --project ${output}`)
}
const build = () => {
  shelljs.exec(`yarn build`)
}
const preview = (output) => {
  shelljs.exec(`cli preview --qr-size small --project ${output}`)
}
const upload = (output, version, desc) => {
  shelljs.exec(
    `cli upload -v ${version} -d "${desc}" --project ${output}`.replace(
      /\$/g,
      ''
    )
  )
}

const wxcli = async () => {
  const answers = await askQuestions()
  const { Command, Env } = answers

  let output = ''
  switch (Env) {
    case envMap.production:
      output = resolvePath('./dist/prod')
      break
    case envMap.test:
      output = resolvePath('./dist/test')
      break
    case envMap.dev:
      output = resolvePath('./dist/dev')
      break
  }
  switch (Command) {
    case commandMap.open:
      open(output)
      break
    case commandMap.build:
      build()
      break
    case commandMap.preview:
      preview(output)
      break
    case commandMap.upload:
      const { Version, Desc } = await askQuestions2()
      upload(output, Version, Desc)
      break
    default:
      break
  }
}

// run()
let args = yargs(hideBin(process.argv))
  .default('help', function () {
    init()
    yargs().showHelp()
  })
  // .command('$0', 'the default command', () => {}, (argv) => {
  //   console.log('this command will be run by default')
  //   yargs().showHelp()
  // })
  // .command(
  //   'serve [port]',
  //   'start the server',
  //   (yargs) => {
  //     return yargs.positional('port', {
  //       describe: 'port to bind on',
  //       default: 5000,
  //     })
  //   },
  //   (argv) => {
  //     if (argv.verbose) console.info(`start server on :${argv.port}`)
  //     console.log(argv)
  //     // serve(argv.port)
  //   }
  // )
  .command(
    'create',
    'create page or component from template',
    (yargs) => {},
    (argv) => {
      createTemplate()
    }
  )
  .command(
    'run',
    'interactively run commands',
    (yargs) => {},
    (argv) => {
      wxcli()
    }
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  // .option('size', {
  //   alias: 's',
  //   describe: 'choose a size',
  //   choices: ['xs', 's', 'm', 'l', 'xl'],
  // })
  .help()
  .parse()
