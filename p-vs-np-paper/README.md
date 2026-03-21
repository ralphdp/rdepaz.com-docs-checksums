# P vs NP: Thermodynamic Irreversibility Paper

## Purpose
This is the formal, peer-reviewable academic translation of the architectural proof
published on [logos.pub/proof/p-vs-np-proof](https://logos.pub/proof/p-vs-np-proof).

The sovereign Logos Protocol version (PR-013) remains untouched on the live site.
This paper translates the same core insight into rigorous mathematical language
suitable for submission to academic journals and the Clay Mathematics Institute.

## Core Thesis
P ≠ NP because the computational asymmetry between verification and search is
a logical consequence of the thermodynamic arrow of time. One-way functions exist
because physical computation is thermodynamically irreversible at the Landauer limit.

## Build
```bash
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

## Target Journals
1. Journal of the ACM (JACM)
2. SIAM Journal on Computing
3. Clay Mathematics Institute Millennium Prize submission pipeline

## Author
Rafael D. De Paz
