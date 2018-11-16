import React from 'react'

export default function useLegacyLifecycleMethods() {
	const reactVersion = React.version.match(/(\d+)\.(\d+)*/)
	const major = reactVersion[1] * 1
	const minor = reactVersion[2] * 1
	return major <= 15 || (major === 16 && minor <= 2)
}
