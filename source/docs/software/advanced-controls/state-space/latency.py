#!/usr/bin/env python3

import matplotlib.pyplot as plt

import frccontrol as fct
import matplotlib.pyplot as plt
import numpy as np
from scipy.signal import StateSpace

DT = 0.005
DELAY = 0.01


def plot_time_responses(
    system, t, x_rec, ref_rec, u_rec, ndigits, title=None, use_pid_labels=False
):
    """Plots time-domain responses for a given system with the K_p and K_d
    controller gains included in the legend.

    Keyword arguments:
    time -- list of timesteps corresponding to references
    x_rec -- recording of state estimates from generate_time_responses()
    ref_rec -- recording of references from generate_time_responses()
    u_rec -- recording of inputs from generate_time_responses()
    ndigits -- number of digits after decimal point to include in gains
    title -- title for time-domain plots (default: no title)
    use_pid_labels -- whether to use PID controller or state-space controller
                      labels (output and setpoint vs state and reference)
    """
    plt.figure()
    subplot_max = system.sysd.states + system.sysd.inputs
    for i in range(system.sysd.states):
        plt.subplot(subplot_max, 1, i + 1)
        if system.sysd.states + system.sysd.inputs > 3:
            plt.ylabel(
                system.state_labels[i],
                horizontalalignment="right",
                verticalalignment="center",
                rotation=45,
            )
        else:
            plt.ylabel(system.state_labels[i])
        if use_pid_labels:
            label = "Output"
        else:
            label = "State"
        if i == 0:
            plt.title(title)
            label += f" ($K_p = {round(system.K[0, 0], ndigits)}$)"
        elif i == 1:
            label += f" ($K_d = {round(system.K[0, 1], ndigits)}$)"
        plt.plot(t, system.extract_row(x_rec, i), label=label)
        if use_pid_labels:
            label = "Setpoint"
        else:
            label = "Reference"
        plt.plot(t, system.extract_row(ref_rec, i), label=label)
        plt.legend()

    for i in range(system.sysd.inputs):
        plt.subplot(subplot_max, 1, system.sysd.states + i + 1)
        if system.sysd.states + system.sysd.inputs > 3:
            plt.ylabel(
                system.u_labels[i],
                horizontalalignment="right",
                verticalalignment="center",
                rotation=45,
            )
        else:
            plt.ylabel(system.u_labels[i])
        plt.plot(t, system.extract_row(u_rec, i), label="Control effort")
        plt.legend()
    plt.xlabel("Time (s)")


class Elevator(fct.System):
    def __init__(self, dt, latency_comp=False):
        """Elevator subsystem.

        Keyword arguments:
        dt -- time between model/controller updates
        latency_comp -- True if the controller gain should be latency-compensated
        """
        self.latency_comp = latency_comp

        state_labels = [("Velocity", "rad/s")]
        u_labels = [("Voltage", "V")]
        self.set_plot_labels(state_labels, u_labels)

        fct.System.__init__(
            self,
            np.array([[-12.0]]),
            np.array([[12.0]]),
            dt,
            np.zeros((1, 1)),
            np.zeros((1, 1)),
        )

    def create_model(self, states, inputs):
        kv = 0.011
        ka = 0.005515

        A = np.array([[-kv / ka]])
        B = np.array([[1 / ka]])
        C = np.array([[1]])
        D = np.array([[0]])

        return StateSpace(A, B, C, D)

    def design_controller_observer(self):
        q = [0.00001]
        r = [12.0]
        self.design_lqr(q, r)
        self.design_two_state_feedforward()

        q_vel = 1.0
        r_pos = 0.0001
        self.design_kalman_filter([q_vel], [r_pos])

        self.ubuf = []
        for i in range(int(DELAY / DT)):
            self.ubuf.append(np.zeros((1, 1)))

        if self.latency_comp:
            self.K = self.K @ np.linalg.matrix_power(
                self.sysd.A - self.sysd.B @ self.K, round(DELAY / DT)
            )

    def update_controller(self, next_r):
        u = self.K @ (self.r - self.x_hat)
        if self.f:
            rdot = (next_r - self.r) / self.dt
            uff = self.Kff @ (rdot - self.f(self.r, np.zeros(self.u.shape)))
        else:
            uff = self.Kff @ (next_r - self.sysd.A @ self.r)
        self.r = next_r
        self.u = np.clip(u + uff, self.u_min, self.u_max)
        self.ubuf.append(self.u)
        self.u = self.ubuf.pop(0)


def main():
    # Set up graphing
    l0 = 0.1
    l1 = l0 + 5.0
    l2 = l1 + 0.1
    t = np.arange(0, l2 + 5.0, DT)

    refs = []

    # Generate references for simulation
    for i in range(len(t)):
        if t[i] < l0:
            r = np.array([[0.0]])
        elif t[i] < l1:
            r = np.array([[300]])
        else:
            r = np.array([[0.0]])
        refs.append(r)

    fig, (ax1, ax2) = plt.subplots(2)
    ax1.set(
        title=f"Flywheel velocity and voltage with dt={DT * 1000}ms and a {DELAY * 1000}ms delay",
        ylabel="Flywheel Velocity (rad/s)",
    )
    ax2.set(ylabel="Voltage (V)", xlabel="Time (s)")

    elevator = Elevator(DT)
    x_rec, ref_rec, u_rec, y_rec = elevator.generate_time_responses(t, refs)
    # plot_time_responses(
    #     elevator,
    #     t,
    #     x_rec,
    #     ref_rec,
    #     u_rec,
    #     4,
    #     title=f"Flywheel with {round(DT * 1000)}ms sample period and {round(DELAY * 1000)}ms output lag",
    # )

    ax1.plot(t, elevator.extract_row(ref_rec, 0), label="Reference")
    ax1.plot(
        t,
        elevator.extract_row(x_rec, 0),
        label=f"Uncompensated (Kp = {round(elevator.K[0, 0], 4)})",
    )
    ax2.plot(
        t,
        elevator.extract_row(u_rec, 0),
        label=f"Uncompensated (Kp = {round(elevator.K[0, 0], 4)})",
    )

    elevator = Elevator(DT, latency_comp=True)
    x_rec, ref_rec, u_rec, y_rec = elevator.generate_time_responses(t, refs)
    # plot_time_responses(
    #     elevator,
    #     t,
    #     x_rec,
    #     ref_rec,
    #     u_rec,
    #     4,
    #     title=f"Flywheel with {round(DT * 1000)}ms sample period and {round(DELAY * 1000)}ms output lag (compensated)",
    # )

    ax1.plot(
        t,
        elevator.extract_row(x_rec, 0),
        label=f"Compensated (Kp = {round(elevator.K[0, 0], 4)})",
    )
    ax2.plot(
        t,
        elevator.extract_row(u_rec, 0),
        label=f"Compensated (Kp = {round(elevator.K[0, 0], 4)})",
    )

    ax1.legend(loc="upper right")
    ax2.legend(loc="upper right")
    plt.show()


if __name__ == "__main__":
    main()
