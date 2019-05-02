# rsf-pairwise-comparison

`rsf-pairwise-comparison` is part of the Rapid Sensemaking Framework ecosystem... please read
the [README of rsf-runner](https://github.com/rapid-sensemaking-framework/rsf-runner/blob/master/README.md) for the full context for what that is.

`rsf-pairwise-comparison` is an [RSF Operator](https://github.com/rapid-sensemaking-framework/rsf-runner#rsf-operators)

Replace this text with a detailed description of what the Operator does. How it behaves.

## Installation

`npm install --save rsf-pairwise-comparison`

## RSF Sequence example

The following could be used in an [RSF Sequence](https://github.com/rapid-sensemaking-framework/rsf-runner#rsf-sequences) JSON file.

```json
{
    "id": "rsf-pairwise-comparison",
    "description": "Tell people what it does",
    "language": "node",
    "contract": {
        "needs": {
            "choice": "string",
            "statements": [{
                "text": "string"
            }],
            "max_time": "number",
            "participants_config": [{
                "id": "string",
                "name": "string",
                "type": "string"
            }]
        },
        "gives": [{
            "choices": {
                "A": "string",
                "1": "string"
            },
            "choice": "string",
            "id": "string",
            "timestamp": "number"
        }]
    },
    "dependencies_file": {
        "dependencies": {
            "rsf-pairwise-comparison": "0.0.1"
        }
    },
    "code_file": "require('rsf-pairwise-comparison').main(__dirname)"
}
```

## API

___

### `main(readWriteDir)`

executes as a process until `rsfPairwiseComparison` completes, at which points it writes the results to a JSON file in the given `readWriteDir` directory, and exits the process.

`readWriteDir` : `String`, the path to the directory from which to read an `input.json` file and write the `output.json` file

Expectations for `input.json`:

`input.choice`, for `choice` in `rsfPairwiseComparison`

`input.statements`, for `statements` in `rsfPairwiseComparison`

`input.participants_config` which it will make an `[Contactables]` using `makeContactable` from `rsf-contactable`  to pass in as `contactables` to `rsfPairwiseComparison`

`input.max_time`, for `maxTime` in `rsfPairwiseComparison`

___

### `rsfPairwiseComparison(choice, statements, maxTime, contactables, callback)`

The core logic for interacting with participants, timeouts, and ...

How it works:

- rules for the process will be sent to participants
- it will let everyone know when the process has completed because the `maxTime` came to pass, or
- it will let everyone know when the process has completed because all the participants have chosen between all the possible pairs

`choice` : `String`, a human readable string clarifying what a choice for either of any two options means

`statements` : `[Statement]`, the list of statements to create all possible pairs out of, and make choices between

`Statement.text` : `String`, the string of text for this statement, can be anything

`maxTime` : `Number`, the number of milliseconds to wait until stopping this process automatically

`contactables`: `[Contactable]`, the "contactables" array from `rsf-contactable`, or a mock... objects with `.speak` and `.listen` methods.

`callback` : `Function`, a callback to call with only one argument which are the results

`callback -> results` : `[Choice]`, array of Choice

`Choice.choices` : `ChoiceObject`, the choices being chosen between

`ChoiceObject.A` : `String`, the text of the choice associated with key A

`ChoiceObject.1` : `String`, the text of the choice associated with key 1

`Choice.choice` : `String`, 1 or A, whichever was chosen

`Choice.id` : `String`, the id of the contactable who chose

`Choice.timestamp` : `Number`, the unix timestamp specifying when the choice was made


## Development

Tests are written in mocha/chai/sinon and can be run using

```
npm test
```



