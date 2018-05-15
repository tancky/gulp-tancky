/**
 * Created by Tancky on 2018/5/4.
 */

let NODE_ENV = process.argv[2];

console.log(`>>当前构建的环境为：${NODE_ENV}模式！===========================`);

let gulp = require('gulp'),
    $ = require('gulp-load-plugins')(), // 自动加载以gulp-为前缀的插件
    pxtoviewport = require('postcss-px-to-viewport'), // postcss
    px2rem = require('postcss-px2rem'),
    autoprefixer = require('autoprefixer'), // 自动添加浏览器前缀 gulp-autoprefixer已废弃
    browserSync = require('browser-sync').create(), //浏览器同步测试工具
    reload = browserSync.reload, //browserSync重载方法
    del = require('del'),  //del代替gulp-clean
    precompile = require('gulp-handlebars-precompile'),
    run = require('run-sequence'); //同步/异步执行gulp任务

// 读取gulp目录下所有的任务遍历后require引入,然后执行gulp任务
// fs.readdirSync('./gulp/').forEach((file) => {
//   require('./gulp/' + file)(gulp, $, NODE_ENV);
// });


// 配置目录结构
var path = {
  dir: {
    src: 'src/',
    dev: 'dev/',
    build: 'build/'
  },
  src: {
    less: 'src/less/',
    js: 'src/js/',
    img: 'src/img/',
    fonts: 'src/fonts/',
    static: 'src/static/'
  },
  dev: {
    css: 'dev/css/',
    js: 'dev/js/',
    img: 'dev/img/',
    fonts: 'dev/fonts/',
    static: 'dev/static/'
  },
  build: {
    css: 'build/css/',
    js: 'build/js/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  }
}

// 清除dev目录
gulp.task('clean:dev', () => {
  return del([`${path.dir.dev}*`])
})

//压缩html
gulp.task('html:dev', () => {
  return gulp.src(`${path.dir.src}index.html`)
    .pipe($.changed(`${path.dir.dev}index.html`, {hasChanged: $.changed.compareSha1Digest}))
    // .pipe($.htmlMinify())
    .pipe($.useref())
    .pipe(gulp.dest(path.dir.dev))
    .pipe(reload({stream:true}))
})

// less编译/自动处理浏览器前缀/压缩css
gulp.task('css:dev', () => {
  var processors = [
    // pxtoviewport({
    //   viewportWidth: 750,
    //   viewportHeight: 1334,
    //   unitPrecision: 5,
    //   viewportUnit: 'vw',
    //   selectorBlackList: [],
    //   minPixelValue: 1,
    //   mediaQuery: false
    // }),
    px2rem({remUnit: 75}),
    autoprefixer({
      browsers: ['iOS >= 7', 'Android >= 4.1']
    })
  ];
  return gulp.src(`${path.src.less}index.less`)
    .pipe($.changed(`${path.dir.dev}css/*.css`, {hasChanged: $.changed.compareSha1Digest}))
    .pipe($.less())
    .pipe($.postcss(processors))
    .pipe($.concat('app.min.css'))
    .pipe($.cleanCss())
    // .pipe($.rev())
    .pipe(gulp.dest(path.dev.css))
    // .pipe($.rev.manifest())
    // .pipe(gulp.dest('./rev/css'))
    .pipe(reload({stream:true}))
})

//压缩js
gulp.task("js:dev", function(){
  gulp.src(`${path.src.js}**/*.js`)
    .pipe($.plumber())
    .pipe($.changed(`${path.dir.dev}js/*.js`, {hasChanged: $.changed.compareSha1Digest}))
    .pipe($.babel({
      presets: ['env']
    }))
    .pipe($.concat('app.min.js'))
    .pipe($.uglify())
    // .pipe($.rev())
    .pipe(gulp.dest(path.dev.js))
    // .pipe($.rev.manifest())
    // .pipe(gulp.dest('./rev/js'))
    .pipe(reload({stream:true}))
});

// 压缩图片
gulp.task('img:dev', () => {
  return gulp.src(`${path.src.img}*.*`)
    // .pipe($.imagemin())
    .pipe(gulp.dest(path.dev.img))
})

//eslint代码检查
gulp.task('eslint:dev', () => {
  return gulp.src(`${path.src.js}**/*.js`)
    .pipe($.eslint())
    .pipe($.plumber())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
    .on("error", $.notify.onError({
      message: "具体错误请查看终端",
      title: "代码不规范"
    }))
})

//handlebars预编译
gulp.task('tpl:dev', function(){
  return gulp.src('src/*.html')
    .pipe(precompile({
      reg: /<!\-\-hbs\s+"([^"]+)"\-\->/g,
      baseSrc: "src/tpl/",
      dest: "dev/tpl/",
      scriptSrc: 'tpl/',
      inline: true,
      namespace: 'kevin'
    }))
    .pipe(gulp.dest('dev/'))
});

//自动上传服务器
gulp.task('ftp:dev', function () {
  return gulp.src('dev/**/*')
    .pipe($.ftp({
      host: '123.57.224.228',
      port: 21,
      user: 'tzl',
      pass: 'tzl@ilc#pgsq'
    }))
});
// md5
gulp.task('rev', () => {
  return gulp.src(['./rev/**/*.json', `${path.dir.dev}index.html`])
    .pipe($.revCollector())
    .pipe(gulp.dest(path.dir.dev))
})

// 自动将css/js文件注入html
gulp.task('inject:dev', () => {
  let target = gulp.src(`${path.dir.src}index.html`),
      source = gulp.src([`${path.dev.css}**/*.css`, `${path.dev.js}**/*.js`], {read: false})
  return target.pipe($.inject(source))
    .pipe(gulp.dest(`${path.dir.dev}`))
})
//watch 实时监听
gulp.task('server:dev', () => {
  // 自动打开浏览器并实时监听文件改动
  browserSync.init({
    server: {
      baseDir: "dev/"
    }
  });
  gulp.watch(`${path.dir.src}**/*.less`, ['css:dev'])
  gulp.watch(`${path.dir.src}js/*.js`, ['js:dev'])
  gulp.watch(`${path.dir.src}*.html`, ['html:dev'])
})

// 开发环境
gulp.task('dev', function (done) {
  run (
    ['clean:dev'],
    ['html:dev', 'css:dev', 'js:dev', 'img:dev'],
    ['server:dev'],
    done
  )
})

// 生产环境
gulp.task('build', function (done) {
  run (
    ['clean:dev'],
    ['html:dev', 'css:dev', 'js:dev', 'img:dev'],
    ['ftp:dev'],
    done
  )
})