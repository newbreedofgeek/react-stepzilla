# react stepzilla
is a  multi step component for data collection via forms and other basic components. It basically lets you throw a bunch of react components at it (data forms, text panels etc) and it will take the user through the forms in steps. If it's a data form it will tigger validation and only proceed if the data is valid.


### what does it do?
```
- effectively scales images instead of resizing using width to work out the thumb scales. (so if you have a really tall image it will still use width to generate thumbs, but this should still work well in order to get fixed size thumbs)
- config driven thumb sizes (support lrg, med and sml sizes)
- choose to keep original image or delete it (via config)
- resized images can then be accessed publicly
```

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
- if one of your components is a form that requires validation before moving to the next component, then that component needs to implement a `isValidated()` public method which validates the form and returns true/false if the data is valid. For an e.g. on this have a look at the `src/examples/Step2` component.

- also if you want some default style, copy the source from `src/css/main.css` code into your project

### dev
- all node source is in src/index.js

### todo
- write the tests

#### change log
- 1.0.0
  - initial working version
