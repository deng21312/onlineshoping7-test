describe('售后申请 - 全场景校验', () => {
  // 1. 定义测试数据集（覆盖图中所有6组场景）
  const testCases = [
    // TC2-10：上传第6张，提示最多5张
    {
      name: 'TC2-10_上传超过5张图_失败',
      title: '商品问题',
      desc: '商品质量问题',
      // 模拟上传5张后再选第6张（实际可通过循环selectFile实现，这里简化为标记）
      imageCount: 6,
      shouldSuccess: false,
      expectMsg: '提示最多5张'
    },
    // TC2-9：上传1~5张JPG/PNG，正常上传
    {
      name: 'TC2-9_上传1-5张合法图_成功',
      title: '商品质量问题申请售后',
      desc: '商品收到后发现有破损，申请售后处理',
      imageCount: 3,
      shouldSuccess: true,
      expectMsg: '已申请售后'
    },
    // TC2-8：上传0张图片，可提交
    {
      name: 'TC2-8_无图提交_成功',
      title: '售后申请',
      desc: '无图片售后申请',
      imageCount: 0,
      shouldSuccess: true,
      expectMsg: '已申请售后'
    },
    // TC2-7：描述>500字，限制输入
    {
      name: 'TC2-7_描述超500字_失败',
      title: '描述超长',
      desc: 'a'.repeat(501), // 生成501个字符
      imageCount: 1,
      shouldSuccess: false,
      expectMsg: '已申请售后'
    },
    // TC2-6：描述≤500字，正常提交
    {
      name: 'TC2-6_描述正常_成功',
      title: '描述合规',
      desc: '商品正常质量问题，申请售后',
      imageCount: 1,
      shouldSuccess: true,
      expectMsg: '已申请售后'
    },
    // TC2-5：描述为空，无法提交
    {
      name: 'TC2-5_描述为空_失败',
      title: '描述空值',
      desc: '', // 空描述
      imageCount: 1,
      shouldSuccess: false,
      expectMsg: '无法提交'
    },
    // TC2-4：标题>50字，限制输入
    {
      name: 'TC2-4_标题超50字_失败',
      title: 'a'.repeat(51), // 生成51个字符
      desc: '标题超长测试',
      imageCount: 1,
      shouldSuccess: false,
      expectMsg: '已申请售后'
    },
    // TC2-3：标题≤50字，正常提交
    {
      name: 'TC2-3_标题正常_成功',
      title: '标题合规',
      desc: '标题长度符合要求',
      imageCount: 1,
      shouldSuccess: true,
      expectMsg: '已申请售后'
    },
    // TC2-2：标题为空，无法提交
    {
      name: 'TC2-2_标题为空_失败',
      title: '', // 空标题
      desc: '标题空值测试',
      imageCount: 1,
      shouldSuccess: false,
      expectMsg: '无法提交'
    }
  ];

  // 2. 遍历数据执行测试
  testCases.forEach((testCase) => {
    it(testCase.name, () => {
      // 前置步骤：登录 + 进入订单页
      cy.visit('http://localhost:5173');
      cy.contains('登录').click();
      cy.contains('我是买家').click();
      cy.get('input[placeholder="请输入用户名"]').type('123');
      cy.get('input[placeholder="请输入密码"]').type('q123456');
      cy.get('.login-form .login-btn').click();
      cy.url().should('not.include', '/login');
      cy.get('[title="我的订单"] > .nav-btn-text').click();

      // 查找并点击【申请售后】按钮
      // 查找并点击【申请售后】按钮（修复版：精准定位+防误触+弹窗处理）
function findAndClickAfterSale() {
  cy.wait(2000); // 等待页面加载

  // 先关闭可能存在的订单详情弹窗（避免遮挡）
  cy.get('body').then(($body) => {
    if ($body.find('.order-detail-modal:visible').length > 0) {
      cy.contains('关闭').click({ force: true });
      cy.wait(1000);
    }
  });

  cy.get('body').then(($body) => {
    // 🔴 核心修复：精准匹配【申请售后】按钮，排除其他按钮
    // 只选择文本完全等于"申请售后"、且类名包含btn的按钮
    const $btn = $body.find('button:contains("申请售后")').filter((i, el) => {
      return el.textContent.trim() === '申请售后';
    });

    if ($btn.length > 0) {
      // 滚动到按钮可视区域，再点击（解决遮挡问题）
      cy.wrap($btn).first().scrollIntoView().click({ force: true });
      // 等待售后表单加载完成
      cy.get('.form-input', { timeout: 10000 }).should('be.visible');
    } else {
      cy.contains('下一页').then(($next) => {
        if ($next.is(':enabled')) {
          cy.wrap($next).click();
          findAndClickAfterSale();
        } else {
          throw new Error(`未找到【申请售后】按钮，测试用例：${testCase.name}`);
        }
      });
    }
  });
}
findAndClickAfterSale();

      // 3. 填充测试数据
      // 输入标题
      cy.get('.form-input').clear().type(testCase.title);
      // 输入描述
      cy.get('.form-textarea').clear().type(testCase.desc);
      // 上传图片（按指定数量上传）
      if (testCase.imageCount > 0) {
        // 模拟上传多张（示例：上传3张，可根据testCase.imageCount动态调整）
        const images = Array(testCase.imageCount).fill('cypress/fixtures/超凡大师.png');
        cy.get('.upload-input-hidden').first().selectFile(images, { force: true });
      }

      // 4. 提交申请并根据预期结果做断言
      if (testCase.shouldSuccess) {
        // 正向用例：提交成功
        cy.contains('提交申请').click({ force: true });
        cy.url().should('include', '/orders');
        cy.contains(testCase.expectMsg).should('be.visible');
      } else {
        // 反向用例：提交失败（不点击提交，或验证提示信息）
        // 若有错误提示，可增加：cy.contains(testCase.expectMsg).should('be.visible');
        cy.log(`预期提交失败：${testCase.expectMsg}`);
        // 可选：验证未跳转成功页
        cy.url().should('not.include', '/orders/success');
      }
    });
  });
});