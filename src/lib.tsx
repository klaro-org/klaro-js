import React from 'react';
import App from './components/app';
import ContextualConsentNotice from './components/contextual-consent-notice';
import ConsentManager from './consent-manager';
import KlaroApi from './utils/api';
import { injectStyles } from './utils/styling';
import { createRoot } from 'react-dom/client';
import { convertToMap, update } from './utils/maps';
import { t, language } from './utils/i18n';
import { themes } from './themes';
import { currentScript, dataset, applyDataset } from './utils/compat';
export { update as updateConfig } from './utils/config';
import './scss/klaro.scss';

let defaultConfig: any;
const defaultTranslations = new Map([]);
const eventHandlers: { [key: string]: Function[] } = {};
const events: { [key: string]: any[][] } = {};

export interface Translations {
  apps: any;
  services: any;
}

export interface Config {
  elementID?: string;
  translations?: Translations;
  services?: Service[];
  apps?: Service[];
  fallbackLang?: string;
  [key: string]: any;
}

export interface Service {
  name: string;
  [key: string]: any;
}

export function getElementID(config: Config, ide?: boolean): string {
  return (config.elementID || 'klaro') + (ide ? '-ide' : '');
}

export function getElement(config: Config, ide?: boolean): HTMLElement {
  const id = getElementID(config, ide);
  let element = document.getElementById(id);
  if (element === null) {
    element = document.createElement('div');
    element.id = id;
    document.body.appendChild(element);
  }
  return element as HTMLElement;
}

export function addEventListener(eventType: string, handler: (...args: any[]) => boolean | void): void {
  if (eventHandlers[eventType] === undefined) eventHandlers[eventType] = [handler];
  else eventHandlers[eventType].push(handler);
  if (events[eventType] !== undefined)
    for (const event of events[eventType]) if (handler(...event) === false) break;
}

function executeEventHandlers(eventType: string, ...args: any[]): boolean | void {
  const handlers = eventHandlers[eventType];
  if (events[eventType] === undefined) events[eventType] = [args];
  else events[eventType].push(args);
  if (handlers !== undefined)
    for (const handler of handlers) {
      if (handler(...args) === true) return true;
    }
}

const roots: any[] = [];
function getRoot(element: any): any {
  let root: any;
  for(const existingRoot of roots){
    if (existingRoot.element === element)
      return existingRoot.root;
  }
  root = createRoot(element)
  roots.push({root: root, element: element})
  return root;
}

export function getConfigTranslations(config: Config): Map<any, any> {
  const trans = new Map([]);
  update(trans, defaultTranslations);
  update(trans, convertToMap(config.translations || {}));
  return trans;
}


let cnt = 1;
export function render(config: Config, opts: any = {}): React.Component | void {

  if (config === undefined) return;
  config = validateConfig(config);

  executeEventHandlers('render', config, opts);

  let showCnt = 0;
  if (opts.show) showCnt = cnt++;
  const element = getElement(config);
  const manager = getManager(config);

  if (opts.api !== undefined) manager.watch(opts.api);

  injectStyles(config, themes, element);

  const lang = language(config);
  const configTranslations = getConfigTranslations(config);
  const tt = (...args: any[]) => t(configTranslations, lang, config.fallbackLang || 'zz', ...args);

  const root = getRoot(element)
  const app = root.render(
    <App
      t={tt}
      lang={lang}
      manager={manager}
      config={config}
      testing={opts.testing}
      modal={opts.modal}
      api={opts.api}
      show={showCnt}
    />);


  renderContextualConsentNotices(manager, tt, lang, config, opts);
  return app;
}

