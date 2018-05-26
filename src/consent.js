import 'scss/consent.scss'

import App from './app.js'
import React from 'react'
import {render} from 'react-dom'

const config = window.cookieConfig

function renderApp(element){
    window.app = render(<App config={config} />, element, window.app)
}

function initialize(){
    const element = document.getElementById('demo')
    element.innerHTML = ''
    renderApp(element)
}

window.onload = initialize

const element = document.getElementById('demo')
renderApp(element)

if (module.hot) {
    module.hot.accept();
  }