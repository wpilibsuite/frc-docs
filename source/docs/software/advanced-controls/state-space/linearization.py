#!/usr/bin/env python3

import matplotlib.pyplot as plt
import numpy as np
from math import sin

t = np.arange(-6.0, 6.0, 0.1)
sinData = np.array([sin(xi) for xi in t])
linearData = np.array([xi for xi in t])
deltaData = np.array([xi - sin(xi) for xi in t])

plt.axhline(0, color="black")
plt.axvline(0, color="black")

plt.plot(t, sinData, label="$y=\sin(x)$")
plt.plot(t, linearData, label="$y=x$")
plt.plot(t, deltaData, label="Difference between $\sin(x)$ and $x$")
plt.legend()

plt.show()
