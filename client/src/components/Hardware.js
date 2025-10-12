import React from "react";
import { Card, CardContent } from "@mui/material";
import HWSetStatus from "./HWSetStatus";

const Hardware = ({ hardware = [] }) => {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {hardware.map((hw, idx) => (
        <Card key={idx} variant="outlined">
          <CardContent>
            <HWSetStatus
              label={hw.hwName}
              available={hw.availability}
              capacity={hw.capacity}
            />
          </CardContent>
        </Card>
      ))}

      <h3>Backend Data</h3>
      <pre>{JSON.stringify(hardware, null, 2)}</pre>
    </div>
  );
};

export default Hardware;
