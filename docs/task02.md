# Vibe Coding day 2

Time：2026.3.20

Author：PHOENIX-collab-bot





编程所需的环境及工具

思维转换：任何操作，可以先询问ai，甚至让ai帮忙操作

IDE：集成开发环境，智能化、功能丰富且强大、是一套帮助开发者高效写代码和运行程序的工具集

AI IDE = AI + IDE(ai辅助编码和修改文件)



Trae

Bulider（Agent）：

- Chat 模式：主要用于和当前文件夹里的代码对话，或者当作普通聊天模型来使用。（你可以通过左上角的 “File” 菜单打开一个文件夹，在这个文件夹中进行编辑操作。在这种情况下，Builder 创建或修改的文件都只会发生在这个文件夹内部。）
- Builder with MCP 模式：为 Agent 提供了更多可用工具（例如把语言模型和其他软件联通起来、查询天气等）。你可以简单理解为：MCP 能让语言模型更方便地调用各种外部工具。



demo构建流程：

1. 新建空文件夹并用AI　IDE打开
2. 在侧边栏中用AI（agent）设计游戏
3. 向AI追问代码实现细节（ｃｈａｔ）
4. 局部优化（优化画面、新增玩法、完善功能）





IDE界面介绍：

![img](https://datawhalechina.github.io/easy-vibe/assets/image32.CCunjUkl.webp)

其中每个部分的具体作用为：

- **Title Bar（标题栏）**：显示文件名和窗口控制按钮。
- **Activity Bar（活动栏）**：切换文件、搜索等功能视图。
- **Side Bar（侧边栏）**：展示文件列表等具体内容。
- **Editor Groups（编辑区）**：编写代码的核心区域。
- **Breadcrumbs（路径导航）**：显示文件路径，支持跳转。
- **Minimap（代码缩略图）**：快速预览和定位代码。
- **Panel（底部面板）**：包含终端和输出窗口。
- **Status Bar（状态栏）**：显示当前环境状态。





学会“说话”

向ａｉ说清楚自己的需求：从模糊想法到具体说明（从不同层面、不同组件进行阐述）

先能跑在完善（完成比完美更重要）

善用截图和复制，ａｉ善于处理这些东西并发现问题

遇到ａｉ生成的代码效果不达预期甚至错误时：先说明现状，把完整代码喂给ａｉ，有报错就把报错信息给它，最后向它描述应该实现的对照







## 俄罗斯方块游戏项目结构

- package.json - 项目配置文件，包含React和Vite依赖
- vite.config.js - Vite构建工具配置
- index.html - 应用入口HTML文件
- src/main.jsx - React应用入口
- src/index.css - 游戏样式文件
- src/App.jsx - 游戏主逻辑
- .gitignore - Git版本控制忽略文件