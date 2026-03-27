// 支付方式测试套件
describe('三种支付方式流程测试', () => {
  // 遍历所有支付方式
  const paymentMethods = [
    { name: '微信支付', selector: '微信支付' },
    { name: '支付宝', selector: '支付宝' },
    { name: '银行卡/信用卡', selector: '银行卡/信用卡' }
  ]

  paymentMethods.forEach(method => {
    it(`用户可以成功使用【${method.name}】完成支付`, () => {
      // 1. 打开商城
      cy.visit('http://localhost:5173')

      // 2. 登录流程
      cy.contains('登录').click()
      cy.contains('我是买家').click()
      cy.get('input[placeholder="请输入用户名"]').type('123')
      cy.get('input[placeholder="请输入密码"]').type('q123456')
      cy.get('.login-form .login-btn').click()
      cy.url().should('not.include', '/login')

      // 3. 选择商品并购买
      cy.get('.product-image').first().click()
      cy.get('.btn-primary').click()

      // 5. 选择当前支付方式
      cy.contains(method.selector).click()

      // 6. 提交订单
      cy.get('.submit-btn').click()

      // 7. 验证支付后跳转（根据实际业务修改）
      cy.url().should('include', '/product/1')
    })
  })
})