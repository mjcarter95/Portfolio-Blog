using Random, Distributions, JSON, Printf

# Output dir
outdir = joinpath(@__DIR__, "..", "..", "public", "plots", "intro-bayesian-inference")
mkpath(outdir)

# ----- Data & grid -----
Random.seed!(42)
σ  = 1.0
μ_true = 10.0
N = 2000
samples = rand(Normal(μ_true, σ), N)

xs = collect(range(6, 14; length=300))
μs = collect(8.0:0.25:12.0)
μ0 = 10.0
active_idx = findfirst(==(μ0), μs); active_idx === nothing && (active_idx = 1)

# Normal PDF
function normal_pdf_vec(x::Vector{Float64}, μ::Float64, σ::Float64)
    inv = 1.0 / (σ * sqrt(2π))
    @inbounds [inv * exp(-0.5 * ((xi - μ)/σ)^2) for xi in x]
end

ys = [normal_pdf_vec(xs, μ, σ) for μ in μs]

# Log-likelihood for Normal with known σ
const_term = -0.5 * N * log(2π*σ^2)
ll = [-(const_term - 0.5 * sum(((samples .- μ) ./ σ).^2)) for μ in μs]

# ----- Traces -----
hist_trace = Dict(
    "type" => "histogram",
    "x" => samples,
    "histnorm" => "probability density",
    "marker" => Dict("color" => "#9A9498"),
    "opacity" => 0.75,
    "nbinsx" => 60,
    "name" => "Observed dwell times"
)

line_trace = Dict(
    "type" => "scatter",
    "mode" => "lines",
    "x" => xs,
    "y" => ys[active_idx],
    "line" => Dict("color" => "blue", "width" => 2),
    "name" => @sprintf("PDF (σ=%.2f)", σ)
)

# ----- Frames (update only the PDF line + title) -----
frames = Any[
    Dict(
        "name" => string(i),
        "data" => Any[ Dict("x" => xs, "y" => ys[i]) ],
        "traces" => [1],  # 0=histogram, 1=PDF line
        "layout" => Dict(
            "title" => @sprintf("Gaussian fit (μ = %.2f,  NLL = %.2f)", μs[i], ll[i])
        )
    )
    for i in eachindex(μs)
]

# ----- Slider steps (animate to frame i) -----
steps = Any[
    Dict(
        "method" => "animate",
        "args" => Any[
            [string(i)],
            Dict("mode" => "immediate",
                 "frame" => Dict("duration" => 0, "redraw" => true),
                 "transition" => Dict("duration" => 0))
        ],
        "label" => @sprintf("%.2f", μs[i])
    )
    for i in eachindex(μs)
]

# ----- Play button -----
buttons = Any[
    Dict(
        "label" => "Play",
        "method" => "animate",
        "args" => Any[
            nothing,
            Dict("frame" => Dict("duration" => 60, "redraw" => true),
                 "fromcurrent" => true,
                 "transition" => Dict("duration" => 0))
        ]
    )
]

# ----- Layout (with proper xaxis & initial title) -----
layout = Dict(
    "title" => @sprintf("Gaussian fit (μ = %.2f,  NLL = %.2f)", μs[active_idx], ll[active_idx]),
    "xaxis" => Dict("title" => "Time", "range" => [6, 14]),
    "yaxis" => Dict("title" => "Density"),
    "barmode" => "overlay",
    "showlegend" => true,
    "legend" => Dict("orientation" => "h", "y" => 1.08),
    "sliders" => [Dict("active" => active_idx - 1, "steps" => steps)],
    "updatemenus" => [Dict("type" => "buttons", "showactive" => false, "y" => 1.15, "buttons" => buttons)]
)

fig = Dict("data" => Any[hist_trace, line_trace], "layout" => layout, "frames" => frames)
fig_json = JSON.json(fig)

# ----- HTML (Plotly via CDN) -----
html = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  <style> body{margin:0;padding:0} #plot{max-width:900px;margin:24px auto;} </style>
</head>
<body>
  <div id="plot"></div>
  <script>
    var fig = $fig_json;
    Plotly.newPlot('plot', fig.data, fig.layout, {responsive:true}).then(function() {
      if (fig.frames && fig.frames.length){
        Plotly.addFrames('plot', fig.frames);
      }
    });
  </script>
</body>
</html>
"""

outfile = joinpath(outdir, "likelihood.html")
open(outfile, "w") do io
    write(io, html)
end
println("✅ Wrote: ", outfile)
