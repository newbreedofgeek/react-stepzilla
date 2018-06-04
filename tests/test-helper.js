var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

global.sinon = require('sinon');
global.chai = require('chai');
global.expect = chai.expect;
global.enzyme = require('enzyme');

chai.use(require('sinon-chai'));

enzyme.configure({ adapter: new Adapter() });