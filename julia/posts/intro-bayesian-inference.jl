# build_blog.jl already activated the env and did: using PlotlyJS
using Random

# -----------------------
# Config
# -----------------------
outdir = joinpath(@__DIR__, "..", "..", "public", "plots", "intro-bayesian-inference")
mkpath(outdir)

σ = 1.0
μ_true = 10.0                   # sampling mean
nsamp = 2_000
x_min, x_max = 0.0, 20.0
xs = range(x_min, x_max; length=600)
μ_grid = 0.0:0.2:20.0           # slider resolution

# -----------------------
# Data: samples ~ N(10, 1)
# -----------------------
Random.seed!(42)
samples = μ_true .+ randn(nsamp)

# -----------------------
# Helpers
# -----------------------
normpdf(x, μ, σ) = exp.(-0.5*((x .- μ)./σ).^2) ./ (σ*sqrt(2π))
function nll(data::AbstractVector{<:Real}, μ::Real, σ::Real)
    n = length(data)
    # -sum(log pdf) for N(μ, σ^2)
    0.5*sum(((data .- μ)./σ).^2) + n*log(σ*sqrt(2π))
end

# Precompute PDFs and NLLs over the grid
ys  = [normpdf(xs, μ, σ) for μ in μ_grid]
nlls = [nll(samples, μ, σ) for μ in μ_grid]

# -----------------------
# Traces
# -----------------------
hist = histogram(
    x = samples,
    histnorm = "probability density",
    opacity = 0.9,
    nbinsx = 60,
    name = "Samples N(10,1)",
)

pdf_traces = [
    scatter(
        x = xs,
        y = ys[i],
        mode = "lines",
        name = "PDF (μ=$(round(μ_grid[i]; digits=1)), σ=1)",
        visible = (μ_grid[i] == μ_true),
    )
    for i in eachindex(μ_grid)
]

# Annotation builder for the live NLL label
function nll_annotation(val; xpos=0.98, ypos=0.98)
    attr(
        x = xpos, y = ypos, xref = "paper", yref = "paper",
        xanchor = "right", yanchor = "top",
        text = "NLL = $(round(val; digits=3))",
        showarrow = false,
        font = attr(size=16, color="black"),
        bgcolor = "rgba(255,255,255,0.8)",
        bordercolor = "rgba(0,0,0,0.25)",
        borderwidth = 1
    )
end

# -----------------------
# Slider wiring
# -----------------------
function visible_mask(k, n)
    v = [true; fill(false, n)]
    v[k+1] = true
    v
end

initial_idx = findfirst(==(μ_true), μ_grid)

steps = [
    attr(
        method = "update",
        # 1) toggle which PDF trace is visible
        args = [
            attr(visible = visible_mask(k, length(μ_grid))),
            # 2) update the annotation with the current NLL
            attr(annotations = [nll_annotation(nlls[k])])
        ],
        label = string(round(μ; digits=1))
    )
    for (k, μ) in enumerate(μ_grid)
]

layout = Layout(
    # no title
    xaxis = attr(title = "x", range = [x_min, x_max]),
    yaxis = attr(title = "density"),
    barmode = "overlay",
    showlegend = true,
    legend = attr(orientation="h", yanchor="bottom", y=1.02, xanchor="left", x=0.0),
    # initial annotation showing NLL at μ_true
    annotations = [nll_annotation(nlls[initial_idx])],
    sliders = [attr(
        active = initial_idx - 1,
        currentvalue = attr(prefix = "μ = "),
        pad = attr(t=30),
        steps = steps
    )],
)

fig = Plot([hist; pdf_traces...], layout)

# -----------------------
# Save standalone HTML
# -----------------------
outfile = joinpath(outdir, "likelihood.html")
open(outfile, "w") do io
    show(io, MIME"text/html"(), fig)
end
@info "Saved" outfile
