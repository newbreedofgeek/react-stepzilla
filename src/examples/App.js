'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

// S: Base - vanilla example
import Example from './Example';

ReactDOM.render(<Example />, document.getElementById('root'));
// E: Base - vanilla example

// S: i18n - Internationalization and localization example
import Examplei18n from './i18n/Example';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Examplei18n />
  </I18nextProvider>
  , document.getElementById('rooti18n')
);
// E: i18n - Internationalization and localization example

// S: Redux example
import ExampleRedux from './redux/Example';
import { createStore} from 'redux'
import { Provider } from 'react-redux';
import reducer from './redux/reducer';

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <ExampleRedux />
  </Provider>, document.getElementById('rootRedux'));
// E: Redux example
