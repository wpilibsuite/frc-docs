import control as ct
import numpy as np
import scipy as sp


def lqr(*args, **kwargs):
    """Solves for the optimal linear-quadratic regulator (LQR).
    For a continuous system:
    .. math:: xdot = A * x + B * u
    .. math:: J = \\int_0^\\infty (x^T Q x + u^T R u + 2 x^T N u) dt
    For a discrete system:
    .. math:: x(n + 1) = A x(n) + B u(n)
    .. math:: J = \\sum_0^\\infty (x^T Q x + u^T R u + 2 x^T N u) \\Delta T
    Keyword arguments:
    sys -- StateSpace object representing a linear system.
    Q -- numpy.array(states x states), state cost matrix.
    R -- numpy.array(inputs x inputs), control effort cost matrix.
    N -- numpy.array(states x inputs), cross weight matrix.
    Returns:
    K -- numpy.array(states x inputs), controller gain matrix.
    """
    sys = args[0]
    Q = args[1]
    R = args[2]
    if len(args) == 4:
        N = args[3]
    else:
        N = np.zeros((sys.A.shape[0], sys.B.shape[1]))

    m = sys.A.shape[0]

    controllability_rank = np.linalg.matrix_rank(ct.ctrb(sys.A, sys.B))
    if controllability_rank != m:
        print(
            "Warning: Controllability of %d != %d, uncontrollable state"
            % (controllability_rank, m)
        )

    if sys.dt == None:
        P = sp.linalg.solve_continuous_are(a=sys.A, b=sys.B, q=Q, r=R, s=N)
        return np.linalg.solve(R, sys.B.T @ P + N.T)
    else:
        P = sp.linalg.solve_discrete_are(a=sys.A, b=sys.B, q=Q, r=R, s=N)
        return np.linalg.solve(R + sys.B.T @ P @ sys.B, sys.B.T @ P @ sys.A + N.T)


kv = 1.0
ka = 1.5

A = np.array([[-kv / ka]])
B = np.array([[1 / ka]])
C = np.array([[1]])
D = np.array([[0]])

sys = ct.ss(A, B, C, D)

sysd = sys.sample(0.01)


x1 = np.array([[0]])
x2 = np.array([[0]])

K1 = lqr(sysd, np.array([[1.0 / (1.0 ** 2)]]), np.array([[1.0 / (12.0 ** 2)]]))
K2 = lqr(sysd, np.array([[1.0 / (0.1 ** 2)]]), np.array([[1.0 / (12.0 ** 2)]]))

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

    x1 = sysd.A @ x1 + sysd.B @ u1
    x2 = sysd.A @ x2 + sysd.B @ u2

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
    title="Flywheel velocity and voltage over time, reference = 5rad/s",
    ylabel="Flywheel Velocity (rad/s)",
)
ax2.set(ylabel="Voltage (V)", xlabel="Time (s)")

ax1.legend()
ax2.legend()
plt.show()
