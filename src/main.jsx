import React from "react";
import { createRoot } from "react-dom/client";
import { WovenLightHero } from "./components/ui/woven-light-hero.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <WovenLightHero />,
);
