export const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales ($)",
        data: [1500, 2000, 1800, 2200, 2500, 3000],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
      },
    ],
  };

export const barChartData = {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        label: "Units Sold",
        data: [100, 200, 150, 300],
        backgroundColor: ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"],
      },
    ],
  };

export const doughnutChartData = {
    labels: ["North America", "Europe", "Asia", "Others"],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ["#4caf50", "#2196f3", "#ff5722", "#9c27b0"],
      },
    ],
  };