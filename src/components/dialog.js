import React from 'react'
import ReactModal from 'react-modal'
import useLegacyLifecycleMethods from '../utils/useLegacyLifecycleMethods';

export default class Dialog extends React.Component {
    constructor(props) {
        super()
        if (props.config.appElement) {
            ReactModal.setAppElement(props.config.appElement)
        }
        this.scrollPosition = null

        // handle lifecycle methods depending on react version for full support
        if (useLegacyLifecycleMethods()) {
            this.componentWillUpdate = this.componentWillUpdateLifecycle
        } else {
            this.getSnapshotBeforeUpdate = this.getSnapshotBeforeUpdateLifecycle
        }
    }

    // for react <16.3 support - see constructor
    componentWillUpdateLifecycle(nextProps) {
        const willOpen = nextProps.isOpen
        if (willOpen && !this.props.isOpen) {
            this.scrollPosition = window.pageYOffset
        }
    }

    // for react >= 16.3 support - see constructor
    getSnapshotBeforeUpdateLifecycle(prevProps) {
        const {isOpen} = this.props
        if (isOpen && !prevProps.isOpen) {
            this.scrollPosition = window.pageYOffset
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        const {isOpen} = this.props
        if (!isOpen && prevProps.isOpen && this.props.handleScrollPosition && this.scrollPosition !== null) {
            // the scroll position stuff is for iOS to work correctly when we want to prevent normal website
            // scrolling with the modal opened
            //
            // /!\ this requires specific CSS to work, example if `htmlOpenClassName = modal-open`:
            //
            // .modal-open {
            //   height: 100%;
            // }
            // .modal-open body {
            //   position: fixed;
            //   overflow: hidden;
            //   height: 100%;
            //   width: 100%;
            // }
            setTimeout(() => { //setTimeout because it seems there is a race condition of some sort without it… oh well
                window.scrollTo(window.pageXOffset, this.scrollPosition)
                this.scrollPosition = null
            }, 0)
        }
    }

    render() {
        const {children, appElement, handleScrollPosition, config, ...reactModalProps} = this.props

        return <ReactModal
            parentSelector={() => document.getElementById(config.elementID || 'orejime')}
            htmlOpenClassName="orejimeHtml-WithModalOpen"
            bodyOpenClassName="orejimeBody-WithModalOpen"
            {...reactModalProps}
        >
            {children}
        </ReactModal>
    }
}

Dialog.defaultProps = {
    handleScrollPosition: true
}
