// init enzyme 3
const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

Enzyme.configure({ adapter: new Adapter() });

global.enzyme = Enzyme;
global.sinon = require('sinon');
global.chai = require('chai');
global.expect = chai.expect;

chai.use(require('sinon-chai'));
