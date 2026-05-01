# Twitter — 前端

模擬 Twitter 核心功能的全端社群平台，前端以 Vue 2 構建，支援即時聊天與通知推播。

---

## 功能總覽

### 一般使用者

| 功能 | 說明 |
|------|------|
| 註冊 / 登入 | 建立帳號並以 JWT 驗證身份 |
| 推文牆 | 瀏覽所有人的推文，支援無限捲動式列表 |
| 發推文 | 撰寫並發布推文（字數限制 140 字） |
| 推文互動 | 對推文按讚、留下回覆，查看回覆串 |
| 個人頁面 | 查看自己或他人的推文、回覆、按讚列表 |
| 追蹤系統 | 追蹤 / 取消追蹤其他使用者，查看粉絲與追蹤清單 |
| 熱門推薦 | 側邊欄顯示追蹤人數最多的使用者排行 |
| 帳號設定 | 修改帳號名稱、Email、密碼、頭像與封面圖片 |
| 通知中心 | 接收被按讚、被回覆、被追蹤等即時通知，支援全部已讀與單筆刪除 |
| 公開聊天室 | 即時廣播聊天，顯示目前上線使用者清單 |
| 私人訊息 | 一對一私訊，支援未讀計數、訊息收回功能 |

### 管理員

| 功能 | 說明 |
|------|------|
| 管理員登入 | 獨立的管理員帳號入口 |
| 推文管理 | 瀏覽全站所有推文並可強制刪除 |
| 使用者管理 | 瀏覽所有使用者資訊與推文數量統計 |

---

## 技術棧

| 類別 | 套件 |
|------|------|
| 前端框架 | Vue 2 |
| 狀態管理 | Vuex |
| 路由 | Vue Router |
| HTTP 請求 | Axios |
| 即時通訊 | Socket.IO Client |
| 時間處理 | Moment.js |
| 身份驗證 | JWT Decode |
| 提示元件 | SweetAlert2 |

版面切版全為手刻，未使用 Bootstrap 等 CSS 框架；大型排版採用 Grid，細部調整使用 Flexbox。

---

## 本地安裝與啟動

**環境需求：** Node.js 14+

```bash
# 安裝相依套件
npm install

# 開發模式（含 hot-reload）
npm run serve

# 建置正式版本
npm run build

# 程式碼檢查與修正
npm run lint
```

> 前端預設連線至 `http://localhost:3000`，請確認後端 API 服務已啟動。

---

## 路由結構

```
/signin                 使用者登入
/signup                 使用者註冊
/main                   推文牆（首頁）
/tweets/:id             推文詳細頁
/user/self/:type        自己的個人頁（tweets / comments / likes）
/user/:id/:type         他人的個人頁
/user/:id/followings    追蹤清單
/user/:id/followers     粉絲清單
/setting                帳號設定
/notifications          通知中心
/chat/public            公開聊天室
/chat/private           私人訊息列表
/chat/private/:id       與指定使用者的私訊
/admin/signin           管理員登入
/admin/tweets           管理員 — 推文管理
/admin/users            管理員 — 使用者管理
```

---

## 目錄結構

```
src/
├── apis/           API 呼叫模組（admin / chat / notifications / tweets / users）
├── assets/         靜態資源
├── components/     可複用元件
├── router/         Vue Router 路由設定
├── store/          Vuex 狀態管理
├── utility/        共用工具函式與 mixins
└── views/          頁面元件
```
