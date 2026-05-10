// 商家发货
describe('商家发货', () => {
  it('商家可以成功发货', () => {

    // 1. 打开你的商城
    cy.visit('http://localhost:5173')

    // 2. 输入账号
    cy.contains('登录').click()
    cy.contains('我是卖家').click()
    // 3. 输入账号
    cy.get('input[placeholder="请输入账户名"]').type('admin')
    // 4. 输入密码
    cy.get('input[placeholder="请输入密码"]').type('admin')

    // 5. 点击登录按钮
    cy.get('.login-form .login-btn').click()

    // 6. 检查是否登录成功
    cy.url().should('not.include', '/login')
    // 7. 进入订单管理
    cy.visit('http://localhost:5173/seller/dashboard?view=orders')
    // 8. 点击发货按钮
    cy.contains('待发货', { timeout: 15000 })
      .first()
      .closest('tr')
      .find('.ship-btn')
      .click({ force: true })
    // 9. 输入物流信息
    cy.get('.ship-dropdown-btn').click()
    cy.contains('顺丰速运').click()
    cy.get('.ship-input').type('SF123456789')
    // 10. 确认发货
    cy.contains('确认发货').click()

    // 11. 验证发货成功
    cy.contains('订单发货').should('not.exist', { timeout: 10000 })
  })
})