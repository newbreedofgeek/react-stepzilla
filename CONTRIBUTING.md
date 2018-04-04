## Development Workflow to Contribute

Hi Contributors, here is the workflow you should follow to contribute any updates/upgrades to StepZilla.

1. Check out master branch, create your new branch that you will work on and raise a PR later
2. Follow the [Dev steps here to run it locally](https://github.com/newbreedofgeek/react-stepzilla#run-and-view-example-in-browser) in live-update watch mode
3. Make your code updates
4. Smoke test it by running through the example app in the browser a few times
5. Once you are happy that your changes have not introduced any new issues
6. Update unit tests if needed and [run tests](https://github.com/newbreedofgeek/react-stepzilla#tests)
7. Once all new tests pass
8. Note down the current "version" number in "package.json" (e.g. 4.6.2) and decide if your update is a major/minor/patch upgrade. For e.g. if it's a non breaking patch then increment the version to 4.6.3
9. Open the "src/examples/index.html" file and also put the new version in the div with "lib-version" (e.g. [here](https://github.com/newbreedofgeek/react-stepzilla/blob/master/src/examples/index.html#L149))
10. Now run `npm run build`. This this will produce the distribution in "dist"
11. Now run `npm run build-example` and this will generate a distribution of the new example app that is available [live here](https://newbreedofgeek.github.io/react-stepzilla/)
12. Check in your code into master or into your own branch and raise a PR
13. Run `npm publish` to push new version in the registry (if you are a contributor who pushed directly to master or ask your PR approved to do this)
14. Give it a few minutes and visit [the new live example app here](https://newbreedofgeek.github.io/react-stepzilla/). Make sure the new version you added in step 9 is shown on the top right corner and also do a complete smoke test to verify your changes
15. Update the (WIKI change log here)[https://github.com/newbreedofgeek/react-stepzilla/wiki/Change-Log] with a new entry and explain what changed.
