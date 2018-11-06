import React from 'react'
import {getPurposes} from '../utils/config'
import ConsentModal from './consent-modal'

export default class ConsentNotice extends React.Component {
    render() {
        const {
            config,
            manager,
            isModalVisible,
            t,
            ns,
            onSaveRequest,
            onDeclineRequest,
            onConfigRequest
        } = this.props

        const purposes = getPurposes(config)
        const purposesText = purposes.map((purpose) => t(['purposes', purpose])).join(", ")

        return <div aria-hidden={isModalVisible} className={ns('Notice')}>
            <div className={ns('Notice-body')}>
                <p className={ns('Notice-description')}>
                    {t(['consentNotice', 'description'], {purposes: <strong key="purposes" className={ns('Notice-purposes')}>{purposesText}</strong>})}
                </p>

                {manager.changed &&
                    <p className={ns('Notice-changes')}>{t(['consentNotice', 'changeDescription'])}</p>
                }

                <ul className={ns('Notice-actions')}>
                    <li className={ns('Notice-actionItem')}>
                         <button
                            className={ns('Button Button--save Notice-button Notice-saveButton')}
                            type="button"
                            onClick={onSaveRequest}
                        >
                            {t(['accept'])}
                        </button>
                    </li>
                    <li className={ns('Notice-actionItem')}>
                         <button
                            className={ns('Button Button--decline Notice-button Notice-declineButton')}
                            type="button"
                            onClick={onDeclineRequest}
                        >
                            {t(['decline'])}
                        </button>
                    </li>
                    <li className={ns('Notice-actionItem')}>
                         <button
                            type="button"
                            className={ns('Button Button--info Notice-learnMoreButton')}
                            onClick={onConfigRequest}
                        >
                            {t(['consentNotice', 'learnMore'])}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    }
}
