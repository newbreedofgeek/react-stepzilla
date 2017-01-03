import React from 'react';
import StepZilla from '../src/main';
const shallow = enzyme.shallow;

const makeFakeSteps = (num) => {
  let steps = [];

  for (let i=0; i < num; i++) {
    steps.push({
      name: `Step${i + 1}`,
      component: (props) => (
        <div>
          <h1>Step {i + 1}</h1>
        </div>
      )
    });
  }

  return steps;
};

function setup(stepCount = 1, config = {}) {
  const steps = makeFakeSteps(stepCount);

  const props = {
    ...config,
    steps: steps
  };

  const enzymeWrapper = shallow(<StepZilla {...props} />);

  return {
    props,
    enzymeWrapper
  }
}

describe('StepZilla', () => {
  describe('base component render', () => {
    const { enzymeWrapper } = setup(2);

    it('should render self and primary css classes', () => {
      expect(enzymeWrapper).to.have.length(1);
      expect(enzymeWrapper.find('div').first().hasClass('multi-step')).to.be.true;
    });

    it('should render correct number of steps', () => {
      expect(enzymeWrapper.find('li')).to.have.length(2);
    });

    describe('default props based ui render', () => {
      it('should render showSteps based header', () => {
        expect(enzymeWrapper.find('.progtrckr')).to.have.length(1);
      });

      it('should render showNavigation based footer', () => {
        expect(enzymeWrapper.find('.footer-buttons').prop('style')).to.deep.equal({});
      });
    });
  });

  describe('conditional component render', () => {
    const { enzymeWrapper } = setup(2, {
      showSteps: false,
      showNavigation: false
    });

    describe('default props based ui render', () => {
      it('should render showSteps based header', () => {
        expect(enzymeWrapper.find('.progtrckr')).to.have.length(0);
      });

      it('should render showNavigation based footer', () => {
        expect(enzymeWrapper.find('.footer-buttons').prop('style')).to.deep.equal({
          display: 'none'
        });
      });
    });
  });
});
