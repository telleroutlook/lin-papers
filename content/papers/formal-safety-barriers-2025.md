---
title: "Provable Invariants in Agentic AI: Discrete Control Barrier Certificates for Code Execution"
authors:
  - Alistair Vance
  - Sophia L. Wei
  - Henrik Lindqvist
publishedDate: "2025-02-14"
doi: "10.48550/arXiv.2502.11044"
keywords:
  - Formal Verification
  - Safety Guarantees
  - Control Barrier Functions
  - AI Safety
abstract: "Autonomous tool-use agents frequently violate privilege boundaries during iterative script invocation. We introduce discrete Control Barrier Certificates that constrain agent action proposals to provably forward-invariant safe sub-manifolds, guaranteeing zero privilege escalation even under adversarially injected instructions."
venue: "ICML 2025 (Selected Publication)"
year: 2025
category: "Alignment & Safety"
citations: 92
highlighted: true
tldr: "Guarantees zero-privilege-escalation in autonomous terminal tool agents using quadratic programming projection onto control barrier submanifolds."
arxivId: "2502.11044"
pdfUrl: "https://arxiv.org/pdf/2502.11044"
codeUrl: "https://github.com/vance-lab/discrete-barrier-invariants"
---

## 1. Safety Envelope & Control Barrier Formulations

Let $\mathcal{X} \subset \mathbb{R}^n$ represent the execution state space of an autonomous system and $\mathcal{U} \subset \mathbb{R}^m$ be the tool action space. A safe set $\mathcal{C}$ is defined as the super-level set of a continuously differentiable barrier function $B: \mathcal{X} \to \mathbb{R}$:

$$\mathcal{C} = \left\{ \mathbf{x} \in \mathcal{X} : B(\mathbf{x}) \ge 0 \right\}, \quad \partial \mathcal{C} = \left\{ \mathbf{x} \in \mathcal{X} : B(\mathbf{x}) = 0 \right\}$$

The system dynamics obey discrete state transitions $\mathbf{x}_{k+1} = f(\mathbf{x}_k, \mathbf{u}_k)$. The action $\mathbf{u}_k$ emitted by the language policy $\pi_\theta$ must satisfy the discrete Control Barrier condition:

$$\Delta B(\mathbf{x}_k, \mathbf{u}_k) = B(f(\mathbf{x}_k, \mathbf{u}_k)) - B(\mathbf{x}_k) \ge -\alpha B(\mathbf{x}_k), \quad \alpha \in (0, 1]$$

## 2. Quadratic Programming Projection Filter

When the raw policy action $\mathbf{u}_0 \sim \pi_\theta(\cdot \mid \mathbf{x})$ attempts an unsafe transition, we project it onto the safe half-space via real-time quadratic programming:

$$\begin{aligned}
\mathbf{u}^* = \arg\min_{\mathbf{u} \in \mathcal{U}} \quad & \frac{1}{2} \|\mathbf{u} - \mathbf{u}_0\|^2 \\
\text{s.t.} \quad & \nabla B(\mathbf{x})^\top f(\mathbf{x}, \mathbf{u}) + \alpha B(\mathbf{x}) \ge 0 \\
& \mathbf{A}_{\text{audit}} \mathbf{u} \le \mathbf{b}_{\text{sandbox}}
\end{aligned}$$

### Invariance Theorem
If $\mathbf{x}_0 \in \mathcal{C}$ and $\mathbf{u}_k = \mathbf{u}^*$ for all $k \ge 0$, then:

$$\mathbb{P}\left( \exists k \ge 0 : \mathbf{x}_k \in \mathcal{X}_{\text{unsafe}} \right) = 0$$

The system remains invariant within $\mathcal{C}$ for all future time steps under any arbitrary instruction input.
