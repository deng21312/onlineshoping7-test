// 查看售后详情
describe('查看售后详情', () => {
  it('商家查看售后详情', () => {

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
    cy.visit('http://localhost:5173/seller/dashboard?view=afterSale')
    // 8. 查看售后详情
    // 查找并点击第一个【详情】按钮（兼容多页）
function findFirstDetailButton() {
  cy.wait(3000);
  cy.get('body').then($body => {
    const $detailBtns = $body.find('button:contains("详情")');
    if ($detailBtns.length > 0) {
      // 点击第一个详情按钮
      cy.wrap($detailBtns).first().click({ force: true });
    } else {
      cy.contains('下一页').then($next => {
        if ($next.is(':enabled')) {
          cy.wrap($next).click();
          findFirstDetailButton();
        } else {
          throw new Error("全部页面都已翻完，未找到【详情】按钮");
        }
      });
    }
  });
}
findFirstDetailButton();

    // 11. 验证发货成功
    cy.get('.dialog-header').should('exist')
  })
})