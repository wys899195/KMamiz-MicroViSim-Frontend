import IAggregateData from "../entities/IAggregateData";
import IEndpointDataType from "../entities/IEndpointDataType";
import { IEndpointDependency } from "../entities/IEndpointDependency";
import IHistoryData from "../entities/IHistoryData";
import { Color } from "./ColorUtils";

const MockGraphData = {
  nodes: [
    {
      id: "null",
      group: "null",
      name: "external requests",
      dependencies: [
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/static*",
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      ],
      linkInBetween: [
        {
          source: "null",
          target:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/static*",
        },
        {
          source: "null",
          target:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
        },
      ],
    },
    {
      id: "productpage\tbook",
      group: "productpage\tbook",
      name: "productpage.book",
      dependencies: [
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/static*",
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      ],
      linkInBetween: [
        {
          source: "productpage\tbook",
          target:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/static*",
        },
        {
          source: "productpage\tbook",
          target:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
        },
      ],
    },
    {
      id: "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/static*",
      group: "productpage\tbook",
      name: "(v1) /static*",
      dependencies: [],
      linkInBetween: [],
    },
    {
      id: "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      group: "productpage\tbook",
      name: "(v1) /productpage",
      dependencies: [
        "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
        "details\tbook\tv1\tdetails.book.svc.cluster.local:9080/*",
      ],
      linkInBetween: [
        {
          source: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        },
        {
          source: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "details\tbook\tv1\tdetails.book.svc.cluster.local:9080/*",
        },
      ],
    },
    {
      id: "details\tbook",
      group: "details\tbook",
      name: "details.book",
      dependencies: [
        "details\tbook\tv1\tdetails.book.svc.cluster.local:9080/*",
      ],
      linkInBetween: [
        {
          source: "details\tbook",
          target: "details\tbook\tv1\tdetails.book.svc.cluster.local:9080/*",
        },
      ],
    },
    {
      id: "details\tbook\tv1\tdetails.book.svc.cluster.local:9080/*",
      group: "details\tbook",
      name: "(v1) /*",
      dependencies: [
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      ],
      linkInBetween: [
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "details\tbook\tv1\tdetails.book.svc.cluster.local:9080/*",
        },
      ],
    },
    {
      id: "ratings\tbook",
      group: "ratings\tbook",
      name: "ratings.book",
      dependencies: [
        "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
      ],
      linkInBetween: [
        {
          source: "ratings\tbook",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        },
      ],
    },
    {
      id: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
      group: "ratings\tbook",
      name: "(v1) /*",
      dependencies: [
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
        "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
      ],
      linkInBetween: [
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        },
        {
          source: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        },
      ],
    },
    {
      id: "reviews\tbook",
      group: "reviews\tbook",
      name: "reviews.book",
      dependencies: [
        "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
      ],
      linkInBetween: [
        {
          source: "reviews\tbook",
          target: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source: "reviews\tbook",
          target: "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source: "reviews\tbook",
          target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
        },
      ],
    },
    {
      id: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
      group: "reviews\tbook",
      name: "(v2) /*",
      dependencies: [
        "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      ],
      linkInBetween: [
        {
          source: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
        },
      ],
    },
    {
      id: "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
      group: "reviews\tbook",
      name: "(v1) /*",
      dependencies: [
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      ],
      linkInBetween: [
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
        },
      ],
    },
    {
      id: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
      group: "reviews\tbook",
      name: "(v3) /*",
      dependencies: [
        "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      ],
      linkInBetween: [
        {
          source: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
        },
      ],
    },
  ],
  links: [
    {
      source: "productpage\tbook",
      target:
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/static*",
    },
    {
      source: "null",
      target:
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/static*",
    },
    {
      source: "productpage\tbook",
      target:
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
    },
    {
      source:
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
    },
    {
      source:
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      target: "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
    },
    {
      source:
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      target: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
    },
    {
      source:
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      target: "details\tbook\tv1\tdetails.book.svc.cluster.local:9080/*",
    },
    {
      source: "null",
      target:
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
    },
    {
      source: "details\tbook",
      target: "details\tbook\tv1\tdetails.book.svc.cluster.local:9080/*",
    },
    {
      source: "ratings\tbook",
      target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
    },
    {
      source: "reviews\tbook",
      target: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
    },
    {
      source: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
      target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
    },
    {
      source: "reviews\tbook",
      target: "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
    },
    {
      source: "reviews\tbook",
      target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
    },
    {
      source: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
      target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
    },
  ],
};

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
  toDate: new Date("2022-02-17T16:00:00.000Z"),
  services: [
    {
      service: "productpage",
      namespace: "book",
      version: "v1",
      totalRequests: 159,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 1,
      endpoints: [
        {
          name: "productpage.book.svc.cluster.local:9080/static*",
          protocol: "GET",
          totalRequests: 81,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 0.3244511162655295,
        },
        {
          name: "productpage.book.svc.cluster.local:9080/productpage",
          protocol: "GET",
          totalRequests: 78,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 2.2792702153413336,
        },
      ],
      avgLatencyCV: 1.3018606658034315,
    },
    {
      service: "details",
      namespace: "book",
      version: "v1",
      totalRequests: 78,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.1,
      endpoints: [
        {
          name: "details.book.svc.cluster.local:9080/*",
          protocol: "GET",
          totalRequests: 78,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 1.478491639752334,
        },
      ],
      avgLatencyCV: 1.478491639752334,
    },
    {
      service: "ratings",
      namespace: "book",
      version: "v1",
      totalRequests: 52,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.16102181971760718,
      endpoints: [
        {
          name: "ratings.book.svc.cluster.local:9080/*",
          protocol: "GET",
          totalRequests: 52,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 1.2152011199650987,
        },
      ],
      avgLatencyCV: 1.2152011199650987,
    },
    {
      service: "reviews",
      namespace: "book",
      version: "v2",
      totalRequests: 26,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.12578952525566112,
      endpoints: [
        {
          name: "reviews.book.svc.cluster.local:9080/*",
          protocol: "GET",
          totalRequests: 26,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 2.967533146811703,
        },
      ],
      avgLatencyCV: 2.967533146811703,
    },
    {
      service: "reviews",
      namespace: "book",
      version: "v1",
      totalRequests: 26,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.10341110368342081,
      endpoints: [
        {
          name: "reviews.book.svc.cluster.local:9080/*",
          protocol: "GET",
          totalRequests: 26,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 4.122910601754022,
        },
      ],
      avgLatencyCV: 4.122910601754022,
    },
    {
      service: "reviews",
      namespace: "book",
      version: "v3",
      totalRequests: 26,
      totalRequestErrors: 0,
      totalServerErrors: 0,
      avgRisk: 0.12704197982594753,
      endpoints: [
        {
          name: "reviews.book.svc.cluster.local:9080/*",
          protocol: "GET",
          totalRequests: 26,
          totalRequestErrors: 0,
          totalServerErrors: 0,
          avgLatencyCV: 2.9986857724896905,
        },
      ],
      avgLatencyCV: 2.9986857724896905,
    },
  ],
};

