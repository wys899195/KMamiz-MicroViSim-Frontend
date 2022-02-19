import IAggregateData from "../entities/IAggregateData";
import IEndpointDataType from "../entities/IEndpointDataType";
import { IEndpointDependency } from "../entities/IEndpointDependency";
import IHistoryData from "../entities/IHistoryData";
import IMappedHistoryData from "../entities/IMappedHistoryData";

const MockEndpointDependencies: IEndpointDependency[] = [
  {
    endpoint: {
      name: "productpage.book.svc.cluster.local:9080/static*",
      version: "v1",
      service: "productpage",
      namespace: "book",
      host: "192.168.39.24",
      path: "/static/bootstrap/css/bootstrap.min.css",
      port: ":31629",
      clusterName: "cluster.local",
    },
    dependsOn: [],
    dependBy: [],
  },
  {
    endpoint: {
      name: "productpage.book.svc.cluster.local:9080/productpage",
      version: "v1",
      service: "productpage",
      namespace: "book",
      host: "192.168.39.24",
      path: "/productpage",
      port: ":31629",
      clusterName: "cluster.local",
    },
    dependsOn: [
      {
        endpoint: {
          name: "reviews.book.svc.cluster.local:9080/*",
          version: "v3",
          service: "reviews",
          namespace: "book",
          host: "reviews",
          path: "/reviews/0",
          port: ":9080",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "SERVER",
      },
      {
        endpoint: {
          name: "reviews.book.svc.cluster.local:9080/*",
          version: "v1",
          service: "reviews",
          namespace: "book",
          host: "reviews",
          path: "/reviews/0",
          port: ":9080",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "SERVER",
      },
      {
        endpoint: {
          name: "reviews.book.svc.cluster.local:9080/*",
          version: "v2",
          service: "reviews",
          namespace: "book",
          host: "reviews",
          path: "/reviews/0",
          port: ":9080",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "SERVER",
      },
      {
        endpoint: {
          name: "details.book.svc.cluster.local:9080/*",
          version: "v1",
          service: "details",
          namespace: "book",
          host: "details",
          path: "/details/0",
          port: ":9080",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "SERVER",
      },
      {
        endpoint: {
          name: "ratings.book.svc.cluster.local:9080/*",
          version: "v1",
          service: "ratings",
          namespace: "book",
          host: "ratings",
          path: "/ratings/0",
          port: ":9080",
          clusterName: "cluster.local",
        },
        distance: 2,
        type: "SERVER",
      },
    ],
    dependBy: [],
  },
  {
    endpoint: {
      name: "details.book.svc.cluster.local:9080/*",
      version: "v1",
      service: "details",
      namespace: "book",
      host: "details",
      path: "/details/0",
      port: ":9080",
      clusterName: "cluster.local",
    },
    dependsOn: [],
    dependBy: [
      {
        endpoint: {
          name: "productpage.book.svc.cluster.local:9080/productpage",
          version: "v1",
          service: "productpage",
          namespace: "book",
          host: "192.168.39.24",
          path: "/productpage",
          port: ":31629",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "CLIENT",
      },
    ],
  },
  {
    endpoint: {
      name: "ratings.book.svc.cluster.local:9080/*",
      version: "v1",
      service: "ratings",
      namespace: "book",
      host: "ratings",
      path: "/ratings/0",
      port: ":9080",
      clusterName: "cluster.local",
    },
    dependsOn: [],
    dependBy: [
      {
        endpoint: {
          name: "productpage.book.svc.cluster.local:9080/productpage",
          version: "v1",
          service: "productpage",
          namespace: "book",
          host: "192.168.39.24",
          path: "/productpage",
          port: ":31629",
          clusterName: "cluster.local",
        },
        distance: 2,
        type: "CLIENT",
      },
      {
        endpoint: {
          name: "reviews.book.svc.cluster.local:9080/*",
          version: "v2",
          service: "reviews",
          namespace: "book",
          host: "reviews",
          path: "/reviews/0",
          port: ":9080",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "CLIENT",
      },
      {
        endpoint: {
          name: "reviews.book.svc.cluster.local:9080/*",
          version: "v3",
          service: "reviews",
          namespace: "book",
          host: "reviews",
          path: "/reviews/0",
          port: ":9080",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "CLIENT",
      },
    ],
  },
  {
    endpoint: {
      name: "reviews.book.svc.cluster.local:9080/*",
      version: "v2",
      service: "reviews",
      namespace: "book",
      host: "reviews",
      path: "/reviews/0",
      port: ":9080",
      clusterName: "cluster.local",
    },
    dependsOn: [
      {
        endpoint: {
          name: "ratings.book.svc.cluster.local:9080/*",
          version: "v1",
          service: "ratings",
          namespace: "book",
          host: "ratings",
          path: "/ratings/0",
          port: ":9080",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "SERVER",
      },
    ],
    dependBy: [
      {
        endpoint: {
          name: "productpage.book.svc.cluster.local:9080/productpage",
          version: "v1",
          service: "productpage",
          namespace: "book",
          host: "192.168.39.24",
          path: "/productpage",
          port: ":31629",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "CLIENT",
      },
    ],
  },
  {
    endpoint: {
      name: "reviews.book.svc.cluster.local:9080/*",
      version: "v1",
      service: "reviews",
      namespace: "book",
      host: "reviews",
      path: "/reviews/0",
      port: ":9080",
      clusterName: "cluster.local",
    },
    dependsOn: [],
    dependBy: [
      {
        endpoint: {
          name: "productpage.book.svc.cluster.local:9080/productpage",
          version: "v1",
          service: "productpage",
          namespace: "book",
          host: "192.168.39.24",
          path: "/productpage",
          port: ":31629",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "CLIENT",
      },
    ],
  },
  {
    endpoint: {
      name: "reviews.book.svc.cluster.local:9080/*",
      version: "v3",
      service: "reviews",
      namespace: "book",
      host: "reviews",
      path: "/reviews/0",
      port: ":9080",
      clusterName: "cluster.local",
    },
    dependsOn: [
      {
        endpoint: {
          name: "ratings.book.svc.cluster.local:9080/*",
          version: "v1",
          service: "ratings",
          namespace: "book",
          host: "ratings",
          path: "/ratings/0",
          port: ":9080",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "SERVER",
      },
    ],
    dependBy: [
      {
        endpoint: {
          name: "productpage.book.svc.cluster.local:9080/productpage",
          version: "v1",
          service: "productpage",
          namespace: "book",
          host: "192.168.39.24",
          path: "/productpage",
          port: ":31629",
          clusterName: "cluster.local",
        },
        distance: 1,
        type: "CLIENT",
      },
    ],
  },
];

const MockEndpointDataType: IEndpointDataType[] = [
  {
    service: "details",
    version: "v1",
    namespace: "book",
    endpoint: "details.book.svc.cluster.local:9080/*",
    schemas: [
      {
        time: new Date("2022-02-08T06:49:03.136Z"),
        sampleObject: {
          id: 0,
          author: "William Shakespeare",
          year: 1595,
          type: "paperback",
          pages: 200,
          publisher: "PublisherA",
          language: "English",
          "ISBN-10": "1234567890",
          "ISBN-13": "123-1234567890",
        },
        schema:
          "interface Root {\n" +
          "  'ISBN-10': string;\n" +
          "  'ISBN-13': string;\n" +
          "  author: string;\n" +
          "  id: number;\n" +
          "  language: string;\n" +
          "  pages: number;\n" +
          "  publisher: string;\n" +
          "  type: string;\n" +
          "  year: number;\n" +
          "}",
      },
    ],
  },
  {
    service: "reviews",
    version: "v3",
    namespace: "book",
    endpoint: "reviews.book.svc.cluster.local:9080/*",
    schemas: [
      {
        time: new Date("2022-02-08T06:49:03.139Z"),
        sampleObject: {
          id: "0",
          reviews: [
            {
              reviewer: "Reviewer1",
              text: "An extremely entertaining play by Shakespeare. The slapstick humour is refreshing!",
              rating: { stars: 5, color: "red" },
            },
            {
              reviewer: "Reviewer2",
              text: "Absolutely fun and entertaining. The play lacks thematic depth when compared to other plays by Shakespeare.",
              rating: { stars: 4, color: "red" },
            },
          ],
        },
        schema:
          "interface Root {\n" +
          "  id: string;\n" +
          "  reviews: Review[];\n" +
          "}\n" +
          "interface Review {\n" +
          "  rating: Rating;\n" +
          "  reviewer: string;\n" +
          "  text: string;\n" +
          "}\n" +
          "interface Rating {\n" +
          "  color: string;\n" +
          "  stars: number;\n" +
          "}",
      },
    ],
  },
  {
    service: "reviews",
    version: "v1",
    namespace: "book",
    endpoint: "reviews.book.svc.cluster.local:9080/*",
    schemas: [
      {
        time: new Date("2022-02-08T06:49:02.933Z"),
        sampleObject: {
          id: "0",
          reviews: [
            {
              reviewer: "Reviewer1",
              text: "An extremely entertaining play by Shakespeare. The slapstick humour is refreshing!",
            },
            {
              reviewer: "Reviewer2",
              text: "Absolutely fun and entertaining. The play lacks thematic depth when compared to other plays by Shakespeare.",
            },
          ],
        },
        schema:
          "interface Root {\n" +
          "  id: string;\n" +
          "  reviews: Review[];\n" +
          "}\n" +
          "interface Review {\n" +
          "  reviewer: string;\n" +
          "  text: string;\n" +
          "}",
      },
    ],
  },
  {
    service: "reviews",
    version: "v2",
    namespace: "book",
    endpoint: "reviews.book.svc.cluster.local:9080/*",
    schemas: [
      {
        time: new Date("2022-02-08T06:49:02.644Z"),
        sampleObject: {
          id: "0",
          reviews: [
            {
              reviewer: "Reviewer1",
              text: "An extremely entertaining play by Shakespeare. The slapstick humour is refreshing!",
              rating: { stars: 5, color: "black" },
            },
            {
              reviewer: "Reviewer2",
              text: "Absolutely fun and entertaining. The play lacks thematic depth when compared to other plays by Shakespeare.",
              rating: { stars: 4, color: "black" },
            },
          ],
        },
        schema:
          "interface Root {\n" +
          "  id: string;\n" +
          "  reviews: Review[];\n" +
          "}\n" +
          "interface Review {\n" +
          "  rating: Rating;\n" +
          "  reviewer: string;\n" +
          "  text: string;\n" +
          "}\n" +
          "interface Rating {\n" +
          "  color: string;\n" +
          "  stars: number;\n" +
          "}",
      },
    ],
  },
  {
    service: "ratings",
    version: "v1",
    namespace: "book",
    endpoint: "ratings.book.svc.cluster.local:9080/*",
    schemas: [
      {
        time: new Date("2022-02-08T06:49:02.650Z"),
        sampleObject: { id: 0, ratings: { Reviewer1: 5, Reviewer2: 4 } },
        schema:
          "interface Root {\n" +
          "  id: number;\n" +
          "  ratings: Ratings;\n" +
          "}\n" +
          "interface Ratings {\n" +
          "  Reviewer1: number;\n" +
          "  Reviewer2: number;\n" +
          "}",
      },
    ],
  },
];

const MockAggregateData: IAggregateData = {
  fromDate: new Date("2022-02-17T16:00:00.000Z"),
  toDate: new Date("2022-02-18T16:00:00.000Z"),
  services: [
    {
      service: "productpage",
      namespace: "book",
      version: "v1",
      totalRequests: 375,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 1,
      endpoints: [
        {
          name: "productpage.book.svc.cluster.local:9080/static*",
          protocol: "GET",
          totalRequests: 195,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 0.4274904845302312,
        },
        {
          name: "productpage.book.svc.cluster.local:9080/productpage",
          protocol: "GET",
          totalRequests: 180,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 1.423004543421064,
        },
      ],
      avgLatencyCV: 0.9252475139756476,
    },
    {
      service: "details",
      namespace: "book",
      version: "v1",
      totalRequests: 178,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.32399695630089126,
      endpoints: [
        {
          name: "details.book.svc.cluster.local:9080/*",
          protocol: "GET",
          totalRequests: 178,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 1.689923822402776,
        },
      ],
      avgLatencyCV: 1.689923822402776,
    },
    {
      service: "reviews",
      namespace: "book",
      version: "v1",
      totalRequests: 60,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.1017055518417104,
      endpoints: [
        {
          name: "reviews.book.svc.cluster.local:9080/*",
          protocol: "GET",
          totalRequests: 60,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 2.1249169376290133,
        },
      ],
      avgLatencyCV: 2.1249169376290133,
    },
    {
      service: "reviews",
      namespace: "book",
      version: "v3",
      totalRequests: 60,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.1411760147944299,
      endpoints: [
        {
          name: "reviews.book.svc.cluster.local:9080/*",
          protocol: "GET",
          totalRequests: 60,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 1.660685189021735,
        },
      ],
      avgLatencyCV: 1.660685189021735,
    },
    {
      service: "ratings",
      namespace: "book",
      version: "v1",
      totalRequests: 118,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.20158331161482765,
      endpoints: [
        {
          name: "ratings.book.svc.cluster.local:9080/*",
          protocol: "GET",
          totalRequests: 118,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 0.7449306138320116,
        },
      ],
      avgLatencyCV: 0.7449306138320116,
    },
    {
      service: "reviews",
      namespace: "book",
      version: "v2",
      totalRequests: 58,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.13363076154444087,
      endpoints: [
        {
          name: "reviews.book.svc.cluster.local:9080/*",
          protocol: "GET",
          totalRequests: 58,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 1.5994554917313777,
        },
      ],
      avgLatencyCV: 1.5994554917313777,
    },
  ],
};

const MockHistoryData: IHistoryData[] = [
  {
    date: new Date("2022-02-18T16:00:00.000Z"),
    services: [
      {
        date: new Date("2022-02-18T16:00:00.000Z"),
        service: "productpage",
        namespace: "book",
        version: "v1",
        requests: 216,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 0.5667388715007946,
        risk: 1,
        endpoints: [
          {
            name: "productpage.book.svc.cluster.local:9080/static*",
            protocol: "GET",
            requests: 114,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.5305298527949329,
          },
          {
            name: "productpage.book.svc.cluster.local:9080/productpage",
            protocol: "GET",
            requests: 102,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.5667388715007946,
          },
        ],
      },
      {
        date: new Date("2022-02-18T16:00:00.000Z"),
        service: "details",
        namespace: "book",
        version: "v1",
        requests: 100,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 1.901356005053218,
        risk: 0.5479939126017825,
        endpoints: [
          {
            name: "details.book.svc.cluster.local:9080/*",
            protocol: "GET",
            requests: 100,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 1.901356005053218,
          },
        ],
      },
      {
        date: new Date("2022-02-18T16:00:00.000Z"),
        service: "reviews",
        namespace: "book",
        version: "v1",
        requests: 34,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 0.1269232735040053,
        risk: 0.1,
        endpoints: [
          {
            name: "reviews.book.svc.cluster.local:9080/*",
            protocol: "GET",
            requests: 34,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.1269232735040053,
          },
        ],
      },
      {
        date: new Date("2022-02-18T16:00:00.000Z"),
        service: "reviews",
        namespace: "book",
        version: "v3",
        requests: 34,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 0.3226846055537795,
        risk: 0.15531004976291227,
        endpoints: [
          {
            name: "reviews.book.svc.cluster.local:9080/*",
            protocol: "GET",
            requests: 34,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.3226846055537795,
          },
        ],
      },
      {
        date: new Date("2022-02-18T16:00:00.000Z"),
        service: "ratings",
        namespace: "book",
        version: "v1",
        requests: 66,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 0.2746601076989245,
        risk: 0.24214480351204812,
        endpoints: [
          {
            name: "ratings.book.svc.cluster.local:9080/*",
            protocol: "GET",
            requests: 66,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.2746601076989245,
          },
        ],
      },
      {
        date: new Date("2022-02-18T16:00:00.000Z"),
        service: "reviews",
        namespace: "book",
        version: "v2",
        requests: 32,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 0.23137783665105224,
        risk: 0.14147199783322062,
        endpoints: [
          {
            name: "reviews.book.svc.cluster.local:9080/*",
            protocol: "GET",
            requests: 32,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.23137783665105224,
          },
        ],
      },
    ],
  },
  {
    date: new Date("2022-02-17T16:00:00.000Z"),
    services: [
      {
        date: new Date("2022-02-17T16:00:00.000Z"),
        service: "productpage",
        namespace: "book",
        version: "v1",
        requests: 159,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 2.2792702153413336,
        risk: 1,
        endpoints: [
          {
            name: "productpage.book.svc.cluster.local:9080/static*",
            protocol: "GET",
            requests: 81,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.3244511162655295,
          },
          {
            name: "productpage.book.svc.cluster.local:9080/productpage",
            protocol: "GET",
            requests: 78,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 2.2792702153413336,
          },
        ],
      },
      {
        date: new Date("2022-02-17T16:00:00.000Z"),
        service: "details",
        namespace: "book",
        version: "v1",
        requests: 78,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 1.478491639752334,
        risk: 0.1,
        endpoints: [
          {
            name: "details.book.svc.cluster.local:9080/*",
            protocol: "GET",
            requests: 78,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 1.478491639752334,
          },
        ],
      },
      {
        date: new Date("2022-02-17T16:00:00.000Z"),
        service: "ratings",
        namespace: "book",
        version: "v1",
        requests: 52,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 1.2152011199650987,
        risk: 0.16102181971760718,
        endpoints: [
          {
            name: "ratings.book.svc.cluster.local:9080/*",
            protocol: "GET",
            requests: 52,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 1.2152011199650987,
          },
        ],
      },
      {
        date: new Date("2022-02-17T16:00:00.000Z"),
        service: "reviews",
        namespace: "book",
        version: "v2",
        requests: 26,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 2.967533146811703,
        risk: 0.12578952525566112,
        endpoints: [
          {
            name: "reviews.book.svc.cluster.local:9080/*",
            protocol: "GET",
            requests: 26,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 2.967533146811703,
          },
        ],
      },
      {
        date: new Date("2022-02-17T16:00:00.000Z"),
        service: "reviews",
        namespace: "book",
        version: "v1",
        requests: 26,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 4.122910601754022,
        risk: 0.10341110368342081,
        endpoints: [
          {
            name: "reviews.book.svc.cluster.local:9080/*",
            protocol: "GET",
            requests: 26,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 4.122910601754022,
          },
        ],
      },
      {
        date: new Date("2022-02-17T16:00:00.000Z"),
        service: "reviews",
        namespace: "book",
        version: "v3",
        requests: 26,
        serverErrors: 0,
        requestErrors: 0,
        latencyCV: 2.9986857724896905,
        risk: 0.12704197982594753,
        endpoints: [
          {
            name: "reviews.book.svc.cluster.local:9080/*",
            protocol: "GET",
            requests: 26,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 2.9986857724896905,
          },
        ],
      },
    ],
  },
];

function GetServiceAggregateDataWithAllVersion(uniqueName: string) {
  const [service, namespace] = uniqueName.split("\t");
  return MockAggregateData.services.filter(
    (s) => s.service === service && s.namespace === namespace
  );
}
function GetServiceAggregateData(uniqueName: string) {
  const [service, namespace, version] = uniqueName.split("\t");
  return (
    MockAggregateData.services.find(
      (s) =>
        s.service === service &&
        s.namespace === namespace &&
        s.version === version
    ) || null
  );
}
function GetEndpointDataType(serviceUniqueName: string, endpointName: string) {
  const [service, namespace, version] = serviceUniqueName.split("\t");
  return MockEndpointDataType.find(
    (e) =>
      e.service === service &&
      e.namespace === namespace &&
      e.version === version &&
      e.endpoint === endpointName
  );
}

function GetAreaLineData(serviceUniqueName?: string): IMappedHistoryData[] {
  if (!serviceUniqueName) {
    return HistoryDataToAreaLineData(MockHistoryData);
  }
  const hData = MockHistoryData.map((d) => {
    return {
      ...d,
      services: d.services.filter((s) => {
        const uniqueName = `${s.service}\t${s.namespace}\t${s.version}`;
        return uniqueName === serviceUniqueName;
      }),
    };
  });
  return HistoryDataToAreaLineData(hData);
}
function HistoryDataToAreaLineData(historyData: IHistoryData[]) {
  return historyData
    .map((h) => {
      return h.services.map((s) => {
        const name = `${s.service}.${s.namespace} (${s.version})`;
        return {
          name,
          x: s.date,
          requests: s.requests,
          serverErrors: s.serverErrors,
          requestErrors: s.requestErrors,
          latencyCV: s.latencyCV,
          risk: s.risk,
        };
      });
    })
    .flat();
}

export {
  MockEndpointDependencies,
  MockEndpointDataType,
  MockAggregateData,
  MockHistoryData,
  GetServiceAggregateDataWithAllVersion,
  GetServiceAggregateData,
  GetEndpointDataType,
  GetAreaLineData,
};
