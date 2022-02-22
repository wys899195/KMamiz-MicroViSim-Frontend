import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Config from "../../Config";
import SwaggerUI from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";
import { Button } from "@mui/material";
import { Download } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  actions: {
    display: "flex",
    flexDirection: "row",
    gap: "1em",
    margin: "1em 0 0 1.4em",
  },
}));

export default function Swagger() {
  const swaggerPrefix = `${Config.ApiHost}${Config.ApiPrefix}/swagger/`;
  const { service } = useParams();
  const classes = useStyles();
  const id = `swagger-${Math.floor(Math.random() * 1000)}`;

  useEffect(() => {
    if (service) {
      SwaggerUI({
        dom_id: `#${id}`,
        url: `${swaggerPrefix}${encodeURIComponent(service)}`,
      });
    }
  }, [service]);

  const download = (json = true) => {
    if (!service) return;
    const filename = `${service.replace(/\t/g, "_")}.${json ? "json" : "yaml"}`;
    const path = `${swaggerPrefix}${json ? "" : "yaml/"}${encodeURIComponent(
      service
    )}`;
    fetch(path)
      .then((res) => res.text())
      .then((res) => {
        const content = `data:text/${
          json ? "json" : "yaml"
        };charset=utf-8,${encodeURIComponent(res)}`;
        const link = document.createElement("a");
        link.setAttribute("target", "_blank");
        link.setAttribute("download", filename);
        link.setAttribute("href", content);
        link.click();
      });
  };

  return (
    <div>
      <div className={classes.actions}>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<Download />}
          onClick={() => download()}
        >
          JSON
        </Button>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<Download />}
          onClick={() => download(false)}
        >
          YAML
        </Button>
      </div>
      <div id={id}></div>
    </div>
  );
}
