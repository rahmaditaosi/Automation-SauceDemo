import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'assert'

Given('I Have a number {int}', function (int) {
    console.log('Starting with number', int);
    this.num = int
})

When('I add the number {int}', function (int) {
    this.total = (this.num) + int;  
})

Then('I get a total of {int}', function (int) {
    assert(this.total === int, `Expected: ${int} But got: ${this.total}`)
})