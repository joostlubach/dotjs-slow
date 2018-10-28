const Gulp = require('gulp')

const svg = require('./svg')

Gulp.task('svg', svg)

Gulp.task('build', ['svg'])
Gulp.task('default', ['svg'], () => {
	svg.watch()
})