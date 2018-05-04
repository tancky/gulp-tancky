/**
 * Created by Tancky on 2018/5/4.
 */

let NODE_ENV = process.argv[2];

console.log(`>>当前构建的环境为：${NODE_ENV}模式！===========================`);

let gulp = require('gulp'),
    $ = require('gulp-load-plugins')(), // 自动加载以gulp-为前缀的插件
    px2rem = require('postcss-px2rem'), // postcss
    autoprefixer = require('autoprefixer'), // 自动添加浏览器前缀 gulp-autoprefixer已废弃
    browserSync = require('browser-sync').create(), //浏览器同步测试工具
    reload = browserSync.reload, //browserSync重载方法
    del = require('del'),  //del代替gulp-clean
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
    fonts: 'src/fonts/'
  },
  dev: {
    less: 'dev/less/',
    js: 'dev/js/',
    img: 'dev/img/',
    fonts: 'dev/fonts/'
  },
  build: {
    less: 'build/less/',
    js: 'build/js/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  }
}


// less编译/自动处理浏览器前缀/px2rem
gulp.task('less:dev', () => {
  var processors = [
    px2rem({
      remUnit: 75
    }),
    autoprefixer({
      browsers: ['last 5 versions']
    })
  ];
  return gulp.src(`${path.src.less}**/*.less`)
    .pipe($.less())
    .pipe($.postcss(processors))
    .pipe(gulp.dest(path.dev.less))
    .pipe(browserSync.reload({stream:true}))
})

// 清除dev目录
gulp.task('clean:dev', () => {
  return del([`${path.dev}*`])
})

// 压缩图片
gulp.task('min_img:dev', () => {
  return gulp.src(`${path.src.img}**/.*`)
    .pipe($.imagemin())
    .pipe(gulp.dest(path.dev.img))
    .pipe($.notify({
      message: '图片压缩成功'
    }))
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

// babel转码
gulp.task('babel:dev', () => {
  return gulp.src(`${path.src.js}**/*.js`)
    .pipe($.babel({
      presets: ['env']
    }))
    .pipe(gulp.dest(path.dev.js))
    .pipe($.notify({
      message: 'es6转码成功'
    }))
})

//sprite雪碧图合并...

//压缩html
gulp.task('min_html:dev', () => {
  return gulp.src(`${path.dir.src}index.html`)
    .pipe($.htmlMinify())
    .pipe(gulp.dest(path.dir.dev))
})

//watch 实时监听
gulp.task('serve:dev', () => {
  // 自动打开浏览器并实时监听文件改动
  browserSync.init({
    server: {
      baseDir: "src/"
    }
  });
  gulp.watch(`${path.dir.dev}**/*.*`).on('change', reload)
})

// 开发环境
gulp.task('dev', function (done) {
  run (
    ['min_html:dev', 'less:dev'],
    ['serve:dev'],
    done
  )
})