#!/usr/bin/env bash
set -euo pipefail
JVER="1.10.5"
curl -L "https://julialang-s3.julialang.org/bin/linux/x64/${JVER%.*}/julia-$JVER-linux-x86_64.tar.gz" | tar -xz
export PATH="$PWD/julia-$JVER/bin:$PATH"
julia -v
