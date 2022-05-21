const MonitorRisk = (
  serviceRisks: { name: string; risks: number[] }[],
  violateThreshold: number
) => {
  return serviceRisks
    .filter(({ risks }) => {
      risks = risks.filter((r) => r > 0);
      const mean = risks.reduce((prev, curr) => prev + curr) / risks.length;
      const sqSum =
        risks.reduce((prev, curr) => prev + curr * curr, 0) / risks.length;
      const stdDev = Math.sqrt(sqSum - Math.pow(mean, 2));

      const current = risks[risks.length - 1];
      return current > violateThreshold * stdDev + mean;
    })
    .map(({ name }) => name);
};

export { MonitorRisk };
