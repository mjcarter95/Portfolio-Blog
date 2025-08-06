# Tutorial: Modelling Censored Data in Stan with CmdStanPy

## Introduction: Right-Censoring in Real-World Data

In many real-world scenarios, we cannot always observe the full outcome of a random variable. Instead, we only know that the true value exceeds a certain threshold — this is known as **right-censoring**.

Let’s consider a concrete example:

> **Scenario**: Suppose we're studying the time people spend waiting in a clinic's waiting room. We collect data on how long each patient waits. However, due to resource constraints, some observations are censored:
>
> * Some patients leave early or are no longer tracked after a certain time.
> * We might stop recording after a maximum allowed time.

This means for some individuals we observe their exact wait time, and for others, we only know they waited **at least** some threshold time.

Our goal is to infer the **underlying distribution** of wait times using **both the observed and right-censored data**.

![Bayesian linear regression](/static/images/blogs/censored_data_stan/censored_data.png))

The transparent histogram shows the full (uncensored) Gamma-distributed wait times, while the solid grey histogram shows the observed data after censoring. The two vertical lines represent the aggressive and passive censoring thresholds. Notice how much of the right tail of the true distribution is lost due to censoring. This illustrates the challenge: we must reconstruct the full distribution from partial data.

---

## The Mathematical Model

We assume the true (latent) wait times, $x_i$, follow a Gamma distribution:

$x_i \sim \text{Gamma}(\alpha, \beta)$

Where:

* $\alpha$ is the shape parameter,
* $\beta$ is the rate parameter (note: Stan uses the rate, not scale).

The dataset is split into:

* **Observed data**: $x_i$ such that $x_i \leq T_i$ (no censoring)
* **Censored data**: We only observe the threshold $T_i$, knowing $x_i > T_i$

The total likelihood becomes:

$$
\log p(\text{data} \mid \alpha, \beta) = \sum_{i \in \text{obs}} \log \text{Gamma}(x_i \mid \alpha, \beta) + \sum_{j \in \text{cens}} \log P(x_j > T_j)
$$

The second term uses the **complementary CDF** (CCDF), which Stan provides as `gamma_lccdf`.

---

## Simulating Censored Data in Python

We simulate $N = 10,000$ samples from a Gamma distribution with known parameters $\alpha = 2.0$, $\beta = 1.5$. Each sample is censored with a **randomly selected threshold**, drawn from two options:

* **Aggressive censoring**: threshold $T_{\text{aggressive}} = 1.5$
* **Passive censoring**: threshold $T_{\text{passive}} = 3.0$

Each data point has a 50% chance of being censored using either threshold.

```python
samples = np.random.gamma(shape=alpha, scale=1/beta, size=N)
use_aggressive = np.random.rand(N) < p_aggressive
thresholds = np.where(use_aggressive, T_aggressive, T_passive)
is_censored = samples > thresholds
```

This gives us:

* `complete`: values where $x \leq T$
* `censored`: censoring thresholds $T$ where $x > T$

The data is saved as a JSON file for Stan.

---

## Writing the Stan Model

Stan supports censored data via the `*_lccdf` functions. Here, we use `gamma_lpdf` for observed values and `gamma_lccdf` for censored values:

```stan
data {
  int<lower=0> N_obs;
  int<lower=0> N_cens;
  vector<lower=0>[N_obs] obs;
  vector<lower=0>[N_cens] cens;
}
parameters {
  real<lower=0> alpha;
  real<lower=0> beta;
}
model {
  target += gamma_lpdf(obs | alpha, beta);
  target += gamma_lccdf(cens | alpha, beta);
}
```

Save this as `censored_gamma.stan`.

---

## Running the Model with CmdStanPy

### Step 1: Compile the Model

```python
from cmdstanpy import CmdStanModel
model = CmdStanModel(stan_file="models/censored_gamma.stan")
```

### Step 2: Simulate and Save the Data

Run the Python script to generate data and save to JSON:

