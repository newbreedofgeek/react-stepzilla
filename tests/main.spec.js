import React from 'react';
import StepZilla from '../src/main';
import sinon from 'sinon'
import { shallow } from 'enzyme';

const makeFakeSteps = (num, makePure) => {
  let steps = [];

  for (let i=0; i < num; i++) {
    let newComp = null;

    if (!makePure) {
      // make a "dirty" react component
      newComp = new React.Component();
      // newComp.isValidated = isValidatedSpy;
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
    const { enzymeWrapper } = setup(2);

    it('should render self and primary css classes', () => {
      expect(enzymeWrapper).to.have.length(1);
      expect(enzymeWrapper.find('div').first().hasClass('multi-step')).to.be.true;
    });

    it('should render correct number of steps', () => {
      expect(enzymeWrapper.find('li')).to.have.length(2);
    });
  });


  describe('base component render (using Pure Components mocking)', () => {
    const { enzymeWrapper } = setup(2, {}, true);

    it('should render self and primary css classes', () => {
      expect(enzymeWrapper).to.have.length(1);
      expect(enzymeWrapper.find('div').first().hasClass('multi-step')).to.be.true;
    });

    it('should render correct number of steps', () => {
      expect(enzymeWrapper.find('li')).to.have.length(2);
    });
  });


  describe('default props based render', () => {
    describe('showSteps: true use case', () => {
      const { enzymeWrapper } = setup(2);

      it('should render showSteps based header', () => {
        expect(enzymeWrapper.find('.progtrckr')).to.have.length(1);
      });
    });

    describe('stepsNavigation: true use case', () => {
      const { enzymeWrapper } = setup(3);

      it('should render steps classes in header with correct classes to indicate navigation is working', () => {
        expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-doing')).to.be.true;
        expect(enzymeWrapper.find('.progtrckr').childAt(1).hasClass('progtrckr-todo')).to.be.true;
        expect(enzymeWrapper.find('.progtrckr').childAt(2).hasClass('progtrckr-todo')).to.be.true;
      });

      it('should jump to 2nd step when clicking the 1st step icon in header', (done) => {
        expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-doing')).to.be.true;
        expect(enzymeWrapper.find('.progtrckr').childAt(1).hasClass('progtrckr-todo')).to.be.true;

        // simulate the click, and mock the event with target to 1 (i.e. jump to step 1 from 0)
        enzymeWrapper.find('.progtrckr').childAt(0).simulate('click', {
          target: {
            value: 1
          },
          persist: () => {} // need this as its not in the enzyme mock
        });

        setTimeout(() => {
          expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-done')).to.be.true;
          expect(enzymeWrapper.find('.progtrckr').childAt(1).hasClass('progtrckr-doing')).to.be.true;

          done();
        }, 10);
      });
    });

    describe('showNavigation: true use case', () => {
      const { enzymeWrapper } = setup(3);

      it('should render showNavigation based footer', () => {
        expect(enzymeWrapper.find('.footer-buttons').prop('style')).to.deep.equal({});
      });

      it('should render the Prev and Next button markup', () => {
        expect(enzymeWrapper.find('.footer-buttons #prev-button')).to.have.length(1);
        expect(enzymeWrapper.find('.footer-buttons #next-button')).to.have.length(1);
      });

      it('should show the Next button on first view', () => {
        expect(enzymeWrapper.find('.footer-buttons #next-button').prop('style')).to.deep.equal({});
      });

      it('should render the forward button with the default "Next" text', () => {
        expect(enzymeWrapper.find('.footer-buttons #next-button').text()).to.be.equal('Next');
      });

      it('should render the back button with the default "Previous" text', () => {
        expect(enzymeWrapper.find('.footer-buttons #prev-button').text()).to.be.equal('Previous');
      });

      it('should NOT show render the Prev button on first view', () => {
        expect(enzymeWrapper.find('.footer-buttons #prev-button').prop('style')).to.deep.equal({
          display: 'none'
        });
      });

      it('should render the Next and Prev button on 2nd step (and test if step classes also updated correctly)', (done) => {
        enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          expect(enzymeWrapper.find('.footer-buttons #next-button').prop('style')).to.deep.equal({});
          expect(enzymeWrapper.find('.footer-buttons #prev-button').prop('style')).to.deep.equal({});
          expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-done')).to.be.true;
          expect(enzymeWrapper.find('.progtrckr').childAt(1).hasClass('progtrckr-doing')).to.be.true;
          expect(enzymeWrapper.find('.progtrckr').childAt(2).hasClass('progtrckr-todo')).to.be.true;

          done();
        }, 10);
      });

      // this should be the last test as the 'click' goes to the second step
      it('should NOT show render the Next button on last step (and test if step classes also updated correctly)', (done) => {
        enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          expect(enzymeWrapper.find('.footer-buttons #next-button').prop('style')).to.deep.equal({
            display: 'none'
          });
          expect(enzymeWrapper.find('.footer-buttons #prev-button').prop('style')).to.deep.equal({});
          expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-done')).to.be.true;
          expect(enzymeWrapper.find('.progtrckr').childAt(1).hasClass('progtrckr-done')).to.be.true;
          expect(enzymeWrapper.find('.progtrckr').childAt(2).hasClass('progtrckr-doing')).to.be.true;

          done();
        }, 10);
      });
    });

    describe('prevBtnOnLastStep: true use case', () => {
      const { enzymeWrapper } = setup(3);

      it('should render Prev button on last (2nd) step', (done) => {
        enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

          setTimeout(() => {
            expect(enzymeWrapper.find('.footer-buttons #prev-button').prop('style')).to.deep.equal({});

            done();
          }, 10);
        }, 10);
      });
    });

    describe('nextButtonText: "Next" use case', () => {
      const { enzymeWrapper } = setup(3);

      it('should render "Next" as text for the forwards movement button', () => {
        expect(enzymeWrapper.find('.footer-buttons #next-button').text()).to.be.equal('Next');
      });
    });

    describe('backButtonText: "Previous" use case', () => {
      const { enzymeWrapper } = setup(3);

      it('should render "Previous" as text for the backwards movement button', (done) => {
        enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          expect(enzymeWrapper.find('.footer-buttons #prev-button').text()).to.be.equal('Previous');

          done();
        }, 10);
      });
    });

    describe('nextTextOnFinalActionStep: "Next" use case', () => {
      const { enzymeWrapper } = setup(3);

      it('should render "Next" when we jump to the final action step (2nd step in this case)', (done) => {
        enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          expect(enzymeWrapper.find('.footer-buttons #next-button').text()).to.be.equal('Next');

          done();
        }, 10);
      });
    });

    describe('nextTextOnFinalActionStep defaults to nextButtonText (when custom nextTextOnFinalActionStep was not given)', () => {
      const { enzymeWrapper } = setup(3, {
        nextButtonText: 'MoveForward'
      });

      it('should render "MoveForward" when we jump to the final action step as thats the default', (done) => {
        enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          expect(enzymeWrapper.find('.footer-buttons #next-button').text()).to.be.equal('MoveForward');

          done();
        }, 10);
      });
    });

    describe('startAtStep: 0 use case', () => {
      const { enzymeWrapper } = setup(3);

      it('should start at the first step', () => {
        expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-doing')).to.be.true;
      });
    });
  }); // end - default props based render group



  describe('custom props based render', () => {
    describe('showSteps: false use case', () => {
      const { enzymeWrapper } = setup(2, {
        showSteps: false
      });

      it('should NOT render showSteps based header', () => {
        expect(enzymeWrapper.find('.progtrckr')).to.have.length(0);
      });
    });

    describe('stepsNavigation: false use case', () => {
      const { enzymeWrapper } = setup(3, {
        stepsNavigation: false
      });

      it('should NOT jump to 2nd step when clicking the 1st step icon in header', (done) => {
        expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-doing')).to.be.true;
        expect(enzymeWrapper.find('.progtrckr').childAt(1).hasClass('progtrckr-todo')).to.be.true;

        // simulate the click, and mock the event with target to 1 (i.e. jump to step 1 from 0)
        enzymeWrapper.find('.progtrckr').childAt(0).simulate('click', {
          target: {
            value: 1
          },
          preventDefault: () => {}, // need this as its not in the enzyme mock
          stopPropagation: () => {} // need this as its not in the enzyme mock
        });

        setTimeout(() => {
          expect(enzymeWrapper.find('.progtrckr').childAt(0).hasClass('progtrckr-doing')).to.be.true;
          expect(enzymeWrapper.find('.progtrckr').childAt(1).hasClass('progtrckr-todo')).to.be.true;

          done();
        }, 10);
      });
    });

    describe('showNavigation: false use case', () => {
      const { enzymeWrapper } = setup(2, {
        showNavigation: false
      });

      it('should NOT render showNavigation based footer', () => {
        expect(enzymeWrapper.find('.footer-buttons').prop('style')).to.deep.equal({
          display: 'none'
        });
      });
    });

    describe('prevBtnOnLastStep: false use case', () => {
      const { enzymeWrapper } = setup(3, {
        prevBtnOnLastStep: false
      });

      it('should NOT render Prev button on last (2nd) step', (done) => {
        enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

          setTimeout(() => {
            expect(enzymeWrapper.find('.footer-buttons #prev-button').prop('style')).to.deep.equal({
              display: 'none'
            });

            done();
          }, 10);
        }, 10);
      });
    });

    describe('nextButtonText: "MoveForward" use case', () => {
      const { enzymeWrapper } = setup(3, {
        nextButtonText: 'MoveForward'
      });

      it('should render "MoveForward" as text for the forwards movement button', () => {
        expect(enzymeWrapper.find('.footer-buttons #next-button').text()).to.be.equal('MoveForward');
      });
    });

    describe('backButtonText: "MoveBack" use case', () => {
      const { enzymeWrapper } = setup(3, {
        backButtonText: 'MoveBack'
      });

      it('should render "MoveBack" as text for the backwards movement button', (done) => {
        enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          expect(enzymeWrapper.find('.footer-buttons #prev-button').text()).to.be.equal('MoveBack');

          done();
        }, 10);
      });
    });

    describe('nextTextOnFinalActionStep: "Save" use case', () => {
      const { enzymeWrapper } = setup(3, {
        nextTextOnFinalActionStep: 'Save'
      });

      it('should render "Save" when we jump to the final action step (2nd step in this case)', (done) => {
        enzymeWrapper.find('.footer-buttons #next-button').simulate('click');

        // click above is promise driven so it's async, setTimeout is probabaly not the best way to do this but it will do for now
        setTimeout(() => {
          expect(enzymeWrapper.find('.footer-buttons #next-button').text()).to.be.equal('Save');

          done();
        }, 10);
      });
    });

    describe('startAtStep: 2 use case', () => {
      const { enzymeWrapper } = setup(3, {
        startAtStep: 2
      });

      it('should start at the 3rd step (its a 0 based index)', () => {
        expect(enzymeWrapper.find('.progtrckr').childAt(2).hasClass('progtrckr-doing')).to.be.true;
      });
    });
    
    describe('onStepChange: not null use case', () => {
        let onStepChange;
        let enzymeWrapper;
        
        beforeEach(() => {
            onStepChange = sinon.spy();
            enzymeWrapper = setup(3, {
                startAtStep: 1,
                onStepChange
            }).enzymeWrapper;
        })
    
        it('should call onStepChange when clicked to next step', (done) => {
            
            enzymeWrapper.find('.footer-buttons #next-button').simulate('click');
    
            // click above is promise driven so it's async, setTimeout is probably not the best way to do this but it will do for now
            setTimeout(() => {
                expect(onStepChange.calledWith(2)).to.be.true;
                done();
            }, 10);
        });
    
        it('should call onStepChange when clicked to previous step', (done) => {
            
            enzymeWrapper.find('.footer-buttons #prev-button').simulate('click');
            
            // click above is promise driven so it's async, setTimeout is probably not the best way to do this but it will do for now
            setTimeout(() => {
                expect(onStepChange.calledWith(0)).to.be.true;
                done();
            }, 10);
        });
    })
  }); // end - custom props based render group
});
