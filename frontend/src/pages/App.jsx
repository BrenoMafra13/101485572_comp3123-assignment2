import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [status, setStatus] = useState("checking...");

  const check = async () => {
    try {
      const res = await axios.get(`${API}/health`);
      setStatus(res.data.ok ? "backend OK" : "backend ?");
    } catch (e) {
      setStatus("backend OFF");
    }
  };

  useEffect(() => {
    check();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>Employee Portal</Typography>
        <Typography sx={{ mb: 2 }}>API: {API}</Typography>
        <Typography sx={{ mb: 2 }}>Status: {status}</Typography>
        <Button variant="contained" onClick={check}>Re-check</Button>
      </Box>
    </Container>
  );
}