```python
simulate_censored_gamma(...)
prepare_stan_data(...)
```

### Step 3: Fit the Model

```python
fit = model.sample(
    data="data/gamma_data.json",
    output_dir="output/",
    chains=4,
    parallel_chains=4,
    iter_warmup=1000,
    iter_sampling=1000,
    seed=42
)
```

---

## 📊 Visualising Posterior Estimates

We extract samples of `alpha` and `beta`, compute the posterior mean $\mu = \frac{\alpha}{\beta}$, and overlay posterior predictive densities.

### Posterior PDF Plot

![Posterior plot](/static/images/blogs/censored_data_stan/inferred_posterior.png))

The grey histogram shows the observed (non-censored) wait times. The blue dashed line shows the posterior mean PDF, with the light blue shaded area representing the 95% credible interval over PDFs sampled from the posterior.
The green line shows the true Gamma distribution used to simulate the data.
Vertical dashed lines highlight:

* The estimated posterior mean ± 1 standard deviation (blue),
* The true mean (green),
* The censoring thresholds (red and orange).
* This visual confirms that the model can recover the underlying distribution, even though it only saw partially observed data.

```python
def plot_stan_gamma_posterior(alphas, betas, true_alpha, true_beta, T_passive, T_aggressive, complete=None, output_path=None):
    from scipy.stats import gamma
    import matplotlib.pyplot as plt
    import numpy as np

    stan_means = alphas / betas
    stan_mean = np.mean(stan_means)
    stan_mean_std = np.std(stan_means)
    true_mean = true_alpha / true_beta

    x = np.linspace(0.001, 10, 500)
    pdfs = np.array([gamma.pdf(x, a=a, scale=1 / b) for a, b in zip(alphas, betas)])
    mean_pdf = np.mean(pdfs, axis=0)
    lower_pdf = np.percentile(pdfs, 2.5, axis=0)
    upper_pdf = np.percentile(pdfs, 97.5, axis=0)
    true_pdf = gamma.pdf(x, a=true_alpha, scale=1 / true_beta)

    plt.figure(figsize=(10, 6))

    if complete is not None:
        plt.hist(complete, bins=30, density=True, alpha=0.4, color='gray', label="Observed (complete wait times)")

    plt.fill_between(x, lower_pdf, upper_pdf, color='blue', alpha=0.2, label="Stan PDF 95% CI")
    plt.plot(x, mean_pdf, label="Stan Mean PDF", linestyle='--', color='blue', linewidth=2)
    plt.plot(x, true_pdf, label="True Gamma PDF", color='green', linewidth=2)

    plt.fill_betweenx(
        y=[0, plt.gca().get_ylim()[1]],
        x1=stan_mean - stan_mean_std,
        x2=stan_mean + stan_mean_std,
        color='blue', alpha=0.1,
        label="Stan mean ± 1 SD"
    )

    plt.axvline(stan_mean, color='blue', linestyle='--', label=f"Stan mean ≈ {stan_mean:.2f} ± {stan_mean_std:.2f}")
    plt.axvline(true_mean, color='green', linestyle='--', label=f"True mean = {true_mean:.2f}")
    plt.axvline(T_passive, color='red', linestyle='--', label=f"T_passive = {T_passive}")
    plt.axvline(T_aggressive, color='orange', linestyle='--', label=f"T_aggressive = {T_aggressive}")

    plt.xlabel("x")
    plt.ylabel("Density")
    plt.title("Stan Gamma Posterior: PDF and Wait Time Uncertainty")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    if output_path:
        plt.savefig(output_path)
    plt.show()
```

---

## Conclusion

This tutorial walked through the full pipeline of:

1. Simulating censored data from a known distribution
2. Encoding censoring logic in Stan using `lccdf`
3. Fitting the model with `CmdStanPy`
4. Visualising the posterior and checking recovery of true parameters

This technique applies widely in survival analysis, industrial reliability, and social science studies where data is frequently incomplete due to observation limits.
