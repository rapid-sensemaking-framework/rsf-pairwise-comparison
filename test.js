const { expect } = require('chai')
const sinon = require('sinon')
// change rsfModuleName to your module name
const { rsfModuleName } = require('./index')
const { newMockMakeContactable } = require('rsf-contactable')

describe('#rsfModuleName', () => {
    context('when timeout is reached, regardless if nothing has happened', function () {
        it('should early exit and return 0 results', done => {
            const maxTime = 1000 // milliseconds
            rsfModuleName(maxTime, [], results => {
                expect(results.length).to.equal(0)
                done()
            })
        })
    })

    context('when text is transmitted by a contactable', function () {
        it('log it the console', (done) => {
            // we pass in sinon.spy to make it
            // so that a contactable.speak function is inspectable for
            // what it has been called with
            const mockMakeContactable = newMockMakeContactable(sinon.spy)
            const contactables = [{ id: 'someId' }].map(mockMakeContactable)
            const maxTime = 1000 // milliseconds
            rsfModuleName(maxTime, contactables, results => {
                expect(results.length).to.equal(0)
                // check what the value of the first call to .speak
                // of the first contactable is
                expect(contactables[0].speak.getCall(0).args[0]).to.equal('hello')
                // check what the value of the second call to .speak
                // of the first contactable is
                expect(contactables[0].speak.getCall(1).args[0]).to.equal('It\'s all over')
                
                // when using testing asynchronously,
                // be sure to call `done` when done
                done()
            })
            // expect to see this logged to the console
            contactables[0].trigger('hi')
            // expect to see this logged to the console
            contactables[0].trigger('hi again')
        })
    })
})