const MockHistoryData: IHistoryData[] = [
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

function GetServiceChordData() {
  const serviceMap = new Map<string, Map<string, number>>();
  MockEndpointDependencies.forEach((ep) => {
    const service = `${ep.endpoint.service}\t${ep.endpoint.namespace}\t${ep.endpoint.version}`;
    if (!serviceMap.has(service)) serviceMap.set(service, new Map());
    ep.dependsOn
      .filter((d) => d.distance === 1)
      .forEach((s) => {
        const dependName = `${s.endpoint.service}\t${s.endpoint.namespace}\t${s.endpoint.version}`;
        serviceMap
          .get(service)!
          .set(dependName, (serviceMap.get(service)!.get(dependName) || 0) + 1);
      });
  });

  const nodes = [...serviceMap.keys()].map((k) => {
    const [service, namespace, version] = k.split("\t");
    return {
      id: `${service}.${namespace} (${version})`,
      name: k,
      fill: Color.generateFromString(k).hex,
    };
  });
  const links = [...serviceMap.entries()]
    .map(([id, dep]) => {
      const [service, namespace, version] = id.split("\t");
      const neoId = `${service}.${namespace} (${version})`;
      return [...dep.entries()].map(([dId, val]) => {
        const [dService, dNamespace, dVersion] = dId.split("\t");
        const neoDId = `${dService}.${dNamespace} (${dVersion})`;
        return {
          from: neoId,
          to: neoDId,
          value: val,
        };
      });
    })
    .flat();
  return { nodes, links };
}
function GetIndirectServiceChordData() {
  const serviceMap = new Map<string, Map<string, number>>();
  MockEndpointDependencies.forEach((ep) => {
    const service = `${ep.endpoint.service}\t${ep.endpoint.namespace}\t${ep.endpoint.version}`;
    if (!serviceMap.has(service)) serviceMap.set(service, new Map());
    ep.dependsOn.forEach((s) => {
      const dependName = `${s.endpoint.service}\t${s.endpoint.namespace}\t${s.endpoint.version}`;
      serviceMap
        .get(service)!
        .set(dependName, (serviceMap.get(service)!.get(dependName) || 0) + 1);
    });
  });

  const nodes = [...serviceMap.keys()].map((k) => {
    const [service, namespace, version] = k.split("\t");
    return {
      id: `${service}.${namespace} (${version})`,
      name: k,
      fill: Color.generateFromString(k).hex,
    };
  });
  const links = [...serviceMap.entries()]
    .map(([id, dep]) => {
      const [service, namespace, version] = id.split("\t");
      const neoId = `${service}.${namespace} (${version})`;
      return [...dep.entries()].map(([dId, val]) => {
        const [dService, dNamespace, dVersion] = dId.split("\t");
        const neoDId = `${dService}.${dNamespace} (${dVersion})`;
        return {
          from: neoId,
          to: neoDId,
          value: val,
        };
      });
    })
    .flat();
  return { nodes, links };
}

export {
  MockGraphData,
  MockEndpointDependencies,
  MockEndpointDataType,
  MockAggregateData,
  GetServiceAggregateDataWithAllVersion,
  GetServiceAggregateData,
  GetEndpointDataType,
  GetServiceChordData,
  GetIndirectServiceChordData,
};
