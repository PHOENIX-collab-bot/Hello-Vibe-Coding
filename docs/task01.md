# VibeCoding 开篇

Time：2026.3.16-2.26.3.17

Author：PHOENIX-collab-bot



## 环境

随着LLM的出现和AI的飞速进步，以及软件需求的日益增长，Vibe Coding的受众越来越广，使用AI的能力变得愈加重要



## 方式

基于项目来学习和训练（更加实用和高效）



## 辅助能力

- 学会如何提问和解决问题

- 对AI的能力有清醒的认知
- 项目级prompt





## Demo实战：AI原生贪吃蛇

### 基础功能实现

开发环境：Trae+Web

![image-20260317120725211](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20260317120725211.png)

prompt：

```txt
帮我做一个贪吃蛇游戏： 
 1. 用方向键控制蛇的移动 
 2. 吃到食物后蛇会变长，分数增加 
 3. 撞到墙壁或自己的身体就游戏结束 
 4. 要有开始和重新开始按钮 
 5. 使用黑客帝国的风格
```



### 拓展模块

prompt:

```
现在在此基础上新增一些功能，我可以吃不同的单词，它们会被收集在一个盒子里
当蛇吃了8个单词时，llm 应该根据这些单词创作一首诗，我们可以根据需要重新混合这首诗。
当诗完成后，下一步将自动根据这首诗创建一幅图像。

优化一下界面，不要纵向布局，视觉效果不太行，诗歌和图片模块排在游戏页面的右侧，既然图片可以调用API，诗歌部分也帮我调用API

虽然你调整了，但是初始页面看得很奇怪，因为右边知道吃了8个词后才会出现，所以我想要右边框架在初始时不要隐藏，此外，调整一下页面的纵向布局，因为用户在游玩的时候页面也会跟着滑动（上下）体验不好
```



最终效果预览：

![image-20260317115520905](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20260317115520905.png)

![image-20260317115612899](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20260317115612899.png)

> 调用生成图片的API出图太慢了，所以显示不出来x_x



### 创新点

新增“成就”模块



prom：

```
新增“成就”机制，用户每获得100分就解锁一个新的单词（意向美好的单词，总共10个），可以在页面的“成就”按钮中查看进度

布局不是很好，可以把成就按钮放在角落，不要占用太大位置，还有这个滚动条有点突兀了，这十个词主题改成科技吧，毕竟是黑客帝国的风格

按钮很奇怪啊，要不改成一个简易图标好了，emoji（皇冠）鼠标悬浮展示成就，记得符合主题
```



最终效果：

![image-20260317121400333](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20260317121400333.png)



## 了解基础知识：前端三件套

- HTML
- CSS
- JavaScript

- 框架：React、Vue3



## Reference

- https://datawhalechina.github.io/easy-vibe/zh-cn/stage-0/0.2-ai-capabilities-through-games/