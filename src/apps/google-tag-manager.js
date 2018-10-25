import {cookies} from './helpers/google';



export default function(params) {
	return {
		name: 'google-tag-manager',
		title : 'Google Tag Manager',
		purposes : ['analytics'],
		cookies: cookies(params)
	};
};
