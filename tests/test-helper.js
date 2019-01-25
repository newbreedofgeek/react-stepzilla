global.sinon = require('sinon');
global.chai = require('chai');
global.expect = chai.expect;

chai.use(require('sinon-chai'));

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.enzyme = require('enzyme');