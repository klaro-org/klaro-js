const KlaroConfigSpec = {
    globals : [
        {
            name: 'elementID',
            control: 'Input',
            validators: [],
            default: 'klaro',
        },
        {
            name: 'htmlTexts',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'embedded',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'groupByPurpose',
            control: 'Switch',
            validators: [],
            default: true,
        },
        {
            name: 'storageMethod',
            control: 'Select',
            choices: ['cookie', 'localStorage'],
            validators: [],
            default: 'cookie',
        },
        {
            name: 'storageName',
            control: 'Input',
            validators: [],
            default: 'klaro',
        },
        {
            name: 'cookieExpiresAfterDays',
            applicable: (config) => config.storageMethod === 'cookie',
            control: 'Range',
            controlProps: {
                min: 0,
                max: 356,
            },
            validators: [],
            default: 60,
        },
        {
            name: 'cookieDomain',
            applicable: (config) => config.storageMethod === 'cookie',
            control: 'Input',
            validators: [],
            default: '',
        },
        {
            name: 'privacyPolicy',
            control: 'I18nInput',
            validators: [],
            controlProps: {
                default: true,
            },
        },
        {
            name: 'default',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'mustConsent',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'acceptAll',
            control: 'Switch',
            validators: [],
            default: true,
        },
        {
            name: 'hideDeclineAll',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'hideLearnMore',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'noticeAsModal',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'additionalClass',
            control: 'Input',
            validators: [],
            default: '',
        },
        {
            name: 'lang',
            control: 'LanguageSelect',
            validators: [],
            default: '',
        },
    ],
    groups: {

    }
}

export default KlaroConfigSpec
