using Pkg

# Activate environment in ./julia
Pkg.activate(@__DIR__)
Pkg.instantiate()

# Ensure PlotlyJS is available
if !haskey(Pkg.project().dependencies, "PlotlyJS")
    @info "Installing PlotlyJS..."
    Pkg.add("PlotlyJS")
end

# Import dependencies globally (so post scripts can just `using PlotlyJS`)
using PlotlyJS, Random

# Discover all .jl files in julia/posts/
posts_dir = joinpath(@__DIR__, "posts")
post_scripts = filter(f -> endswith(f, ".jl"), readdir(posts_dir; join=true))

@info "Found $(length(post_scripts)) Julia post scripts" post_scripts

# Run each post script
for script in post_scripts
    @info "Running script" script
    include(script)
end

@info "✅ All Julia plots generated"
