// init enzyme 3
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

global.enzyme = Enzyme;
global.sinon = require('sinon');
global.chai = require('chai');
global.expect = chai.expect;

chai.use(require('sinon-chai'));
