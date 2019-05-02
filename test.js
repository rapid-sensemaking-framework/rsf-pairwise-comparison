const { expect } = require('chai')
const sinon = require('sinon')
const { rsfPairwiseComparison } = require('./index')
const { newMockMakeContactable } = require('rsf-contactable')

describe('#rsfPairwiseComparison', () => {
    context('when timeout is reached, regardless if nothing has happened', function () {
        it('should early exit and return 0 results', done => {
            const maxTime = 1000 // milliseconds
            rsfPairwiseComparison('', [], maxTime, [], results => {
                expect(results.length).to.equal(0)
                done()
            })
        })
    })

    context('when compares everything, and the list has "n" items', function () {
        it('should have n(n-1)/2 times the number of participants results', (done) => {
            const mockMakeContactable = newMockMakeContactable(sinon.spy)
            const contactables = [{ id: 'someId' }].map(mockMakeContactable)
            const maxTime = 1000 // milliseconds
            const statements = [
                { text: 'Better thing' },
                { text: 'Worse thing' },
                { text: 'Another thing' }
            ]
            const choice = 'Pick whichever you prefer!'
            rsfPairwiseComparison(choice, statements, maxTime, contactables, results => {
                expect(results.length).to.equal(3)
                expect(results[0].choice).to.equal('1')
                expect(results[1].choice).to.equal('A')
                expect(results[2].choice).to.equal('1')
                done()
            })
            contactables[0].trigger('1')
            contactables[0].trigger('A')
            contactables[0].trigger('1')
        })
    })
})