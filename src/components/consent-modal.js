import React from 'react';
import { Close } from './icons';
import Apps from './apps';

export default class ConsentModal extends React.Component {
  render() {
    const { hide, saveAndHide, config, manager, t } = this.props;

    let closeLink;
    if (!config.mustConsent)
      closeLink = (
        <button
          title={t(['close'])}
          className="btn-close"
          type="button"
          onClick={hide}
        >
          <Close t={t} />
        </button>
      );

    const ppLink = (
      <a
        onClick={e => {
          hide();
        }}
        href={config.privacyPolicy}
      >
        {t(['consentModal', 'privacyPolicy', 'name'])}
      </a>
    );
    return (
      <div className="cookie-modal">
        <div className="cm-bg" onClick={hide} />
        <div className="cm-modal">
          <div className="cm-header">
            {closeLink}
            <h1 className="title">{t(['consentModal', 'title'])}</h1>
            <p>{t(['consentModal', 'description'])}</p>
          </div>
          <div className="cm-body">
            <Apps t={t} config={config} manager={manager} />
          </div>
          <div className="cm-footer">
            <button
              className="btn btn-success"
              type="button"
              onClick={saveAndHide}
            >
              {t([manager.confirmed ? 'close' : 'save'])}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
