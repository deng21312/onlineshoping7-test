// 支付方式测试套件 —— 完全隔离正式库！
describe('三种支付方式流程测试', () => {
  const paymentMethods = [
    { name: '微信支付', selector: '微信支付' },
    { name: '银行卡/信用卡', selector: '银行卡/信用卡' }
  ]

  paymentMethods.forEach(method => {
    it(`用户可以成功使用【${method.name}】完成支付（隔离测试库）`, () => {

      // ==============================================
      // 核心魔法：拦截所有 API 请求，转发到 8081 测试库
      // ==============================================
      cy.intercept('GET', '/api/**', (req) => {
        req.url = req.url.replace('http://114.55.144.88:8080', 'http://114.55.144.88:8081');
      }).as('api')

      cy.intercept('POST', '/api/**', (req) => {
        req.url = req.url.replace('http://114.55.144.88:8080', 'http://114.55.144.88:8081');
      }).as('apiPost')

      // 访问页面
      cy.visit('http://114.55.144.88')

      // 登录
      cy.contains('登录').click()
      cy.contains('我是买家').click()
      cy.get('input[placeholder="请输入用户名"]').type('123')
      cy.get('input[placeholder="请输入密码"]').type('q123456')
      cy.get('.login-form .login-btn').click()
      cy.url().should('not.include', '/login')

      // 购买商品
      cy.get('.product-image').first().click()
      cy.get('.btn-primary').click()

      // 选择支付方式
      cy.contains(method.selector).click()

      // 提交订单
      cy.get('.submit-btn').click()

      // 验证成功
      cy.url().should('include', '/payment/success')
    })
  })
})