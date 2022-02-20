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
      url: "http://192.168.39.24:31629/static/bootstrap/css/bootstrap.min.css",
      host: "192.168.39.24",
      path: "/static/bootstrap/css/bootstrap.min.css",
      port: ":31629",
      clusterName: "cluster.local",
      method: "GET",
      uniqueServiceName: "productpage\tbook\tv1",
      uniqueEndpointName:
        "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/bootstrap/css/bootstrap.min.css",
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
      url: "http://192.168.39.24:31629/productpage",
      host: "192.168.39.24",
      path: "/productpage",
      port: ":31629",
      clusterName: "cluster.local",
      method: "GET",
      uniqueServiceName: "productpage\tbook\tv1",
      uniqueEndpointName:
        "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/productpage",
    },
    dependsOn: [
      {
        endpoint: {
          name: "reviews.book.svc.cluster.local:9080/*",
          version: "v2",
          service: "reviews",
          namespace: "book",
          url: "http://reviews:9080/reviews/0",
          host: "reviews",
          path: "/reviews/0",
          port: ":9080",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "reviews\tbook\tv2",
          uniqueEndpointName:
            "reviews\tbook\tv2\tGET\thttp://reviews:9080/reviews/0",
        },
        distance: 1,
        type: "SERVER",
      },
      {
        endpoint: {
          name: "reviews.book.svc.cluster.local:9080/*",
          version: "v3",
          service: "reviews",
          namespace: "book",
          url: "http://reviews:9080/reviews/0",
          host: "reviews",
          path: "/reviews/0",
          port: ":9080",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "reviews\tbook\tv3",
          uniqueEndpointName:
            "reviews\tbook\tv3\tGET\thttp://reviews:9080/reviews/0",
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
          url: "http://reviews:9080/reviews/0",
          host: "reviews",
          path: "/reviews/0",
          port: ":9080",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "reviews\tbook\tv1",
          uniqueEndpointName:
            "reviews\tbook\tv1\tGET\thttp://reviews:9080/reviews/0",
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
          url: "http://details:9080/details/0",
          host: "details",
          path: "/details/0",
          port: ":9080",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "details\tbook\tv1",
          uniqueEndpointName:
            "details\tbook\tv1\tGET\thttp://details:9080/details/0",
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
          url: "http://ratings:9080/ratings/0",
          host: "ratings",
          path: "/ratings/0",
          port: ":9080",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "ratings\tbook\tv1",
          uniqueEndpointName:
            "ratings\tbook\tv1\tGET\thttp://ratings:9080/ratings/0",
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
      url: "http://details:9080/details/0",
      host: "details",
      path: "/details/0",
      port: ":9080",
      clusterName: "cluster.local",
      method: "GET",
      uniqueServiceName: "details\tbook\tv1",
      uniqueEndpointName:
        "details\tbook\tv1\tGET\thttp://details:9080/details/0",
    },
    dependsOn: [],
    dependBy: [
      {
        endpoint: {
          name: "productpage.book.svc.cluster.local:9080/productpage",
          version: "v1",
          service: "productpage",
          namespace: "book",
          url: "http://192.168.39.24:31629/productpage",
          host: "192.168.39.24",
          path: "/productpage",
          port: ":31629",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "productpage\tbook\tv1",
          uniqueEndpointName:
            "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/productpage",
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
      url: "http://reviews:9080/reviews/0",
      host: "reviews",
      path: "/reviews/0",
      port: ":9080",
      clusterName: "cluster.local",
      method: "GET",
      uniqueServiceName: "reviews\tbook\tv1",
      uniqueEndpointName:
        "reviews\tbook\tv1\tGET\thttp://reviews:9080/reviews/0",
    },
    dependsOn: [],
    dependBy: [
      {
        endpoint: {
          name: "productpage.book.svc.cluster.local:9080/productpage",
          version: "v1",
          service: "productpage",
          namespace: "book",
          url: "http://192.168.39.24:31629/productpage",
          host: "192.168.39.24",
          path: "/productpage",
          port: ":31629",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "productpage\tbook\tv1",
          uniqueEndpointName:
            "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/productpage",
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
      url: "http://reviews:9080/reviews/0",
      host: "reviews",
      path: "/reviews/0",
      port: ":9080",
      clusterName: "cluster.local",
      method: "GET",
      uniqueServiceName: "reviews\tbook\tv3",
      uniqueEndpointName:
        "reviews\tbook\tv3\tGET\thttp://reviews:9080/reviews/0",
    },
    dependsOn: [
      {
        endpoint: {
          name: "ratings.book.svc.cluster.local:9080/*",
          version: "v1",
          service: "ratings",
          namespace: "book",
          url: "http://ratings:9080/ratings/0",
          host: "ratings",
          path: "/ratings/0",
          port: ":9080",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "ratings\tbook\tv1",
          uniqueEndpointName:
            "ratings\tbook\tv1\tGET\thttp://ratings:9080/ratings/0",
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
          url: "http://192.168.39.24:31629/productpage",
          host: "192.168.39.24",
          path: "/productpage",
          port: ":31629",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "productpage\tbook\tv1",
          uniqueEndpointName:
            "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/productpage",
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
      url: "http://ratings:9080/ratings/0",
      host: "ratings",
      path: "/ratings/0",
      port: ":9080",
      clusterName: "cluster.local",
      method: "GET",
      uniqueServiceName: "ratings\tbook\tv1",
      uniqueEndpointName:
        "ratings\tbook\tv1\tGET\thttp://ratings:9080/ratings/0",
    },
    dependsOn: [],
    dependBy: [
      {
        endpoint: {
          name: "productpage.book.svc.cluster.local:9080/productpage",
          version: "v1",
          service: "productpage",
          namespace: "book",
          url: "http://192.168.39.24:31629/productpage",
          host: "192.168.39.24",
          path: "/productpage",
          port: ":31629",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "productpage\tbook\tv1",
          uniqueEndpointName:
            "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/productpage",
        },
        distance: 2,
        type: "CLIENT",
      },
      {
        endpoint: {
          name: "reviews.book.svc.cluster.local:9080/*",
          version: "v3",
          service: "reviews",
          namespace: "book",
          url: "http://reviews:9080/reviews/0",
          host: "reviews",
          path: "/reviews/0",
          port: ":9080",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "reviews\tbook\tv3",
          uniqueEndpointName:
            "reviews\tbook\tv3\tGET\thttp://reviews:9080/reviews/0",
        },
        distance: 1,
        type: "CLIENT",
      },
      {
        endpoint: {
          name: "reviews.book.svc.cluster.local:9080/*",
          version: "v2",
          service: "reviews",
          namespace: "book",
          url: "http://reviews:9080/reviews/0",
          host: "reviews",
          path: "/reviews/0",
          port: ":9080",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "reviews\tbook\tv2",
          uniqueEndpointName:
            "reviews\tbook\tv2\tGET\thttp://reviews:9080/reviews/0",
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
      url: "http://reviews:9080/reviews/0",
      host: "reviews",
      path: "/reviews/0",
      port: ":9080",
      clusterName: "cluster.local",
      method: "GET",
      uniqueServiceName: "reviews\tbook\tv2",
      uniqueEndpointName:
        "reviews\tbook\tv2\tGET\thttp://reviews:9080/reviews/0",
    },
    dependsOn: [
      {
        endpoint: {
          name: "ratings.book.svc.cluster.local:9080/*",
          version: "v1",
          service: "ratings",
          namespace: "book",
          url: "http://ratings:9080/ratings/0",
          host: "ratings",
          path: "/ratings/0",
          port: ":9080",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "ratings\tbook\tv1",
          uniqueEndpointName:
            "ratings\tbook\tv1\tGET\thttp://ratings:9080/ratings/0",
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
          url: "http://192.168.39.24:31629/productpage",
          host: "192.168.39.24",
          path: "/productpage",
          port: ":31629",
          clusterName: "cluster.local",
          method: "GET",
          uniqueServiceName: "productpage\tbook\tv1",
          uniqueEndpointName:
            "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/productpage",
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
    labelName: "details.book.svc.cluster.local:9080/*",
    schemas: [
      {
        time: new Date("2022-02-19T06:42:50.883Z"),
        status: "200",
        responseSample: {
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
        responseSchema:
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
    method: "GET",
    uniqueServiceName: "details\tbook\tv1",
    uniqueEndpointName: "details\tbook\tv1\tGET\thttp://details:9080/details/0",
  },
  {
    service: "ratings",
    version: "v1",
    namespace: "book",
    labelName: "ratings.book.svc.cluster.local:9080/*",
    schemas: [
      {
        time: new Date("2022-02-19T06:42:50.868Z"),
        status: "200",
        responseSample: { id: 0, ratings: { Reviewer1: 5, Reviewer2: 4 } },
        responseSchema:
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
    method: "GET",
    uniqueServiceName: "ratings\tbook\tv1",
    uniqueEndpointName: "ratings\tbook\tv1\tGET\thttp://ratings:9080/ratings/0",
  },
  {
    service: "reviews",
    version: "v1",
    namespace: "book",
    labelName: "reviews.book.svc.cluster.local:9080/*",
    schemas: [
      {
        time: new Date("2022-02-19T06:42:50.817Z"),
        status: "200",
        responseSample: {
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
        responseSchema:
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
    method: "GET",
    uniqueServiceName: "reviews\tbook\tv1",
    uniqueEndpointName: "reviews\tbook\tv1\tGET\thttp://reviews:9080/reviews/0",
  },
  {
    service: "reviews",
    version: "v3",
    namespace: "book",
    labelName: "reviews.book.svc.cluster.local:9080/*",
    schemas: [
      {
        time: new Date("2022-02-19T06:42:50.759Z"),
        status: "200",
        responseSample: {
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
        responseSchema:
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
    method: "GET",
    uniqueServiceName: "reviews\tbook\tv3",
    uniqueEndpointName: "reviews\tbook\tv3\tGET\thttp://reviews:9080/reviews/0",
  },
  {
    service: "reviews",
    version: "v2",
    namespace: "book",
    labelName: "reviews.book.svc.cluster.local:9080/*",
    schemas: [
      {
        time: new Date("2022-02-19T06:42:50.682Z"),
        status: "200",
        responseSample: {
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
        responseSchema:
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
    method: "GET",
    uniqueServiceName: "reviews\tbook\tv2",
    uniqueEndpointName: "reviews\tbook\tv2\tGET\thttp://reviews:9080/reviews/0",
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
          labelName: "productpage.book.svc.cluster.local:9080/static*",
          method: "GET",
          totalRequests: 82,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 0.29834322498735444,
          uniqueServiceName: "productpage\tbook\tv1",
        },
        {
          labelName: "productpage.book.svc.cluster.local:9080/static*",
          method: "GET",
          totalRequests: 107,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 0.4297690472025231,
          uniqueServiceName: "productpage\tbook\tv1",
        },
        {
          labelName: "productpage.book.svc.cluster.local:9080/productpage",
          method: "GET",
          totalRequests: 180,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 1.423004543421064,
          uniqueServiceName: "productpage\tbook\tv1",
        },
        {
          labelName: "productpage.book.svc.cluster.local:9080/static*",
          method: "GET",
          totalRequests: 2,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 0,
          uniqueServiceName: "productpage\tbook\tv1",
        },
        {
          labelName: "productpage.book.svc.cluster.local:9080/static*",
          method: "GET",
          totalRequests: 2,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 0,
          uniqueServiceName: "productpage\tbook\tv1",
        },
        {
          labelName: "productpage.book.svc.cluster.local:9080/static*",
          method: "GET",
          totalRequests: 2,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 0,
          uniqueServiceName: "productpage\tbook\tv1",
        },
      ],
      avgLatencyCV: 0.35851946926849027,
      uniqueServiceName: "productpage\tbook\tv1",
    },
    {
      service: "details",
      namespace: "book",
      version: "v1",
      totalRequests: 178,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.3169632079926473,
      endpoints: [
        {
          labelName: "details.book.svc.cluster.local:9080/*",
          method: "GET",
          totalRequests: 178,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 1.689923822402776,
          uniqueServiceName: "details\tbook\tv1",
        },
      ],
      avgLatencyCV: 1.689923822402776,
      uniqueServiceName: "details\tbook\tv1",
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
          labelName: "reviews.book.svc.cluster.local:9080/*",
          method: "GET",
          totalRequests: 60,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 2.1249169376290133,
          uniqueServiceName: "reviews\tbook\tv1",
        },
      ],
      avgLatencyCV: 2.1249169376290133,
      uniqueServiceName: "reviews\tbook\tv1",
    },
    {
      service: "reviews",
      namespace: "book",
      version: "v3",
      totalRequests: 60,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.1403076169032858,
      endpoints: [
        {
          labelName: "reviews.book.svc.cluster.local:9080/*",
          method: "GET",
          totalRequests: 60,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 1.660685189021735,
          uniqueServiceName: "reviews\tbook\tv3",
        },
      ],
      avgLatencyCV: 1.660685189021735,
      uniqueServiceName: "reviews\tbook\tv3",
    },
    {
      service: "ratings",
      namespace: "book",
      version: "v1",
      totalRequests: 118,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.199351560818434,
      endpoints: [
        {
          labelName: "ratings.book.svc.cluster.local:9080/*",
          method: "GET",
          totalRequests: 118,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 0.7449306138320116,
          uniqueServiceName: "ratings\tbook\tv1",
        },
      ],
      avgLatencyCV: 0.7449306138320116,
      uniqueServiceName: "ratings\tbook\tv1",
    },
    {
      service: "reviews",
      namespace: "book",
      version: "v2",
      totalRequests: 58,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.13297962860179707,
      endpoints: [
        {
          labelName: "reviews.book.svc.cluster.local:9080/*",
          method: "GET",
          totalRequests: 58,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 1.5994554917313777,
          uniqueServiceName: "reviews\tbook\tv2",
        },
      ],
      avgLatencyCV: 1.5994554917313777,
      uniqueServiceName: "reviews\tbook\tv2",
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
        latencyCV: 0.58755793003874,
        risk: 1,
        endpoints: [
          {
            labelName: "productpage.book.svc.cluster.local:9080/static*",
            method: "GET",
            requests: 48,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.3455067903600441,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/jquery.min.js",
          },
          {
            labelName: "productpage.book.svc.cluster.local:9080/static*",
            method: "GET",
            requests: 63,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.58755793003874,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/bootstrap/js/bootstrap.min.js",
          },
          {
            labelName: "productpage.book.svc.cluster.local:9080/productpage",
            method: "GET",
            requests: 102,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.5667388715007946,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/productpage",
          },
          {
            labelName: "productpage.book.svc.cluster.local:9080/static*",
            method: "GET",
            requests: 1,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/bootstrap/fonts/glyphicons-halflings-regular.woff2",
          },
          {
            labelName: "productpage.book.svc.cluster.local:9080/static*",
            method: "GET",
            requests: 1,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/bootstrap/css/bootstrap-theme.min.css",
          },
          {
            labelName: "productpage.book.svc.cluster.local:9080/static*",
            method: "GET",
            requests: 1,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/bootstrap/css/bootstrap.min.css",
          },
        ],
        uniqueServiceName: "productpage\tbook\tv1",
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
        risk: 0.5339264159852947,
        endpoints: [
          {
            labelName: "details.book.svc.cluster.local:9080/*",
            method: "GET",
            requests: 100,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 1.901356005053218,
            uniqueServiceName: "details\tbook\tv1",
            uniqueEndpointName:
              "details\tbook\tv1\tGET\thttp://details:9080/details/0",
          },
        ],
        uniqueServiceName: "details\tbook\tv1",
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
            labelName: "reviews.book.svc.cluster.local:9080/*",
            method: "GET",
            requests: 34,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.1269232735040053,
            uniqueServiceName: "reviews\tbook\tv1",
            uniqueEndpointName:
              "reviews\tbook\tv1\tGET\thttp://reviews:9080/reviews/0",
          },
        ],
        uniqueServiceName: "reviews\tbook\tv1",
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
        risk: 0.1535732539806241,
        endpoints: [
          {
            labelName: "reviews.book.svc.cluster.local:9080/*",
            method: "GET",
            requests: 34,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.3226846055537795,
            uniqueServiceName: "reviews\tbook\tv3",
            uniqueEndpointName:
              "reviews\tbook\tv3\tGET\thttp://reviews:9080/reviews/0",
          },
        ],
        uniqueServiceName: "reviews\tbook\tv3",
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
        risk: 0.23768130191926082,
        endpoints: [
          {
            labelName: "ratings.book.svc.cluster.local:9080/*",
            method: "GET",
            requests: 66,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.2746601076989245,
            uniqueServiceName: "ratings\tbook\tv1",
            uniqueEndpointName:
              "ratings\tbook\tv1\tGET\thttp://ratings:9080/ratings/0",
          },
        ],
        uniqueServiceName: "ratings\tbook\tv1",
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
        risk: 0.140169731947933,
        endpoints: [
          {
            labelName: "reviews.book.svc.cluster.local:9080/*",
            method: "GET",
            requests: 32,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.23137783665105224,
            uniqueServiceName: "reviews\tbook\tv2",
            uniqueEndpointName:
              "reviews\tbook\tv2\tGET\thttp://reviews:9080/reviews/0",
          },
        ],
        uniqueServiceName: "reviews\tbook\tv2",
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
            labelName: "productpage.book.svc.cluster.local:9080/static*",
            method: "GET",
            requests: 44,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.27198016436630623,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/bootstrap/js/bootstrap.min.js",
          },
          {
            labelName: "productpage.book.svc.cluster.local:9080/static*",
            method: "GET",
            requests: 34,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0.2511796596146647,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/jquery.min.js",
          },
          {
            labelName: "productpage.book.svc.cluster.local:9080/productpage",
            method: "GET",
            requests: 78,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 2.2792702153413336,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/productpage",
          },
          {
            labelName: "productpage.book.svc.cluster.local:9080/static*",
            method: "GET",
            requests: 1,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/bootstrap/fonts/glyphicons-halflings-regular.woff2",
          },
          {
            labelName: "productpage.book.svc.cluster.local:9080/static*",
            method: "GET",
            requests: 1,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/bootstrap/css/bootstrap-theme.min.css",
          },
          {
            labelName: "productpage.book.svc.cluster.local:9080/static*",
            method: "GET",
            requests: 1,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 0,
            uniqueServiceName: "productpage\tbook\tv1",
            uniqueEndpointName:
              "productpage\tbook\tv1\tGET\thttp://192.168.39.24:31629/static/bootstrap/css/bootstrap.min.css",
          },
        ],
        uniqueServiceName: "productpage\tbook\tv1",
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
            labelName: "details.book.svc.cluster.local:9080/*",
            method: "GET",
            requests: 78,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 1.478491639752334,
            uniqueServiceName: "details\tbook\tv1",
            uniqueEndpointName:
              "details\tbook\tv1\tGET\thttp://details:9080/details/0",
          },
        ],
        uniqueServiceName: "details\tbook\tv1",
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
            labelName: "ratings.book.svc.cluster.local:9080/*",
            method: "GET",
            requests: 52,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 1.2152011199650987,
            uniqueServiceName: "ratings\tbook\tv1",
            uniqueEndpointName:
              "ratings\tbook\tv1\tGET\thttp://ratings:9080/ratings/0",
          },
        ],
        uniqueServiceName: "ratings\tbook\tv1",
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
            labelName: "reviews.book.svc.cluster.local:9080/*",
            method: "GET",
            requests: 26,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 2.967533146811703,
            uniqueServiceName: "reviews\tbook\tv2",
            uniqueEndpointName:
              "reviews\tbook\tv2\tGET\thttp://reviews:9080/reviews/0",
          },
        ],
        uniqueServiceName: "reviews\tbook\tv2",
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
            labelName: "reviews.book.svc.cluster.local:9080/*",
            method: "GET",
            requests: 26,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 4.122910601754022,
            uniqueServiceName: "reviews\tbook\tv1",
            uniqueEndpointName:
              "reviews\tbook\tv1\tGET\thttp://reviews:9080/reviews/0",
          },
        ],
        uniqueServiceName: "reviews\tbook\tv1",
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
            labelName: "reviews.book.svc.cluster.local:9080/*",
            method: "GET",
            requests: 26,
            requestErrors: 0,
            serverErrors: 0,
            latencyCV: 2.9986857724896905,
            uniqueServiceName: "reviews\tbook\tv3",
            uniqueEndpointName:
              "reviews\tbook\tv3\tGET\thttp://reviews:9080/reviews/0",
          },
        ],
        uniqueServiceName: "reviews\tbook\tv3",
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
  return (
    MockAggregateData.services.find(
      (s) => s.uniqueServiceName === uniqueName
    ) || null
  );
}
function GetEndpointDataType(service: string, label: string) {
  return MockEndpointDataType.find(
    (e) => e.uniqueServiceName === service && e.labelName === label
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
