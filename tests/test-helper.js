// init enzyme 3
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.enzyme = Enzyme;
global.sinon = require('sinon');
global.chai = require('chai');
global.expect = chai.expect;

chai.use(require('sinon-chai'));
