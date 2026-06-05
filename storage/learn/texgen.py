#!/usr/bin/env python3
"""
Convert a JSON file with a training history into a LaTeX figure with three subplots.
"""

import json
import sys
import argparse
from collections import defaultdict


def load_history(json_path):
    """Load the history array from the JSON file."""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if 'history' not in data:
        raise ValueError("JSON must contain a top-level 'history' array")
    history = data['history']
    if not isinstance(history, list):
        raise ValueError("'history' must be an array")
    return history


def extract_coordinates(history):
    """
    Extract sorted coordinates from the history list.
    Returns dictionaries with epoch -> value for loss, acc_snr, acc_5, acc_10, acc_20.
    """
    loss_dict = {}
    acc_snr_dict = {}
    acc_5_dict = {}
    acc_10_dict = {}
    acc_20_dict = {}

    for entry in history:
        epoch = entry.get('epoch')
        if epoch is None:
            continue
        # Convert to number (float or int)
        try:
            epoch = float(epoch)
        except (TypeError, ValueError):
            continue

        # Loss
        if 'loss' in entry:
            try:
                loss_dict[epoch] = float(entry['loss'])
            except (TypeError, ValueError):
                pass

        # Acc SNR
        if 'acc_snr' in entry:
            try:
                acc_snr_dict[epoch] = float(entry['acc_snr'])
            except (TypeError, ValueError):
                pass

        # Acc_5, Acc_10, Acc_20 (convert from [0,1] to percent)
        for key, target in [('acc_5', acc_5_dict),
                            ('acc_10', acc_10_dict),
                            ('acc_20', acc_20_dict)]:
            if key in entry:
                try:
                    val = float(entry[key]) * 100.0   # to percent
                    target[epoch] = val
                except (TypeError, ValueError):
                    pass

    # Sort by epoch
    def sorted_items(d):
        return sorted(d.items(), key=lambda kv: kv[0])

    return (sorted_items(loss_dict),
            sorted_items(acc_snr_dict),
            sorted_items(acc_5_dict),
            sorted_items(acc_10_dict),
            sorted_items(acc_20_dict))


def format_coordinates(pairs, precision=6):
    """Convert a list of (x,y) pairs into a pgfplots coordinate string."""
    points = [f"({x:.{precision}f},{y:.{precision}f})" for x, y in pairs]
    return " ".join(points)


def generate_latex_figure(loss_pairs, acc_snr_pairs,
                          acc5_pairs, acc10_pairs, acc20_pairs):
    """Generate the complete LaTeX code for the figure (standalone document)."""
    # Format coordinate strings
    loss_coords = format_coordinates(loss_pairs)
    snr_coords = format_coordinates(acc_snr_pairs)
    acc5_coords = format_coordinates(acc5_pairs)
    acc10_coords = format_coordinates(acc10_pairs)
    acc20_coords = format_coordinates(acc20_pairs)

    latex_code = r"""\documentclass[tikz,border=5pt]{standalone}
\usepackage{pgfplots}
\usepgfplotslibrary{groupplots}
\pgfplotsset{compat=1.18}

\begin{document}
\begin{tikzpicture}
\begin{groupplot}[
    group style={
        group size=1 by 3,
        vertical sep=2.5cm,
        ylabels at=edge left,
        xlabels at=edge bottom
    },
    width=0.85\textwidth,
    height=0.28\textwidth,
    grid=both,
    grid style={line width=0.2pt, draw=gray!30},
    minor tick num=4,
    tick label style={font=\small},
    label style={font=\small},
    title style={font=\small\bfseries},
]

% -------------------- Loss subplot --------------------
\nextgroupplot[
    ylabel={Loss},
    title={Training Loss},
    ymode=linear,
]
\addplot[color=blue, thick, mark=none] coordinates {""" + loss_coords + r"""};

% -------------------- SNR Accuracy subplot --------------------
\nextgroupplot[
    ylabel={SNR (dB)},
    title={SNR Accuracy},
    ymode=linear,
]
\addplot[color=red, thick, mark=none] coordinates {""" + snr_coords + r"""};

% -------------------- Top-N Accuracy subplot --------------------
\nextgroupplot[
    xlabel={Epoch},
    ylabel={Accuracy (\%)},
    title={Top-N Accuracy},
    ymin=0,
    ymax=100,
    legend pos=south east,
    legend style={font=\tiny},
]
\addplot[color=green!50!black, thick, mark=none] coordinates {""" + acc5_coords + r"""};
\addplot[color=orange, thick, mark=none] coordinates {""" + acc10_coords + r"""};
\addplot[color=purple, thick, mark=none] coordinates {""" + acc20_coords + r"""};
\legend{Top-5, Top-10, Top-20}

\end{groupplot}
\end{tikzpicture}
\end{document}
"""
    return latex_code


def main():
    parser = argparse.ArgumentParser(
        description="Convert a JSON training history to a LaTeX figure with three plots."
    )
    parser.add_argument("input_json", help="Path to input JSON file")
    parser.add_argument("output_tex", nargs="?", default="figure.tex",
                        help="Output LaTeX file (default: figure.tex)")
    args = parser.parse_args()

    try:
        history = load_history(args.input_json)
    except Exception as e:
        print(f"Error loading JSON: {e}", file=sys.stderr)
        sys.exit(1)

    # Extract data (already converted to percent for accuracies)
    loss_pairs, snr_pairs, acc5_pairs, acc10_pairs, acc20_pairs = extract_coordinates(history)

    # Sanity checks
    if not loss_pairs:
        print("Warning: No loss data found.", file=sys.stderr)
    if not snr_pairs:
        print("Warning: No acc_snr data found.", file=sys.stderr)
    if not (acc5_pairs and acc10_pairs and acc20_pairs):
        print("Warning: Some top-N accuracy data missing.", file=sys.stderr)

    latex_content = generate_latex_figure(
        loss_pairs, snr_pairs, acc5_pairs, acc10_pairs, acc20_pairs
    )

    with open(args.output_tex, 'w', encoding='utf-8') as f:
        f.write(latex_content)

    print(f"LaTeX figure written to {args.output_tex}")
    print("Compile with: pdflatex", args.output_tex)


if __name__ == "__main__":
    main()