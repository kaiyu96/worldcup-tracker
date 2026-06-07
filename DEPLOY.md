# WorldCup Tracker — 首次部署清单

## 部署前检查

在项目根目录执行：

```powershell
cd "C:\Users\z5547440\OneDrive - UNSW\Documents\GitHub\polymarket"

# 1. 安装依赖
npm install

# 2. 类型检查
npm run typecheck

# 3. Lint
npm run lint

# 4. 生产构建（Vercel 会跑同样的命令）
npm run build

# 5. 本地预览生产版本（可选）
npm run start
```

浏览器访问 http://localhost:3000，确认首页和市场页能加载数据。

---

## 应提交的文件

| 路径 | 说明 |
|------|------|
| `app/` | 页面、布局、API 路由 |
| `components/` | React 组件 |
| `lib/` | 分类、数据获取、信号逻辑 |
| `package.json` | 项目依赖与脚本 |
| `package-lock.json` | 锁定依赖版本（**必须提交**） |
| `tsconfig.json` | TypeScript 配置 |
| `next.config.ts` | Next.js 配置 |
| `tailwind.config.ts` | Tailwind 主题 |
| `postcss.config.mjs` | PostCSS 配置 |
| `eslint.config.mjs` | ESLint 配置 |
| `logo.svg` | Logo 源文件（可选，已内联到组件） |
| `.gitignore` | Git 忽略规则 |
| `DEPLOY.md` | 本部署文档 |

## 不要提交的文件

| 路径 | 原因 |
|------|------|
| `node_modules/` | 依赖目录，Vercel 会自动 `npm install` |
| `.next/` | 本地/构建缓存 |
| `.env` / `.env*.local` | 密钥（本项目暂无必需 env） |
| `.vercel/` | Vercel CLI 本地配置 |
| `.cursor/` | Cursor 本地文件 |
| `picsvg_download.svg` | 一次性转换产物，Logo 已内联 |
| 根目录 `*.png` / `*.jpg` | 设计参考图，非站点资源 |

---

## 首次 Git + GitHub 推送

```powershell
cd "C:\Users\z5547440\OneDrive - UNSW\Documents\GitHub\polymarket"

# 初始化仓库（若尚未 init）
git init

# 查看将被提交的文件（确认没有 node_modules / .next）
git status

# 暂存所有应跟踪文件
git add .

# 再次确认
git status

# 首次提交
git commit -m "Initial commit: worldcup-tracker Polymarket dashboard"

# 在 GitHub 新建空仓库后（不要勾选 README），替换为你的用户名和仓库名：
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/worldcup-tracker.git
git push -u origin main
```

> 若 `git remote add` 提示已存在，改用：  
> `git remote set-url origin https://github.com/YOUR_USERNAME/worldcup-tracker.git`

---

## Vercel 部署

### 方式 A：GitHub 连接（推荐）

1. 登录 [vercel.com](https://vercel.com)，用 GitHub 授权
2. **Add New → Project**
3. 选择 `worldcup-tracker` 仓库
4. 确认构建设置（通常自动识别）：
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: （留空，Next.js 默认）
5. **Environment Variables**：本项目无需配置（Gamma API 为公开接口）
6. 点击 **Deploy**

部署成功后获得 `https://your-project.vercel.app`。

### 方式 B：Vercel CLI（可选）

```powershell
npm i -g vercel
cd "C:\Users\z5547440\OneDrive - UNSW\Documents\GitHub\polymarket"
vercel
# 按提示登录、链接项目
vercel --prod
```

---

## 部署后验证

- [ ] 首页 `/` 显示世界杯市场统计
- [ ] `/markets/champion` 等分类页正常
- [ ] Header Logo 与导航正常
- [ ] 无 502 / Gamma API 限流（若偶发 429，刷新即可）

---

## 常见问题

**Build 失败**  
本地先跑 `npm run build`，根据报错修复后再 push。

**页面无数据 / 502**  
Polymarket Gamma API 可能限流，与 Vercel 配置无关；稍后重试。

**OneDrive 路径问题**  
若 git 或 node 异常，可将项目移到非同步目录如 `C:\dev\worldcup-tracker` 再操作。

**后续更新**  
```powershell
git add .
git commit -m "描述你的改动"
git push
```
Vercel 会自动重新部署。
