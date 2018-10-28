const Path = require('path')

const rootDir   = Path.resolve(__dirname, '..')
const resDir    = Path.join(rootDir, 'res')

module.exports = {

	svg: {
		sketch:            Path.join(resDir, 'slow-burgers.sketch'),
		manifestFile:      Path.join(resDir, 'svgs/index.ts'),
		manifestImagePath: basename => `./${basename}`,
		out:               Path.join(resDir, 'svgs')
	}

};
