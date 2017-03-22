import React from 'react';
import StepZilla from '../src/main';
const shallow = enzyme.shallow;

const makeFakeSteps = (num, makePure) => {
  let steps = [];

  for (let i=0; i < num; i++) {
    let newComp = null;

    if (!makePure) {
      // make a "dirty" react component
      newComp = new React.Component();
      newComp.render = () => {
        return (
          <div>
            <h1>Step {i + 1}</h1>
          </div>
        )
      }
    }
    else {
      // make a "pure" component
      newComp = (props) => (
        <div>
          <h1>Step {i + 1}</h1>
        </div>
      )
    }

    steps.push({
      name: `Step${i + 1}`,
      component: newComp
    });
  }

  return steps;
};

function setup(stepCount = 1, config = {}, makePure = false) {
  const steps = makeFakeSteps(stepCount, makePure);

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
  describe('base component render (using React.Component based Components mocking)', () => {
    const { enzymeWrapper } = setup(2, {dontValidate: true});

    it('should render self and primary css classes', () => {
      expect(enzymeWrapper).to.have.length(1);
      expect(enzymeWrapper.find('div').first().hasClass('multi-step')).to.be.true;
    });

    it('should render correct number of steps', () => {
      expect(enzymeWrapper.find('li')).to.have.length(2);
    });
  });


  describe('base component render (using Pure Components mocking)', () => {
    const { enzymeWrapper } = setup(2, {dontValidate: true}, true);

    it('should render self and primary css classes', () => {
      expect(enzymeWrapper).to.have.length(1);
      expect(enzymeWrapper.find('div').first().hasClass('multi-step')).to.be.true;
    });

    it('should render correct number of steps', () => {
      expect(enzymeWrapper.find('li')).to.have.length(2);
    });
  });


  describe('custom props based render', () => {
    describe('showSteps: true use case', () => {
      const { enzymeWrapper } = setup(2, {dontValidate: true});

      it('should render showSteps based header', () => {
        expect(enzymeWrapper.find('.progtrckr')).to.have.length(1);
      });
    });

    describe('stepsNavigation: true use case', () => {
      const { enzymeWrapper } = setup(3, {dontValidate: true});

      it('should render steps classes in header with correct classes to indicate navigation is working', () => {
        expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-doing')).to.be.true;
        expect(enzymeWrapper.find('.progtrckr').childAt(1).hasClass('progtrckr-todo')).to.be.true;
        expect(enzymeWrapper.find('.progtrckr').childAt(2).hasClass('progtrckr-todo')).to.be.true;
      });
    });

    describe('showNavigation: true use case', () => {
      const { enzymeWrapper } = setup(3, {dontValidate: true});

      it('should render showNavigation based footer', () => {
        expect(enzymeWrapper.find('.footer-buttons').prop('style')).to.deep.equal({});
      });

      it('should render the Prev and Next button markup', () => {
        expect(enzymeWrapper.find('.footer-buttons .btn-prev')).to.have.length(1);
        expect(enzymeWrapper.find('.footer-buttons .btn-next')).to.have.length(1);
      });

      it('should show the Next button on first view', () => {
        expect(enzymeWrapper.find('.footer-buttons .btn-next').prop('style')).to.deep.equal({});
      });

      it('should render the forward button with the default Next text', () => {
        expect(enzymeWrapper.find('.footer-buttons .btn-next').text()).to.be.equal('Next');
      });

      it('should NOT show render the Prev button on first view', () => {
        expect(enzymeWrapper.find('.footer-buttons .btn-prev').prop('style')).to.deep.equal({
          display: 'none'
        });
      });

      it('should render the Next and Prev button on 2nd step (and test if step classes also updated correctly)', (done) => {
        enzymeWrapper.find('.footer-buttons .btn-next').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          expect(enzymeWrapper.find('.footer-buttons .btn-next').prop('style')).to.deep.equal({});
          expect(enzymeWrapper.find('.footer-buttons .btn-prev').prop('style')).to.deep.equal({});
          expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-done')).to.be.true;
          expect(enzymeWrapper.find('.progtrckr').childAt(1).hasClass('progtrckr-doing')).to.be.true;
          expect(enzymeWrapper.find('.progtrckr').childAt(2).hasClass('progtrckr-todo')).to.be.true;

          done();
        }, 10);
      });

      // this should be the last test as the 'click' goes to the second step
      it('should NOT show render the Next button on last step (and test if step classes also updated correctly)', (done) => {
        enzymeWrapper.find('.footer-buttons .btn-next').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          expect(enzymeWrapper.find('.footer-buttons .btn-next').prop('style')).to.deep.equal({
            display: 'none'
          });
          expect(enzymeWrapper.find('.footer-buttons .btn-prev').prop('style')).to.deep.equal({});
          expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-done')).to.be.true;
          expect(enzymeWrapper.find('.progtrckr').childAt(1).hasClass('progtrckr-done')).to.be.true;
          expect(enzymeWrapper.find('.progtrckr').childAt(2).hasClass('progtrckr-doing')).to.be.true;

          done();
        }, 10);
      });
    });

    describe('prevBtnOnLastStep: true use case', () => {
      const { enzymeWrapper } = setup(3, {dontValidate: true});

      it('should render Prev button on last (2nd) step', (done) => {
        enzymeWrapper.find('.footer-buttons .btn-next').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          enzymeWrapper.find('.footer-buttons .btn-next').simulate('click');

          setTimeout(() => {
            expect(enzymeWrapper.find('.footer-buttons .btn-prev').prop('style')).to.deep.equal({});

            done();
          }, 10);
        }, 10);
      });
    });
  }); // end - default props based render group


  describe('custom props based render', () => {
    describe('showSteps: false use case', () => {
      const { enzymeWrapper } = setup(2, {
        showSteps: false,
        dontValidate: true
      });

      it('should NOT render showSteps based header', () => {
        expect(enzymeWrapper.find('.progtrckr')).to.have.length(0);
      });
    });

    describe('showNavigation: false use case', () => {
      const { enzymeWrapper } = setup(2, {
        showNavigation: false,
        dontValidate: true
      });

      it('should NOT render showNavigation based footer', () => {
        expect(enzymeWrapper.find('.footer-buttons').prop('style')).to.deep.equal({
          display: 'none'
        });
      });
    });

    describe('prevBtnOnLastStep: false use case', () => {
      const { enzymeWrapper } = setup(3, {
        prevBtnOnLastStep: false,
        dontValidate: true
      });

      it('should NOT render Prev button on last (2nd) step', (done) => {
        enzymeWrapper.find('.footer-buttons .btn-next').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          enzymeWrapper.find('.footer-buttons .btn-next').simulate('click');

          setTimeout(() => {
            expect(enzymeWrapper.find('.footer-buttons .btn-prev').prop('style')).to.deep.equal({
              display: 'none'
            });

            done();
          }, 10);
        }, 10);
      });
    });
  }); // end - custom props based render group
});
