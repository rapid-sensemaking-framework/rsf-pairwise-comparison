const { readInput, writeOutput } = require('rsf-reader-writer')
const { makeContactable } = require('rsf-contactable')

// define constants or creator functions
// of the strings for user interaction here
const INVALID_RESPONSE_TEXT = `That's not a valid response, please try again.`
const MAX_RESPONSES_TEXT = `You've responded to everything. Thanks for participating. You will be notified when everyone has completed.`
const ALL_COMPLETED_TEXT = `Everyone has completed. Thanks for participating.`
const TIMEOUT_TEXT = `The max time has been reached. Stopping now. Thanks for participating.`
const rulesText = (maxTime) => `The process will stop automatically after ${maxTime} milliseconds.` // TODO: improve the human readable time

const rsfPairwiseComparison = (choice, statements, maxTime, contactables, callback) => {
    // array to store the results
    const results = []

    // number of results to expect, per contactable
    // the number of possible pairs
    const n = statements.length
    const numPerPerson = n * (n - 1) / 2

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

    // a function to check the validity of a response
    // according to the options
    const validResponse = (text) => {
        return text === '1' || text === 'A'
    }

    // a function to check the completion conditions
    const checkCompletionCondition = () => {
        // exit when everyone has responded to everything
        if (results.length === contactables.length * numPerPerson) {
            complete(ALL_COMPLETED_TEXT)
        }
    }

    // create a list of all the pairs
    const pairsTexts = []
    statements.forEach((statement, index) => {
        for (let i = index + 1; i < statements.length; i++) {
            let pairedStatement = statements[i]
            // use A and 1 to try to minimize preference
            // bias for 1 vs 2, or A vs B
            pairsTexts.push({
                A: statement.text,
                1: pairedStatement.text
            })
        }
    })

    // The "rules" of the game should be conveyed here
    // Make sure people fully understand the process
    contactables.forEach(contactable => {

        // initiate contact with the person
        // and set context, and "rules"
        // contactable.speak(prompt)
        contactable.speak(rulesText(maxTime))
        contactable.speak(choice)

        // send them one message per pair,
        // awaiting their response before sending the next
        let responseCount = 0
        const nextText = () => {
            return `(${numPerPerson - 1 - responseCount} remaining) A) ${pairsTexts[responseCount]['A']} 1) ${pairsTexts[responseCount]['1']}`
        }
        contactable.listen(text => {
            // do we still accept this response?
            if (responseCount < numPerPerson) {
                if (!validResponse(text)) {
                    contactable.speak(INVALID_RESPONSE_TEXT)
                    return
                }
                results.push({
                    choices: pairsTexts[responseCount],
                    choice: text,
                    id: contactable.id,
                    timestamp: Date.now()
                })
                responseCount++
            }

            // is there anything else we should say?
            if (responseCount === numPerPerson) {
                // remind them they've responded to everything
                contactable.speak(MAX_RESPONSES_TEXT)
            } else {
                // still haven't reached the end,
                // so send the next one
                contactable.speak(nextText())
            }

            // are we done?
            checkCompletionCondition()
        })
        // send the first one
        contactable.speak(nextText())
    })
}
module.exports.rsfPairwiseComparison = rsfPairwiseComparison

// this is the function that folks who import this module for use as an RSF Operator
// will simply call
module.exports.main = (dir) => {
    const input = readInput(dir)

    const CHOICE = input.choice
    const STATEMENTS = input.statements
    const PARTICIPANTS_CONFIG = input.participants_config
    const MAX_TIME = input.max_time // TODO: set a default?

    // convert each config into a "contactable", with `speak` and `listen` functions
    const contactables = PARTICIPANTS_CONFIG.map(makeContactable)

    rsfPairwiseComparison(CHOICE, STATEMENTS, MAX_TIME, contactables, results => {
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