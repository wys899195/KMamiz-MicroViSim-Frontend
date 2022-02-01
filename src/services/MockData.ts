const MockGraphData = {
  nodes: [
    { id: "null", group: "null", name: "external requests" },
    {
      id: "details\tbook",
      group: "details\tbook",
      name: "details.book",
    },
    {
      id: "details\tbook\tv1\t/*",
      group: "details\tbook",
      name: "(details.book v1) /*",
    },
    {
      id: "reviews\tbook",
      group: "reviews\tbook",
      name: "reviews.book",
    },
    {
      id: "reviews\tbook\tv1\t/*",
      group: "reviews\tbook",
      name: "(reviews.book v1) /*",
    },
    {
      id: "reviews\tbook\tv3\t/*",
      group: "reviews\tbook",
      name: "(reviews.book v3) /*",
    },
    {
      id: "reviews\tbook\tv2\t/*",
      group: "reviews\tbook",
      name: "(reviews.book v2) /*",
    },
    {
      id: "productpage\tbook",
      group: "productpage\tbook",
      name: "productpage.book",
    },
    {
      id: "productpage\tbook\tv1\t/productpage",
      group: "productpage\tbook",
      name: "(productpage.book v1) /productpage",
    },
    {
      id: "productpage\tbook\tv1\t/static*",
      group: "productpage\tbook",
      name: "(productpage.book v1) /static*",
    },
    {
      id: "ratings\tbook",
      group: "ratings\tbook",
      name: "ratings.book",
    },
    {
      id: "ratings\tbook\tv1\t/*",
      group: "ratings\tbook",
      name: "(ratings.book v1) /*",
    },
  ],
  links: [
    { source: "details\tbook", target: "details\tbook\tv1\t/*" },
    { source: "reviews\tbook", target: "reviews\tbook\tv1\t/*" },
    { source: "reviews\tbook", target: "reviews\tbook\tv3\t/*" },
    {
      source: "reviews\tbook\tv3\t/*",
      target: "ratings\tbook\tv1\t/*",
    },
    { source: "reviews\tbook", target: "reviews\tbook\tv2\t/*" },
    {
      source: "reviews\tbook\tv2\t/*",
      target: "ratings\tbook\tv1\t/*",
    },
    {
      source: "productpage\tbook",
      target: "productpage\tbook\tv1\t/productpage",
    },
    {
      source: "productpage\tbook\tv1\t/productpage",
      target: "reviews\tbook\tv2\t/*",
    },
    {
      source: "productpage\tbook\tv1\t/productpage",
      target: "reviews\tbook\tv3\t/*",
    },
    {
      source: "productpage\tbook\tv1\t/productpage",
      target: "reviews\tbook\tv1\t/*",
    },
    {
      source: "productpage\tbook\tv1\t/productpage",
      target: "details\tbook\tv1\t/*",
    },
    { source: "null", target: "productpage\tbook\tv1\t/productpage" },
    {
      source: "productpage\tbook",
      target: "productpage\tbook\tv1\t/static*",
    },
    { source: "null", target: "productpage\tbook\tv1\t/static*" },
    { source: "ratings\tbook", target: "ratings\tbook\tv1\t/*" },
  ],
  services: [
    "details\tbook",
    "reviews\tbook",
    "productpage\tbook",
    "ratings\tbook",
  ],
};

export { MockGraphData };
