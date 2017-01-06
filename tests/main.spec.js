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
  });

  describe('default props based ui render', () => {
    const { enzymeWrapper } = setup(2);

    it('should render showSteps based header', () => {
      expect(enzymeWrapper.find('.progtrckr')).to.have.length(1);
    });

    it('should render showNavigation based footer', () => {
      expect(enzymeWrapper.find('.footer-buttons').prop('style')).to.deep.equal({});
    });
  });

  describe('custom props based ui render', () => {
    const { enzymeWrapper } = setup(2, {
      showSteps: false,
      showNavigation: false
    });

    it('should NOT render showSteps based header as "showSteps: false"', () => {
      expect(enzymeWrapper.find('.progtrckr')).to.have.length(0);
    });

    it('should NOT render showNavigation based footer as "showNavigation: false"', () => {
      expect(enzymeWrapper.find('.footer-buttons').prop('style')).to.deep.equal({
        display: 'none'
      });
    });

    it('should render the Prev and Next button markup', () => {
      expect(enzymeWrapper.find('.footer-buttons .btn-prev')).to.have.length(1);
      expect(enzymeWrapper.find('.footer-buttons .btn-next')).to.have.length(1);
    });

    it('should show the Next button on first view', () => {
      expect(enzymeWrapper.find('.footer-buttons .btn-next').prop('style')).to.deep.equal({});
    });

    it('should NOT show render the Prev button on first view', () => {
      expect(enzymeWrapper.find('.footer-buttons .btn-prev').prop('style')).to.deep.equal({
        display: 'none'
      });
    });
  });
});
