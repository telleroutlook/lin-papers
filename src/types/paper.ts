export interface Paper {
  // Required fields per user specification:
  title: string;          // 标题 (必须)
  authors: string[];      // 作者 (必须)
  publishedDate: string;  // 发布日期 (必须, e.g. "2026-03-15")
  abstract: string;       // 摘要 (必须)
  keywords: string[];     // 关键词 (必须)
  content: string;        // 正文 (必须 - 支持 Markdown 与复杂 LaTeX 数学公式)
  doi: string;            // DOI (必须)

  // Optional fields:
  id?: string;            // 唯一标识 (可选，缺省自动生成)
  venue?: string;         // 发表期刊/会议 (可选)
  year?: number;          // 年份 (可选，缺省由 publishedDate 自动提取)
  category?: string;      // 专题分类 (可选，缺省为 General)
  tldr?: string;          // 核心亮点一句话总结 (可选)
  arxivId?: string;       // arXiv ID (可选)
  pdfUrl?: string;        // PDF 链接 (可选)
  codeUrl?: string;       // 代码链接 (可选)
  demoUrl?: string;       // 演示链接 (可选)
  slidesUrl?: string;     // 演示幻灯片 (可选)
  citations?: number;     // 引用次数 (可选)
  highlighted?: boolean;  // 是否精选展示 (可选)
  bibtex?: string;        // BibTeX 条目 (可选)
  award?: string;         // 奖项荣誉 (可选)
}

export interface AuthorProfile {
  name: string;
  title: string;
  affiliation: string;
  bio: string;
  email: string;
  location: string;
  scholarUrl: string;
  orcid: string;
  githubUrl: string;
  arxivUrl: string;
  twitterUrl?: string;
  cvUrl?: string;
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  researchInterests: string[];
}

export type SortOption = 'year-desc' | 'year-asc' | 'citations-desc' | 'title-asc';

export type ReadingFontSize = 'normal' | 'large' | 'larger';
export type ReadingTheme = 'paper' | 'sepia' | 'dark';
export type ReadingViewMode = 'editorial' | 'compact';
