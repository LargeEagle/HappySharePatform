# 測試數據說明

## 📊 數據摘要

執行 seed 後，資料庫包含以下測試數據：

- **用戶**: 5 位
- **文章**: 11 篇（10 篇已發布，1 篇草稿）
- **評論**: 15 條
- **點讚**: 28 個
- **收藏**: 9 個

## 👥 測試帳號

所有測試帳號的密碼都是：`Test@1234`

| Email | 用戶名 | 姓名 | 簡介 |
|-------|--------|------|------|
| alice@happyshare.com | alice | Alice Wang | 喜歡分享生活中的美好時刻 ✨ |
| bob@happyshare.com | bob | Bob Chen | 攝影愛好者 📷 \| 旅行者 🌍 |
| carol@happyshare.com | carol | Carol Lee | 美食探索者 🍜 \| 分享快樂 |
| david@happyshare.com | david | David Lin | 科技愛好者 💻 \| 學習分享 |
| emma@happyshare.com | emma | Emma Zhang | 音樂人 🎵 \| 創作分享 |

## 📝 測試文章列表

### 已發布的文章

1. **今天的陽光真好！** - Alice Wang
   - 內容：分享美好天氣和心情
   - 點讚：3 個 | 評論：2 條

2. **分享我的新攝影作品** - Bob Chen
   - 內容：陽明山夕陽攝影作品
   - 點讚：3 個 | 評論：2 條
   - 收藏：2 個

3. **發現一家超棒的拉麵店！** - Carol Lee
   - 內容：美食推薦
   - 點讚：4 個 | 評論：2 條
   - 收藏：1 個

4. **學習 React Native 的心得分享** - David Lin
   - 內容：技術學習心得
   - 點讚：2 個 | 評論：2 條
   - 收藏：2 個

5. **新歌創作中...** - Emma Zhang
   - 內容：音樂創作分享
   - 點讚：3 個 | 評論：2 條
   - 收藏：1 個

6. **週末爬山記** - Alice Wang
   - 內容：戶外活動分享
   - 點讚：1 個 | 評論：1 條

7. **咖啡拉花練習中** - Carol Lee
   - 內容：咖啡拉花學習
   - 點讚：1 個 | 評論：1 條

8. **TypeScript 最佳實踐** - David Lin
   - 內容：程式設計技巧
   - 點讚：1 個 | 評論：1 條
   - 收藏：2 個

9. **音樂節表演回顧** - Emma Zhang
   - 內容：音樂表演經驗
   - 點讚：1 個 | 評論：1 條

10. **讀書分享：原子習慣** - Bob Chen
    - 內容：書籍閱讀心得
    - 點讚：1 個 | 評論：1 條
    - 收藏：1 個

### 草稿

11. **未完成的想法** - Alice Wang
    - 內容：尚未完成的草稿

## 💬 評論互動

測試數據包含真實的社交互動：

- 用戶之間相互評論
- 對不同文章發表看法
- 友善和支持性的評論內容

## 👍 點讚和收藏

- **文章點讚**：20 個
- **評論點讚**：8 個
- **文章收藏**：9 個

## 🔄 重新填充數據

如果需要重置數據庫並重新填充測試數據：

```bash
cd backend

# 方式 1: 使用 npm script
npm run prisma:seed

# 方式 2: 直接執行
npx ts-node prisma/seed.ts

# 方式 3: 使用 Prisma CLI
npx prisma db seed
```

⚠️ **注意**：執行 seed 會清除現有的所有數據！

## 📦 數據結構

### 用戶統計自動更新

seed 腳本會自動更新用戶的統計數據：
- `postsCount`: 用戶發布的文章數量
- `totalLikes`: 用戶獲得的總點讚數（文章 + 評論）

### 頭像

所有用戶使用 [pravatar.cc](https://pravatar.cc/) 提供的測試頭像。

## 🧪 測試建議

### 登入測試

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@happyshare.com",
    "password": "Password123"
  }'
```

### 獲取文章列表

```bash
curl http://localhost:5000/api/posts?page=1&limit=10
```

### 獲取用戶信息

首先獲取任一用戶 ID，然後：

```bash
curl http://localhost:5000/api/users/{userId}
```

## 🎨 前端測試

使用這些測試帳號登入前端應用：

1. **Alice** - 內容創作者，有多篇文章
2. **Bob** - 攝影愛好者，技術分享
3. **Carol** - 美食探索者，生活分享
4. **David** - 技術愛好者，學習筆記
5. **Emma** - 音樂人，創作分享

每個帳號都有不同的內容風格，可以測試各種使用場景。

## 📊 使用 Prisma Studio 查看

想要視覺化查看數據：

```bash
cd backend
npx prisma studio
```

瀏覽器會自動打開 http://localhost:5555，您可以：
- 查看所有表格數據
- 編輯記錄
- 添加新數據
- 查看關聯關係

## 🗂️ 數據庫表格

Seed 填充的表格：

1. **User** - 用戶表
2. **Post** - 文章表
3. **Comment** - 評論表
4. **Like** - 點讚表（支持文章和評論）
5. **Bookmark** - 收藏表

## 💡 擴展建議

如果需要更多測試數據，可以修改 `prisma/seed.ts`：

- 增加更多用戶
- 創建更多文章
- 添加更複雜的互動
- 測試邊界情況

---

**最後更新**: 2025-10-29  
**Seed 腳本**: `backend/prisma/seed.ts`
