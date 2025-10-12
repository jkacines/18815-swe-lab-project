import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, LinearProgress } from "@mui/material";

const Hardware = () => {
  const [hardware, setHardware] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8001/hardware")
      .then((res) => {
        if (res.data.success) setHardware(res.data.hardware);
      })
      .catch((err) => console.error("Error fetching hardware:", err));
  }, []);

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {hardware.map((hw, idx) => (
        <Card key={idx} variant="outlined">
          <CardContent>
            <Typography variant="h6">{hw.hwName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {hw.availability}/{hw.capacity} available
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(hw.availability / hw.capacity) * 100}
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Hardware;
