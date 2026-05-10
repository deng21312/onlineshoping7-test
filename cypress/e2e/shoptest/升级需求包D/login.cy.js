//商家登录
describe('商家登录-数据驱动', () => {
  // 直接用正确的相对路径读取 JSON，确保 Cypress 扫描阶段就能拿到数据
  const testCases = require('../../../fixtures/升级需求包D/login-data.json')
  
  // 动态生成测试用例，每组数据一个独立 it
  testCases.forEach((data, index) => {
    it(`第 ${index + 1} 组数据 - ${data.shopName}`, () => {
      // 1. 打开页面并进入登录页
      cy.visit('http://localhost:5173')
      cy.contains('开店').click()
      cy.contains('立即登录').click()

      // 2. 输入登录信息
      if (data.password) cy.get('#seller-password').type(data.password)
      if (data.username) cy.get('#seller-username').type(data.username)

      // 3. 点击登录按钮
      cy.get('.login-form .login-btn').click()

      // 4. 断言是否跳转到卖家首页
      cy.url().should('include', 'seller/dashboard')
    })
  })
})