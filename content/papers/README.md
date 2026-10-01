# 论文目录发布规范 (Papers Publishing Guide)

此目录 (`content/papers/`) 是本学术作品集的所有论文源文件仓库。
无需任何后台管理系统，**只需在此目录下新增或提交 `.md` 文件即可自动发布新论文**。

---

## 文件命名规范

推荐使用英文字母、数字和短横线，例如：
`content/papers/scalable-latent-reasoning.md`
系统会自动将文件名（去除 `.md`）作为该论文的唯一 URL 锚点和标识符。

---

## 结构化文件模板 (YAML Frontmatter + Markdown Body)

每个 Markdown 文件的顶部使用 `---` 包裹 YAML 元数据：

```markdown
---
# ==========================================
# 7 项必需字段 (REQUIRED)
# ==========================================
title: "论文完整标题：创新算法与数学推导"
authors:
  - 第一作者姓名
  - 第二作者姓名
  - 合作导师姓名
publishedDate: "2026-03-15"
doi: "10.48550/arXiv.2603.12345"
keywords:
  - Latent Reasoning
  - Optimization
  - AI Safety
abstract: "这里是简明摘要。概括核心研究问题、技术创新以及实验基准提升。"

# ==========================================
# 可选字段 (OPTIONAL - 皆可缺省)
# ==========================================
venue: "NeurIPS 2026 (Oral)"           # 发表会议或期刊
year: 2026                             # 若缺省，自动从 publishedDate 提取
category: "Reasoning & Search"         # 分类标签（例如：Reasoning & Search, Inference & Systems 等）
tldr: "一句话核心亮点总结，供读者快速浏览。"
award: "Oral Presentation (Top 1%)"    # 获奖或演讲荣誉
citations: 0                           # 引用次数
highlighted: true                      # 是否在精选亮点中置顶展示
arxivId: "2603.12345"                  # arXiv 编号
pdfUrl: "https://arxiv.org/pdf/..."    # PDF 下载链接
codeUrl: "https://github.com/..."      # 开源开源代码链接
demoUrl: "https://..."                 # 交互式 Demo 地址
---

## 1. 研究背景与理论推导

正文支持标准的 Markdown 排版与 **KaTeX 复杂数学公式**。

### 行内公式示例
状态空间定义为 $\mathbf{z} \in \mathcal{Z} \subset \mathbb{R}^d$，转移步长为 $\Delta t$。

### 独立块级多行公式示例
$$\min_{\theta} \mathbb{E}_{\mathbf{z} \sim \mathcal{Z}} \left[ \mathcal{L}_{\text{planning}}(\mathbf{z}_t, \mathbf{z}^*) + \lambda \sum_{k=1}^K \nabla_{\mathbf{z}} \mathcal{E}_\phi(\mathbf{z}_k) \right]$$

### 分段函数与偏微分矩阵
$$\Omega_{i,j} = \begin{cases} 
0 & \text{if } j \in \mathcal{S}_i \\ 
\infty & \text{otherwise} 
\end{cases}, \quad \frac{\partial \mathcal{H}}{\partial \mathbf{p}} = \dot{\mathbf{q}}$$

## 2. 实验基准对比
- 提升测试时推理效率 4.2×
- MATH-500 基准取得 93.4% 准确率
```
