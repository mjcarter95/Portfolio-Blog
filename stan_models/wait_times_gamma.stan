
data {
  int<lower=1> N;
  vector<lower=0>[N] y;
}
parameters {
  real<lower=0> alpha;
  real<lower=0> beta;
}
model {
  // weakly-informative priors
  alpha ~ gamma(2, 1);
  beta  ~ gamma(2, 1);
  // Stan's gamma(alpha, beta) uses shape=alpha, rate=beta
  y ~ gamma(alpha, beta);
}
