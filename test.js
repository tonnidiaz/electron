let reg = /config.json$/
let reg2 = /config.*.json$/

console.log(new Date().toISOString(),reg2.test('tsconfig.json'));