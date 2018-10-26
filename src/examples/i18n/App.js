'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Example from './Example';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

import './main.css';

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Example />
  </I18nextProvider>
  , document.getElementById('root')
);
