import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard</h2>

      <button onClick={() => navigate("/materials")}>Materials</button>
      <br /><br />

      <button onClick={() => navigate("/flashcards")}>Flashcards</button>
      <br /><br />

      <button onClick={() => navigate("/studyplan")}>Study Plan</button>
      <br /><br />

      <button onClick={() => navigate("/progress")}>Progress</button>
    </div>
  );
}