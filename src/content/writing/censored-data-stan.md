---
title: "Modelling Right-Censored Data in Stan with CmdStanPy"
date: 2025-08-06
summary: "A hands-on introduction to Bayesian inference using Stan to model patient wait times in a clinic. By fitting a Gamma distribution with right-censoring, we capture uncertainty in both model parameters and unseen outcomes, showcasing how Bayesian methods naturally handle incomplete data where traditional tools fall short."
tags: ["bayesian inference", "stan", "survival analysis", "censoring"]
series: "Modelling Censored Data"
series_order: 1
banner: "/images/photography/boats_london.jpg"
---

## 1. Introduction

In many real-world scenarios, we cannot always observe the full outcome of a random variable. Instead, we only know that the true value exceeds a certain threshold, this is known as **right-censoring**.

Let's consider the following example:

> Suppose we're studying the time people spend waiting in a clinic's waiting room. We collect data on how long each patient waits. However, due to resource constraints, some observations are censored.

In this scenario:
* Some patients leave early or are no longer tracked after a certain time.
* We might stop recording after a maximum allowed time.

This means for some individuals we observe their exact wait time, and for others, we only know they waited **at least** some threshold time.

Our goal is to infer the **underlying distribution** of wait times using **both the observed and right-censored data**.

![Bayesian linear regression](/images/blogs/censored_data_stan/censored_data.png)

The transparent histogram shows the full (uncensored) Gamma-distributed wait times, while the solid grey histogram shows the observed data after censoring. The two vertical lines represent the aggressive and passive censoring thresholds. Notice how much of the right tail of the true distribution is lost due to censoring. This illustrates the challenge: we must reconstruct the full distribution from partial data.

---

## 2. Modelling Wait Times: The Maths

We assume that the true wait times, $x_i$, follow a Gamma distribution:

$x_i \sim \text{Gamma}(\alpha, \beta)$,

where:

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

## 3. Simulating Censored Data in Python

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

## 4. Writing the Stan Model

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

---

## 5. Running the Model with CmdStanPy

### 5.1 Compile the Model

```python
from cmdstanpy import CmdStanModel
model = CmdStanModel(stan_file="models/censored_gamma.stan")
```

### 5.2: Simulate and Save the Data

Run the Python script to generate data and save to JSON:

```python
simulate_censored_gamma(...)
prepare_stan_data(...)
```

### 5.3: Fit the Model

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

## 6.Visualising Posterior Estimates

We extract samples of `alpha` and `beta`, compute the posterior mean $\mu = \frac{\alpha}{\beta}$, and overlay posterior predictive densities.

### 6.1 Posterior PDF Plot

![Posterior plot](/images/blogs/censored_data_stan/inferred_posterior.png)

The grey histogram shows the observed (non-censored) wait times. The blue dashed line shows the posterior mean PDF, with the light blue shaded area representing the 95% credible interval over PDFs sampled from the posterior.
The green line shows the true Gamma distribution used to simulate the data.
Vertical dashed lines highlight:

* The estimated posterior mean ± 1 standard deviation (blue),
* The censoring thresholds (red and orange).

This visual confirms that the model can recover the underlying distribution, even though it only saw partially observed data.

---

## 7. Conclusion

This tutorial walked through the full pipeline of:

1. Simulating censored data from a known distribution
2. Encoding censoring logic in Stan using `lccdf`
3. Fitting the model with `CmdStanPy`
4. Visualising the posterior and checking recovery of true parameters

This technique applies widely in survival analysis, industrial reliability, and social science studies where data is frequently incomplete due to observation limits.