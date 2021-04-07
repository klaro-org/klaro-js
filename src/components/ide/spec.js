const KlaroConfigSpec = {
    cookieConfig: [
        {
            name: 'pattern',
            control: 'RetractingLabelInput',
            validators: [],
        },
        {
            name: 'path',
            control: 'RetractingLabelInput',
            validators: [],
        },
        {
            name: 'domain',
            control: 'RetractingLabelInput',
            validators: [],
        },
    ],
    serviceConfig: [
        {
            name: 'name',
            control: 'RetractingLabelInput',
            validators: [],
            default: 'klaro',
        },
        {
            name: 'purposes',
            control: 'PurposeSelect',
            validators: [],
            default: 'klaro',
        },
        {
            name: 'default',
            control: 'Switch',
            validators: [],
            default: true,
        },
        {
            name: 'required',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'optOut',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'onlyOnce',
            control: 'Switch',
            default: false,
            validators: [],
        },
        {
            name: 'cookies',
            control: 'Cookies',
            validators: [],
        },
    ],
    styling: [
        {
            name: 'theme',
            control: 'ThemesSelect',
            validators: [],
            default: [],
        },
    ],
    globals: [
        {
            name: 'languages',
            control: 'LanguageSelect',
            validators: [],
            default: '',
        },
        {
            name: 'elementID',
            control: 'RetractingLabelInput',
            validators: [],
            default: 'klaro',
        },
        {
            name: 'additionalClass',
            control: 'RetractingLabelInput',
            validators: [],
            default: '',
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
            control: 'RetractingLabelInput',
            validators: [],
            default: 'klaro',
        },
        {
            name: 'cookieDomain',
            applicable: (config) => config.storageMethod === 'cookie',
            control: 'RetractingLabelInput',
            validators: [],
            default: '',
        },
        {
            name: 'cookiePath',
            applicable: (config) => config.storageMethod === 'cookie',
            control: 'RetractingLabelInput',
            validators: [],
            default: '',
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
            name: 'hideToggleAll',
            control: 'Switch',
            validators: [],
            default: false
        },
        {
            name: 'noticeAsModal',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'disablePoweredBy',
            control: 'Switch',
            validators: [],
            default: false,
        },
        {
            name: 'purposeOrder',
            control: 'PurposeOrder',
            validators: [],
            default: [],
        },
    ],
    groups: {},
};

export default KlaroConfigSpec;
