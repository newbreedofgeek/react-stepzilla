# react stepzilla
is a  multi-step, wizard component for data collection via forms and other sub components. It basically lets you throw a bunch of react components at it (data forms, text / html components etc) and it will take the user through those components in steps. If it's a data entry form it will tigger validation and only proceed if the data is valid.


### what does it do?
- something like this of course:

![react-stepzilla](https://github.com/newbreedofgeek/react-stepzilla/blob/master/stepzilla-eg.png)

### get started
- run
```
npm install react-stepzilla
```
- require into your project via
```
var StepZilla = require('react-stepzilla')
```
- define the list of all the components you want to step through. The `name` indicates the title of the UI step and component is what loads.
```
const steps =
    [
      {name: 'Step 1', component: <Step1 />},
      {name: 'Step 2', component: <Step2 />},
      {name: 'Step 3', component: <Step3 />},
      {name: 'Step 4', component: <Step4 />},
      {name: 'Step 5', component: <Step5 />}
    ]
```
- and now render it out somewhere in your app
```
    <div className='step-progress'>
        <StepZilla steps={steps}/>
    </div>
```
- if one of your components is a form that requires validation before moving to the next component, then that component needs to implement a `isValidated()` public method which validates the form and returns true/false if the data is valid. For an e.g. on this have a look at the `src/examples/Step2` component.

- also if you want some default style, copy the source from `src/css/main.css` code into your project

### dev
- all node source is in src/main.js
- you need to install dependencies first `npm install`
- make any changes and run `npm run build` to transpile the jsx into `dist`
- the transpilation is run as a auto pre-publish task so it should usually be up to date when consumed via npm

### todo
- write the tests

#### change log
- 1.2.0
  - fixed issue when when consumed via npm the jsx was causing a build error on the host project. Its not transpiled via babel into dist
- 1.0.0
  - initial working version
