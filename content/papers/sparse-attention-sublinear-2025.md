---
title: "Sublinear Speculative Attention for Multi-Million Token Long-Context Transformer Inference"
authors:
  - Alistair Vance
  - David Chen
  - Siddharth Nair
  - Kavita Patel
publishedDate: "2025-05-12"
doi: "10.48550/arXiv.2505.04128"
keywords:
  - Sparse Attention
  - KV Cache
  - Inference Optimization
  - Kernel Design
abstract: "Transformer self-attention incurs quadratic complexity with context length N. We design a hardware-aware speculative attention mechanism with sublinear memory consumption. By leveraging dynamic cluster centroids and blockwise Taylor approximations, we compress KV caches by 85% with zero degradation in retrieval accuracy."
venue: "ICLR 2025 (Spotlight)"
year: 2025
category: "Inference & Systems"
citations: 184
highlighted: true
tldr: "Achieves 85% KV-cache memory reduction across 4M token context windows with provable lossless precision using custom FlashDecoding kernels."
arxivId: "2505.04128"
pdfUrl: "https://arxiv.org/pdf/2505.04128"
codeUrl: "https://github.com/vance-lab/sublinear-sparse-attention"
---

## 1. Architectural Formulation & Kernel Decomposition

Full scaled dot-product attention computes:

$$\mathbf{A} = \text{Softmax}\left( \frac{\mathbf{Q} \mathbf{K}^\top}{\sqrt{d_k}} + \mathbf{M} \right) \mathbf{V}$$

For sequence length $N = 2 \times 10^6$, storing the key-value cache $\mathbf{K}, \mathbf{V} \in \mathbb{R}^{N \times d}$ requires over $120\text{ GB}$ of high-bandwidth memory (HBM3e). We replace the dense attention matrix with a low-rank speculative kernel:

$$\mathbf{A}_{i,j} = \frac{\exp\left( \frac{\mathbf{q}_i^\top \mathbf{k}_j}{\sqrt{d_k}} - \Omega_{i,j} \right)}{\sum_{l=1}^N \exp\left( \frac{\mathbf{q}_i^\top \mathbf{k}_l}{\sqrt{d_k}} - \Omega_{i,l} \right)}, \quad \Omega_{i,j} = \begin{cases} 0 & \text{if } j \in \mathcal{S}_i \\ \infty & \text{otherwise} \end{cases}$$

Where the active sparsity set $\mathcal{S}_i$ is dynamically pruned via hyper-plane locality hashing:

$$\mathcal{S}_i = \left\{ j : \left\langle h(\mathbf{q}_i), h(\mathbf{k}_j) \right\rangle \ge \tau_i \right\} \cup \left\{ i-w, \dots, i \right\}$$

## 2. Theoretical Bound on Attention Error

Let $\hat{\mathbf{A}}$ be our sparse approximation. We prove an $L_1$ approximation bound with respect to full attention $\mathbf{A}$:

$$\|\mathbf{A} - \hat{\mathbf{A}}\|_{1} \le 2 \sum_{j \notin \mathcal{S}_i} \frac{\exp\left(\frac{\mathbf{q}_i^\top \mathbf{k}_j}{\sqrt{d_k}}\right)}{\sum_{l=1}^N \exp\left(\frac{\mathbf{q}_i^\top \mathbf{k}_l}{\sqrt{d_k}}\right)} \le 2 N \cdot \exp\left( -\frac{\Delta^2}{2 \sigma^2} \right)$$

Where $\Delta = \min_{j \in \mathcal{S}_i} \mathbf{q}_i^\top \mathbf{k}_j - \max_{l \notin \mathcal{S}_i} \mathbf{q}_i^\top \mathbf{k}_l$.

## 3. FlashDecoding Kernel Implementation
Our custom CUDA kernel runs directly inside SRAM without spilling intermediate activations to DRAM, delivering **3.4× higher throughput** at $4\text{M}$ context length on 8× NVIDIA H100 SXM5 nodes.
