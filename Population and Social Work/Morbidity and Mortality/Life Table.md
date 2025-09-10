### Life table

| Age interval (x to x+n) | lxl_x (No. alive at start) | dxd_x (Deaths in interval) | qxq_x (Prob. of dying) | pxp_x (Prob. of surviving) | LxL_x (Person-years lived) | TxT_x (Total person-years left) | exe_x (Life expectancy at age x) |
| ----------------------- | -------------------------- | -------------------------- | ---------------------- | -------------------------- | -------------------------- | ------------------------------- | -------------------------------- |
| 0–4                     | 100,000                    | 8,000                      | 0.080                  | 0.920                      | 96,000                     | 6,800,000                       | 68.0                             |
| 5–9                     | 92,000                     | 500                        | 0.005                  | 0.995                      | 459,750                    | 6,704,000                       | 72.9                             |
| 10–14                   | 91,500                     | 300                        | 0.003                  | 0.997                      | 457,350                    | 6,244,250                       | 68.3                             |
| 15–19                   | 91,200                     | 400                        | 0.004                  | 0.996                      | 455,000                    | 5,786,900                       | 63.5                             |
| 20–24                   | 90,800                     | 600                        | 0.007                  | 0.993                      | 452,500                    | 5,331,900                       | 58.7                             |
| 25–29                   | 90,200                     | 700                        | 0.008                  | 0.992                      | 448,850                    | 4,879,400                       | 54.1                             |
| 30–34                   | 89,500                     | 900                        | 0.010                  | 0.990                      | 445,050                    | 4,430,550                       | 49.5                             |
| 35–39                   | 88,600                     | 1,100                      | 0.012                  | 0.988                      | 440,100                    | 3,985,500                       | 45.0                             |
| 40–44                   | 87,500                     | 1,400                      | 0.016                  | 0.984                      | 434,300                    | 3,545,400                       | 40.5                             |
| 45–49                   | 86,100                     | 1,800                      | 0.021                  | 0.979                      | 425,200                    | 3,111,100                       | 36.1                             |
| 50–54                   | 84,300                     | 2,500                      | 0.030                  | 0.970                      | 412,050                    | 2,685,900                       | 31.9                             |
| 55–59                   | 81,800                     | 3,500                      | 0.043                  | 0.957                      | 399,050                    | 2,273,850                       | 27.8                             |
| 60–64                   | 78,300                     | 5,000                      | 0.064                  | 0.936                      | 383,050                    | 1,874,800                       | 23.9                             |
| 65–69                   | 73,300                     | 7,500                      | 0.102                  | 0.898                      | 359,300                    | 1,491,750                       | 20.3                             |
| 70–74                   | 65,800                     | 10,500                     | 0.159                  | 0.841                      | 326,050                    | 1,132,450                       | 17.2                             |
| 75–79                   | 55,300                     | 12,500                     | 0.226                  | 0.774                      | 287,050                    | 806,400                         | 14.6                             |
| 80–84                   | 42,800                     | 14,000                     | 0.327                  | 0.673                      | 235,800                    | 519,350                         | 12.1                             |
| 85+                     | 28,800                     | 28,800                     | 1.000                  | 0.000                      | 144,000                    | 283,550                         | 9.9                              |
## Explanation of Columns

- Col 1: Starting age of interval
- Col 2: Number of people alive at start (radix usually 100,000 at birth) *l$_x$
- Col 3: Number dying in the age interval (**dxd_xdx​**)
- Col 4: **q$_x$q_xqx​** = probability of dying between ages xxx and x+nx+nx+n
- Col 5: **pxp_xpx​** = probability of surviving the interval (px=1−qxp_x = 1 - q_xpx​=1−qx​)
- Col 6: **LxL_xLx​** = total person-years lived in interval (approximation: midpoint of deaths)
- Col 7: **TxT_xTx​** = cumulative total years lived by the cohort beyond age xxx
- Col 8: **exe_xex​** = life expectancy at age xxx (Tx/lxT_x / l_xTx​/lx​)
##### Assumptions
- There is no migration