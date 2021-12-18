const MockGraphData = {
  nodes: [
    { id: "details.book", name: "details.book", group: "details.book" },
    {
      id: "productpage.book",
      name: "productpage.book",
      group: "productpage.book",
    },
    { id: "reviews.book", name: "reviews.book", group: "reviews.book" },
    { id: "ratings.book", name: "ratings.book", group: "ratings.book" },
    {
      id: "v1-details.book.svc.cluster.local:9080/*",
      name: "(details.book v1) /*",
      group: "details.book",
    },
    {
      id: "v1-productpage.book.svc.cluster.local:9080/productpage",
      name: "(productpage.book v1) /productpage",
      group: "productpage.book",
    },
    {
      id: "v1-reviews.book.svc.cluster.local:9080/*",
      name: "(reviews.book v1) /*",
      group: "reviews.book",
    },
    {
      id: "v3-reviews.book.svc.cluster.local:9080/*",
      name: "(reviews.book v3) /*",
      group: "reviews.book",
    },
    {
      id: "v1-ratings.book.svc.cluster.local:9080/*",
      name: "(ratings.book v1) /*",
      group: "ratings.book",
    },
    {
      id: "v2-reviews.book.svc.cluster.local:9080/*",
      name: "(reviews.book v2) /*",
      group: "reviews.book",
    },
  ],
  links: [
    {
      source: "details.book",
      target: "v1-details.book.svc.cluster.local:9080/*",
    },
    {
      source: "productpage.book",
      target: "v1-productpage.book.svc.cluster.local:9080/productpage",
    },
    {
      source: "reviews.book",
      target: "v1-reviews.book.svc.cluster.local:9080/*",
    },
    {
      source: "reviews.book",
      target: "v3-reviews.book.svc.cluster.local:9080/*",
    },
    {
      source: "ratings.book",
      target: "v1-ratings.book.svc.cluster.local:9080/*",
    },
    {
      source: "reviews.book",
      target: "v2-reviews.book.svc.cluster.local:9080/*",
    },
    {
      source: "v1-productpage.book.svc.cluster.local:9080/productpage",
      target: "v1-reviews.book.svc.cluster.local:9080/*",
    },
    {
      source: "v1-productpage.book.svc.cluster.local:9080/productpage",
      target: "v3-reviews.book.svc.cluster.local:9080/*",
    },
    {
      source: "v1-productpage.book.svc.cluster.local:9080/productpage",
      target: "v2-reviews.book.svc.cluster.local:9080/*",
    },
    {
      source: "v1-productpage.book.svc.cluster.local:9080/productpage",
      target: "v1-details.book.svc.cluster.local:9080/*",
    },
    {
      source: "v3-reviews.book.svc.cluster.local:9080/*",
      target: "v1-ratings.book.svc.cluster.local:9080/*",
    },
    {
      source: "v2-reviews.book.svc.cluster.local:9080/*",
      target: "v1-ratings.book.svc.cluster.local:9080/*",
    },
  ],
};

export { MockGraphData };
