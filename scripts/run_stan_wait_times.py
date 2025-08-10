# scripts/run_stan_wait_times.py
import os
from pathlib import Path
import numpy as np
import pandas as pd

# If cmdstanpy isn't installed yet:
#   pip install -U cmdstanpy
# To install CmdStan binaries (first time only):
#   python -m cmdstanpy.install_cmdstan --compiler
from cmdstanpy import CmdStanModel

ROOT = Path(__file__).resolve().parents[1]  # repo root
DATA_DIR = ROOT / "data"
STAN_DIR = ROOT / "stan_models"
STAN_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

# -----------------------------
# 1) Ground truth + data
# -----------------------------
rng = np.random.default_rng(7)
alpha_true = 3.0   # shape
beta_true  = 0.5   # rate   -> mean = alpha_true / beta_true = 6.0
theta_true = 1.0 / beta_true
N = 600

wait_times = rng.gamma(shape=alpha_true, scale=theta_true, size=N)
pd.DataFrame({"y": wait_times}).to_csv(DATA_DIR / "wait_times.csv", index=False)

# -----------------------------
# 2) Stan model (Gamma with shape alpha, rate beta)
# -----------------------------
stan_code = r"""
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
"""

stan_file = STAN_DIR / "wait_times_gamma.stan"
stan_file.write_text(stan_code)

# -----------------------------
# 3) Compile & sample
# -----------------------------
model = CmdStanModel(stan_file=str(stan_file))
fit = model.sample(
    data={"N": int(N), "y": wait_times.astype(np.float64)},
    chains=4,
    iter_warmup=1000,
    iter_sampling=2000,
    seed=123,
    show_progress=True,
)

# -----------------------------
# 4) Save posterior samples
# -----------------------------
df = fit.draws_pd()  # tidy dataframe with columns like 'alpha', 'beta'
post = df[["alpha", "beta"]].reset_index(drop=True)
post.to_csv(DATA_DIR / "posterior_alpha_beta.csv", index=False)

print("✅ Wrote:")
print(f" - {DATA_DIR / 'wait_times.csv'}")
print(f" - {DATA_DIR / 'posterior_alpha_beta.csv'}")
print("Tip: now run the Julia plotting script to emit the HTML widget.")
