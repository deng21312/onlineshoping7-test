// 增加地址
describe('增加地址', () => {
  it('买家可以成功增加地址', () => {

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
    // 7. 进入地址管理
    cy.visit('http://localhost:5173/address')
    // 8. 点击增加地址按钮
    cy.contains('新增地址').click()
    // 9. 输入地址信息
    cy.get('input[placeholder="请输入收货人姓名"]').type('张三')
    cy.get('input[placeholder="请输入手机号"]').type('13800138000')
    cy.contains('请选择省').click()
    cy.get(':nth-child(1) > .option-text').click({ force: true }) // 强制点击第一个选项（北京市）

    // 选市（省选完后，市下拉框才会激活）
    cy.contains('请选择市').click()
    cy.get(':nth-child(1) > .option-text').click({ force: true }) // 强制点击第一个选项（北京市只有一个市）

    // 选区县（市选完后，区县下拉框才会激活）
    cy.contains('请选择区/县').click()
    cy.get(':nth-child(1) > .option-text') .click({ force: true }) // 强制点击第一个选项（北京市朝阳区）
    
    // --- 修复详细地址输入：匹配页面实际 placeholder ---
    cy.get('input[placeholder="街道、门牌号、楼栋房号等"]')
      .type('北京市朝阳区某某街道某某号')
    // 10. 保存地址
    cy.contains('保存').click()
    // 11. 验证地址添加成功
    cy.get('.modal-content').should('not.exist')
    
  })
})