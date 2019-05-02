# rsf-operator-template

A starter template for modules that want to work as [RSF Operators](https://github.com/rapid-sensemaking-framework/rsf-runner#rsf-operators).

Clone this repository and rename it something else.

Replace the `id`, `description`, `contract.needs` and `contract.gives` with new values.

Fill in the appropriate descriptions.

You can delete everything this line and above, and just edit everything below:


# rsf-module-name

`rsf-module-name` is part of the Rapid Sensemaking Framework ecosystem... please read
the [README of rsf-runner](https://github.com/rapid-sensemaking-framework/rsf-runner/blob/master/README.md) for the full context for what that is.

`rsf-module-name` is an [RSF Operator](https://github.com/rapid-sensemaking-framework/rsf-runner#rsf-operators)

Replace this text with a detailed description of what the Operator does. How it behaves.

## Installation

`npm install --save rsf-module-name`

## RSF Sequence example

The following could be used in an [RSF Sequence](https://github.com/rapid-sensemaking-framework/rsf-runner#rsf-sequences) JSON file.

```json
{
    "id": "rsf-module-name",
    "description": "Tell people what it does",
    "language": "node",
    "contract": {
        "needs": {
            "max_time": "number",
            "participants_config": [{
                "id": "string",
                "name": "string",
                "type": "string"
            }]
        },
        "gives": []
    },
    "dependencies_file": {
        "dependencies": {
            "rsf-module-name": "0.0.1"
        }
    },
    "code_file": "require('rsf-module-name').main(__dirname)"
}
```

## API

___

### `main(readWriteDir)`

executes as a process until `rsfModuleName` completes, at which points it writes the results to a JSON file in the given `readWriteDir` directory, and exits the process.

`readWriteDir` : `String`, the path to the directory from which to read an `input.json` file and write the `output.json` file

Expectations for `input.json`:

`input.participants_config` which it will make an `[Contactables]` using `makeContactable` from `rsf-contactable`  to pass in as `contactables` to `rsfCollectResponses`

`input.max_time`, for `maxTime` in `rsfCollectResponses`

___

### `rsfModuleName(maxTime, contactables, callback)`

The core logic for interacting with participants, timeouts, and ...

How it works:

- rules for the process will be sent to participants
- it will let everyone know when the process has completed because the `maxTime` came to pass, or
- it will let everyone know when the process has completed because ...

`maxTime` : `Number`, the number of milliseconds to wait until stopping this process automatically

`contactables`: `[Contactable]`, the "contactables" array from `rsf-contactable`, or a mock... objects with `.speak` and `.listen` methods.

`callback` : `Function`, a callback to call with only one argument which are the results

`callback -> results` : `[]`, array of ... (could be an object too)



## Development

Tests are written in mocha/chai/sinon and can be run using

```
npm test
```



