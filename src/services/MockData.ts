const MockGraphData = {
  nodes: [
    { id: "null", group: "null", name: "external requests" },
    {
      id: "details\tbook",
      group: "details\tbook",
      name: "details.book",
    },
    {
      id: "details\tbook\tv1\t/details/0",
      group: "details\tbook",
      name: "(details.book v1) /details/0",
    },
    {
      id: "reviews\tbook",
      group: "reviews\tbook",
      name: "reviews.book",
    },
    {
      id: "reviews\tbook\tv1\t/reviews/0",
      group: "reviews\tbook",
      name: "(reviews.book v1) /reviews/0",
    },
    {
      id: "reviews\tbook\tv3\t/reviews/0",
      group: "reviews\tbook",
      name: "(reviews.book v3) /reviews/0",
    },
    {
      id: "reviews\tbook\tv2\t/reviews/0",
      group: "reviews\tbook",
      name: "(reviews.book v2) /reviews/0",
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
      id: "productpage\tbook\tv1\t/static/bootstrap/css/bootstrap.min.css",
      group: "productpage\tbook",
      name: "(productpage.book v1) /static/bootstrap/css/bootstrap.min.css",
    },
    {
      id: "ratings\tbook",
      group: "ratings\tbook",
      name: "ratings.book",
    },
    {
      id: "ratings\tbook\tv1\t/ratings/0",
      group: "ratings\tbook",
      name: "(ratings.book v1) /ratings/0",
    },
  ],
  links: [
    {
      source: "details\tbook",
      target: "details\tbook\tv1\t/details/0",
    },
    {
      source: "reviews\tbook",
      target: "reviews\tbook\tv1\t/reviews/0",
    },
    {
      source: "reviews\tbook",
      target: "reviews\tbook\tv3\t/reviews/0",
    },
    {
      source: "reviews\tbook\tv3\t/reviews/0",
      target: "ratings\tbook\tv1\t/ratings/0",
    },
    {
      source: "reviews\tbook",
      target: "reviews\tbook\tv2\t/reviews/0",
    },
    {
      source: "reviews\tbook\tv2\t/reviews/0",
      target: "ratings\tbook\tv1\t/ratings/0",
    },
    {
      source: "productpage\tbook",
      target: "productpage\tbook\tv1\t/productpage",
    },
    {
      source: "productpage\tbook\tv1\t/productpage",
      target: "reviews\tbook\tv2\t/reviews/0",
    },
    {
      source: "productpage\tbook\tv1\t/productpage",
      target: "reviews\tbook\tv3\t/reviews/0",
    },
    {
      source: "productpage\tbook\tv1\t/productpage",
      target: "reviews\tbook\tv1\t/reviews/0",
    },
    {
      source: "productpage\tbook\tv1\t/productpage",
      target: "details\tbook\tv1\t/details/0",
    },
    { source: "null", target: "productpage\tbook\tv1\t/productpage" },
    {
      source: "productpage\tbook",
      target: "productpage\tbook\tv1\t/static/bootstrap/css/bootstrap.min.css",
    },
    {
      source: "null",
      target: "productpage\tbook\tv1\t/static/bootstrap/css/bootstrap.min.css",
    },
    {
      source: "ratings\tbook",
      target: "ratings\tbook\tv1\t/ratings/0",
    },
  ],
  services: [
    "details\tbook",
    "reviews\tbook",
    "productpage\tbook",
    "ratings\tbook",
  ],
};

export { MockGraphData };
