#!/usr/bin/env python3

import frccontrol as fct
import numpy as np
from scipy.signal import StateSpace


kv = 1.0
ka = 1.5
dt = 0.01

A = np.array([[-kv / ka]])
B = np.array([[1 / ka]])
C = np.array([[1]])
D = np.array([[0]])
sys = StateSpace(A, B, C, D).to_discrete(dt)

x1 = np.array([[0]])
x2 = np.array([[0]])

K1 = fct.LinearQuadraticRegulator(A, B, [1.0], [12.0], dt).K
K2 = fct.LinearQuadraticRegulator(A, B, [0.1], [12.0], dt).K

t1 = []
x1data = []
x2data = []
u1data = []
u2data = []

for i in range(120):
    ref = np.array([[5]])
    ff = ref * kv

    u1 = K1 @ (ref - x1) + ff
    u2 = K2 @ (ref - x2) + ff

    if np.linalg.norm(u1) > 12:
        u1 = np.array([[12]])

    if np.linalg.norm(u2) > 12:
        u2 = np.array([[12]])

    x1 = sys.A @ x1 + sys.B @ u1
    x2 = sys.A @ x2 + sys.B @ u2

    x1data.append(x1[0, 0])
    x2data.append(x2[0, 0])

    u1data.append(u1[0, 0])
    u2data.append(u2[0, 0])

    t1.append(i * 0.01)

import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2)

ax1.plot(t1, x1data, label=f"q = [1], r = [12], K={round(K1[0, 0])}")
ax1.plot(t1, x2data, label=f"q = [0.1], r = [12], K={round(K2[0, 0])}")
ax2.plot(t1, u1data, label=f"q = [1], r = [12], K={round(K1[0, 0])}")
ax2.plot(t1, u2data, label=f"q = [0.1], r = [12], K={round(K2[0, 0])}")

ax1.set(
    title="Flywheel, reference = 5 rad/s",
    ylabel="Angular Velocity (rad/s)",
)
ax2.set(ylabel="Voltage (V)", xlabel="Time (s)")

ax1.legend()
ax2.legend()
plt.savefig("images/flywheel-lqr-ex.jpg")
plt.show()
