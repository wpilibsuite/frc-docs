#!/usr/bin/env python3

import frccontrol as fct
import matplotlib.pyplot as plt
import numpy as np
from scipy.signal import StateSpace


class Flywheel:
    """An frccontrol system representing a flywheel with a time delay."""

    def __init__(self, dt, delay=0.0):
        """Flywheel subsystem.

        Keyword arguments:
        dt -- time between model/controller updates
        delay -- input delay in seconds
        """
        self.dt = dt
        self.delay = delay

        Kv = 0.011
        Ka = 0.005515

        A = np.array([[-Kv / Ka]])
        B = np.array([[1.0 / Ka]])
        C = np.array([[1]])
        D = np.array([[0]])

        self.plant = StateSpace(A, B, C, D)

        # Sim variables
        self.sim = self.plant.to_discrete(self.dt)
        self.x = np.zeros((1, 1))
        self.u = np.zeros((1, 1))
        self.y = np.zeros((1, 1))

        # States: angular velocity (rad/s)
        # Inputs: voltage (V)
        # Outputs: angular velocity (rad/s)
        self.feedforward = fct.LinearPlantInversionFeedforward(
            self.plant.A, self.plant.B, self.dt
        )
        self.feedback = fct.LinearQuadraticRegulator(
            self.plant.A, self.plant.B, [0.00001], [12.0], self.dt
        )

        # Prepare time delay
        self.ubuf = []
        for _ in range(int(self.delay / self.dt)):
            self.ubuf.append(np.zeros((1, 1)))

        self.u_min = np.array([[-12.0]])
        self.u_max = np.array([[12.0]])

    def update(self, r, next_r):
        """
        Advance the model by one timestep.

        Keyword arguments:
        r -- the current reference
        next_r -- the next reference
        """
        # Update sim model
        self.x = self.sim.A @ self.x + self.sim.B @ self.u
        self.y = self.sim.C @ self.x + self.sim.D @ self.u

        self.u = np.clip(
            self.feedforward.calculate(next_r) + self.feedback.calculate(self.x, r),
            self.u_min,
            self.u_max,
        )
        self.ubuf.append(self.u)
        self.u = self.ubuf.pop(0)


def main():
    dt = 0.005
    delay = 0.01

    # Set up graphing
    l0 = 0.1
    l1 = l0 + 5.0
    l2 = l1 + 0.1
    ts = np.arange(0, l2 + 5.0, dt)

    # Generate references
    refs = []
    for t in ts:
        if t < l0:
            r = np.array([[0.0]])
        elif t < l1:
            r = np.array([[300]])
        else:
            r = np.array([[0.0]])
        refs.append(r)

    # Run simulations
    flywheel = Flywheel(dt, delay)

    fig, (ax1, ax2) = plt.subplots(2)
    ax1.set(
        title=f"Flywheel with dt = {dt * 1000} ms and delay = {delay * 1000} ms",
        ylabel="Angular velocity (rad/s)",
    )
    ax2.set(ylabel="Voltage (V)", xlabel="Time (s)")

    r_rec, x_rec, u_rec, y_rec = fct.generate_time_responses(flywheel, refs)

    ax1.plot(ts, r_rec[0, :], label="Reference")
    ax1.plot(
        ts,
        x_rec[0, :],
        label=f"Uncompensated (Kp = {round(flywheel.feedback.K[0, 0], 4)})",
    )
    ax2.plot(
        ts,
        u_rec[0, :],
        label=f"Uncompensated (Kp = {round(flywheel.feedback.K[0, 0], 4)})",
    )

    flywheel = Flywheel(dt, delay)
    flywheel.feedback.latency_compensate(
        flywheel.plant.A, flywheel.plant.B, flywheel.dt, delay
    )
    r_rec, x_rec, u_rec, y_rec = fct.generate_time_responses(flywheel, refs)

    ax1.plot(
        ts,
        x_rec[0, :],
        label=f"Compensated (Kp = {round(flywheel.feedback.K[0, 0], 4)})",
    )
    ax2.plot(
        ts,
        u_rec[0, :],
        label=f"Compensated (Kp = {round(flywheel.feedback.K[0, 0], 4)})",
    )

    ax1.legend(loc="upper right")
    ax2.legend(loc="upper right")
    plt.savefig("images/latency-comp-lqr.jpg")
    plt.show()


if __name__ == "__main__":
    main()
