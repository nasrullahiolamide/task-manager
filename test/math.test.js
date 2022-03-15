const {calculateTip, fahrenheitToCelcius, celciusToFarenheit} = require('../src/math')

test('Should calculate total with tip', ()=>{
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('Should calculate tip with default', ()=>{
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Should convert 32 f to 0 c', ()=>{
    const temp = fahrenheitToCelcius(32)
    expect(temp).toBe(0)
})

test('Should convert 0c to 32 f', ()=>{
    const temp = celciusToFarenheit(0)
    expect(temp).toBe(32)
}) 