import { Snackbar, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { TAlert } from "../entities/TAlert";
import MuiAlert from "@mui/material/Alert";
import AlertManager from "../services/AlertManager";
import { useNavigate } from "react-router-dom";

export default function Alert() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<TAlert[]>([]);

  useEffect(() => {
    const unSub = AlertManager.getInstance().listen((alerts) =>
      setAlerts(alerts)
    );
    return () => unSub();
  }, []);

  return (
    <Snackbar
      sx={{ pointerEvents: "none" }}
      open={alerts.length > 0}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        marginTop="3em"
        sx={{ pointerEvents: "auto" }}
      >
        {alerts.map((a) => (
          <MuiAlert
            elevation={6}
            key={a.id}
            variant="filled"
            severity={a.severity}
            onClose={() =>
              AlertManager.getInstance().update({ ...a, notified: true })
            }
            onClick={() => a.onClickNavigation && navigate(a.onClickNavigation)}
            sx={{ cursor: "pointer" }}
          >
            {a.context}
          </MuiAlert>
        ))}
      </Box>
    </Snackbar>
  );
}
