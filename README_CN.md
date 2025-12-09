# 高级搜索块

一个功能强大的WordPress高级搜索块插件，提供带有分类和标签过滤功能的搜索界面。

## 功能特点

- **关键词搜索** - 支持文章标题和内容的关键词搜索
- **分类过滤** - 按文章分类进行筛选
- **标签过滤** - 按文章标签进行筛选（可配置显示/隐藏）
- **分页功能** - 支持搜索结果分页显示（可配置显示/隐藏）
- **可配置每页显示数量** - 可自定义每页显示的文章数量
- **URL参数支持** - 搜索条件保存在URL中，支持分享和书签
- **响应式设计** - 适配各种屏幕尺寸
- **无刷新搜索** - 使用AJAX技术，无需页面刷新即可获取搜索结果

## 安装方法

1. 将插件文件夹上传到 `/wp-content/plugins/` 目录
2. 在WordPress管理后台的"插件"页面激活"Advanced Search Block"插件
3. 在页面或文章编辑器中添加"Advanced Search Block"块

## 使用方法

### 在编辑器中使用

1. 在WordPress编辑器中，点击"+"按钮添加新块
2. 搜索"Advanced Search"或浏览"小工具"分类
3. 选择"Advanced Search Block"块
4. 在右侧设置面板中配置块选项：
   - **Show Tags** - 是否显示标签筛选器
   - **Show Pagination** - 是否显示分页
   - **Posts Per Page** - 每页显示的文章数量

### 在前端使用

1. 在搜索框中输入关键词
2. 选择分类和/或标签进行筛选（可选）
3. 点击"搜索"按钮
4. 浏览搜索结果，使用分页导航查看更多结果

## 技术实现

### 前端技术

- **React** - 用于构建用户界面
- **TypeScript** - 提供类型安全
- **SCSS** - 用于样式编写
- **WordPress REST API** - 用于数据获取

### 后端技术

- **PHP** - WordPress插件开发语言
- **WordPress REST API** - 提供自定义API端点
- **WordPress Block Editor** - 集成到Gutenberg编辑器

## API端点

插件注册了以下自定义REST API端点：

- `GET /wp-json/advanced-search/v1/categories` - 获取所有分类
- `GET /wp-json/advanced-search/v1/tags` - 获取所有标签
- `GET /wp-json/advanced-search/v1/search` - 执行搜索

### 搜索参数

- `q` - 搜索关键词
- `cat` - 分类ID
- `tags[]` - 标签ID数组
- `page` - 页码
- `per_page` - 每页显示数量

## 自定义开发

### 修改样式

插件样式位于 `src/style.scss` 文件中。修改后需要运行构建命令：

```bash
npm run build
```

### 扩展功能

1. 在 `src/types.ts` 中添加新的类型定义
2. 在 `src/components/` 目录中创建新组件
3. 在 `includes/class-advanced-search-block.php` 中添加新的API端点

## 开发环境设置

1. 克隆仓库到插件目录
2. 安装依赖：

```bash
npm install
```

3. 开发模式（自动监听文件变化）：

```bash
npm run start
```

4. 构建生产版本：

```bash
npm run build
```

## 版本历史

### 1.0.0
- 初始版本
- 基本搜索功能
- 分类和标签过滤
- 分页功能
- 可配置选项

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 GPL-2.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 支持

如果您遇到任何问题或有功能建议，请在 [GitHub Issues](https://github.com/RealFelixWang/advanced-search-block/issues) 中创建一个issue。

## 作者

- **FelixWang** - 初始开发者
  - GitHub: [RealFelixWang](https://github.com/RealFelixWang)
  - 仓库: [advanced-search-block](https://github.com/RealFelixWang/advanced-search-block)

## 致谢

- WordPress 团队提供的 Block Editor API
- React 团队提供的优秀框架
- 所有贡献者和用户的支持