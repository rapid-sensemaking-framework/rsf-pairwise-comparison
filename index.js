const { readInput, writeOutput } = require('rsf-reader-writer')
const { makeContactable } = require('rsf-contactable')

// define constants or creator functions
// of the strings for user interaction here
const HELLO = 'hello'
const TIMEOUT_TEXT = 'It\'s all over'

// change rsfModuleName to your module name :)
const rsfModuleName = (maxTime, contactables, callback) => {
    // array to store the results
    const results = []

    // stop the process after a maximum amount of time
    const timeoutId = setTimeout(() => {
        // complete, saving whatever results we have
        complete(TIMEOUT_TEXT)
    }, maxTime)

    // setup a completion handler that
    // can only fire once
    let calledComplete = false
    const complete = (completionText) => {
        if (!calledComplete) {
            // It is good practice to inform participants the process is ending
            contactables.forEach(contactable => contactable.speak(completionText))
            clearTimeout(timeoutId)
            callback(results)
            calledComplete = true
        }
    }
    
    // The "rules" of the game should be conveyed here
    // Make sure people fully understand the process
    contactables.forEach(contactable => contactable.speak(HELLO))
    contactables.forEach(contactable => contactable.listen((text) => console.log(text)))

    // implement core logic here
    
    // be sure to specify completion conditions, as in, 
    // how does the process end, if not just by time passing (maxTime)
}
module.exports.rsfModuleName = rsfModuleName

// this is the function that folks who import this module for use as an RSF Operator
// will simply call
module.exports.main = (dir) => {
    const input = readInput(dir)

    const PARTICIPANTS_CONFIG = input.participants_config
    const MAX_TIME = input.max_time // TODO: set a default?

    // convert each config into a "contactable", with `speak` and `listen` functions
    const contactables = PARTICIPANTS_CONFIG.map(makeContactable)

    // change rsfModuleName to your module name :)
    rsfModuleName(MAX_TIME, contactables, results => {
        // this save the output to a file
        writeOutput(dir, results)
        // this exits the process with 'success' status
        // use exit code 1 to show error
        // allow any remaining messages to be sent
        setTimeout(() => {
            process.exit()
        }, 2000)
    })
}