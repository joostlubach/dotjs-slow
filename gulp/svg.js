const Gulp = require('gulp')
const sketch = require('gulp-sketch')
const cheerio = require('gulp-cheerio')
const config = require('./config')
const FS = require('fs-extra')

function stripFill($) {
	$('[fill]').each(function () {
		const id = $(this).attr('id') || ''
		let shouldSkip =
			id.startsWith('!') ||
			$(this).closest('[id^="!"]').length > 0

		if (!shouldSkip) {
			$(this).removeAttr('fill')
		}
	})

	$('[id^="!"]').each(function () {
		const id = $(this).attr('id')
		$(this).attr('id', id.replace(/^![-\s]+/, ''))
	})
}

function writeManifest(files) {
	const lines = []

	lines.push('// tslint:disable no-var-requires')
	lines.push('export default {')

	lines.push(...files.sort().map(basename => {
		const path = config.svg.manifestImagePath(basename)
		const svgName = basename.replace(/\.[^.]*$/, '')
		return `  ${JSON.stringify(svgName)}: require(${JSON.stringify(path)}),`
	}))
	lines.push('}')

	FS.writeFileSync(config.svg.manifestFile, lines.join('\n'))
}

function svg() {
	const files = new Set()

	return Gulp
		.src(config.svg.sketch)
		.pipe(sketch({
			export:  'artboards',
			formats: 'svg'
		}))
		.pipe(cheerio({
			run:           stripFill,
			parserOptions: { xmlMode: true }
		}))
		.pipe(Gulp.dest(config.svg.out))
		.on('data', (file) => { files.add(file.basename) })
		.on('end', () => { writeManifest(Array.from(files)) })
}

svg.watch = function watch() {
	Gulp.watch(config.svg.sketch, svg)
}

module.exports = svg