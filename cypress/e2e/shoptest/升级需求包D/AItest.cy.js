//商家登录
describe('商家登录-数据驱动', () => {
  // 直接用正确的相对路径读取 JSON，确保 Cypress 扫描阶段就能拿到数据
  const testCases = require('../../../fixtures/升级需求包D/AItest.json')
  
  // 动态生成测试用例，每组数据一个独立 it
  testCases.forEach((data, index) => {
    it(`第 ${index + 1} 组数据 - ${data.shopName}`, () => {
      // 1. 打开页面并进入登录页
      cy.visit('http://localhost:5173')
      cy.contains('登录').click()

      // 2. 输入登录信息
      if (data.password) cy.get('#buyer-password').type(data.password)
      if (data.username) cy.get('#buyer-username').type(data.username)

      // 3. 点击登录按钮
      cy.get('.login-form .login-btn').click()
      cy.wait(1000)
      // 4. 点击AI按钮
      cy.get('.ai-fab').click()
      // 5. 输入问题
      cy.get('.chat-input').type(data.ask)
      cy.get('.send-btn').click()
      cy.wait(10000)
    })
  })
})