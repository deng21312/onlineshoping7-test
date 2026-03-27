// 售后申请
describe('售后申请', () => {
  it('用户可以成功提交售后申请', () => {

    // 1. 打开你的商城
    cy.visit('http://localhost:5173')

    // 2. 输入账号
    cy.contains('登录').click()
    cy.contains('我是买家').click()
    // 3. 输入账号
    cy.get('input[placeholder="请输入用户名"]').type('123')
    // 4. 输入密码
    cy.get('input[placeholder="请输入密码"]').type('q123456')

    // 5. 点击登录按钮
    cy.get('.login-form .login-btn').click()

    // 6. 检查是否登录成功
    cy.url().should('not.include', '/login')
    // 7. 点击订单
    cy.get('[title="我的订单"] > .nav-btn-text').click()

    // ==============================================
    // 🔥 自动翻页查找【申请售后】按钮，每页等待10秒
    // ==============================================
    function findAndClickAfterSale() {
      cy.wait(10000); // 等待10秒加载

      cy.get('body').then($body => {
        // 只找订单卡片里的【申请售后】按钮（排除弹窗标题）
        const $btn = $body.find('.order-card:contains("申请售后") button:contains("申请售后")');
        if ($btn.length > 0) {
          // 找到后强制点击（解决遮挡问题）
          cy.wrap($btn).first().click({ force: true });
        } else {
          cy.contains('下一页').then($next => {
            if ($next.is(':enabled')) {
              cy.wrap($next).click();
              findAndClickAfterSale();
            } else {
              throw new Error("全部页面都已翻完，未找到【申请售后】按钮");
            }
          });
        }
      });
    }

    findAndClickAfterSale();

    // 9. 输入售后标题
    cy.get('.form-input').type('商品有质量问题，申请售后处理')
    // 10. 输入售后描述
    cy.get('.form-textarea').type('商品有质量问题，申请售后处理')
    // 11. 上传图片
    cy.get('.upload-input-hidden').selectFile(
     'cypress/fixtures/超凡大师.png',
      { force: true }
    )
    // 12. 提交售后申请
    cy.contains('提交申请').click({ force: true })
    // 13. 验证提交成功
    cy.url().should('include', '/orders')
    cy.contains('已申请售后').should('be.visible')
  })
})