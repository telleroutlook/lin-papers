---
# ==============================================================================
# 单篇论文 Markdown 模板 (Markdown with YAML Frontmatter)
# ==============================================================================

# 【必须字段 / REQUIRED】
title: "Latent Reasoning Graphs: Scalable Self-Evolving Planning for Deep Thinking Models"
topic: "Reasoning & Search"
doi: "10.48550/arXiv.2501.09871"

# 【可选字段 / OPTIONAL】
series: "Frontiers in Cognitive Computing Series, Vol. 4"
authors:
  - Alistair Vance
  - Elena Rostova
  - Julian K. Thorne
venue: "NeurIPS 2025 (Oral Presentation)"
year: 2025
keywords:
  - Test-Time Compute
  - Latent Graph Reasoning
  - Theorem Proving
tldr: "Demonstrates that discrete search over self-supervised latent graph spaces reduces test-time compute by 4.2x while exceeding o1-preview."
citations: 218
highlighted: true
award: "Oral Presentation (Top 1.2%)"
pdfUrl: "https://arxiv.org/pdf/2501.09871"
codeUrl: "https://github.com/vance-lab/latent-reasoning-graphs"
demoUrl: "https://lrg-demo.stanford.edu"
bibtex: |
  @inproceedings{vance2025latent,
    title={Latent Reasoning Graphs: Scalable Self-Evolving Planning for Deep Thinking Models},
    author={Vance, Alistair and Rostova, Elena and Thorne, Julian K.},
    booktitle={Advances in Neural Information Processing Systems (NeurIPS)},
    year={2025}
  }
---

### Executive Summary & Problem Formulation
Autoregressive token-level Chain-of-Thought (CoT) exploration incurs quadratic context degradation and accumulates unrecoverable semantic drifting during long-horizon mathematical proofs.

### Core Contributions
- **Continuous Latent Topology**: We formulate tree-of-thought exploration as gradient-guided trajectories within low-entropy latent manifold representations, bypassing token generation until branch confirmation.
- **Energy-Based Prune & Resample**: A lightweight auxiliary energy critic evaluates branch promise at 0.04 ms per state, reducing compute budgets by 76% on competitive benchmark sets.
- **Empirical Validation**: Our methodology achieves 93.4% on MATH-500 (+8.1% over standard beam search) and solves 41 additional tasks on ARC-AGI 2024.