export function renderContextualConsentNotices(
  manager: any,
  tt: (...args: any[]) => string,
  lang: string,
  config: Config,
  opts: any
) {
  for (const service of config.services || []) {
    const consent = manager.getConsent(service.name) && manager.confirmed;
    const elements = document.querySelectorAll("[data-name='" + service.name + "']");
    for(let i=0;i < elements.length; i++){
      const element = elements[i];
      const ds: any = dataset(element as HTMLElement);
      if (ds.type === 'placeholder') continue;
      if (element.tagName === 'IFRAME' || element.tagName === 'DIV') {
        let placeholderElement = element.previousElementSibling as HTMLElement | null;
        if (placeholderElement !== null) {
          const ds: any = dataset(placeholderElement);
          if (ds.type !== 'placeholder' || ds.name !== service.name) placeholderElement = null;
        }
        if (placeholderElement === null) {
          placeholderElement = document.createElement('DIV');
          placeholderElement.style.maxWidth = element.getAttribute('width') + 'px';
          placeholderElement.style.height = element.getAttribute('height') + 'px';
          applyDataset({ type: 'placeholder', name: service.name }, placeholderElement);
          if (consent) placeholderElement.style.display = 'none';
          element.parentElement!.insertBefore(placeholderElement, element);
          const root = getRoot(placeholderElement);
          const notice = root.render(
              <ContextualConsentNotice
              t={tt}
              lang={lang}
              manager={manager}
              config={config}
              service={service}
              style={ds.style}
            />);
        }
        if (element instanceof HTMLIFrameElement) {
          ds['src'] = element.src;
        }
        if (ds['modified-by-klaro'] === undefined && (element.getAttribute('style')! as any || {}).display === undefined)
          ds['original-display'] = (element.getAttribute('style')! as any || {}).display;
        ds['modified-by-klaro'] = 'yes';
        applyDataset(ds, element as HTMLElement);
        if (!consent) {
          element.setAttribute('src', '');
          element.setAttribute('style', 'display: none;');
        }
      }
    }
  }
}

function showKlaroIDE(script: HTMLScriptElement): void {
  const baseName = /^(.*)(\/[^/]+)$/.exec(script.src)?.[1] || '';
  const element = document.createElement('script');
  element.src = baseName !== '' ? baseName + '/ide.js' : 'ide.js';
  element.type = "application/javascript";
  document.head.appendChild(element);
}

function doOnceLoaded(handler: () => void): void {
  if (/complete|interactive|loaded/.test(document.readyState)) {
    handler();
  } else {
    window.addEventListener('DOMContentLoaded', handler);
  }
}

function getKlaroId(script: HTMLScriptElement): string | null {
  const klaroId = script.getAttribute('data-klaro-id');
  if (klaroId !== null) return klaroId;
  const regexMatch = /.*\/privacy-managers\/([a-f0-9]+)\/klaro.*\.js/.exec(script.src);
  if (regexMatch !== null) return regexMatch[1];
  return null;
}

function getKlaroApiUrl(script: HTMLScriptElement): string | null {
  const klaroApiUrl = script.getAttribute('data-klaro-api-url');
  if (klaroApiUrl !== null) return klaroApiUrl;
  const regexMatch = /(http(?:s)?:\/\/[^/]+)\/v1\/privacy-managers\/([a-f0-9]+)\/klaro.*\.js/.exec(script.src);
  if (regexMatch !== null) return regexMatch[1];
  return null;
}

function getKlaroConfigName(hashParams: Map<string, string | boolean>, script: HTMLScriptElement): string {
  if (hashParams.has('klaro-config')) {
    return hashParams.get('klaro-config')! as string;
  }
  const klaroConfigName = script.getAttribute('data-klaro-config');
  if (klaroConfigName !== null) return klaroConfigName;
  return 'default';
}

function getHashParams(): Map<string, string | boolean> {
  return new Map(decodeURI(location.hash.slice(1)).split("&").map(kv => kv.split("=")).map((kv) : [string, string | boolean] => (kv.length === 1 ? [kv[0], true] : [kv[0], kv[1]])));
}

