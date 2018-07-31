export function createCssNamespace(namespace) {
	return function ns(classNames) {
		const splitClassNames = classNames.split(' ')
		return splitClassNames.map(className => `${namespace}-${className}`).join(' ')
	};
}
