// this loads Klaro with the default translations

export * from './lib'
import {setup, defaultTranslations} from './lib'
import translations from 'translations/index'
import {convertToMap, update} from 'utils/maps'

const convertedTranslations = convertToMap(translations)
// we add the default translations
update(defaultTranslations, convertedTranslations)

// we set up Klaro
setup()