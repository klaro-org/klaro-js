import React from 'react'
import ConsentNoticeWrapper from './consent-notice-wrapper'
import ConsentModal from './consent-modal'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: this.isModalVisible()
        }
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.saveAndHideAll = this.saveAndHideAll.bind(this)
        this.declineAndHideAll = this.declineAndHideAll.bind(this)
    }

    isModalVisible(userRequest) {
        const {config, manager} = this.props
        if (userRequest) {
            return true
        }
        if (config.mustConsent && (!manager.confirmed || manager.changed)) {
            return true
        }
        return false
    }

    isNoticeVisible() {
        const {config, manager} = this.props
        if (config.mustConsent || config.noNotice) {
            return false
        }
        if (manager.confirmed && !manager.changed) {
            return false
        }
        return true
    }

    showModal(e) {
        if (e !== undefined) {
            e.preventDefault()
        }
        this.setState({isModalVisible: this.isModalVisible(true)})
    }

    hideModal(e) {
        if (e !== undefined) {
            e.preventDefault()
        }
        this.setState({isModalVisible: this.isModalVisible(false)})
    }

    saveAndHideAll(e) {
        if (e !== undefined) {
            e.preventDefault()
        }
        this.props.manager.saveAndApplyConsents()
        this.setState({isModalVisible: this.isModalVisible(false)})
    }

    declineAndHideAll(e) {
        this.props.manager.declineAll()
        this.props.manager.saveAndApplyConsents()
        this.setState({isModalVisible: this.isModalVisible(false)})
    }

    render() {
        const {config, t, manager, ns} = this.props
        const isNoticeVisible = this.isNoticeVisible()
        return (
            <div className={ns('Main')}>
                <ConsentNoticeWrapper
                    key="notice"
                    t={t}
                    ns={ns}
                    isVisible={isNoticeVisible}
                    isMandatory={config.mustNotice || false}
                    isModalVisible={this.state.isModalVisible}
                    config={config}
                    manager={manager}
                    onSaveRequest={this.saveAndHideAll}
                    onDeclineRequest={this.declineAndHideAll}
                    onConfigRequest={this.showModal}
                />
                <ConsentModal
                    key="modal"
                    isOpen={this.state.isModalVisible}
                    t={t}
                    ns={ns}
                    config={config}
                    onHideRequest={this.hideModal}
                    onSaveRequest={this.saveAndHideAll}
                    manager={manager}
                />
            </div>
        )
    }
}
