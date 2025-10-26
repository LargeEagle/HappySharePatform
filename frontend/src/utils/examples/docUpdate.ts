import { updateDevDocs } from '../devDocs';

// 使用示例：
// 當完成新功能時
updateDevDocs({
  type: 'feature',
  title: '完成用戶認證基礎架構',
  details: [
    '實現登入和註冊頁面',
    '配置認證導航流程',
    '建立認證相關服務和 Hooks'
  ]
});

// 當修復問題時
updateDevDocs({
  type: 'fix',
  title: '修復登入表單驗證問題',
  details: [
    '添加電子郵件格式驗證',
    '改進錯誤訊息顯示'
  ]
});

// 當重構代碼時
updateDevDocs({
  type: 'refactor',
  title: '重構認證狀態管理',
  details: [
    '使用 Context API 重構狀態管理',
    '優化 Hook 的性能'
  ]
});