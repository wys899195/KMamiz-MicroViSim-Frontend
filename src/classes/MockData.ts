import { IEndpointDependency } from "../entites/IEndpointDependency";

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
        "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
        "details\tbook\tv1\tdetails.book.svc.cluster.local:9080/*",
      ],
      linkInBetween: [
        {
          source: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        },
        {
          source: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
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
      id: "reviews\tbook",
      group: "reviews\tbook",
      name: "reviews.book",
      dependencies: [
        "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
      ],
      linkInBetween: [
        {
          source: "reviews\tbook",
          target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source: "reviews\tbook",
          target: "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source: "reviews\tbook",
          target: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
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
        "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
        "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
      ],
      linkInBetween: [
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source:
            "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
          target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
        },
        {
          source: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
        },
        {
          source: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
          target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
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
      target: "reviews\tbook\tv2\treviews.book.svc.cluster.local:9080/*",
    },
    {
      source:
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      target: "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
    },
    {
      source:
        "productpage\tbook\tv1\tproductpage.book.svc.cluster.local:9080/productpage",
      target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
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
      source: "reviews\tbook",
      target: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
    },
    {
      source: "reviews\tbook\tv3\treviews.book.svc.cluster.local:9080/*",
      target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
    },
    {
      source: "reviews\tbook",
      target: "reviews\tbook\tv1\treviews.book.svc.cluster.local:9080/*",
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
      source: "ratings\tbook",
      target: "ratings\tbook\tv1\tratings.book.svc.cluster.local:9080/*",
    },
  ],
};

const MockEndpointDependencies: IEndpointDependency[] = [
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
];

export { MockGraphData, MockEndpointDependencies };
