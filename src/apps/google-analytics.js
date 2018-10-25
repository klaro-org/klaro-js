import {cookies} from './helpers/google';



export default function(params) {
	return {
		name: 'google-analytics',
		title : 'Google Analytics',
		purposes : ['analytics'],
		cookies: cookies(params)
	};
};
