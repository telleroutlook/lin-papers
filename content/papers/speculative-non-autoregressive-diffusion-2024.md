---
title: "Score-Based Speculative Diffusion: Eliminating Sequential Bottlenecks in Discrete Planning"
authors:
  - Alistair Vance
  - Marcus Lin
  - David Chen
publishedDate: "2024-04-10"
doi: "10.48550/arXiv.2404.08832"
keywords:
  - Diffusion Models
  - Non-Autoregressive
  - Trajectory Optimization
  - Optimal Control
abstract: "Autoregressive rollouts in deep reinforcement learning suffer from high step latencies during inference. We introduce score-based continuous diffusion over token belief states, generating complete multi-step trajectory plans in 4 parallel sampling steps with superior coverage of multimodal rewards."
venue: "NeurIPS 2024 (Spotlight Paper)"
year: 2024
category: "Reasoning & Search"
citations: 147
tldr: "Reduces trajectory planning latency by 18× by substituting token-by-token generation with 4-step score-based reverse diffusion."
arxivId: "2404.08832"
codeUrl: "https://github.com/vance-lab/speculative-diffusion-planner"
---

## 1. Reverse-Time Stochastic Differential Equations

We formulate plan generation as the reversal of an Itô diffusion process that gradually perturbs candidate action sequences $\mathbf{x} \in \mathbb{R}^{H \times d}$ toward standard Gaussian noise:

$$d\mathbf{x}_t = \mathbf{f}(\mathbf{x}_t, t) dt + g(t) d\mathbf{w}_t$$

The corresponding reverse-time SDE satisfies:

$$d\mathbf{x}_t = \left[ \mathbf{f}(\mathbf{x}_t, t) - g(t)^2 \nabla_{\mathbf{x}} \log p_t(\mathbf{x}_t) \right] dt + g(t) d\bar{\mathbf{w}}_t$$

We approximate the score function $s_\theta(\mathbf{x}_t, t) \approx \nabla_{\mathbf{x}} \log p_t(\mathbf{x}_t)$ using a denoiser network trained with denoising score matching:

$$\mathcal{L}_{\text{DSM}}(\theta) = \mathbb{E}_{t, \mathbf{x}_0, \boldsymbol{\epsilon}} \left[ \left\| s_\theta\left( \alpha_t \mathbf{x}_0 + \sigma_t \boldsymbol{\epsilon}, t \right) + \frac{\boldsymbol{\epsilon}}{\sigma_t} \right\|^2 \right]$$

## 2. Fast Predictor-Corrector Sampling
By combining an exponential integrator predictor with a single-step Hamiltonian Monte Carlo corrector, we reduce the required reverse iterations from $100$ steps down to **4 steps**, achieving **$18\times$ speedup** over autoregressive planners.
