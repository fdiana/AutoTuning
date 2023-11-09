import numpy as np
from skopt import gp_minimize

import csv
import sys

rows = []
x0_gp_minimize = []
y0_gp_minimize = []

x0_gp_minimize_float = []
y0_gp_minimize_float = []
# read CSV input file
file = open(sys.argv[1], 'r');
csvreader = csv.reader(file)
for row in csvreader:
    rows.append(row)
    x0_gp_minimize = [float(ele) for ele in row[:-1]]
    x0_gp_minimize_float.append(x0_gp_minimize)
file.close()

y0_gp_minimize = [row[-1] for row in rows]
y0_gp_minimize_float = [float(ele) for ele in y0_gp_minimize]


def my_function(value):
    result_my_function = 1;

    return result_my_function

res = gp_minimize(my_function,                  # the function to minimize
                  [(-1000.0, 1000.0), (-2000.0, 2000.0)],      # the bounds on each dimension of x
                  acq_func="EI",      # the acquisition function
                  x0=x0_gp_minimize_float,
                  y0=y0_gp_minimize_float,
                  n_calls=25,         # the number of evaluations of f
                  n_random_starts=10,  # the number of random initialization points
                  n_initial_points=10,
                  noise=0.1**2,       # the noise level (optional)
                  random_state=1234)   # the random seed

print(res.fun)
