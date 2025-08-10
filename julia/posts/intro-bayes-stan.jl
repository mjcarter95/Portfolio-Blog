using Pkg
Pkg.activate(@__DIR__); Pkg.instantiate()
for pkg in ["CSV","DataFrames","Distributions","PlotlyJS","Statistics"]
    if !haskey(Pkg.project().dependencies, pkg); Pkg.add(pkg); end
end

using CSV, DataFrames, Distributions, PlotlyJS, Statistics

# Paths
root = normpath(joinpath(@__DIR__, "..", ".."))
data_dir = joinpath(root, "data")
out_dir  = joinpath(root, "public", "plots", "modelling-wait-times")
mkpath(out_dir)

# Load data and posterior
wait_df = CSV.read(joinpath(data_dir, "wait_times.csv"), DataFrame)
post_df = CSV.read(joinpath(data_dir, "posterior_alpha_beta.csv"), DataFrame)

wait_times = collect(wait_df.y)
α_samples  = collect(post_df.alpha)
β_samples  = collect(post_df.beta)

# Build figure
times = range(0, stop=20, length=600)

hist = histogram(
    x = wait_times,
    histnorm = "probability density",
    nbinsx = 50,
    opacity = 0.5,
    name = "Observed data",
)

# Draw a subset of posterior curves
n_draws = min(80, length(α_samples))
curves = Any[]
for i in 1:n_draws
    α = α_samples[i]
    β = β_samples[i]    # rate
    push!(curves, scatter(
        x = collect(times),
        y = pdf.(Gamma(α, 1/β), times),
        mode = "lines",
        opacity = 0.75,
        line = attr(width=1),
        name = (i == 1 ? "Posterior draws" : nothing),
        showlegend = (i == 1),
    ))
end

# Posterior mean curve & mean line
ᾱ, β̄ = mean(α_samples), mean(β_samples)
pdf_mean = pdf.(Gamma(ᾱ, 1/β̄), times)
mean_curve = scatter(x=collect(times), y=pdf_mean, mode="lines",
                     line=attr(width=3), name="Posterior mean")

μ_hat = ᾱ/β̄
max_y = maximum(pdf_mean) * 1.05
mean_line = shape(
    type="line", x0=μ_hat, x1=μ_hat, y0=0, y1=max_y,
    line=attr(width=2, dash="dot")
)

layout = Layout(
    # no title to keep it clean in-blog
    xaxis = attr(title="Wait time"),
    yaxis = attr(title="Density"),
    showlegend = true,
    legend = attr(orientation="h", yanchor="bottom", y=1.02, xanchor="left", x=0.0),
    shapes = [mean_line],
)

fig = Plot([hist; curves...; mean_curve], layout)

# Save standalone HTML (works on Netlify via <iframe>)
outfile = joinpath(out_dir, "fit.html")
open(outfile, "w") do io
    show(io, MIME"text/html"(), fig)
end
println("✅ Wrote $(outfile)")
