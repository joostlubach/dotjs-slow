function iterate(val) {
	// For some reason, "val instanceof Color" does not work (anymore).
	if (val instanceof Object && 'color' in val && typeof val.model === 'string') {
		return val.toString()
	} else if (Array.isArray(val)) {
		return val.map(iterate)
	} else if (val instanceof Object) {
		const res = {}
		for (let key of Object.keys(val)) {
			res[key] = iterate(val[key])
		}
		return res
	} else {
		return val
	}
}

export default function colors() {
	function onProcessStyle(style, rule) {
		if (rule.type !== 'style') {
			return style
		}

		for (var prop of Object.keys(style)) {
			style[prop] = iterate(style[prop])
		}

		return style
	}

	function onChangeValue(value, prop) {
		return iterate(value)
	}

	return {onProcessStyle, onChangeValue}
}