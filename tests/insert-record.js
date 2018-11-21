var test = require('tape');
const insertRecord = require('../lib/insert-record')

test('timing test', function (t) {
    t.plan(1);

    const bookSpec = {}
    const subjectSpecs = [{}]

    const result = insertRecord() // stored data
    t.equal(result, bookSpec) // Make sure to check that individual properties are stored.
    t.equal(result.title, bookSpec.title)
 
    t.equal(typeof Date.now, 'function');
 
});