using Pkg
Pkg.activate("."); Pkg.instantiate()

# Example with PlotlyJS.jl (great interactivity, one-file HTML)
using PlotlyJS
import Downloads, JSON

# Make sure the target dir exists
mkpath("public/plots/intro-bayesian-inference")

# Example plot (swap this for your real code)
x = 1:200
y = cumsum(randn(length(x)))
p = plot(scatter(x=x, y=y, mode="lines", name="Random walk"))

# Write a fully self-contained HTML page for the iframe
open("public/plots/intro-bayesian-inference/likelihood.html", "w") do io
    show(io, MIME"text/html"(), p)
end

# You can generate more widgets here; just write more HTML files
