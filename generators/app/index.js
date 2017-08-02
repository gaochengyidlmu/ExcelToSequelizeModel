const
   Generator = require('yeoman-generator')
  ,chalk = require('chalk')
  ,yosay = require('yosay')
  ,fs = require('fs')
  ,ejs = require('ejs')
  ,process = require('process')
  ,xlsx = require('node-xlsx')
  ,common = require('./common')
;

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    super(args, opts);

    this.option('babel'); // This method adds support for a `--babel` flag
  }
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the fabulous ' + chalk.red('generator-modelFile') + ' gcy_generator!!'
    ));

    let prompts = [
      {
        type: 'input',
        name: 'excelPath',
        message: "excel文件的路径(多个文件以','分隔)?"
      }

    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  writeFile() {
    this.log('begin to write...');
    this.log('this.props: ',this.props);
    this.log('path1: ',this.templatePath('index.ejs'));
    this.log('path1: ',this.destinationPath());

    let files = [];
    let pathArr = this.props.excelPath.split(',');
    pathArr.forEach((item) => {
      files = [...files, ...xlsx.parse(item)]
    })
    
    files.shift();

    let indexTemp = fs.readFileSync(this.templatePath('index.ejs'), 'utf8');
    indexTemp = ejs.render(indexTemp, {});
    fs.writeFileSync(this.destinationPath('index.js'),indexTemp);

    let commonTemp = fs.readFileSync(this.templatePath('models.ejs'), 'utf8');
    let assArr = [];
    commonTemp = ejs.render(commonTemp, {
      files: files,
      common: common,
      cb: function (data) {
        assArr = data
      }
    });
    fs.writeFileSync(this.destinationPath('models.js'),commonTemp);

    let assTemp = fs.readFileSync(this.templatePath('association.ejs'), 'utf8');
    assTemp = ejs.render(assTemp, {
      assArr: assArr
    });
    fs.writeFileSync(this.destinationPath('association.js'),assTemp);
    this.log('Success!')
  }

};
