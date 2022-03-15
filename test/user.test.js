const request = require('supertest')
const app = require('../src/app')

test('Should signup a new user', async ()=>{
    await request(app).post('/users').send({
        name: 'Primo',
        email: "primo@gmail.com",
        password: 'MyPass72'
    })
    expect(res.status201).toBe(400)
})