---
title: "Closed-Form Invariant Solutions for Direct Preference Optimization in Foundation Models"
authors:
  - Alistair Vance
  - Julian K. Thorne
  - Sophia L. Wei
publishedDate: "2023-11-05"
doi: "10.48550/arXiv.2311.02984"
keywords:
  - Preference Optimization
  - RLHF
  - Implicit Rewards
  - Alignment
abstract: "Reinforcement Learning from Human Feedback (RLHF) via PPO is notoriously unstable. Direct Preference Optimization (DPO) derives an implicit reward, but lacks monotonic alignment guarantees under out-of-distribution shifts. We prove exact closed-form boundary invariants that eliminate policy collapse."
venue: "NeurIPS 2023 (Poster Presentation)"
year: 2023
category: "Alignment & Safety"
citations: 430
tldr: "Derives exact closed-form invariant bounds for preference optimization that eliminate policy drift and over-optimization in large reasoning models."
arxivId: "2311.02984"
pdfUrl: "https://arxiv.org/pdf/2311.02984"
---

## 1. Bradley-Terry Implicit Formulation

Given a reference policy $\pi_{\text{ref}}$, the optimal policy $\pi^*$ under a general reward function $r(x, y)$ subject to KL regularization is given by:

$$\pi^*(y \mid x) = \frac{\pi_{\text{ref}}(y \mid x) \exp\left( \frac{1}{\beta} r(x, y) \right)}{\mathcal{Z}(x)}, \quad \mathcal{Z}(x) = \sum_{y'} \pi_{\text{ref}}(y' \mid x) \exp\left( \frac{1}{\beta} r(x, y') \right)$$

Solving for the implicit reward $r(x, y)$ yields the exact algebraic identity:

$$r(x, y) = \beta \log \frac{\pi^*(y \mid x)}{\pi_{\text{ref}}(y \mid x)} + \beta \log \mathcal{Z}(x)$$

Under the Bradley-Terry preference model $p(y_w \succ y_l \mid x) = \sigma(r(x, y_w) - r(x, y_l))$, the partition function $\mathcal{Z}(x)$ cancels out identically:

$$\mathcal{L}_{\text{DPO}}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} \right) \right]$$

## 2. Invariant Margin Regularizer
To prevent probability mass degradation on out-of-distribution prompts, we prove that bounding the variance of log-ratios stabilizes training:

$$\mathbb{V}_{(x, y) \sim \pi_\theta} \left[ \log \frac{\pi_\theta(y \mid x)}{\pi_{\text{ref}}(y \mid x)} \right] \le \frac{2}{\beta^2} \log \left( 1 + \|r\|_\infty \right)$$
