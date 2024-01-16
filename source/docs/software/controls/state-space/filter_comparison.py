#!/usr/bin/env python3

import csv

import matplotlib.pyplot as plt

file_to_legend_mappings = {
    "xhat-state-3-measurement-02.csv": "Kalman Filter\nstate stdev=3 RPM\nmeasurement stdev=0.2 RPM",
    "xhat-state-2-measurement-1.csv": "Kalman Filter\nstate stdev=2 RPM\nmeasurement stdev=1 RPM",
    "median-filter.csv": "Median filter, window of 10 samples",
    "iir-filter.csv": "IIR filter, time constant of 0.1",
    "measurement.csv": "Raw Measurements",
}


def main():
    reference_data = ((0, 5.1), (2560, 2560))
    graph_data = {
        # key: (xs, ys)
    }

    for csv_filename, legend in file_to_legend_mappings.items():
        xs = []
        ys = []
        with open(f"filter-comparison-data/{csv_filename}", newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in sorted(reader, key=lambda d: (d["x"], d["y"])):
                xs.append(float(row["x"]))
                ys.append(float(row["y"]))

            if csv_filename == "measurement.csv":
                measurement_data = (xs, ys)
            else:
                graph_data[legend] = (xs, ys)

    dpi = 96
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(
        2, 2, figsize=(800 / dpi, 700 / dpi), dpi=dpi
    )
    fig.suptitle("Filter Comparison")

    # i values in 2x2 grid
    # 0 1
    # 2 3

    for i, (axis, (graph_key, (xs, ys))) in enumerate(
        zip((ax1, ax2, ax3, ax4), graph_data.items())
    ):
        axis.set_title(graph_key)
        axis.set_ylim(ymin=2000, ymax=2800)
        if i == 2 or i == 3:
            axis.set_xlabel("Time (s)")
        if i == 0 or i == 2:
            axis.set_ylabel("Flywheel Speed (RPM)")

        axis.plot(measurement_data[0], measurement_data[1], label="Measurements")
        axis.plot(xs, ys, label="Filtered")
        axis.plot(reference_data[0], reference_data[1], label="Reference")

        if i == 3:
            axis.legend(loc="lower right")

    plt.savefig("images/filter_comparison.png")
    plt.show()


if __name__ == "__main__":
    main()
