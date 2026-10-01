---
title: "Hamiltonian Differentiable World Models: Enforcing Conservation Laws in Video Rollouts"
authors:
  - Alistair Vance
  - Kenji Takahashi
  - Elena Rostova
publishedDate: "2024-06-20"
doi: "10.1109/CVPR.2024.18921"
keywords:
  - World Models
  - Hamiltonian Mechanics
  - Diffusion Models
  - Physical AI
abstract: "Generative video models suffer from perceptual drift, hallucinations, and violations of basic physical laws during extended multi-second rollouts. We integrate Hamiltonian energy equations into the latent bottleneck of spatio-temporal diffusion models to enforce geometric phase space volume preservation."
venue: "CVPR 2024 (Conference Publication)"
year: 2024
category: "Multimodal & World Models"
award: "Best Paper Finalist"
citations: 312
tldr: "Guarantees exact conservation of momentum and energy across 1,200 continuous simulated video frames using symplectic latent neural integrators."
arxivId: "2403.09112"
pdfUrl: "https://arxiv.org/pdf/2403.09112"
---

## 1. Hamiltonian Symplectic Manifold Structure

Classical mechanics describes physical states in phase space $(\mathbf{q}, \mathbf{p}) \in \mathbb{R}^{2d}$ where $\mathbf{q}$ denotes generalized coordinates and $\mathbf{p}$ denotes conjugate momenta. The total energy Hamiltonian $\mathcal{H}(\mathbf{q}, \mathbf{p})$ satisfies Hamilton's canonical equations:

$$\frac{d\mathbf{q}}{dt} = \frac{\partial \mathcal{H}}{\partial \mathbf{p}}, \quad \frac{d\mathbf{p}}{dt} = -\frac{\partial \mathcal{H}}{\partial \mathbf{q}}$$

By Liouville's theorem, phase space volume is strictly conserved along the Hamiltonian flow:

$$\nabla \cdot \mathbf{v}_{\mathcal{H}} = \sum_{i=1}^d \left( \frac{\partial}{\\partial q_i} \frac{\partial \mathcal{H}}{\partial p_i} - \frac{\partial}{\partial p_i} \frac{\partial \mathcal{H}}{\partial q_i} \right) = 0$$

## 2. Symplectic Integrator Diffusion Bottleneck

To integrate the learned Hamiltonian $\mathcal{H}_\theta$ within a deep network, we employ a symplectic Verlet leapfrog integrator:

$$\begin{aligned}
\mathbf{p}_{t + \frac{\Delta t}{2}} &= \mathbf{p}_t - \frac{\Delta t}{2} \nabla_{\mathbf{q}} \mathcal{H}_\theta\left( \mathbf{q}_t, \mathbf{p}_{t + \frac{\Delta t}{2}} \right) \\
\mathbf{q}_{t + \Delta t} &= \mathbf{q}_t + \frac{\Delta t}{2} \left[ \nabla_{\mathbf{p}} \mathcal{H}_\theta\left( \mathbf{q}_t, \mathbf{p}_{t + \frac{\Delta t}{2}} \right) + \nabla_{\mathbf{p}} \mathcal{H}_\theta\left( \mathbf{q}_{t + \Delta t}, \mathbf{p}_{t + \frac{\Delta t}{2}} \right) \right] \\
\mathbf{p}_{t + \Delta t} &= \mathbf{p}_{t + \frac{\Delta t}{2}} - \frac{\Delta t}{2} \nabla_{\mathbf{q}} \mathcal{H}_\theta\left( \mathbf{q}_{t + \Delta t}, \mathbf{p}_{t + \frac{\Delta t}{2}} \right)
\end{aligned}$$

This formulation guarantees that energy drift is strictly bounded over thousands of time steps:

$$\left| \mathcal{H}(\mathbf{q}_T, \mathbf{p}_T) - \mathcal{H}(\mathbf{q}_0, \mathbf{p}_0) \right| = \mathcal{O}(\Delta t^2)$$
