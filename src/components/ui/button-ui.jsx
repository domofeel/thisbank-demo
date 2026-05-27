"use client";

import React from "react";
import BorderGlow from "./BorderGlow.jsx";

const getGlowHsl = (settings) => (
    `${settings.borderButtonGlowHue ?? 40} ${settings.borderButtonGlowSaturation ?? 80} ${settings.borderButtonGlowLightness ?? 80}`
);

export default function Example({ settings = {}, onClick }) {
    const textTransform = (settings.borderButtonUppercase ?? 0) > 0 ? "uppercase" : "none";

    return (
        <BorderGlow
            className="hero-border-glow-button"
            edgeSensitivity={settings.borderButtonEdgeSensitivity ?? 30}
            glowColor={getGlowHsl(settings)}
            backgroundColor={settings.borderButtonBackground ?? "#120F17"}
            borderRadius={settings.borderButtonRadius ?? 28}
            borderWidth={settings.borderButtonBorderWidth ?? 1}
            glowRadius={settings.borderButtonGlowRadius ?? 40}
            glowIntensity={settings.borderButtonGlowIntensity ?? 1}
            coneSpread={settings.borderButtonConeSpread ?? 25}
            animated
            colors={[
                settings.borderButtonColorOne ?? "#c084fc",
                settings.borderButtonColorTwo ?? "#f472b6",
                settings.borderButtonColorThree ?? "#38bdf8",
            ]}
            fillOpacity={settings.borderButtonFillOpacity ?? 0.5}
            animationDuration={settings.borderButtonAnimationSpeed ?? 5200}
        >
            <div
                className="border-glow-button-content"
                onClick={onClick}
                onKeyDown={(event) => {
                    if (!onClick || (event.key !== "Enter" && event.key !== " ")) return;
                    event.preventDefault();
                    onClick(event);
                }}
                role={onClick ? "button" : undefined}
                tabIndex={onClick ? 0 : undefined}
            >
                <span
                    className="border-glow-button-label"
                    style={{
                        "--border-button-text-color": settings.borderButtonTextColor ?? "#ffffff",
                        "--border-button-font-size": `${settings.borderButtonFontSize ?? 18}px`,
                        "--border-button-font-weight": settings.borderButtonFontWeight ?? 500,
                        "--border-button-text-transform": textTransform,
                    }}
                >
                    Request early access
                </span>
            </div>
        </BorderGlow>
    );
}
