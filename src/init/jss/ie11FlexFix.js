// tslint:disable no-console
import {isArray} from 'lodash'

function iterate(prop, val) {
	if (prop === 'flex' && isArray(val) && val[2] === 0) {
		return [val[0], val[1], '0px']
	} else if (prop === 'flex-basis' && val === 0) {
		return '0px'
	} else {
		return val
	}
}

export default function ie11FlexFix() {
	function onProcessStyle(style, rule) {
		if (rule.type !== 'style') {
			return style
		}

		for (var prop of Object.keys(style)) {
			style[prop] = iterate(prop, style[prop])
		}

		return style
	}

	function onChangeValue(value, prop) {
		return iterate(prop, value)
	}

	return {onProcessStyle, onChangeValue}
}