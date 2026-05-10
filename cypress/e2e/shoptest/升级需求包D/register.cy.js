//商家注册
describe('商家注册-数据驱动', () => {
  // 直接用正确的相对路径读取 JSON，确保 Cypress 扫描阶段就能拿到数据
  const testCases = require('../../../fixtures/升级需求包D/register-data.json')

  // 动态生成测试用例，每组数据一个独立 it
  testCases.forEach((data, index) => {
    it(`第 ${index + 1} 组数据 - ${data.shopName}`, () => {
      // 1. 打开页面并进入注册页
      cy.visit('http://localhost:5173')
      cy.contains('开店').click()

      // 2. 输入注册信息
      if (data.shopName) cy.get('#shopName').type(data.shopName)
      if (data.password) cy.get('#password').type(data.password)
      if (data.phone) cy.get('#phone').type(data.phone)
      if (data.confirmPassword) cy.get('#confirmPassword').type(data.confirmPassword)
      if (data.username) cy.get('#username').type(data.username)

      // 3. 点击注册按钮
      cy.get('.register-form .register-btn').click()

      // 4. 断言是否跳转到卖家登录页
      cy.url().should('include', '/seller/login')
    })
  })
})