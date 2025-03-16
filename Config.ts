const Config = {
  ApiHost: (import.meta.env.VITE_API_HOST as string) || window.location.origin,
  ApiPrefix: (import.meta.env.VITE_API_PREFIX as string) || "/api/v1",
  InactiveEndpointThreshold: "30s", // Use the format "XdYhZmWs", where X is the number of days, Y is the number of hours, Z is the number of minutes, and W is the number of seconds. E.g., "3d4h30m15s", "10h3m45s", "5m30s"
  DeprecatedEndpointThreshold: "40s", // Use the format "XdYhZmWs", where X is the number of days, Y is the number of hours, Z is the number of minutes, and W is the number of seconds. E.g., "3d4h30m15s", "10h3m45s", "5m30s"
};

export default Config;
