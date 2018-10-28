import JSS from 'jss'
import colors from './colors'
import ie11FlexFix from './ie11FlexFix'

import extend from 'jss-extend'
import nested from 'jss-nested'
import camelCase from 'jss-camel-case'
import defaultUnit from 'jss-default-unit'
import vendorPrefixer from 'jss-vendor-prefixer'
import propsSort from 'jss-props-sort'
import compose from 'jss-compose'
import expand from 'jss-expand'
import global from 'jss-global'

JSS.setup({
	plugins: [
		global(),
		extend(),
		colors(),
		nested(),
		compose(),
		camelCase(),
		vendorPrefixer(),
		ie11FlexFix(),
		defaultUnit(),
		expand(),
		propsSort()
	]
})