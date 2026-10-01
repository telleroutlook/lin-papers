---
title: "Latent Reasoning Graphs: Scalable Self-Evolving Planning for Deep Thinking Models"
authors:
  - Alistair Vance
  - Elena Rostova
  - Julian K. Thorne
  - Marcus Lin
publishedDate: "2025-10-18"
doi: "10.48550/arXiv.2501.09871"
keywords:
  - Test-Time Compute
  - Graph Search
  - Latent Space
  - Theorem Proving
abstract: "Autoregressive token-level Chain-of-Thought (CoT) exploration incurs quadratic context degradation and accumulates unrecoverable semantic drifting during long-horizon mathematical proofs. We formulate tree-of-thought exploration as gradient-guided trajectories within low-entropy latent manifold representations, bypassing token generation until branch confirmation."
venue: "NeurIPS 2025 (Oral Presentation)"
year: 2025
category: "Reasoning & Search"
award: "Oral Presentation (Top 1.2%)"
citations: 218
highlighted: true
tldr: "Demonstrates that discrete search directly in continuous latent spaces reduces test-time computation overhead by 4.2× while exceeding token-level chain-of-thought on OlympiadBench and ARC Prize."
arxivId: "2501.09871"
pdfUrl: "https://arxiv.org/pdf/2501.09871"
codeUrl: "https://github.com/vance-lab/latent-reasoning-graphs"
demoUrl: "https://lrg-demo.stanford.edu"
---

## 1. Problem Formulation & Latent Energy Dynamics

Standard autoregressive reasoning samples sequences $\mathbf{x} = (x_1, \dots, x_T)$ from a token distribution $p_\theta(\mathbf{x}) = \prod_{t=1}^T p_\theta(x_t \mid x_{<t})$. Under long deduction horizons, errors compound exponentially. Instead, we project intermediate logic states into a smooth latent manifold $\mathcal{Z} \subset \mathbb{R}^d$.

We define a differentiable planning energy functional $\mathcal{E}_\phi(\mathbf{z})$ over latent paths $\gamma: [0, 1] \to \mathcal{Z}$ with boundary constraints $\gamma(0) = \mathbf{z}_0$ and $\gamma(1) = \mathbf{z}^*$:

$$\min_{\theta} \mathbb{E}_{\mathbf{z} \sim \mathcal{Z}} \left[ \mathcal{L}_{\text{planning}}(\mathbf{z}_t, \mathbf{z}^*) + \lambda \sum_{k=1}^K \nabla_{\mathbf{z}} \mathcal{E}_\phi(\mathbf{z}_k) \right]$$

The free energy of any reasoning node $\mathbf{z}$ is evaluated via Hamiltonian marginalization:

$$\mathcal{F}(\mathbf{z}) = -\frac{1}{\beta} \log \int_{\Omega} \exp \left( -\beta \left[ \frac{1}{2}\|\mathbf{z} - \mathbf{g}(\mathbf{x})\|^2 + \mathcal{V}(\mathbf{x}) \right] \right) d\mathbf{x} + \gamma \mathcal{R}(\mathbf{z})$$

## 2. Hamiltonian Gradient Trajectories & Branch Pruning

To explore diverse deductive routes without combinatorial explosion, test-time exploration proceeds via stochastic Langevin dynamics in latent velocity space $(\mathbf{z}, \mathbf{v})$:

$$\begin{cases}
d\mathbf{z}_t = \mathbf{v}_t dt \\
d\mathbf{v}_t = -\left[ \nabla_{\mathbf{z}} \mathcal{E}_\phi(\mathbf{z}_t) + \gamma \mathbf{v}_t \right] dt + \sqrt{2 \gamma \beta^{-1}} d\mathbf{W}_t
\end{cases}$$

Here $\mathbf{W}_t$ denotes a standard Wiener process and $\beta^{-1}$ corresponds to the temperature schedule. 

### Convergence Guarantee
By the Poincaré inequality on compact manifolds, the distribution of latent candidate paths $q_t(\mathbf{z})$ converges to the Gibbs equilibrium $p_\infty(\mathbf{z}) \propto e^{-\beta \mathcal{E}(\mathbf{z})}$ at an exponential rate:

$$\mathcal{D}_{\text{KL}}\left( q_t \, \| \, p_\infty \right) \le \mathcal{D}_{\text{KL}}\left( q_0 \, \| \, p_\infty \right) e^{-2 \alpha t}, \quad \alpha = \inf_{\mathbf{z}} \lambda_{\min}\left( \nabla^2 \mathcal{E}_\phi(\mathbf{z}) \right)$$

## 3. Empirical Verification
Our continuous latent graph formulation outperforms standard beam search and Monte Carlo Tree Search across 500 Olympiad-level IMO benchmark problems while consuming **76% fewer tokens**.
