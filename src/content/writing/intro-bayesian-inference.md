---
title: "From Priors to Predictions: An Intuitive Introduction to Bayesian Inference"
date: 2025-08-02
summary: "An accessible introduction to Bayesian inference, from Bayes' theorem and likelihoods to a hands-on example with linear regression, showing how we can estimate entire distributions over model parameters and quantify uncertainty instead of settling for a single best fit."
tags: ['bayesian inference', 'uncertainty']
---

## Overview
Bayesian inference is a framework for statistical inference that provides a systematic way to update our beliefs about the parameters of a model in light of observed data. At its heart is Bayes' theorem, which relates four key components:

- **Prior distribution** $p(x)$: Encodes our beliefs about the parameters $x$ before seeing the data.  
- **Likelihood** $p(y \mid x)$: Measures how well a particular setting of the parameters explains the observed data $y$.  
- **Marginal likelihood (evidence)** $p(y)$: A normalising constant ensuring the posterior distribution is a valid probability distribution.  
- **Posterior distribution** $p(x \mid y)$: Our updated beliefs about the parameters after observing data.  

Formally, Bayes' theorem states:

$$
p(x \mid y) = \frac{p(y \mid x) \, p(x)}{p(y)},
$$

where the marginal likelihood is given by

$$
p(y) = \int p(y \mid x) \, p(x) \, dx.
$$

Here, $x \in \mathbb{R}^D$ represents the parameters of interest, and $y \in \mathbb{R}^{D_N}$ the observed data. In many realistic problems, computing $p(y)$ exactly is intractable, making closed-form solutions for the posterior unavailable. In such cases, we turn to approximate methods, such as **Markov Chain Monte Carlo (MCMC)**, to generate samples from the posterior.

---

## Likelihood Intuition
The likelihood function quantifies how plausible the observed data is under different possible parameter values (hypotheses). For continuous data, the likelihood is the value of the probability density function evaluated at the observed points. Though technically not a probability itself, it is often described informally as *"the probability of the data given the parameters."*

To build intuition, suppose we believe a dataset was generated from a Gaussian distribution with known variance but unknown mean $\mu$. Each possible $\mu$ corresponds to a different hypothesis about the true data-generating process. The likelihood tells us which values of $\mu$ make the observed data most plausible. Hypotheses that align closely with the actual data yield higher likelihood values (or lower negative log-likelihoods).

![Likelihood intuition](/images/blogs/intro_bayes_inference/likelihood_intuition.png)

In this example, 80 samples are drawn from a Gaussian distribution with true mean $\mu = 10$ and variance $\sigma^2 = 1$. Two candidate models are compared: one far from the truth ($\mu = 5$) and one matching the generative process ($\mu = 10$). The model closer to the true parameters yields a much lower negative log-likelihood (NLL), reflecting a better fit to the observed data.

---

## Example: Linear Regression with Uncertainty
In classical (frequentist) linear regression, we fit a line

$$
y = \beta_0 + \beta_1 x + \epsilon
$$

by finding the single *best* slope $\beta_1$ and intercept $\beta_0$ that minimise the squared error. This approach produces a **point estimate**, one fixed line through the data.

In the **Bayesian** approach, we treat $\beta_0$ and $\beta_1$ as random variables with prior distributions. Observing the data updates these priors into posterior distributions, giving us not just one line, but a distribution over all plausible lines.  

The likelihood in this case measures how well a given line explains the data, and the posterior tells us which lines are more probable after accounting for both our prior beliefs and the evidence from the data.

![Bayesian linear regression](/images/blogs/intro_bayes_inference/bayesian_linear_regression.png)

Posterior samples from a Bayesian linear regression model with known noise variance. The grey lines represent plausible fits drawn from the posterior distribution, while the solid black line shows the true data-generating relationship. Unlike a single best-fit line from classical regression, the Bayesian approach captures the full range of models consistent with the data and prior beliefs, allowing uncertainty to be quantified.

This richer picture allows us to make statements like:

> "There's a 95% probability that the slope lies between 0.8 and 1.2."

rather than just reporting a single number. It also lets us **quantify uncertainty** in predictions for new data points.

---

## Sampling from the Posterior
For most interesting models, including Bayesian linear regression with unknown noise variance,  the posterior distribution cannot be computed exactly. Instead, we use sampling algorithms such as **Markov Chain Monte Carlo (MCMC)** to draw representative samples from the posterior.

These samples can be used to:

- Estimate summaries of the parameters (means, credible intervals).  
- Visualise the distribution of plausible models.  
- Make probabilistic predictions for new data.  

In the Bayesian framework, inference is therefore about **learning a distribution over parameters**, not just finding a single optimal set of values. This mindset shift is what makes Bayesian methods so powerful for reasoning under uncertainty.