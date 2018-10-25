export function cookies(params) {
	const cookies = [
		'_ga',
		'_gat',
		'_gid',
		'__utma',
		'__utmb',
		'__utmc',
		'__utmt',
		'__utmz'
	];
	if (params && params.ua) {
		cookies.push(`_gat_gtag_${params.ua}`, `_gat_${params.ua}`);
	}
	return cookies;
}
