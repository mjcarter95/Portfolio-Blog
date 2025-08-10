using Distributions, Statistics, Printf, JSON

# Output directory
outdir = joinpath(@__DIR__, "..", "..", "public", "plots", "intro-bayesian-inference")
mkpath(outdir)

# Parameters & distribution
k = 2.0
θ = 3.0
dist = Gamma(k, θ)
μ = mean(dist)

# X grid (collect to a Vector for JSON)
t_vals = collect(0:0.1:30)
pdf_vals = pdf.(dist, t_vals)

# Simulate dwell times
n_samples = 2000
samples = rand(dist, n_samples)

# Build Plotly figure (histogram + PDF + mean line)
fig = Dict(
  "data" => Any[
    Dict(  # opaque histogram
      "type" => "histogram",
      "x" => samples,
      "histnorm" => "probability density",
      "marker" => Dict("color" => "#9A9498 "),
      "opacity" => 0.75,
      "nbinsx" => 60,
      "name" => "Observed data"
    ),
    Dict(  # blue PDF line
      "type" => "scatter",
      "mode" => "lines",
      "x" => t_vals,
      "y" => pdf_vals,
      "line" => Dict("color" => "blue", "width" => 2),
      "name" => @sprintf("Gamma(k=%.1f, θ=%.1f)", k, θ)
    ),
    Dict(  # mean marker
      "type" => "scatter",
      "mode" => "lines",
      "x" => [μ, μ],
      "y" => [0, maximum(pdf_vals) * 1.05],
      "line" => Dict("color" => "red", "dash" => "dash"),
      "name" => @sprintf("Mean μ = %.1f", μ)
    )
  ],
  "layout" => Dict(
    # "title" => @sprintf("Gamma PDF (k = %.1f, θ = %.1f, μ = %.1f)", k, θ, μ),
    "xaxis" => Dict("title" => "Time", "range" => [0, 30]),
    "yaxis" => Dict("title" => "Density"),
    "barmode" => "overlay",
    "showlegend" => true,
    "legend" => Dict("orientation" => "h", "y" => 1.08)
  )
)

# Serialize once, then embed
fig_json = JSON.json(fig)

html = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  <style>body{margin:0;padding:0} #plot{max-width:900px;margin:24px auto;}</style>
</head>
<body>
  <div id="plot"></div>
  <script>
    var fig = $fig_json;
    Plotly.newPlot('plot', fig.data, fig.layout, {responsive:true});
  </script>
</body>
</html>
"""

outfile = joinpath(outdir, "gamma.html")
open(outfile, "w") do io
  write(io, html)
end
println("Saved to $outfile")
