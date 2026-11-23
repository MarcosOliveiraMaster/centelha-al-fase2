import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app.jsx";
import "./legacy.css";
import "./landing.css";

createRoot(document.getElementById("root")).render(<App />);
