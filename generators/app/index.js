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
        message: 'excel文件的路径?'
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

    const files = xlsx.parse(this.props.excelPath);
    files.shift();

    // console.log('files: ',files);
    console.log('files: ',files[0].data[2]);

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
    console.log('assArr: ',assArr);
    fs.writeFileSync(this.destinationPath('models.js'),commonTemp);

    let assTemp = fs.readFileSync(this.templatePath('association.ejs'), 'utf8');
    assTemp = ejs.render(assTemp, {
      assArr: assArr
    });
    fs.writeFileSync(this.destinationPath('association.js'),assTemp);
  }

};
