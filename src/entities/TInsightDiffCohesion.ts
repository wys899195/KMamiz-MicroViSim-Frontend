export type TInsightDiffCohesion = {
  uniqueServiceName: string;
  name: string;
  dataCohesionV1: number; // SIDC Ver1
  usageCohesionV1: number; // SIUC Ver1
  totalInterfaceCohesionV1: number; // TSIC Ver1
  dataCohesionV2: number; // SIDC Ver2
  usageCohesionV2: number; // SIUC Ver2
  totalInterfaceCohesionV2: number; // TSIC Ver2
};

