const PPCToken = artifacts.require('./PPCToken.sol')

const truffleAssert = require('truffle-assertions');

contract('PPCToken', (accounts) => {

  before(async () => {
    this.ppctoken = await PPCToken.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.ppctoken.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

})