export function validateConfig(config: Config): Config {
  const validatedConfig: Config = { ...config };
  if (validatedConfig.version === 2) return validatedConfig;
  if (validatedConfig.apps !== undefined && validatedConfig.services === undefined) {
    validatedConfig.services = validatedConfig.apps;
    console.warn("Warning, your configuration file is outdated. Please change `apps` to `services`");
    delete validatedConfig.apps;
  }
  if (validatedConfig.translations !== undefined) {
    if (validatedConfig.translations.apps !== undefined && validatedConfig.translations.services === undefined) {
      validatedConfig.translations.services = validatedConfig.translations.apps;
      console.warn("Warning, your configuration file is outdated. Please change `apps` to `services` in the `translations` key");
      delete validatedConfig.translations.apps;
    }
  }
  return validatedConfig;
}

export function setup(config?: Config): void {
  if (typeof window === 'undefined') return;
  const script = currentScript("klaro") as HTMLScriptElement;
  if (!script) return;


  const hashParams = getHashParams();
  const testing = hashParams.get('klaro-testing') === 'true';

  const initialize = (opts: any) => {
    const fullOpts = { ...opts, testing };
    if (!defaultConfig.noAutoLoad && (!defaultConfig.testing || fullOpts.testing)) render(defaultConfig, fullOpts);
  };


  if (config !== undefined) {
    defaultConfig = config;
    doOnceLoaded(() => initialize({}));
  } else if (script !== null) {
    const klaroId = getKlaroId(script);
    const klaroApiUrl = getKlaroApiUrl(script);
    const klaroConfigName = getKlaroConfigName(hashParams, script);

    if (klaroId !== null){
            // we initialize with an API backend
            const api = new KlaroApi(klaroApiUrl, klaroId, {testing: testing})
            if ((window as any).klaroApiConfigs !== undefined){
                // the configs were already supplied with the Klaro binary

                if (executeEventHandlers("apiConfigsLoaded", (window as any).klaroApiConfigs, api) === true){
                    return
                }

                const config: any = (window as any).klaroApiConfigs.find((config: any): boolean => config.name === klaroConfigName && (config.status === 'active' || testing))

                if (config !== undefined){
                    defaultConfig = config
                    doOnceLoaded(() => initialize({api: api}))
                } else {
                    executeEventHandlers("apiConfigsFailed", {})
                }

            } else {
                // we load the configs separately...
                api.loadConfig(klaroConfigName).then((config) => {

                    // an event handler can interrupt the initialization, e.g. if it wants to perform
                    // its own initialization given the API configs
                    if (executeEventHandlers("apiConfigsLoaded", [config], api) === true){
                        return
                    }
                    defaultConfig = config
                    doOnceLoaded(() => initialize({api: api}))

                }).catch((err) => {
                    console.error(err, "cannot load Klaro configs")
                    executeEventHandlers("apiConfigsFailed", err)
                })
            }
        } else {
            // we initialize with a local config instead
            const configName = script.getAttribute('data-klaro-config') || "klaroConfig"
            defaultConfig = (window as any)[configName];
            if (defaultConfig !== undefined)
                doOnceLoaded(() => initialize({}))
        }
  }

  if (hashParams.has('klaro-ide')) {
    showKlaroIDE(script);
  }
}

export function show(config?: Config, modal?: boolean, api?: any): boolean {
  config = config || defaultConfig;
  render(config!, { show: true, modal, api });
  return false;
}

// Consent Managers
interface Managers {
  [key: string]: ConsentManager;
}

const managers: Managers = {};

export function resetManagers(): void {
  for (const key of Object.keys(managers)) {
    delete managers[key];
  }
}

export function getManager(config?: Config): ConsentManager {
  if (config === undefined)
    config = defaultConfig!;
  const name = config!.storageName || config!.cookieName || 'default'; // deprecated: cookieName
  if (!managers[name]) {
    managers[name] = new ConsentManager(validateConfig(config!));
  }
  return managers[name];
}

declare var VERSION: string;

export function version(): string {
  return VERSION[0] === 'v' ? VERSION.slice(1) : VERSION;
}

export { language, defaultConfig, defaultTranslations };