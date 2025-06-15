#!/usr/bin/env python3

import datetime
from pathlib import Path

import matplotlib.dates as mdate
import matplotlib.pyplot as plt
from matplotlib.axes import Axes

START_YEAR = 2027
END_YEAR = START_YEAR + 4
BAR_HEIGHT = 0.4
LINE_HEIGHT = 1 / (END_YEAR - START_YEAR)


def make_divider(
    ax: Axes,
    label: str,
    date: datetime.datetime,
    start: float,
    end: float,
    color: str,
):
    ax.vlines(
        date,
        start,
        end,
        transform=ax.get_xaxis_transform(),
        color=color,
        linewidths=0.5,
    )
    ax.annotate(
        label,
        xy=(date, end),
        xytext=(date, end),
        xycoords=ax.get_xaxis_transform(),
        rotation=30,
    )


def make_offset_bar(
    ax: Axes,
    bar_label: str,
    start: datetime.datetime,
    end: datetime.datetime,
    height: float,
    color: str,
    **kwargs,
):
    return ax.barh(
        bar_label,
        datetime.datetime(1970, 1, 1) + (end - start),
        left=start,
        height=height,
        color=color,
        **kwargs,
    )


def build_dividers(ax: Axes, year: int, start: float, end: float):
    make_divider(
        ax,
        f"{year} FRC Kickoff",
        datetime.datetime(year, 1, 1),
        start=start,
        end=end,
        color="#009CD7",
    )
    make_divider(
        ax,
        f"{year} Champs",
        datetime.datetime(year, 4, 25),
        start=start,
        end=end,
        color="red",
    )
    make_divider(
        ax,
        f"{year}-{year + 1} FTC Kickoff",
        datetime.datetime(year, 9, 1),
        start=start,
        end=end,
        color="#F57E25",
    )


def build_year(ax: Axes, year: int):
    return [
        make_offset_bar(
            ax,
            f"WPILib {year}",
            start=datetime.datetime(year - 1, 1, 1),
            end=datetime.datetime(year - 1, 10, 1),
            height=BAR_HEIGHT,
            color="gold",
            label="In development",
        ),
        make_offset_bar(
            ax,
            f"WPILib {year}",
            start=datetime.datetime(year - 1, 10, 1),
            end=datetime.datetime(year, 1, 1),
            height=BAR_HEIGHT,
            color="#009CD7",
            hatch="/",
            edgecolor="gold",
            label="FRC Beta",
        ),
        make_offset_bar(
            ax,
            f"WPILib {year}",
            start=datetime.datetime(year, 1, 1),
            end=datetime.datetime(year, 4, 25),
            height=BAR_HEIGHT,
            color="#009CD7",
            label="FRC Season/Support",
        ),
        make_offset_bar(
            ax,
            f"WPILib {year}",
            start=datetime.datetime(year, 4, 25),
            end=datetime.datetime(year, 9, 1),
            height=BAR_HEIGHT,
            color="#F57E25",
            hatch="/",
            edgecolor="gold",
            label="Updates/FTC Beta",
        ),
        make_offset_bar(
            ax,
            f"WPILib {year}",
            start=datetime.datetime(year, 9, 1),
            end=datetime.datetime(year + 1, 4, 25),
            height=BAR_HEIGHT,
            color="#F57E25",
            label="FTC Season/Support",
        ),
    ]


def main():
    plt.figure(figsize=(16, 12))
    plt.title("WPILib Development Timeline")
    ax = plt.gca()
    ax.set_autoscaley_on(False)
    ax.set_ylim(-0.5, -0.5 + (END_YEAR - START_YEAR))
    ax.invert_yaxis()

    plt.gcf().autofmt_xdate()
    ax.set_xlim(
        [datetime.datetime(START_YEAR - 1, 1, 1), datetime.datetime(END_YEAR, 9, 1)]
    )
    ax.xaxis.set_major_locator(mdate.MonthLocator(bymonthday=1, interval=4))
    ax.xaxis.set_major_formatter(mdate.DateFormatter("%b %Y"))
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    bars = []
    for i, year in enumerate(range(START_YEAR, END_YEAR, 1)):
        build_dividers(
            ax,
            year,
            0,
            1 - (i * LINE_HEIGHT) - 1 / 40,
        )
        bars = build_year(ax, year)
    ax.legend(
        handles=bars,
        loc="lower left",
        fontsize="small",
    )
    script_path = Path(__file__).resolve().parent
    plt.savefig(Path(script_path, "../../assets/dev_timeline.svg"), bbox_inches="tight")


if __name__ == "__main__":
    main()
