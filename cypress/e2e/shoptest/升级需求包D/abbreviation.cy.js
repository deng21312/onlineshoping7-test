import 'cypress-file-upload'

describe('商品介绍缩写-数据驱动', () => {
  const testCases = require('../../../fixtures/升级需求包D/abbreviation.json')

  testCases.forEach((data, index) => {
    it(`第 ${index + 1} 组数据 - ${data.productName}`, () => {
      // 1. 打开商城并登录
      cy.visit('http://localhost:5173')
      cy.contains('开店').click()
      cy.contains('立即登录').click()
      cy.get('#seller-password').type(data.password)
      cy.get('#seller-username').type(data.username)
      cy.get('.login-form .login-btn').click()

      // 2. 发布商品
      cy.get('#product-name').type(data.productName)
      cy.get('#product-price').type(data.productPrice)
      cy.get('#product-stock').type(data.productStock)
      cy.get('.ql-editor').type(data.productDesc)

      // 3. 上传图片
      cy.get('input[type="file"]', { timeout: 10000 })
        .first()
        .attachFile(data.imageFile, { force: true })
      cy.wait(1000)
      cy.get('.btn-primary').click()
      // 4. 检测简介是否压缩为30字
      cy.visit('http://localhost:5173/m/10/') 
      const expectedPreview = data.productDesc.slice(0, 30)
      cy.get(':nth-child(1) > .product-info > .product-description > span')
        .should('be.visible')
        .and('contain', expectedPreview) // 核心：只要包含前30字即可，避免...导致的精确匹配失败
        .and('not.contain', data.productDesc) // 确保列表页没有显示完整描述
    })
  })
})
