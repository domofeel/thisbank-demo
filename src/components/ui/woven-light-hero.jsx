import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import benefitsCardImage from "../../assets/MyWallet.png";
import fifthBlockCardImage from "../../assets/fifth-block-card-transparent.png";
import { Button as CnippetButton } from "./button";
import ButtonUi from "./button-ui.jsx";
import BorderGlow from "./BorderGlow.jsx";
import projectPresets from "../../../data/presets.json";

const PRESET_STORAGE_KEY = "woven-light-presets";
const CURRENT_SETTINGS_STORAGE_KEY = "woven-light-current-settings-v4";
const PROJECT_DEFAULT_PRESET_NAME = "32";
const SHOW_SHADER_CONTROLS = false;
const EARLY_ACCESS_EMAIL_ENDPOINT = "https://formsubmit.co/ajax/domofeel@gmail.com";

const neutralBenefitsImageSettings = {
  benefitsImageWidth: 720,
  benefitsImageScale: 1,
  benefitsImageOffsetX: 0,
  benefitsImageOffsetY: 0,
  benefitsImageRotate: 0,
  benefitsImageOpacity: 1,
  benefitsImageBlur: 0,
  benefitsImageLightness: 1,
  benefitsImageBrightness: 1,
  benefitsImageContrast: 1,
  benefitsImageSaturation: 1,
  benefitsImageSharpness: 0,
  benefitsImageDropShadow: 0,
};

const baseDefaultSettings = {
  shapeType: "knot",
  shapeScale: 1,
  shapeTwist: 0,
  tubeRadius: 0.5,
  particleCount: 130000,
  pointSize: 0.013,
  opacity: 0.95,
  dotCore: 0.42,
  dotSoftness: 0.08,
  dotStart: "#4F46E5",
  dotMiddle: "#8B5CF6",
  dotEnd: "#E879F9",
  rotationSpeed: 0.05,
  interactionRadius: 1.8,
  interactionForce: 0.045,
  returnForce: 0.0012,
  damping: 0.94,
  wobble: 0.0,
  depthPulse: 0.0,
  cameraZ: 5,
  shapeOffsetY: -2.93,
  nearDotBlur: 0.18,
  nearBlurStart: 3.5,
  nearBlurEnd: 11,
  bgType: "gradient",
  bgSolid: "#ffffff",
  bgStart: "#4F46E5",
  bgMiddle: "#8B5CF6",
  bgEnd: "#E879F9",
  bgAngle: 135,
  bgOpacity: 0.28,
  figureOverlayColor: "#000000",
  figureOverlayOpacity: 0,
  heroTopGap: 0,
  heroElementsTopGap: 240,
  heroHeight: 100,
  heroTop: 160,
  titleSize: 74,
  titleLineHeight: 80,
  titleWeight: 400,
  titleColor: "#ffffff",
  titleSecondColor: "#ffffff",
  titleFont: "sans",
  subtitleTop: 34,
  subtitleSize: 20,
  subtitleLineHeight: 1.6,
  subtitleWeight: 430,
  subtitleColor: "#ffffff",
  buttonsTop: 70,
  buttonsGap: 18,
  borderButtonWidth: 273,
  borderButtonHeight: 58,
  borderButtonPaddingX: 34,
  borderButtonPaddingY: 14,
  borderButtonRadius: 28,
  borderButtonBorderWidth: 1,
  borderButtonFontSize: 18,
  borderButtonFontWeight: 500,
  borderButtonUppercase: 0,
  borderButtonTextColor: "#ffffff",
  borderButtonBackground: "#120F17",
  borderButtonSurfaceOpacity: 1,
  borderButtonGlassBlur: 0,
  borderButtonGlassSaturation: 1,
  borderButtonGlassBrightness: 1,
  borderButtonMatteOpacity: 0,
  borderButtonFillOpacity: 0.5,
  borderButtonEdgeSensitivity: 30,
  borderButtonGlowHue: 40,
  borderButtonGlowSaturation: 80,
  borderButtonGlowLightness: 80,
  borderButtonGlowRadius: 40,
  borderButtonGlowIntensity: 1,
  borderButtonConeSpread: 25,
  borderButtonAnimationSpeed: 5200,
  borderButtonColorOne: "#c084fc",
  borderButtonColorTwo: "#f472b6",
  borderButtonColorThree: "#38bdf8",
  siteContainerWidth: 1680,
  glassSurfaceColor: "#ffffff",
  glassOpacity: 0.06,
  glassBlur: 16,
  glassFrost: 0.03,
  glassRadius: 34,
  glassBorderWidth: 1.4,
  glassBorderColor: "#ffffff",
  glassBorderOpacity: 0.45,
  glassGlossiness: 0.12,
  glassGlossinessAngle: 135,
  glassGlossinessColor: "#ffffff",
  benefitsTextColor: "#2dea5a",
  benefitsTextSecondColor: "#ffffff",
  benefitsBlockTopGap: 0,
  benefitsElementsTopGap: 32,
  benefitsBlockHeight: 0,
  benefitsBlockPadding: 46,
  benefitsTextSize: 70,
  benefitsTextLineHeight: 1.15,
  benefitsHeadlineWidth: 760,
  benefitsTextTop: 0,
  benefitsHeadlineInsetX: 24,
  benefitsHeadlineInsetY: 51,
  benefitsContentGap: 64,
  benefitsLeadWidth: 50,
  benefitsLeadHeight: 0,
  benefitsMainGap: 8,
  benefitsCardGap: 8,
  benefitsTopCardHeight: 33.3,
  benefitsMiddleRowHeight: 35,
  benefitsMiddleLeftWidth: 40,
  benefitsBottomLeftWidth: 60,
  benefitsSmallTextInsetX: 0,
  benefitsCardTitleWidth: 460,
  benefitsCardSubtitleWidth: 460,
  benefitsSmallTitleSize: 30,
  benefitsSmallBodySize: 13,
  benefitsSmallTitleWeight: 500,
  benefitsSmallBodyWeight: 400,
  benefitsCardTitleColor: "#ffffff",
  benefitsCardSubtitleColor: "#ffffff",
  benefitsCardPadding: 32,
  benefitsChipTextColor: "#ffffff",
  benefitsChipBorderColor: "#ffffff",
  benefitsChipHeight: 37,
  benefitsChipPaddingX: 15,
  benefitsChipPaddingY: 12,
  benefitsChipTextSize: 11,
  benefitsChipBorderWidth: 1.183,
  benefitsChipGap: 1,
  benefitsChipsOffsetY: 0,
  benefitsImageVisible: 1,
  ...neutralBenefitsImageSettings,
  benefitsImages: [],
  benefitsCardsWidth: 100,
  benefitsCardsHeight: 100,
  benefitsCard1Width: 100,
  benefitsCard1Height: 100,
  benefitsCard2Width: 100,
  benefitsCard2Height: 100,
  benefitsCard3Width: 100,
  benefitsCard3Height: 100,
  benefitsCard4Width: 100,
  benefitsCard4Height: 100,
  benefitsCard5Width: 100,
  benefitsCard5Height: 100,
  thirdCardCount: 3,
  thirdBlockTop: 8,
  thirdElementsTopGap: 32,
  thirdBlockHeight: 720,
  thirdBlockPadding: 32,
  thirdHeadlineTop: 0,
  thirdHeadlineInsetX: 0,
  thirdHeadlineGap: 32,
  thirdHeadlineSize: 70,
  thirdHeadlineLineHeight: 1.05,
  thirdHeadlineLineGap: 0,
  thirdHeadlineFirstSize: 70,
  thirdHeadlineFirstLineHeight: 1.05,
  thirdHeadlineFirstWeight: 500,
  thirdHeadlineFirstTracking: -0.04,
  thirdHeadlineSecondSize: 70,
  thirdHeadlineSecondLineHeight: 1.05,
  thirdHeadlineSecondWeight: 400,
  thirdHeadlineSecondTracking: -0.04,
  thirdHeadlineFirstColor: "#31e257",
  thirdHeadlineSecondColor: "#ffffff",
  thirdTextCentered: 0,
  thirdSubtitleGap: 36,
  thirdSubtitleWidth: 760,
  thirdSubtitleSize: 18,
  thirdSubtitleLineHeight: 1.45,
  thirdSubtitleWeight: 400,
  thirdSubtitleColor: "#ffffff",
  thirdSubtitleVisible: 1,
  thirdCardGap: 8,
  thirdCardRadius: 34,
  thirdCardTitleSize: 30,
  thirdCardTitleWeight: 500,
  thirdCardTitleColor: "#ffffff",
  thirdCardBodyTopGap: 12,
  thirdCardBodySize: 13,
  thirdCardBodyWeight: 400,
  thirdCardBodyColor: "#ffffff",
  thirdCardBodyVisible: 1,
  thirdCardBodyWidth: 420,
  thirdCardTextInsetX: 0,
  thirdCardTextInsetY: 0,
  thirdListTopGap: 24,
  thirdListItemGap: 10,
  thirdListSize: 13,
  thirdListWeight: 400,
  thirdListLineHeight: 1.35,
  thirdListCheckGap: 10,
  thirdListTextColor: "#ffffff",
  thirdListCheckColor: "#ffffff",
  thirdButtonTopGap: 28,
  thirdButtonY: 260,
  thirdButtonBottomGap: 0,
  thirdButtonCardInsetX: 32,
  thirdButtonHeight: 66,
  thirdButtonPaddingX: 38,
  thirdButtonPaddingY: 0,
  thirdButtonRadius: 999,
  thirdButtonGap: -1,
  thirdButtonFillColor: "#ddff9c",
  thirdButtonBorderColor: "#ddff9c",
  thirdButtonBorderWidth: 1,
  thirdButtonTextColor: "#071009",
  thirdButtonTextSize: 20,
  thirdButtonTextWeight: 400,
  thirdButtonTextUppercase: 0,
  thirdButtonTextTracking: 0,
  thirdButtonIconScale: 0.94,
  thirdButtonArrowSize: 22,
  thirdButtonArrowStroke: 2,
  thirdButtonArrowOffsetX: 0,
  thirdButtonArrowOffsetY: 0,
  thirdButtonHoverFillColor: "#ddff9c",
  thirdButtonHoverTextColor: "#071009",
  thirdButtonHoverBorderColor: "#ddff9c",
  thirdButtonHoverScale: 1,
  thirdButtonHoverButtonScale: 1.06,
  thirdButtonPressedScale: 0.98,
  thirdButtonTransitionMs: 180,
  thirdCard1Width: 33.33,
  thirdCard1Height: 360,
  thirdCard2Width: 33.33,
  thirdCard2Height: 360,
  thirdCard3Width: 33.33,
  thirdCard3Height: 360,
  thirdCard4Width: 50,
  thirdCard4Height: 300,
  thirdCard5Width: 50,
  thirdCard5Height: 300,
  thirdCard6Width: 33.33,
  thirdCard6Height: 260,
  thirdCard7Width: 33.33,
  thirdCard7Height: 260,
  thirdCard8Width: 33.33,
  thirdCard8Height: 260,
  fourthBlockTopGap: 0,
  fourthElementsTopGap: 80,
  fourthBlockTopPadding: 80,
  fourthBlockBottomPadding: 80,
  fourthBlockHeight: 520,
  fourthInputStageHeight: 420,
  fourthHeadlineTop: 0,
  fourthHeadlineGap: 22,
  fourthHeadlineSize: 76,
  fourthHeadlineLineHeight: 1.02,
  fourthHeadlineFont: "serif",
  fourthHeadlineFirstWeight: 500,
  fourthHeadlineSecondWeight: 400,
  fourthHeadlineTracking: -0.0526,
  fourthHeadlineToSubtitleGap: 28,
  fourthHeadlineFirstColor: "#31e257",
  fourthHeadlineSecondColor: "#31e257",
  fourthSubtitleTop: 28,
  fourthSubtitleGap: 40,
  fourthSubtitleWidth: 760,
  fourthSubtitleSize: 20,
  fourthSubtitleLineHeight: 1.5,
  fourthSubtitleWeight: 430,
  fourthSubtitleColor: "#ffffff",
  fourthInputOffsetX: 0,
  fourthInputOffsetY: 0,
  fourthInputScale: 1,
  fourthInputOpacity: 1,
  fourthInputWidth: 760,
  fourthInputPaddingX: 24,
  fourthInputPaddingY: 16,
  fourthInputIconSize: 40,
  fourthInputIconGlyphSize: 20,
  fourthInputButtonSize: 48,
  fourthInputArrowSize: 24,
  fourthInputTextSize: 20,
  fourthInputIconVisible: 1,
  fourthInputBorderWidth: 1,
  fourthInputTextColor: "#f1f5f9",
  fourthInputPlaceholderColor: "#cbd5e1",
  fourthInputAccentColor: "#fb923c",
  fourthInputIconColor: "#fcd34d",
  fourthInputButtonStart: "#fbbf24",
  fourthInputButtonEnd: "#fb7185",
  popupVeilColor: "#000000",
  popupVeilOpacity: 0.68,
  popupVeilBlur: 0,
  popupWidth: 860,
  popupHeight: 640,
  popupOffsetX: 0,
  popupOffsetY: 0,
  popupPaddingX: 72,
  popupPaddingY: 80,
  popupBackground: "#a9a9a9",
  popupRadius: 72,
  popupTextOffsetY: 0,
  popupTitleSize: 72,
  popupTitleLineHeight: 1.05,
  popupTitleWeight: 400,
  popupTitleColor: "#111111",
  popupSubtitleGap: 44,
  popupSubtitleSize: 34,
  popupSubtitleLineHeight: 1.38,
  popupSubtitleWeight: 400,
  popupSubtitleColor: "#111111",
  popupButtonInsetX: 64,
  popupButtonY: 420,
  popupButtonColor: "#ddff9c",
  fifthBlockTopGap: 0,
  fifthElementsTopGap: 32,
  fifthBlockBottomGap: 80,
  fifthBlockHeight: 720,
  fifthBlockPaddingX: 46,
  fifthBlockPaddingY: 32,
  fifthHeadlineTop: 51,
  fifthHeadlineInsetX: 0,
  fifthTextGroupOffsetY: 0,
  fifthHeadlineToCardGap: 0,
  fifthHeadlineToSubtitleGap: 32,
  fifthHeadlineWidth: 560,
  fifthHeadlineSize: 70,
  fifthHeadlineLineHeight: 1.05,
  fifthHeadlineFirstColor: "#ffffff",
  fifthHeadlineSecondColor: "#ffffff",
  fifthSubtitleTop: 0,
  fifthSubtitleOffsetX: 0,
  fifthSubtitleWidth: 760,
  fifthSubtitleSize: 18,
  fifthSubtitleLineHeight: 1.45,
  fifthSubtitleWeight: 400,
  fifthSubtitleColor: "#ffffff",
  fifthCardWidth: 720,
  fifthCardHeight: 420,
  fifthCardAspect: 1.7,
  fifthCardOffsetX: 0,
  fifthCardOffsetY: 0,
  fifthCardPadding: 32,
  fifthCardRadius: 34,
  fifthCardAlignX: 0,
  fifthImageVisible: 1,
  fifthImageWidth: 690,
  fifthImageScale: 1,
  fifthImageOffsetX: 20,
  fifthImageOffsetY: -74,
  fifthImageRotate: -2,
  fifthImageOpacity: 1,
  fifthImageBlur: 0,
  fifthImageBrightness: 1,
  fifthImageContrast: 1,
  fifthImageSaturation: 1,
  fifthImageDropShadow: 0,
  fifthImages: [],
  footerBlockTopGap: 0,
  footerHeight: 280,
  footerPaddingX: 64,
  footerPaddingY: 56,
  footerColumnGap: 80,
  footerTextGap: 24,
  footerBlocksGap: 80,
  footerBrandToContactsGap: 80,
  footerContactsToGlobalGap: 80,
  footerGlobalToLinksGap: 80,
  footerContactsToLinksGap: 80,
  footerBrandOffsetX: 0,
  footerContactsOffsetX: 0,
  footerGlobalOffsetX: 0,
  footerLinksOffsetX: 0,
  footerBrandItemsGap: 24,
  footerBrandToDescriptionGap: 24,
  footerDescriptionToCopyrightGap: 24,
  footerContactsGap: 0,
  footerGlobalItemsGap: 0,
  footerLinksItemsGap: 8,
  footerBrandSize: 56,
  footerBrandWeight: 400,
  footerTextSize: 30,
  footerTextLineHeight: 1.35,
  footerTextWeight: 400,
  footerLinksSize: 30,
  footerLinksLineHeight: 1.35,
  footerLinksWeight: 400,
  footerLinksGap: 8,
  footerTextColor: "#dedede",
  footerLinkColor: "#dedede",
  footerLinkHoverColor: "#16e33f",
  footerLinkPressedColor: "#ffffff",
  footerLinkUnderlineOpacity: 0.85,
  footerLinkHoverUnderlineOpacity: 1,
  footerLinkPressedScale: 0.97,
  footerTransitionMs: 180,
  footerGlassSurfaceColor: "#ffffff",
  footerGlassOpacity: 0,
  footerGlassBlur: 2,
  footerGlassFrost: 0,
  footerGlassBorderWidth: 1.2,
  footerGlassBorderColor: "#589d6d",
  footerGlassBorderOpacity: 0.11,
  footerGlassGlossiness: 0.41,
  footerGlassGlossinessAngle: 360,
  footerGlassGlossinessColor: "#368131",
  contentWidth: 1120,
  navTop: 24,
  navX: 60,
  headerItemHeight: 48,
  menuSize: 22,
  menuWeight: 650,
  menuGap: 48,
  menuPaddingX: 12,
  menuPaddingY: 8,
  menuEdgePaddingX: 8,
  menuColor: "#ffffff",
  menuUppercase: 1,
  loginSize: 20,
  loginWeight: 650,
  loginColor: "#ffffff",
  loginUppercase: 1,
  brandSize: 31,
  brandWeight: 760,
  brandColor: "#ffffff",
  brandGap: 12,
  brandLetterSpacing: 0,
  brandOpacity: 1,
  brandOffsetX: 0,
  brandOffsetY: 0,
  brandMarkSize: 48,
  brandMarkDotScale: 0.35,
  brandMarkDotColor: "#ffffff",
};

const projectDefaultPresetSettings =
  projectPresets.find((preset) => preset?.name === PROJECT_DEFAULT_PRESET_NAME)?.settings ?? {};

const productionGlassOverrides = {};

const defaultSettings = {
  ...baseDefaultSettings,
  ...projectDefaultPresetSettings,
  ...productionGlassOverrides,
  benefitsImages: [benefitsCardImage],
};

const controls = [
  { key: "shapeScale", label: "Shape scale", min: 0.4, max: 2.2, step: 0.02 },
  { key: "shapeTwist", label: "Shape twist", min: -2, max: 2, step: 0.05 },
  { key: "tubeRadius", label: "Tube radius", min: 0.08, max: 0.9, step: 0.02 },
  { key: "particleCount", label: "Particles", min: 20000, max: 220000, step: 5000 },
  { key: "pointSize", label: "Dot size", min: 0.006, max: 0.04, step: 0.001 },
  { key: "opacity", label: "Intensity", min: 0.1, max: 1, step: 0.01 },
  { key: "dotCore", label: "Circle core", min: 0.1, max: 0.49, step: 0.01 },
  { key: "dotSoftness", label: "Soft edge", min: 0.01, max: 0.25, step: 0.01 },
  { key: "rotationSpeed", label: "Rotation", min: -0.2, max: 0.2, step: 0.005 },
  { key: "interactionRadius", label: "Cursor radius", min: 0.2, max: 4, step: 0.05 },
  { key: "interactionForce", label: "Cursor force", min: 0, max: 0.12, step: 0.002 },
  { key: "returnForce", label: "Return pull", min: 0.0001, max: 0.006, step: 0.0001 },
  { key: "damping", label: "Damping", min: 0.82, max: 0.99, step: 0.005 },
  { key: "wobble", label: "Wobble", min: 0, max: 0.08, step: 0.002 },
  { key: "depthPulse", label: "Depth pulse", min: 0, max: 0.8, step: 0.02 },
  { key: "cameraZ", label: "Zoom", min: 3, max: 8, step: 0.1 },
  { key: "shapeOffsetY", label: "Figure Y position", min: -4, max: 2, step: 0.05 },
  { key: "nearDotBlur", label: "Near dot blur", min: 0, max: 0.38, step: 0.01 },
  { key: "nearBlurStart", label: "Blur starts", min: 1, max: 16, step: 0.5 },
  { key: "nearBlurEnd", label: "Blur full", min: 3, max: 28, step: 0.5 },
  { key: "bgAngle", label: "Bg angle", min: 0, max: 360, step: 1 },
  { key: "bgOpacity", label: "Bg opacity", min: 0, max: 1, step: 0.01 },
  { key: "figureOverlayOpacity", label: "Text veil opacity", min: 0, max: 1, step: 0.01 },
];

const sceneControlKeys = new Set([
  "shapeScale",
  "shapeTwist",
  "tubeRadius",
  "particleCount",
  "pointSize",
  "opacity",
  "dotCore",
  "dotSoftness",
  "rotationSpeed",
  "interactionRadius",
  "interactionForce",
  "returnForce",
  "damping",
  "wobble",
  "depthPulse",
  "cameraZ",
  "shapeOffsetY",
  "nearDotBlur",
  "nearBlurStart",
  "nearBlurEnd",
]);

const backgroundControlKeys = new Set(["bgAngle", "bgOpacity", "figureOverlayOpacity"]);
const sceneControls = controls.filter((control) => sceneControlKeys.has(control.key));
const backgroundControls = controls.filter((control) => backgroundControlKeys.has(control.key));

const heroLayoutControls = [
  { key: "siteContainerWidth", label: "Site content width", min: 960, max: 1920, step: 20 },
  { key: "heroTopGap", label: "Block top gap", min: 0, max: 480, step: 1 },
  { key: "heroHeight", label: "Block height (vh)", min: 70, max: 180, step: 1 },
  { key: "heroElementsTopGap", label: "Elements top gap", min: 0, max: 720, step: 1 },
  { key: "contentWidth", label: "Hero text width", min: 640, max: 1320, step: 20 },
];

const titleTextControls = [
  { key: "titleSize", label: "Title size", min: 36, max: 120, step: 1 },
  { key: "titleLineHeight", label: "Title line height", min: 40, max: 140, step: 1 },
  { key: "titleWeight", label: "Title weight", min: 300, max: 900, step: 50 },
];

const subtitleTextControls = [
  { key: "subtitleTop", label: "Subtitle gap", min: 8, max: 80, step: 2 },
  { key: "subtitleSize", label: "Subtitle size", min: 12, max: 36, step: 1 },
  { key: "subtitleLineHeight", label: "Subtitle line height", min: 1, max: 2.2, step: 0.05 },
  { key: "subtitleWeight", label: "Subtitle weight", min: 300, max: 800, step: 50 },
];

const headerLayoutControls = [
  { key: "navTop", label: "Logo/login top", min: 0, max: 120, step: 1 },
  { key: "navX", label: "Nav side", min: 16, max: 120, step: 2 },
  { key: "headerItemHeight", label: "Header item height", min: 32, max: 76, step: 1 },
];

const logoTextControls = [
  { key: "brandSize", label: "Logo size", min: 18, max: 42, step: 1 },
  { key: "brandWeight", label: "Logo weight", min: 300, max: 900, step: 20 },
  { key: "brandLetterSpacing", label: "Logo tracking", min: -1, max: 8, step: 0.1 },
  { key: "brandGap", label: "Logo gap", min: 4, max: 28, step: 1 },
  { key: "brandOpacity", label: "Logo opacity", min: 0, max: 1, step: 0.01 },
  { key: "brandOffsetX", label: "Logo offset X", min: -160, max: 160, step: 1 },
  { key: "brandOffsetY", label: "Logo offset Y", min: -80, max: 80, step: 1 },
];

const logoMarkControls = [
  { key: "brandMarkSize", label: "Mark size", min: 24, max: 96, step: 1 },
  { key: "brandMarkDotScale", label: "Dot scale", min: 0.12, max: 0.72, step: 0.01 },
];

const loginTextControls = [
  { key: "loginSize", label: "Log in size", min: 12, max: 36, step: 1 },
  { key: "loginWeight", label: "Log in weight", min: 300, max: 900, step: 50 },
  { key: "loginUppercase", label: "Log in uppercase", min: 0, max: 1, step: 1 },
];

const benefitsTextControls = [
  { key: "benefitsHeadlineInsetX", label: "Headline inset X", min: 0, max: 180, step: 1 },
  { key: "benefitsHeadlineInsetY", label: "Headline inset Y", min: -1400, max: 1400, step: 1 },
  { key: "benefitsHeadlineWidth", label: "Headline width", min: 220, max: 1200, step: 5 },
  { key: "benefitsTextSize", label: "Headline size", min: 36, max: 140, step: 1 },
  { key: "benefitsTextLineHeight", label: "Headline line height", min: 0.75, max: 1.4, step: 0.01 },
  { key: "benefitsLeadWidth", label: "Large card width", min: 30, max: 70, step: 0.5 },
  { key: "benefitsLeadHeight", label: "Large card height", min: 0, max: 1400, step: 2 },
  { key: "benefitsTopCardHeight", label: "Top card height", min: 18, max: 56, step: 0.5 },
  { key: "benefitsMiddleRowHeight", label: "Middle cards height", min: 18, max: 64, step: 0.5 },
  { key: "benefitsMiddleLeftWidth", label: "Middle left card width", min: 25, max: 75, step: 0.5 },
  { key: "benefitsBottomLeftWidth", label: "Bottom left card width", min: 25, max: 75, step: 0.5 },
  { key: "benefitsSmallTextInsetX", label: "Small text inset X", min: 0, max: 160, step: 1 },
  { key: "benefitsCardTitleWidth", label: "Card title width", min: 120, max: 720, step: 5 },
  { key: "benefitsCardSubtitleWidth", label: "Card subtitle width", min: 120, max: 720, step: 5 },
  { key: "benefitsSmallTitleSize", label: "Small title size", min: 16, max: 56, step: 1 },
  { key: "benefitsSmallBodySize", label: "Small subtitle size", min: 9, max: 24, step: 1 },
  { key: "benefitsSmallTitleWeight", label: "Card title weight", min: 100, max: 900, step: 10 },
  { key: "benefitsSmallBodyWeight", label: "Card subtitle weight", min: 100, max: 900, step: 10 },
  { key: "benefitsCardPadding", label: "Card padding", min: 0, max: 120, step: 1 },
  { key: "benefitsChipHeight", label: "Chip height", min: 18, max: 120, step: 1 },
  { key: "benefitsChipPaddingX", label: "Chip padding X", min: 0, max: 80, step: 1 },
  { key: "benefitsChipPaddingY", label: "Chip padding Y", min: 0, max: 60, step: 1 },
  { key: "benefitsChipTextSize", label: "Chip text size", min: 8, max: 28, step: 1 },
  { key: "benefitsChipBorderWidth", label: "Chip border width", min: 0, max: 5, step: 0.1 },
  { key: "benefitsChipGap", label: "Chip gap", min: 0, max: 32, step: 1 },
  { key: "benefitsChipsOffsetY", label: "Chips Y", min: 0, max: 900, step: 1 },
  { key: "benefitsMainGap", label: "Main cards gap", min: 0, max: 120, step: 1 },
  { key: "benefitsCardGap", label: "Cards gap", min: 0, max: 40, step: 1 },
];

const benefitsBlockControls = [
  { key: "benefitsBlockTopGap", label: "Block top gap", min: -200, max: 1080, step: 1 },
  { key: "benefitsBlockHeight", label: "Block height", min: 0, max: 1600, step: 2 },
  { key: "benefitsElementsTopGap", label: "Elements top gap", min: 0, max: 720, step: 1 },
  { key: "benefitsBlockPadding", label: "Block padding", min: 0, max: 180, step: 1 },
];

const buttonLayoutControls = [
  { key: "buttonsTop", label: "Button top", min: 0, max: 120, step: 2 },
  { key: "borderButtonWidth", label: "Button width", min: 120, max: 720, step: 1 },
  { key: "borderButtonHeight", label: "Button height", min: 32, max: 140, step: 1 },
  { key: "borderButtonPaddingX", label: "Padding X", min: 0, max: 180, step: 1 },
  { key: "borderButtonPaddingY", label: "Padding Y", min: 0, max: 90, step: 1 },
  { key: "borderButtonRadius", label: "Button radius", min: 0, max: 120, step: 1 },
  { key: "borderButtonBorderWidth", label: "Border width", min: 0, max: 8, step: 0.1 },
];

const buttonTextControls = [
  { key: "borderButtonFontSize", label: "Button font size", min: 10, max: 42, step: 1 },
  { key: "borderButtonFontWeight", label: "Button weight", min: 300, max: 900, step: 20 },
  { key: "borderButtonUppercase", label: "Button uppercase", min: 0, max: 1, step: 1 },
];

const buttonSurfaceControls = [
  { key: "borderButtonSurfaceOpacity", label: "Surface opacity", min: 0, max: 1, step: 0.01 },
  { key: "borderButtonGlassBlur", label: "Glass blur", min: 0, max: 40, step: 1 },
  { key: "borderButtonGlassSaturation", label: "Glass saturation", min: 0.5, max: 2.5, step: 0.05 },
  { key: "borderButtonGlassBrightness", label: "Glass brightness", min: 0.5, max: 1.8, step: 0.05 },
  { key: "borderButtonMatteOpacity", label: "Matte opacity", min: 0, max: 0.55, step: 0.01 },
  { key: "borderButtonFillOpacity", label: "Fill opacity", min: 0, max: 1, step: 0.01 },
  { key: "borderButtonEdgeSensitivity", label: "Edge sensitivity", min: 0, max: 100, step: 1 },
];

const buttonMotionControls = [
  { key: "borderButtonGlowHue", label: "Glow hue", min: 0, max: 360, step: 1 },
  { key: "borderButtonGlowSaturation", label: "Glow saturation", min: 0, max: 100, step: 1 },
  { key: "borderButtonGlowLightness", label: "Glow lightness", min: 0, max: 100, step: 1 },
  { key: "borderButtonGlowRadius", label: "Glow radius", min: 0, max: 120, step: 1 },
  { key: "borderButtonGlowIntensity", label: "Glow intensity", min: 0, max: 1.5, step: 0.01 },
  { key: "borderButtonConeSpread", label: "Cone spread", min: 1, max: 90, step: 1 },
  { key: "borderButtonAnimationSpeed", label: "Animation speed", min: 800, max: 16000, step: 100 },
];

const glassGlobalControls = [
  { key: "glassOpacity", label: "Surface opacity", min: 0, max: 0.6, step: 0.01 },
  { key: "glassBlur", label: "Backdrop blur", min: 0, max: 80, step: 1 },
  { key: "glassFrost", label: "Matte layer", min: 0, max: 0.6, step: 0.01 },
  { key: "glassRadius", label: "Pill radius", min: 0, max: 80, step: 1 },
  { key: "glassBorderWidth", label: "Border width", min: 0, max: 5, step: 0.1 },
  { key: "glassBorderOpacity", label: "Border opacity", min: 0, max: 1, step: 0.01 },
  { key: "glassGlossiness", label: "Glossiness", min: 0, max: 0.8, step: 0.01 },
  { key: "glassGlossinessAngle", label: "Gloss angle", min: 0, max: 360, step: 1 },
];

const benefitsImageControls = [
  { key: "benefitsImageVisible", label: "Show image", min: 0, max: 1, step: 1 },
  { key: "benefitsImageWidth", label: "Image width", min: 120, max: 1300, step: 2 },
  { key: "benefitsImageScale", label: "Image scale", min: 0.1, max: 2.5, step: 0.01 },
  { key: "benefitsImageOffsetX", label: "Image X", min: -600, max: 600, step: 1 },
  { key: "benefitsImageOffsetY", label: "Image Y", min: -200, max: 1000, step: 1 },
  { key: "benefitsImageRotate", label: "Image rotate", min: -45, max: 45, step: 0.1 },
  { key: "benefitsImageOpacity", label: "Image opacity", min: 0, max: 1, step: 0.01 },
  { key: "benefitsImageBlur", label: "Image blur", min: 0, max: 20, step: 0.1 },
  { key: "benefitsImageLightness", label: "Lightness", min: 0, max: 2, step: 0.01 },
  { key: "benefitsImageBrightness", label: "Brightness", min: 0.2, max: 2, step: 0.01 },
  { key: "benefitsImageContrast", label: "Contrast", min: 0.2, max: 2.5, step: 0.01 },
  { key: "benefitsImageSaturation", label: "Saturation", min: 0, max: 2.5, step: 0.01 },
  { key: "benefitsImageSharpness", label: "Sharpness", min: 0, max: 1, step: 0.01 },
  { key: "benefitsImageDropShadow", label: "Drop shadow", min: 0, max: 1, step: 0.01 },
];

const thirdLayoutControls = [
  { key: "thirdCardCount", label: "Card count", min: 3, max: 8, step: 1 },
  { key: "thirdBlockTop", label: "Block top gap", min: -200, max: 1080, step: 1 },
  { key: "thirdBlockHeight", label: "Block height", min: 320, max: 1400, step: 2 },
  { key: "thirdElementsTopGap", label: "Elements top gap", min: 0, max: 720, step: 1 },
  { key: "thirdBlockPadding", label: "Block padding", min: 0, max: 96, step: 1 },
  { key: "thirdCardGap", label: "Cards gap", min: 0, max: 48, step: 1 },
  { key: "thirdCardRadius", label: "Cards radius", min: 0, max: 90, step: 1 },
];

const thirdHeadlineControls = [
  { key: "thirdHeadlineInsetX", label: "Headline inset X", min: -160, max: 320, step: 1 },
  { key: "thirdTextCentered", label: "Center headline", min: 0, max: 1, step: 1 },
  { key: "thirdHeadlineGap", label: "Headline to subtitle", min: 0, max: 240, step: 1 },
  { key: "thirdHeadlineLineGap", label: "Lines gap", min: -40, max: 80, step: 1 },
  { key: "thirdHeadlineSize", label: "Headline size", min: 28, max: 120, step: 1 },
  { key: "thirdHeadlineLineHeight", label: "Headline line height", min: 0.78, max: 1.5, step: 0.01 },
  { key: "thirdHeadlineFirstSize", label: "First line size", min: 28, max: 140, step: 1 },
  { key: "thirdHeadlineFirstLineHeight", label: "First line height", min: 0.78, max: 1.5, step: 0.01 },
  { key: "thirdHeadlineFirstWeight", label: "First line weight", min: 100, max: 900, step: 10 },
  { key: "thirdHeadlineFirstTracking", label: "First line tracking", min: -0.12, max: 0.12, step: 0.005 },
  { key: "thirdHeadlineSecondSize", label: "Second line size", min: 28, max: 140, step: 1 },
  { key: "thirdHeadlineSecondLineHeight", label: "Second line height", min: 0.78, max: 1.5, step: 0.01 },
  { key: "thirdHeadlineSecondWeight", label: "Second line weight", min: 100, max: 900, step: 10 },
  { key: "thirdHeadlineSecondTracking", label: "Second line tracking", min: -0.12, max: 0.12, step: 0.005 },
];

const thirdSubtitleControls = [
  { key: "thirdSubtitleVisible", label: "Show subtitle", min: 0, max: 1, step: 1 },
  { key: "thirdSubtitleGap", label: "Subtitle to cards", min: 0, max: 240, step: 1 },
  { key: "thirdSubtitleWidth", label: "Subtitle width", min: 80, max: 1400, step: 5 },
  { key: "thirdSubtitleSize", label: "Subtitle size", min: 10, max: 42, step: 1 },
  { key: "thirdSubtitleLineHeight", label: "Subtitle line height", min: 0.9, max: 2.2, step: 0.01 },
  { key: "thirdSubtitleWeight", label: "Subtitle weight", min: 100, max: 900, step: 10 },
];

const thirdCardTextControls = [
  { key: "thirdCardTitleSize", label: "Title size", min: 14, max: 64, step: 1 },
  { key: "thirdCardTitleWeight", label: "Title weight", min: 100, max: 900, step: 10 },
  { key: "thirdCardBodyVisible", label: "Show card body", min: 0, max: 1, step: 1 },
  { key: "thirdCardBodyTopGap", label: "Title/body gap", min: 0, max: 180, step: 1 },
  { key: "thirdCardBodySize", label: "Body size", min: 9, max: 28, step: 1 },
  { key: "thirdCardBodyWeight", label: "Body weight", min: 100, max: 900, step: 10 },
  { key: "thirdCardBodyWidth", label: "Body width", min: 120, max: 720, step: 5 },
  { key: "thirdCardTextInsetX", label: "Text inset X", min: 0, max: 160, step: 1 },
  { key: "thirdCardTextInsetY", label: "Text inset Y", min: 0, max: 900, step: 1 },
];

const thirdListControls = [
  { key: "thirdListTopGap", label: "List top gap", min: 0, max: 160, step: 1 },
  { key: "thirdListItemGap", label: "List item gap", min: 0, max: 48, step: 1 },
  { key: "thirdListSize", label: "List text size", min: 9, max: 32, step: 1 },
  { key: "thirdListWeight", label: "List text weight", min: 100, max: 900, step: 10 },
  { key: "thirdListLineHeight", label: "List line height", min: 0.9, max: 2.2, step: 0.01 },
  { key: "thirdListCheckGap", label: "Check gap", min: 0, max: 40, step: 1 },
];

const thirdButtonLayoutControls = [
  { key: "thirdButtonY", label: "Button Y", min: 0, max: 900, step: 1 },
  { key: "thirdButtonTopGap", label: "Top gap", min: 0, max: 180, step: 1 },
  { key: "thirdButtonBottomGap", label: "Bottom gap", min: 0, max: 220, step: 1 },
  { key: "thirdButtonCardInsetX", label: "Card edge inset", min: 0, max: 220, step: 1 },
  { key: "thirdButtonHeight", label: "Button height", min: 32, max: 120, step: 1 },
  { key: "thirdButtonPaddingX", label: "Text padding X", min: 0, max: 96, step: 1 },
  { key: "thirdButtonPaddingY", label: "Text padding Y", min: 0, max: 48, step: 1 },
  { key: "thirdButtonRadius", label: "Radius", min: 0, max: 999, step: 1 },
  { key: "thirdButtonGap", label: "Circle gap", min: -24, max: 32, step: 1 },
  { key: "thirdButtonBorderWidth", label: "Border width", min: 0, max: 8, step: 0.25 },
];

const thirdButtonTextControls = [
  { key: "thirdButtonTextSize", label: "Text size", min: 10, max: 36, step: 1 },
  { key: "thirdButtonTextWeight", label: "Text weight", min: 100, max: 900, step: 10 },
  { key: "thirdButtonTextTracking", label: "Text tracking", min: -1, max: 6, step: 0.1 },
  { key: "thirdButtonTextUppercase", label: "Uppercase", min: 0, max: 1, step: 1 },
];

const thirdButtonIconControls = [
  { key: "thirdButtonIconScale", label: "Circle scale", min: 0.6, max: 1.4, step: 0.01 },
  { key: "thirdButtonArrowSize", label: "Arrow size", min: 10, max: 42, step: 1 },
  { key: "thirdButtonArrowStroke", label: "Arrow stroke", min: 1, max: 5, step: 0.25 },
  { key: "thirdButtonArrowOffsetX", label: "Arrow offset X", min: -18, max: 18, step: 1 },
  { key: "thirdButtonArrowOffsetY", label: "Arrow offset Y", min: -18, max: 18, step: 1 },
];

const thirdButtonStateControls = [
  { key: "thirdButtonHoverScale", label: "Row hover scale", min: 0.9, max: 1.12, step: 0.01 },
  { key: "thirdButtonHoverButtonScale", label: "Button hover size", min: 1, max: 1.18, step: 0.01 },
  { key: "thirdButtonPressedScale", label: "Pressed scale", min: 0.84, max: 1.04, step: 0.01 },
  { key: "thirdButtonTransitionMs", label: "Transition ms", min: 0, max: 900, step: 10 },
];

const fourthBlockControls = [
  { key: "fourthBlockTopGap", label: "Block top gap", min: -200, max: 1080, step: 1 },
  { key: "fourthBlockHeight", label: "Block height", min: 220, max: 1200, step: 2 },
  { key: "fourthElementsTopGap", label: "Elements top gap", min: 0, max: 720, step: 1 },
  { key: "fourthInputStageHeight", label: "Stage height", min: 160, max: 1000, step: 2 },
];

const fourthTextControls = [
  { key: "fourthHeadlineGap", label: "Headline gap", min: 0, max: 100, step: 1 },
  { key: "fourthHeadlineSize", label: "Headline size", min: 32, max: 140, step: 1 },
  { key: "fourthHeadlineLineHeight", label: "Headline line height", min: 0.78, max: 1.4, step: 0.01 },
  { key: "fourthHeadlineFirstWeight", label: "First line weight", min: 100, max: 900, step: 10 },
  { key: "fourthHeadlineSecondWeight", label: "Second line weight", min: 100, max: 900, step: 10 },
  { key: "fourthHeadlineTracking", label: "Headline tracking", min: -0.12, max: 0.12, step: 0.005 },
  { key: "fourthHeadlineToSubtitleGap", label: "Headline to subtitle", min: 0, max: 180, step: 1 },
  { key: "fourthSubtitleGap", label: "Subtitle to input", min: 0, max: 180, step: 1 },
  { key: "fourthSubtitleWidth", label: "Subtitle width", min: 280, max: 1200, step: 10 },
  { key: "fourthSubtitleSize", label: "Subtitle size", min: 10, max: 42, step: 1 },
  { key: "fourthSubtitleLineHeight", label: "Subtitle line height", min: 0.9, max: 2.2, step: 0.01 },
  { key: "fourthSubtitleWeight", label: "Subtitle weight", min: 100, max: 900, step: 10 },
];

const fourthInputLayoutControls = [
  { key: "fourthInputWidth", label: "Input width", min: 320, max: 1200, step: 2 },
  { key: "fourthInputPaddingX", label: "Input padding X", min: 12, max: 64, step: 1 },
  { key: "fourthInputPaddingY", label: "Input padding Y", min: 8, max: 40, step: 1 },
  { key: "fourthInputOffsetX", label: "Offset X", min: -360, max: 360, step: 1 },
  { key: "fourthInputScale", label: "Scale", min: 0.5, max: 1.6, step: 0.01 },
  { key: "fourthInputOpacity", label: "Opacity", min: 0, max: 1, step: 0.01 },
];

const fourthInputPartsControls = [
  { key: "fourthInputIconSize", label: "Icon chip", min: 24, max: 72, step: 1 },
  { key: "fourthInputIconGlyphSize", label: "Icon glyph", min: 12, max: 36, step: 1 },
  { key: "fourthInputButtonSize", label: "Button size", min: 32, max: 180, step: 1 },
  { key: "fourthInputArrowSize", label: "Arrow size", min: 14, max: 42, step: 1 },
  { key: "fourthInputTextSize", label: "Text size", min: 12, max: 36, step: 1 },
  { key: "fourthInputIconVisible", label: "Show start icon", min: 0, max: 1, step: 1 },
];

const fourthInputBorderControls = [
  { key: "fourthInputBorderWidth", label: "Input border width", min: 0, max: 8, step: 0.1 },
  { key: "borderButtonSurfaceOpacity", label: "Surface opacity", min: 0, max: 1, step: 0.01 },
  { key: "borderButtonGlassBlur", label: "Glass blur", min: 0, max: 40, step: 1 },
  { key: "borderButtonGlassSaturation", label: "Glass saturation", min: 0.5, max: 2.5, step: 0.05 },
  { key: "borderButtonGlassBrightness", label: "Glass brightness", min: 0.5, max: 1.8, step: 0.05 },
  { key: "borderButtonMatteOpacity", label: "Matte opacity", min: 0, max: 0.55, step: 0.01 },
  { key: "borderButtonEdgeSensitivity", label: "Edge sensitivity", min: 0, max: 100, step: 1 },
  { key: "borderButtonGlowHue", label: "Glow hue", min: 0, max: 360, step: 1 },
  { key: "borderButtonGlowSaturation", label: "Glow saturation", min: 0, max: 100, step: 1 },
  { key: "borderButtonGlowLightness", label: "Glow lightness", min: 0, max: 100, step: 1 },
  { key: "borderButtonGlowRadius", label: "Glow radius", min: 0, max: 120, step: 1 },
  { key: "borderButtonGlowIntensity", label: "Glow intensity", min: 0, max: 1.5, step: 0.01 },
  { key: "borderButtonConeSpread", label: "Cone spread", min: 1, max: 90, step: 1 },
  { key: "borderButtonFillOpacity", label: "Fill opacity", min: 0, max: 1, step: 0.01 },
  { key: "borderButtonAnimationSpeed", label: "Animation speed", min: 800, max: 16000, step: 100 },
];

const popupVeilControls = [
  { key: "popupVeilOpacity", label: "Veil opacity", min: 0, max: 1, step: 0.01 },
  { key: "popupVeilBlur", label: "Veil blur", min: 0, max: 40, step: 1 },
];

const popupLayoutControls = [
  { key: "popupRadius", label: "Popup corner radius", min: 0, max: 140, step: 1 },
  { key: "popupWidth", label: "Popup width", min: 280, max: 1400, step: 2 },
  { key: "popupHeight", label: "Popup height", min: 240, max: 1000, step: 2 },
  { key: "popupOffsetX", label: "Popup X", min: -500, max: 500, step: 1 },
  { key: "popupOffsetY", label: "Popup Y", min: -500, max: 500, step: 1 },
  { key: "popupPaddingX", label: "Padding X", min: 0, max: 180, step: 1 },
  { key: "popupPaddingY", label: "Padding Y", min: 0, max: 180, step: 1 },
];

const popupTextControls = [
  { key: "popupTextOffsetY", label: "Text group Y", min: -240, max: 420, step: 1 },
  { key: "popupTitleSize", label: "Title size", min: 24, max: 140, step: 1 },
  { key: "popupTitleLineHeight", label: "Title line height", min: 0.8, max: 1.6, step: 0.01 },
  { key: "popupTitleWeight", label: "Title weight", min: 100, max: 900, step: 10 },
  { key: "popupSubtitleGap", label: "Title/subtitle gap", min: 0, max: 180, step: 1 },
  { key: "popupSubtitleSize", label: "Subtitle size", min: 12, max: 72, step: 1 },
  { key: "popupSubtitleLineHeight", label: "Subtitle line height", min: 0.9, max: 2.2, step: 0.01 },
  { key: "popupSubtitleWeight", label: "Subtitle weight", min: 100, max: 900, step: 10 },
];

const popupButtonControls = [
  { key: "popupButtonInsetX", label: "Button side inset", min: 0, max: 220, step: 1 },
  { key: "popupButtonY", label: "Button Y", min: 80, max: 900, step: 1 },
];

const fifthBlockControls = [
  { key: "fifthBlockTopGap", label: "Block top gap", min: -200, max: 480, step: 1 },
  { key: "fifthBlockHeight", label: "Block height", min: 260, max: 1400, step: 2 },
  { key: "fifthElementsTopGap", label: "Elements top gap", min: 0, max: 720, step: 1 },
  { key: "fifthBlockBottomGap", label: "Bottom gap", min: 0, max: 480, step: 1 },
  { key: "fifthBlockPaddingX", label: "Padding X", min: 0, max: 120, step: 1 },
  { key: "fifthBlockPaddingY", label: "Padding Y", min: 0, max: 120, step: 1 },
];

const fifthHeadlineControls = [
  { key: "fifthHeadlineInsetX", label: "Text X", min: -160, max: 320, step: 1 },
  { key: "fifthTextGroupOffsetY", label: "Text group Y", min: -360, max: 360, step: 1 },
  { key: "fifthHeadlineToSubtitleGap", label: "Headline to subtitle", min: 0, max: 240, step: 1 },
  { key: "fifthHeadlineToCardGap", label: "Text/card gap", min: -900, max: 360, step: 1 },
  { key: "fifthHeadlineWidth", label: "Headline width", min: 240, max: 1400, step: 10 },
  { key: "fifthHeadlineSize", label: "Headline size", min: 28, max: 140, step: 1 },
  { key: "fifthHeadlineLineHeight", label: "Headline line height", min: 0.78, max: 1.5, step: 0.01 },
];

const fifthSubtitleControls = [
  { key: "fifthSubtitleTop", label: "Subtitle Y", min: -120, max: 240, step: 1 },
  { key: "fifthSubtitleOffsetX", label: "Subtitle X", min: -240, max: 360, step: 1 },
  { key: "fifthSubtitleWidth", label: "Subtitle width", min: 180, max: 1400, step: 10 },
  { key: "fifthSubtitleSize", label: "Subtitle size", min: 10, max: 56, step: 1 },
  { key: "fifthSubtitleLineHeight", label: "Subtitle line height", min: 0.9, max: 2.2, step: 0.01 },
  { key: "fifthSubtitleWeight", label: "Subtitle weight", min: 100, max: 900, step: 10 },
];

const fifthCardControls = [
  { key: "fifthCardWidth", label: "Card width", min: 180, max: 1600, step: 2 },
  { key: "fifthCardHeight", label: "Card height", min: 120, max: 1000, step: 2 },
  { key: "fifthCardAspect", label: "Card proportion", min: 0.5, max: 3.2, step: 0.01 },
  { key: "fifthCardOffsetX", label: "Card X", min: -600, max: 600, step: 1 },
  { key: "fifthCardPadding", label: "Card padding", min: 0, max: 120, step: 1 },
  { key: "fifthCardRadius", label: "Card radius", min: 0, max: 90, step: 1 },
];

const fifthImageControls = [
  { key: "fifthImageVisible", label: "Show image", min: 0, max: 1, step: 1 },
  { key: "fifthImageWidth", label: "Image width", min: 120, max: 1300, step: 2 },
  { key: "fifthImageScale", label: "Image scale", min: 0.1, max: 2.5, step: 0.01 },
  { key: "fifthImageOffsetX", label: "Image X", min: -600, max: 600, step: 1 },
  { key: "fifthImageOffsetY", label: "Image Y", min: -400, max: 800, step: 1 },
  { key: "fifthImageRotate", label: "Image rotate", min: -45, max: 45, step: 0.1 },
  { key: "fifthImageOpacity", label: "Image opacity", min: 0, max: 1, step: 0.01 },
  { key: "fifthImageBlur", label: "Image blur", min: 0, max: 20, step: 0.1 },
  { key: "fifthImageBrightness", label: "Brightness", min: 0.2, max: 2, step: 0.01 },
  { key: "fifthImageContrast", label: "Contrast", min: 0.2, max: 2.5, step: 0.01 },
  { key: "fifthImageSaturation", label: "Saturation", min: 0, max: 2.5, step: 0.01 },
  { key: "fifthImageDropShadow", label: "Drop shadow", min: 0, max: 1, step: 0.01 },
];

const footerLayoutControls = [
  { key: "footerBlockTopGap", label: "Block top gap", min: -240, max: 480, step: 1 },
  { key: "footerHeight", label: "Footer height", min: 160, max: 720, step: 2 },
  { key: "footerPaddingX", label: "Padding X", min: 16, max: 180, step: 1 },
  { key: "footerPaddingY", label: "Padding Y", min: 16, max: 160, step: 1 },
  { key: "footerBrandToContactsGap", label: "Brand to contacts", min: 0, max: 420, step: 1 },
  { key: "footerContactsToGlobalGap", label: "Contacts to links", min: 0, max: 420, step: 1 },
  { key: "footerGlobalToLinksGap", label: "Links to global", min: 0, max: 420, step: 1 },
  { key: "footerBrandOffsetX", label: "Brand block X", min: -320, max: 320, step: 1 },
  { key: "footerContactsOffsetX", label: "Contacts block X", min: -320, max: 320, step: 1 },
  { key: "footerGlobalOffsetX", label: "Global block X", min: -320, max: 320, step: 1 },
  { key: "footerLinksOffsetX", label: "Links block X", min: -320, max: 320, step: 1 },
  { key: "footerBrandItemsGap", label: "Brand items gap", min: 0, max: 120, step: 1 },
  { key: "footerBrandToDescriptionGap", label: "Brand to description", min: 0, max: 160, step: 1 },
  { key: "footerDescriptionToCopyrightGap", label: "Description to copyright", min: 0, max: 160, step: 1 },
  { key: "footerContactsGap", label: "Contacts items gap", min: 0, max: 80, step: 1 },
  { key: "footerGlobalItemsGap", label: "Global items gap", min: 0, max: 80, step: 1 },
  { key: "footerLinksItemsGap", label: "Links items gap", min: 0, max: 80, step: 1 },
];

const footerTextControls = [
  { key: "footerBrandSize", label: "Brand size", min: 24, max: 96, step: 1 },
  { key: "footerBrandWeight", label: "Brand weight", min: 100, max: 900, step: 10 },
  { key: "footerTextSize", label: "Text size", min: 12, max: 56, step: 1 },
  { key: "footerTextLineHeight", label: "Text line height", min: 0.9, max: 2, step: 0.01 },
  { key: "footerTextWeight", label: "Text weight", min: 100, max: 900, step: 10 },
];

const footerLinkControls = [
  { key: "footerLinksSize", label: "Link size", min: 12, max: 56, step: 1 },
  { key: "footerLinksLineHeight", label: "Link line height", min: 0.9, max: 2, step: 0.01 },
  { key: "footerLinksWeight", label: "Link weight", min: 100, max: 900, step: 10 },
  { key: "footerLinkUnderlineOpacity", label: "Underline", min: 0, max: 1, step: 0.01 },
  { key: "footerLinkHoverUnderlineOpacity", label: "Hover underline", min: 0, max: 1, step: 0.01 },
  { key: "footerLinkPressedScale", label: "Press scale", min: 0.84, max: 1.04, step: 0.01 },
  { key: "footerTransitionMs", label: "Transition ms", min: 0, max: 900, step: 10 },
];

const footerGlassControls = [
  { key: "footerGlassOpacity", label: "Surface opacity", min: 0, max: 1, step: 0.01 },
  { key: "footerGlassBlur", label: "Blur", min: 0, max: 80, step: 1 },
  { key: "footerGlassFrost", label: "Frost", min: 0, max: 0.4, step: 0.01 },
  { key: "footerGlassBorderWidth", label: "Border width", min: 0, max: 8, step: 0.1 },
  { key: "footerGlassBorderOpacity", label: "Border opacity", min: 0, max: 1, step: 0.01 },
  { key: "footerGlassGlossiness", label: "Glossiness", min: 0, max: 1, step: 0.01 },
  { key: "footerGlassGlossinessAngle", label: "Gloss angle", min: 0, max: 360, step: 1 },
];

const getBorderGlowHsl = (settings) => (
  `${settings.borderButtonGlowHue ?? 40} ${settings.borderButtonGlowSaturation ?? 80} ${settings.borderButtonGlowLightness ?? 80}`
);

const getThirdCardControls = (count) =>
  Array.from({ length: count }, (_, index) => {
    const cardNumber = index + 1;
    return [
      {
        key: `thirdCard${cardNumber}Width`,
        label: `Card ${cardNumber} width`,
        min: 12,
        max: 100,
        step: 0.5,
      },
      {
        key: `thirdCard${cardNumber}Height`,
        label: `Card ${cardNumber} height`,
        min: 120,
        max: 900,
        step: 2,
      },
    ];
  }).flat();

const benefitsCardSizeControls = [
  {
    key: "benefitsCardsWidth",
    label: "Cards width",
    min: 20,
    max: 100,
    step: 0.5,
  },
  {
    key: "benefitsCardsHeight",
    label: "Cards height",
    min: 20,
    max: 100,
    step: 0.5,
  },
];

const pickControls = (items, keys) =>
  keys.map((key) => items.find((control) => control.key === key)).filter(Boolean);

const normalizeEmTracking = (value, fontSize, fallback) => {
  if (!Number.isFinite(value)) return fallback;
  if (Math.abs(value) <= 1) return value;

  const size = Number.isFinite(fontSize) && fontSize > 0 ? fontSize : 76;
  return Number((value / size).toFixed(4));
};

const normalizePresetSettings = (presetSettings = {}) => {
  const nextSettings = { ...defaultSettings, ...presetSettings };

  if (!Array.isArray(nextSettings.benefitsImages) || nextSettings.benefitsImages.length === 0) {
    nextSettings.benefitsImages = [benefitsCardImage];
  }

  if (!Array.isArray(nextSettings.fifthImages)) {
    nextSettings.fifthImages = [];
  }

  if (!Number.isFinite(nextSettings.shapeOffsetY)) {
    nextSettings.shapeOffsetY = defaultSettings.shapeOffsetY;
  }

  nextSettings.fourthHeadlineTracking = normalizeEmTracking(
    nextSettings.fourthHeadlineTracking,
    nextSettings.fourthHeadlineSize,
    defaultSettings.fourthHeadlineTracking,
  );

  if (!Number.isFinite(presetSettings.benefitsCardsWidth) && Number.isFinite(presetSettings.benefitsCard1Width)) {
    nextSettings.benefitsCardsWidth = presetSettings.benefitsCard1Width;
  }

  if (!Number.isFinite(presetSettings.benefitsCardsHeight) && Number.isFinite(presetSettings.benefitsCard1Height)) {
    nextSettings.benefitsCardsHeight = presetSettings.benefitsCard1Height;
  }

  for (let cardNumber = 1; cardNumber <= 5; cardNumber += 1) {
    nextSettings[`benefitsCard${cardNumber}Width`] = nextSettings.benefitsCardsWidth;
    nextSettings[`benefitsCard${cardNumber}Height`] = nextSettings.benefitsCardsHeight;
  }

  nextSettings.fifthHeadlineInsetX = 0;
  nextSettings.fifthCardOffsetX = 0;
  nextSettings.fifthCardAlignX = 0;

  return nextSettings;
};

const normalizePresets = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items.map((preset) => ({
    ...preset,
    settings: normalizePresetSettings(preset.settings),
  }));
};

const stripStoredImages = (settings = {}) => ({
  ...settings,
  benefitsImages: [],
  fifthImages: [],
});

const safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Large uploaded images can exceed localStorage quota. Project presets remain in data/presets.json.
  }
};

const restoreDefaultImages = (savedSettings = {}) => {
  const nextSettings = { ...savedSettings };

  if (Array.isArray(nextSettings.benefitsImages) && nextSettings.benefitsImages.length === 0) {
    delete nextSettings.benefitsImages;
  }

  if (Array.isArray(nextSettings.fifthImages) && nextSettings.fifthImages.length === 0) {
    delete nextSettings.fifthImages;
  }

  return nextSettings;
};

const readCurrentSettings = () => {
  try {
    const savedSettings = JSON.parse(localStorage.getItem(CURRENT_SETTINGS_STORAGE_KEY) || "null");

    if (!savedSettings) {
      return defaultSettings;
    }

    return normalizePresetSettings(restoreDefaultImages(savedSettings));
  } catch {
    return defaultSettings;
  }
};

const mergePresets = (primaryPresets = [], secondaryPresets = []) => {
  const merged = [];
  const seenIds = new Set();

  [...primaryPresets, ...secondaryPresets].forEach((preset) => {
    if (!preset?.id || seenIds.has(preset.id)) return;

    seenIds.add(preset.id);
    merged.push(preset);
  });

  return merged.slice(0, 12);
};

const persistPresets = async (nextPresets) => {
  try {
    await fetch("/api/presets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextPresets),
    });
  } catch {
    // The Vite persistence endpoint is available in local dev; localStorage remains the fallback.
  }

  safeSetLocalStorage(
    PRESET_STORAGE_KEY,
    JSON.stringify(
      nextPresets.map((preset) => ({
        ...preset,
        settings: stripStoredImages(preset.settings),
      })),
    ),
  );
};

let activeScrollFrame = 0;

const smoothScrollToCenteredElement = (selector) => {
  const target = document.querySelector(selector);
  if (!target) return;

  if (activeScrollFrame) cancelAnimationFrame(activeScrollFrame);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targetRect = target.getBoundingClientRect();
  const startY = window.scrollY;
  const targetY = Math.max(
    0,
    startY + targetRect.top + targetRect.height / 2 - window.innerHeight / 2,
  );

  if (reducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }

  const distance = targetY - startY;
  const duration = Math.min(1800, Math.max(1100, Math.abs(distance) * 0.7));
  const startTime = performance.now();
  const easeInOutQuint = (progress) =>
    progress < 0.5
      ? 16 * progress * progress * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 5) / 2;

  const tick = (now) => {
    const progress = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, startY + distance * easeInOutQuint(progress));

    if (progress < 1) {
      activeScrollFrame = requestAnimationFrame(tick);
      return;
    }

    activeScrollFrame = 0;
  };

  activeScrollFrame = requestAnimationFrame(tick);
};

export const WovenLightHero = () => {
  const [settings, setSettings] = useState(readCurrentSettings);
  const [presets, setPresets] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(SHOW_SHADER_CONTROLS);

  useEffect(() => {
    let localPresets = [];

    try {
      const saved = JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY) || "[]");
      localPresets = normalizePresets(saved);
      setPresets(localPresets);
    } catch {
      setPresets([]);
    }

    let isCancelled = false;

    const loadProjectPresets = async () => {
      try {
        const response = await fetch("/api/presets");
        if (!response.ok) throw new Error("Unable to load project presets.");

        const projectPresets = normalizePresets(await response.json());
        if (isCancelled) return;

        if (projectPresets.length > 0) {
          const mergedPresets = mergePresets(projectPresets, localPresets);
          setPresets(mergedPresets);
          safeSetLocalStorage(
            PRESET_STORAGE_KEY,
            JSON.stringify(
              mergedPresets.map((preset) => ({
                ...preset,
                settings: stripStoredImages(preset.settings),
              })),
            ),
          );
          return;
        }

        setPresets(localPresets);
      } catch {
        setPresets(localPresets);
      }
    };

    loadProjectPresets();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    safeSetLocalStorage(CURRENT_SETTINGS_STORAGE_KEY, JSON.stringify(stripStoredImages(settings)));
  }, [settings]);

  const backgroundStyle = useMemo(() => {
    const layoutStyle = {
      "--hero-height": `${settings.heroHeight}vh`,
      "--hero-top-gap": `${settings.heroTopGap ?? 0}px`,
      "--hero-elements-top-gap": `${settings.heroElementsTopGap ?? 240}px`,
      "--hero-top": `${settings.heroTop}px`,
      "--hero-content-width": `${settings.contentWidth}px`,
      "--title-size": `${settings.titleSize}px`,
      "--title-line-height": `${settings.titleLineHeight}px`,
      "--title-weight": settings.titleWeight,
      "--title-color": settings.titleColor,
      "--title-second-color": settings.titleSecondColor,
      "--title-font": getFontStack(settings.titleFont),
      "--subtitle-top": `${settings.subtitleTop}px`,
      "--subtitle-size": `${settings.subtitleSize}px`,
      "--subtitle-line-height": settings.subtitleLineHeight,
      "--subtitle-weight": settings.subtitleWeight,
      "--subtitle-color": settings.subtitleColor,
      "--buttons-top": `${settings.buttonsTop}px`,
      "--buttons-gap": `${settings.buttonsGap}px`,
      "--border-button-width": `${settings.borderButtonWidth ?? 273}px`,
      "--border-button-height": `${settings.borderButtonHeight ?? 58}px`,
      "--border-button-padding-x": `${settings.borderButtonPaddingX ?? 34}px`,
      "--border-button-padding-y": `${settings.borderButtonPaddingY ?? 14}px`,
      "--border-button-background": settings.borderButtonBackground ?? "#120F17",
      "--border-button-surface-opacity": settings.borderButtonSurfaceOpacity ?? 1,
      "--border-button-glass-blur": `${settings.borderButtonGlassBlur ?? 0}px`,
      "--border-button-glass-saturation": settings.borderButtonGlassSaturation ?? 1,
      "--border-button-glass-brightness": settings.borderButtonGlassBrightness ?? 1,
      "--border-button-matte-opacity": settings.borderButtonMatteOpacity ?? 0,
      "--site-container-width": `${settings.siteContainerWidth}px`,
      "--glass-surface-color": settings.glassSurfaceColor ?? "#ffffff",
      "--glass-opacity": settings.glassOpacity,
      "--glass-blur": `${settings.glassBlur}px`,
      "--glass-frost": settings.glassFrost,
      "--glass-radius": `${settings.glassRadius}px`,
      "--glass-border-width": `${settings.glassBorderWidth}px`,
      "--glass-border-color": settings.glassBorderColor ?? "#ffffff",
      "--glass-border-opacity": settings.glassBorderOpacity,
      "--glass-glossiness": settings.glassGlossiness ?? 0.12,
      "--glass-glossiness-angle": `${settings.glassGlossinessAngle ?? 135}deg`,
      "--glass-glossiness-color": settings.glassGlossinessColor ?? "#ffffff",
      "--glass-card-fill": settings.glassCardFill ?? 0.92,
      "--glass-card-blur": `${settings.glassCardBlur ?? settings.glassBlur ?? 5}px`,
      "--glass-card-radius": `${settings.glassCardRadius ?? settings.glassRadius ?? 39}px`,
      "--glass-card-border-opacity": settings.glassCardBorderOpacity ?? settings.glassBorderOpacity ?? 0.16,
      "--glass-card-veil-color": settings.figureOverlayColor ?? "#051409",
      "--glass-card-veil-opacity": Math.min(0.42, Math.max(0.18, (settings.glassCardFill ?? 0.92) * 0.34)),
      "--glass-card-surface-opacity": Math.min(0.12, Math.max(0.035, (settings.glassCardFill ?? 0.92) * 0.08)),
      "--glass-highlight-opacity": settings.glassHighlightOpacity ?? 0.08,
      "--glass-shadow-opacity": settings.glassShadowOpacity ?? 0.18,
      "--benefits-text-color": settings.benefitsTextColor,
      "--benefits-text-second-color": settings.benefitsTextSecondColor,
      "--benefits-block-top-gap": `${settings.benefitsBlockTopGap ?? 0}px`,
      "--benefits-elements-top-gap": `${settings.benefitsElementsTopGap ?? 32}px`,
      "--benefits-block-height": `${settings.benefitsBlockHeight ?? 0}px`,
      "--benefits-block-padding": `${settings.benefitsBlockPadding ?? 46}px`,
      "--benefits-text-size": `${settings.benefitsTextSize}px`,
      "--benefits-text-line-height": settings.benefitsTextLineHeight,
      "--benefits-headline-width": `${settings.benefitsHeadlineWidth ?? 760}px`,
      "--benefits-text-top": `${settings.benefitsTextTop}px`,
      "--benefits-headline-inset-x": `${settings.benefitsHeadlineInsetX ?? 24}px`,
      "--benefits-headline-inset-y": `${settings.benefitsHeadlineInsetY ?? 51}px`,
      "--benefits-content-gap": `${settings.benefitsContentGap}px`,
      "--benefits-lead-width": `${settings.benefitsLeadWidth ?? 50}%`,
      "--benefits-lead-height": `${settings.benefitsLeadHeight ?? 0}px`,
      "--benefits-main-gap": `${settings.benefitsMainGap ?? 8}px`,
      "--benefits-card-gap": `${settings.benefitsCardGap}px`,
      "--benefits-top-card-height": `${settings.benefitsTopCardHeight ?? 33.3}%`,
      "--benefits-middle-row-height": `${settings.benefitsMiddleRowHeight ?? 35}%`,
      "--benefits-middle-left-width": `${settings.benefitsMiddleLeftWidth ?? 40}%`,
      "--benefits-bottom-left-width": `${settings.benefitsBottomLeftWidth ?? 60}%`,
      "--benefits-small-text-inset-x": `${settings.benefitsSmallTextInsetX ?? 0}px`,
      "--benefits-card-title-width": `${settings.benefitsCardTitleWidth ?? 460}px`,
      "--benefits-card-subtitle-width": `${settings.benefitsCardSubtitleWidth ?? 460}px`,
      "--benefits-small-title-size": `${settings.benefitsSmallTitleSize ?? 30}px`,
      "--benefits-small-body-size": `${settings.benefitsSmallBodySize ?? 13}px`,
      "--benefits-small-title-weight": settings.benefitsSmallTitleWeight ?? 500,
      "--benefits-small-body-weight": settings.benefitsSmallBodyWeight ?? 400,
      "--benefits-card-title-color": settings.benefitsCardTitleColor ?? "#ffffff",
      "--benefits-card-subtitle-color": settings.benefitsCardSubtitleColor ?? "#ffffff",
      "--benefits-card-padding": `${settings.benefitsCardPadding ?? 32}px`,
      "--benefits-chip-text-color": settings.benefitsChipTextColor ?? "#ffffff",
      "--benefits-chip-border-color": settings.benefitsChipBorderColor ?? "#ffffff",
      "--benefits-chip-height": `${settings.benefitsChipHeight ?? 37}px`,
      "--benefits-chip-padding-x": `${settings.benefitsChipPaddingX ?? 15}px`,
      "--benefits-chip-padding-y": `${settings.benefitsChipPaddingY ?? 12}px`,
      "--benefits-chip-text-size": `${settings.benefitsChipTextSize ?? 11}px`,
      "--benefits-chip-border-width": `${settings.benefitsChipBorderWidth ?? 1.183}px`,
      "--benefits-chip-gap": `${settings.benefitsChipGap ?? 1}px`,
      "--benefits-chips-y": `${settings.benefitsChipsOffsetY ?? 0}px`,
      "--benefits-image-display": settings.benefitsImageVisible > 0 ? "block" : "none",
      "--benefits-image-width": `${settings.benefitsImageWidth ?? 720}px`,
      "--benefits-image-scale": settings.benefitsImageScale ?? 1,
      "--benefits-image-x": `${settings.benefitsImageOffsetX ?? 20}px`,
      "--benefits-image-y": `${settings.benefitsImageOffsetY ?? 430}px`,
      "--benefits-image-rotate": `${settings.benefitsImageRotate ?? -2}deg`,
      "--benefits-image-opacity": settings.benefitsImageOpacity ?? 1,
      "--benefits-image-blur": `${settings.benefitsImageBlur ?? 0}px`,
      "--benefits-image-lightness": settings.benefitsImageLightness ?? 1,
      "--benefits-image-brightness": settings.benefitsImageBrightness ?? 1,
      "--benefits-image-contrast": settings.benefitsImageContrast ?? 1,
      "--benefits-image-saturation": settings.benefitsImageSaturation ?? 1,
      "--benefits-image-sharpness": settings.benefitsImageSharpness ?? 0,
      "--benefits-image-drop-shadow": settings.benefitsImageDropShadow ?? 0,
      "--third-block-top": `${settings.thirdBlockTop ?? 8}px`,
      "--third-elements-top-gap": `${settings.thirdElementsTopGap ?? 32}px`,
      "--third-block-height": `${settings.thirdBlockHeight ?? 720}px`,
      "--third-block-padding": `${settings.thirdBlockPadding ?? 32}px`,
      "--third-headline-top": `${settings.thirdHeadlineTop ?? 0}px`,
      "--third-headline-inset-x": `${settings.thirdHeadlineInsetX ?? 0}px`,
      "--third-headline-gap": `${settings.thirdHeadlineGap ?? 32}px`,
      "--third-headline-size": `${settings.thirdHeadlineSize ?? 70}px`,
      "--third-headline-line-height": settings.thirdHeadlineLineHeight ?? 1.05,
      "--third-headline-line-gap": `${settings.thirdHeadlineLineGap ?? 0}px`,
      "--third-headline-first-size": `${settings.thirdHeadlineFirstSize ?? settings.thirdHeadlineSize ?? 70}px`,
      "--third-headline-first-line-height": settings.thirdHeadlineFirstLineHeight ?? settings.thirdHeadlineLineHeight ?? 1.05,
      "--third-headline-first-weight": settings.thirdHeadlineFirstWeight ?? 500,
      "--third-headline-first-tracking": `${settings.thirdHeadlineFirstTracking ?? -0.04}em`,
      "--third-headline-second-size": `${settings.thirdHeadlineSecondSize ?? settings.thirdHeadlineSize ?? 70}px`,
      "--third-headline-second-line-height": settings.thirdHeadlineSecondLineHeight ?? settings.thirdHeadlineLineHeight ?? 1.05,
      "--third-headline-second-weight": settings.thirdHeadlineSecondWeight ?? 400,
      "--third-headline-second-tracking": `${settings.thirdHeadlineSecondTracking ?? -0.04}em`,
      "--third-headline-first-color": settings.thirdHeadlineFirstColor ?? "#31e257",
      "--third-headline-second-color": settings.thirdHeadlineSecondColor ?? "#ffffff",
      "--third-text-align": settings.thirdTextCentered > 0 ? "center" : "left",
      "--third-text-items": settings.thirdTextCentered > 0 ? "center" : "flex-start",
      "--third-subtitle-gap": `${settings.thirdSubtitleGap ?? 36}px`,
      "--third-subtitle-width": `${settings.thirdSubtitleWidth ?? 760}px`,
      "--third-subtitle-size": `${settings.thirdSubtitleSize ?? 18}px`,
      "--third-subtitle-line-height": settings.thirdSubtitleLineHeight ?? 1.45,
      "--third-subtitle-weight": settings.thirdSubtitleWeight ?? 400,
      "--third-subtitle-color": settings.thirdSubtitleColor ?? "#ffffff",
      "--third-subtitle-display": (settings.thirdSubtitleVisible ?? 1) > 0 ? "block" : "none",
      "--third-card-gap": `${settings.thirdCardGap ?? 8}px`,
      "--third-card-radius": `${settings.thirdCardRadius ?? 34}px`,
      "--third-card-title-size": `${settings.thirdCardTitleSize ?? 30}px`,
      "--third-card-title-weight": settings.thirdCardTitleWeight ?? 500,
      "--third-card-title-color": settings.thirdCardTitleColor ?? "#ffffff",
      "--third-card-body-top-gap": `${settings.thirdCardBodyTopGap ?? 12}px`,
      "--third-card-body-size": `${settings.thirdCardBodySize ?? 13}px`,
      "--third-card-body-weight": settings.thirdCardBodyWeight ?? 400,
      "--third-card-body-color": settings.thirdCardBodyColor ?? "#ffffff",
      "--third-card-body-display": (settings.thirdCardBodyVisible ?? 1) > 0 ? "block" : "none",
      "--third-card-body-width": `${settings.thirdCardBodyWidth ?? 420}px`,
      "--third-card-text-inset-x": `${settings.thirdCardTextInsetX ?? 0}px`,
      "--third-card-text-inset-y": `${settings.thirdCardTextInsetY ?? 0}px`,
      "--third-list-top-gap": `${settings.thirdListTopGap ?? 24}px`,
      "--third-list-item-gap": `${settings.thirdListItemGap ?? 10}px`,
      "--third-list-size": `${settings.thirdListSize ?? 13}px`,
      "--third-list-weight": settings.thirdListWeight ?? 400,
      "--third-list-line-height": settings.thirdListLineHeight ?? 1.35,
      "--third-list-check-gap": `${settings.thirdListCheckGap ?? 10}px`,
      "--third-list-text-color": settings.thirdListTextColor ?? "#ffffff",
      "--third-list-check-color": settings.thirdListCheckColor ?? "#ffffff",
      "--third-button-top-gap": `${settings.thirdButtonTopGap ?? 28}px`,
      "--third-button-y": `${settings.thirdButtonY ?? 260}px`,
      "--third-button-bottom-gap": `${settings.thirdButtonBottomGap ?? 0}px`,
      "--third-button-card-inset-x": `${settings.thirdButtonCardInsetX ?? 32}px`,
      "--third-button-height": `${settings.thirdButtonHeight ?? 66}px`,
      "--third-button-padding-x": `${settings.thirdButtonPaddingX ?? 38}px`,
      "--third-button-padding-y": `${settings.thirdButtonPaddingY ?? 0}px`,
      "--third-button-radius": `${settings.thirdButtonRadius ?? 999}px`,
      "--third-button-gap": `${settings.thirdButtonGap ?? -1}px`,
      "--third-button-fill": settings.thirdButtonFillColor ?? "#ddff9c",
      "--third-button-border": settings.thirdButtonBorderColor ?? "#ddff9c",
      "--third-button-border-width": `${settings.thirdButtonBorderWidth ?? 1}px`,
      "--third-button-text-color": settings.thirdButtonTextColor ?? "#071009",
      "--third-button-text-size": `${settings.thirdButtonTextSize ?? 20}px`,
      "--third-button-text-weight": settings.thirdButtonTextWeight ?? 400,
      "--third-button-text-transform": (settings.thirdButtonTextUppercase ?? 0) > 0 ? "uppercase" : "none",
      "--third-button-text-tracking": `${settings.thirdButtonTextTracking ?? 0}px`,
      "--third-button-icon-scale": settings.thirdButtonIconScale ?? 0.94,
      "--third-button-arrow-size": `${settings.thirdButtonArrowSize ?? 22}px`,
      "--third-button-arrow-stroke": settings.thirdButtonArrowStroke ?? 2,
      "--third-button-arrow-offset-x": `${settings.thirdButtonArrowOffsetX ?? 0}px`,
      "--third-button-arrow-offset-y": `${settings.thirdButtonArrowOffsetY ?? 0}px`,
      "--third-button-hover-fill": settings.thirdButtonHoverFillColor ?? "#ddff9c",
      "--third-button-hover-text": settings.thirdButtonHoverTextColor ?? "#071009",
      "--third-button-hover-border": settings.thirdButtonHoverBorderColor ?? "#ddff9c",
      "--third-button-hover-scale": settings.thirdButtonHoverScale ?? 1,
      "--third-button-hover-button-scale": settings.thirdButtonHoverButtonScale ?? 1.06,
      "--third-button-pressed-scale": settings.thirdButtonPressedScale ?? 0.98,
      "--third-button-transition": `${settings.thirdButtonTransitionMs ?? 180}ms`,
      "--fourth-block-top-gap": `${settings.fourthBlockTopGap ?? 0}px`,
      "--fourth-elements-top-gap": `${settings.fourthElementsTopGap ?? 80}px`,
      "--fourth-block-top-padding": `${settings.fourthBlockTopPadding ?? 80}px`,
      "--fourth-block-bottom-padding": `${settings.fourthBlockBottomPadding ?? 80}px`,
      "--fourth-block-height": `${settings.fourthBlockHeight ?? 520}px`,
      "--fourth-input-stage-height": `${settings.fourthInputStageHeight ?? 420}px`,
      "--fourth-headline-top": `${settings.fourthHeadlineTop ?? 0}px`,
      "--fourth-headline-gap": `${settings.fourthHeadlineGap ?? 22}px`,
      "--fourth-headline-size": `${settings.fourthHeadlineSize ?? 76}px`,
      "--fourth-headline-line-height": settings.fourthHeadlineLineHeight ?? 1.02,
      "--fourth-headline-font": '"Playfair Display", "Bodoni Moda", "Bodoni 72", Didot, Georgia, serif',
      "--fourth-headline-first-weight": settings.fourthHeadlineFirstWeight ?? 500,
      "--fourth-headline-second-weight": settings.fourthHeadlineSecondWeight ?? 400,
      "--fourth-headline-tracking": `${settings.fourthHeadlineTracking ?? -0.0526}em`,
      "--fourth-headline-subtitle-gap": `${settings.fourthHeadlineToSubtitleGap ?? 28}px`,
      "--fourth-headline-first-color": settings.fourthHeadlineFirstColor ?? "#31e257",
      "--fourth-headline-second-color": settings.fourthHeadlineSecondColor ?? "#31e257",
      "--fourth-subtitle-top": `${settings.fourthSubtitleTop ?? 28}px`,
      "--fourth-subtitle-gap": `${settings.fourthSubtitleGap ?? 40}px`,
      "--fourth-subtitle-width": `${settings.fourthSubtitleWidth ?? 760}px`,
      "--fourth-subtitle-size": `${settings.fourthSubtitleSize ?? 20}px`,
      "--fourth-subtitle-line-height": settings.fourthSubtitleLineHeight ?? 1.5,
      "--fourth-subtitle-weight": settings.fourthSubtitleWeight ?? 430,
      "--fourth-subtitle-color": settings.fourthSubtitleColor ?? "#ffffff",
      "--fourth-input-x": `${settings.fourthInputOffsetX ?? 0}px`,
      "--fourth-input-y": `${settings.fourthInputOffsetY ?? 0}px`,
      "--fourth-input-scale": settings.fourthInputScale ?? 1,
      "--fourth-input-opacity": settings.fourthInputOpacity ?? 1,
      "--fourth-input-width": `${settings.fourthInputWidth ?? 760}px`,
      "--fourth-input-padding-x": `${settings.fourthInputPaddingX ?? 24}px`,
      "--fourth-input-padding-y": `${settings.fourthInputPaddingY ?? 16}px`,
      "--fourth-input-icon-size": `${settings.fourthInputIconSize ?? 40}px`,
      "--fourth-input-icon-glyph-size": `${settings.fourthInputIconGlyphSize ?? 20}px`,
      "--fourth-input-button-size": `${settings.fourthInputButtonSize ?? 48}px`,
      "--fourth-input-arrow-size": `${settings.fourthInputArrowSize ?? 24}px`,
      "--fourth-input-text-size": `${settings.fourthInputTextSize ?? 20}px`,
      "--fourth-input-icon-display": (settings.fourthInputIconVisible ?? 1) > 0 ? "grid" : "none",
      "--fourth-input-text-color": settings.fourthInputTextColor ?? "#f1f5f9",
      "--fourth-input-placeholder-color": settings.fourthInputPlaceholderColor ?? "#cbd5e1",
      "--fourth-input-accent": settings.fourthInputAccentColor ?? "#fb923c",
      "--fourth-input-icon-color": settings.fourthInputIconColor ?? "#fcd34d",
      "--fourth-input-button-start": settings.fourthInputButtonStart ?? "#fbbf24",
      "--fourth-input-button-end": settings.fourthInputButtonEnd ?? "#fb7185",
      "--popup-veil-color": settings.popupVeilColor ?? "#000000",
      "--popup-veil-opacity": settings.popupVeilOpacity ?? 0.68,
      "--popup-veil-blur": `${settings.popupVeilBlur ?? 0}px`,
      "--popup-width": `${settings.popupWidth ?? 860}px`,
      "--popup-height": `${settings.popupHeight ?? 640}px`,
      "--popup-x": `${settings.popupOffsetX ?? 0}px`,
      "--popup-y": `${settings.popupOffsetY ?? 0}px`,
      "--popup-padding-x": `${settings.popupPaddingX ?? 72}px`,
      "--popup-padding-y": `${settings.popupPaddingY ?? 80}px`,
      "--popup-background": settings.popupBackground ?? "#a9a9a9",
      "--popup-radius": `${settings.popupRadius ?? 72}px`,
      "--popup-text-y": `${settings.popupTextOffsetY ?? 0}px`,
      "--popup-title-size": `${settings.popupTitleSize ?? 72}px`,
      "--popup-title-line-height": settings.popupTitleLineHeight ?? 1.05,
      "--popup-title-weight": settings.popupTitleWeight ?? 400,
      "--popup-title-color": settings.popupTitleColor ?? "#111111",
      "--popup-subtitle-gap": `${settings.popupSubtitleGap ?? 44}px`,
      "--popup-subtitle-size": `${settings.popupSubtitleSize ?? 34}px`,
      "--popup-subtitle-line-height": settings.popupSubtitleLineHeight ?? 1.38,
      "--popup-subtitle-weight": settings.popupSubtitleWeight ?? 400,
      "--popup-subtitle-color": settings.popupSubtitleColor ?? "#111111",
      "--popup-button-inset-x": `${settings.popupButtonInsetX ?? 64}px`,
      "--popup-button-y": `${settings.popupButtonY ?? 420}px`,
      "--popup-button-color": settings.popupButtonColor ?? "#ddff9c",
      "--fifth-block-top-gap": `${settings.fifthBlockTopGap ?? 0}px`,
      "--fifth-block-bottom-gap": `${settings.fifthBlockBottomGap ?? 80}px`,
      "--fifth-elements-top-gap": `${settings.fifthElementsTopGap ?? 32}px`,
      "--fifth-block-height": `${settings.fifthBlockHeight ?? 720}px`,
      "--fifth-block-padding-x": `${settings.fifthBlockPaddingX ?? 46}px`,
      "--fifth-block-padding-y": `${settings.fifthBlockPaddingY ?? 32}px`,
      "--fifth-headline-top": `${settings.fifthHeadlineTop ?? 51}px`,
      "--fifth-headline-inset-x": `${settings.fifthHeadlineInsetX ?? 0}px`,
      "--fifth-text-group-y": `${settings.fifthTextGroupOffsetY ?? 0}px`,
      "--fifth-headline-card-gap": `${settings.fifthHeadlineToCardGap ?? 0}px`,
      "--fifth-headline-subtitle-gap": `${settings.fifthHeadlineToSubtitleGap ?? 32}px`,
      "--fifth-headline-width": `${settings.fifthHeadlineWidth ?? 560}px`,
      "--fifth-headline-size": `${settings.fifthHeadlineSize ?? 70}px`,
      "--fifth-headline-line-height": settings.fifthHeadlineLineHeight ?? 1.05,
      "--fifth-headline-first-color": settings.fifthHeadlineFirstColor ?? "#ffffff",
      "--fifth-headline-second-color": settings.fifthHeadlineSecondColor ?? "#ffffff",
      "--fifth-subtitle-top": `${settings.fifthSubtitleTop ?? 0}px`,
      "--fifth-subtitle-x": `${settings.fifthSubtitleOffsetX ?? 0}px`,
      "--fifth-subtitle-width": `${settings.fifthSubtitleWidth ?? 760}px`,
      "--fifth-subtitle-size": `${settings.fifthSubtitleSize ?? 18}px`,
      "--fifth-subtitle-line-height": settings.fifthSubtitleLineHeight ?? 1.45,
      "--fifth-subtitle-weight": settings.fifthSubtitleWeight ?? 400,
      "--fifth-subtitle-color": settings.fifthSubtitleColor ?? "#ffffff",
      "--fifth-card-width": `${settings.fifthCardWidth ?? 720}px`,
      "--fifth-card-height": `${settings.fifthCardHeight ?? 420}px`,
      "--fifth-card-aspect": settings.fifthCardAspect ?? 1.7,
      "--fifth-card-x": `${settings.fifthCardOffsetX ?? 0}px`,
      "--fifth-card-y": `${settings.fifthCardOffsetY ?? 0}px`,
      "--fifth-card-padding": `${settings.fifthCardPadding ?? 32}px`,
      "--fifth-card-radius": `${settings.fifthCardRadius ?? 34}px`,
      "--fifth-card-align-x": `${settings.fifthCardAlignX ?? 0}%`,
      "--fifth-image-display": (settings.fifthImageVisible ?? 1) > 0 ? "block" : "none",
      "--fifth-image-width": `${settings.fifthImageWidth ?? 560}px`,
      "--fifth-image-scale": settings.fifthImageScale ?? 1,
      "--fifth-image-x": `${settings.fifthImageOffsetX ?? 80}px`,
      "--fifth-image-y": `${settings.fifthImageOffsetY ?? 40}px`,
      "--fifth-image-rotate": `${settings.fifthImageRotate ?? -2}deg`,
      "--fifth-image-opacity": settings.fifthImageOpacity ?? 1,
      "--fifth-image-blur": `${settings.fifthImageBlur ?? 0}px`,
      "--fifth-image-brightness": settings.fifthImageBrightness ?? 1,
      "--fifth-image-contrast": settings.fifthImageContrast ?? 1,
      "--fifth-image-saturation": settings.fifthImageSaturation ?? 1,
      "--fifth-image-drop-shadow": settings.fifthImageDropShadow ?? 0,
      "--footer-block-top-gap": `${settings.footerBlockTopGap ?? 0}px`,
      "--footer-height": `${settings.footerHeight ?? 280}px`,
      "--footer-padding-x": `${settings.footerPaddingX ?? 64}px`,
      "--footer-padding-y": `${settings.footerPaddingY ?? 56}px`,
      "--footer-blocks-gap": `${settings.footerBlocksGap ?? settings.footerColumnGap ?? 80}px`,
      "--footer-brand-contacts-gap": `${settings.footerBrandToContactsGap ?? settings.footerBlocksGap ?? settings.footerColumnGap ?? 80}px`,
      "--footer-contacts-global-gap": `${settings.footerContactsToGlobalGap ?? settings.footerContactsToLinksGap ?? settings.footerBlocksGap ?? settings.footerColumnGap ?? 80}px`,
      "--footer-global-links-gap": `${settings.footerGlobalToLinksGap ?? settings.footerContactsToLinksGap ?? settings.footerBlocksGap ?? settings.footerColumnGap ?? 80}px`,
      "--footer-brand-x": `${settings.footerBrandOffsetX ?? 0}px`,
      "--footer-contacts-x": `${settings.footerContactsOffsetX ?? 0}px`,
      "--footer-global-x": `${settings.footerGlobalOffsetX ?? 0}px`,
      "--footer-links-x": `${settings.footerLinksOffsetX ?? 0}px`,
      "--footer-brand-items-gap": `${settings.footerBrandItemsGap ?? settings.footerTextGap ?? 24}px`,
      "--footer-brand-description-gap": `${settings.footerBrandToDescriptionGap ?? settings.footerBrandItemsGap ?? settings.footerTextGap ?? 24}px`,
      "--footer-description-copyright-gap": `${settings.footerDescriptionToCopyrightGap ?? settings.footerBrandItemsGap ?? settings.footerTextGap ?? 24}px`,
      "--footer-contacts-gap": `${settings.footerContactsGap ?? 0}px`,
      "--footer-global-items-gap": `${settings.footerGlobalItemsGap ?? 0}px`,
      "--footer-links-items-gap": `${settings.footerLinksItemsGap ?? settings.footerLinksGap ?? 8}px`,
      "--footer-brand-size": `${settings.footerBrandSize ?? 56}px`,
      "--footer-brand-weight": settings.footerBrandWeight ?? 400,
      "--footer-text-size": `${settings.footerTextSize ?? 30}px`,
      "--footer-text-line-height": settings.footerTextLineHeight ?? 1.35,
      "--footer-text-weight": settings.footerTextWeight ?? 400,
      "--footer-links-size": `${settings.footerLinksSize ?? 30}px`,
      "--footer-links-line-height": settings.footerLinksLineHeight ?? 1.35,
      "--footer-links-weight": settings.footerLinksWeight ?? 400,
      "--footer-text-color": settings.footerTextColor ?? "#dedede",
      "--footer-link-color": settings.footerLinkColor ?? "#dedede",
      "--footer-link-hover-color": settings.footerLinkHoverColor ?? "#16e33f",
      "--footer-link-pressed-color": settings.footerLinkPressedColor ?? "#ffffff",
      "--footer-link-underline-opacity": settings.footerLinkUnderlineOpacity ?? 0.85,
      "--footer-link-hover-underline-opacity": settings.footerLinkHoverUnderlineOpacity ?? 1,
      "--footer-link-pressed-scale": settings.footerLinkPressedScale ?? 0.97,
      "--footer-transition": `${settings.footerTransitionMs ?? 180}ms`,
      "--footer-glass-surface-color": settings.footerGlassSurfaceColor ?? settings.glassSurfaceColor ?? "#ffffff",
      "--footer-glass-opacity": settings.footerGlassOpacity ?? settings.glassOpacity ?? 0.06,
      "--footer-glass-blur": `${settings.footerGlassBlur ?? settings.glassBlur ?? 16}px`,
      "--footer-glass-frost": settings.footerGlassFrost ?? settings.glassFrost ?? 0.03,
      "--footer-glass-border-width": `${settings.footerGlassBorderWidth ?? settings.glassBorderWidth ?? 1.4}px`,
      "--footer-glass-border-color": settings.footerGlassBorderColor ?? settings.glassBorderColor ?? "#ffffff",
      "--footer-glass-border-opacity": settings.footerGlassBorderOpacity ?? settings.glassBorderOpacity ?? 0.45,
      "--footer-glass-glossiness": settings.footerGlassGlossiness ?? settings.glassGlossiness ?? 0.12,
      "--footer-glass-glossiness-angle": `${settings.footerGlassGlossinessAngle ?? settings.glassGlossinessAngle ?? 135}deg`,
      "--footer-glass-glossiness-color": settings.footerGlassGlossinessColor ?? settings.glassGlossinessColor ?? "#ffffff",
      "--footer-glass-veil-color": settings.figureOverlayColor ?? "#051409",
      "--footer-glass-veil-opacity": Math.min(0.36, Math.max(0.16, (settings.glassCardFill ?? 0.92) * 0.26)),
      "--footer-glass-surface-opacity": Math.min(0.10, Math.max(0.025, (settings.glassCardFill ?? 0.92) * 0.055)),
      "--footer-glass-effective-blur": `${Math.max(settings.footerGlassBlur ?? settings.glassCardBlur ?? settings.glassBlur ?? 4, settings.glassCardBlur ?? 5)}px`,
      "--nav-top": `${settings.navTop}px`,
      "--nav-x": `${settings.navX}px`,
      "--header-item-height": `${settings.headerItemHeight}px`,
      "--login-size": `${settings.loginSize}px`,
      "--login-weight": settings.loginWeight,
      "--login-color": settings.loginColor,
      "--login-text-transform": settings.loginUppercase > 0 ? "uppercase" : "none",
      "--brand-size": `${settings.brandSize}px`,
      "--brand-weight": settings.brandWeight,
      "--brand-color": settings.brandColor,
      "--brand-gap": `${settings.brandGap}px`,
      "--brand-letter-spacing": `${settings.brandLetterSpacing ?? 0}px`,
      "--brand-opacity": settings.brandOpacity ?? 1,
      "--brand-offset-x": `${settings.brandOffsetX ?? 0}px`,
      "--brand-offset-y": `${settings.brandOffsetY ?? 0}px`,
      "--brand-mark-size": `${settings.brandMarkSize ?? settings.headerItemHeight ?? 48}px`,
      "--brand-mark-dot-scale": settings.brandMarkDotScale ?? 0.35,
      "--brand-mark-dot-color": settings.brandMarkDotColor ?? "#ffffff",
      "--figure-overlay-color": settings.figureOverlayColor,
      "--figure-overlay-opacity": settings.figureOverlayOpacity,
    };

    if (settings.bgType === "solid") {
      return {
        ...layoutStyle,
        "--woven-bg": settings.bgSolid,
        "--woven-bg-opacity": 1,
      };
    }

    return {
      ...layoutStyle,
      "--woven-bg": `linear-gradient(${settings.bgAngle}deg, ${settings.bgStart} 0%, ${settings.bgMiddle} 45%, ${settings.bgEnd} 100%)`,
      "--woven-bg-opacity": settings.bgOpacity,
    };
  }, [settings]);

  const canvasSettings = useMemo(
    () => ({
      particleCount: settings.particleCount,
      shapeType: settings.shapeType,
      shapeScale: settings.shapeScale,
      shapeTwist: settings.shapeTwist,
      tubeRadius: settings.tubeRadius,
      pointSize: settings.pointSize,
      opacity: settings.opacity,
      dotCore: settings.dotCore,
      dotSoftness: settings.dotSoftness,
      nearDotBlur: settings.nearDotBlur,
      nearBlurStart: settings.nearBlurStart,
      nearBlurEnd: settings.nearBlurEnd,
      dotStart: settings.dotStart,
      dotMiddle: settings.dotMiddle,
      dotEnd: settings.dotEnd,
      rotationSpeed: settings.rotationSpeed,
      interactionRadius: settings.interactionRadius,
      interactionForce: settings.interactionForce,
      returnForce: settings.returnForce,
      damping: settings.damping,
      wobble: settings.wobble,
      depthPulse: settings.depthPulse,
      cameraZ: settings.cameraZ,
      shapeOffsetY: settings.shapeOffsetY,
    }),
    [
      settings.particleCount,
      settings.shapeType,
      settings.shapeScale,
      settings.shapeTwist,
      settings.tubeRadius,
      settings.pointSize,
      settings.opacity,
      settings.dotCore,
      settings.dotSoftness,
      settings.nearDotBlur,
      settings.nearBlurStart,
      settings.nearBlurEnd,
      settings.dotStart,
      settings.dotMiddle,
      settings.dotEnd,
      settings.rotationSpeed,
      settings.interactionRadius,
      settings.interactionForce,
      settings.returnForce,
      settings.damping,
      settings.wobble,
      settings.depthPulse,
      settings.cameraZ,
      settings.shapeOffsetY,
    ],
  );

  const updateSetting = (key, value) => {
    setSettings((current) => {
      const next = { ...current, [key]: value };
      const benefitsCardSizeMatch = key.match(/^benefitsCard(?:s|\d+)(Width|Height)$/);
      const thirdCardHeightMatch = key.match(/^thirdCard(\d+)Height$/);

      if (key === "thirdHeadlineSize") {
        next.thirdHeadlineFirstSize = value;
        next.thirdHeadlineSecondSize = value;
      }

      if (benefitsCardSizeMatch) {
        const dimension = benefitsCardSizeMatch[1];
        next[`benefitsCards${dimension}`] = value;
        for (let cardNumber = 1; cardNumber <= 5; cardNumber += 1) {
          next[`benefitsCard${cardNumber}${dimension}`] = value;
        }
      }

      if (thirdCardHeightMatch) {
        const cardNumber = Number(thirdCardHeightMatch[1]);
        getThirdCardRowNumbers(current, cardNumber).forEach((rowCardNumber) => {
          next[`thirdCard${rowCardNumber}Height`] = value;
        });
      }

      return next;
    });
  };

  const savePreset = () => {
    const name = window.prompt("Preset name");
    if (!name) return;

    const nextPresets = [
      { id: crypto.randomUUID(), name, settings },
      ...presets,
    ].slice(0, 12);

    setPresets(nextPresets);
    persistPresets(nextPresets);
  };

  const deletePreset = (id) => {
    const nextPresets = presets.filter((preset) => preset.id !== id);
    setPresets(nextPresets);
    persistPresets(nextPresets);
  };

  const scrollToFourthBlock = () => smoothScrollToCenteredElement("#early-access");
  const scrollToFifthBlock = () => smoothScrollToCenteredElement("#see-thisbank");

  return (
    <div className="woven-light-page" style={backgroundStyle}>
      <svg className="liquid-glass-filter" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="glass-blur"
            x="0"
            y="0"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.007"
              numOctaves="1"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="200"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <WovenCanvas settings={canvasSettings} />
      <div className="figure-readability-layer" aria-hidden="true" />
      <main className="woven-light-hero" aria-label="Woven light animation">
        <MarketingOverlay settings={settings} onRequestAccess={scrollToFourthBlock} onLearnMore={scrollToFifthBlock} />
      </main>
      <BenefitsSection settings={settings} />
      <ThirdCardsSection settings={settings} onRequestAccess={scrollToFourthBlock} />
      <FourthInputSection settings={settings} />
      <FifthContentSection settings={settings} />
      <FooterSection />
      {SHOW_SHADER_CONTROLS && (
        isPanelOpen ? (
          <ShaderControls
            settings={settings}
            presets={presets}
            onChange={updateSetting}
            onReset={() => setSettings(defaultSettings)}
            onSavePreset={savePreset}
            onLoadPreset={(preset) =>
              setSettings(normalizePresetSettings(preset.settings))
            }
            onDeletePreset={deletePreset}
            onCollapse={() => setIsPanelOpen(false)}
          />
        ) : (
          <button
            className="shader-panel-toggle"
            type="button"
            onClick={() => setIsPanelOpen(true)}
            aria-label="Open shader controls"
            title="Open shader controls"
          >
            Controls
          </button>
        )
      )}
    </div>
  );
};

const MarketingOverlay = ({ settings, onRequestAccess, onLearnMore }) => (
  <section className="marketing-overlay" aria-label="ThisBank banking hero">
    <header className="marketing-nav">
      <a className="marketing-brand" href="/" aria-label="ThisBank home">
        <span className="marketing-brand__mark liquid-glass" />
        <span>ThisBank</span>
      </a>
      <div className="marketing-actions">
        <a
          className="marketing-login liquid-glass"
          href="#see-thisbank"
          onClick={(event) => {
            event.preventDefault();
            onLearnMore?.();
          }}
        >
          Learn More
        </a>
      </div>
    </header>

    <div className="marketing-hero">
      <h1>
        <span className="marketing-title-line marketing-title-line--sans">Netless banking.</span>
        <span className="marketing-title-line marketing-title-line--italic">A borderless financial life</span>
      </h1>
      <p>
        <span className="marketing-subtitle-line">One platform for banking, payments, assets, crypto, and&nbsp;credit</span>
      </p>
      <div className="marketing-buttons" aria-label="Hero actions">
        <ButtonUi settings={settings} onClick={onRequestAccess} />
      </div>
    </div>
  </section>
);

const LegacyBenefitsSection = () => (
  <section className="next-content-block" aria-label="Platform benefits preview">
    <div className="benefits-left">
      <div className="benefits-tags" aria-label="Financial platform capabilities">
        <span className="benefits-tag benefits-tag--icon liquid-glass" aria-hidden="true">↗</span>
        {[
          "Google Pay",
          "Bill management",
          "Asset management",
          "Ultimate payment card",
          "Apple Pay",
          "Crypto exchange",
        ].map((tag) => (
          <span className="benefits-tag liquid-glass" key={tag}>{tag}</span>
        ))}
      </div>
      <div className="benefits-copy">
        <span>One platform</span>
        <span>Every financial layer</span>
      </div>
    </div>
    <div className="benefits-grid" aria-hidden="true">
      {[
        "benefit-card--hero",
        "benefit-card--tall benefit-card--left",
        "benefit-card--tall benefit-card--right",
        "benefit-card--wide-bottom",
        "benefit-card--small-bottom",
      ].map((className) => (
        <article className={`benefit-card liquid-glass ${className}`} key={className}>
          <span className="benefit-card__distortion" />
          <span className="benefit-card__tint" />
          <span className="benefit-card__edge" />
        </article>
      ))}
    </div>
  </section>
);

const benefitCards = [
  {
    className: "benefit-card--hero",
    tags: ["Premium plans", "Bill management", "Corporate accounts"],
    title: "Accounts for daily banking",
    body:
      "Current accounts, bill management, premium plans, corporate accounts, and\u00a0electronic invoicing in one banking ecosystem",
  },
  {
    className: "benefit-card--left",
    tags: ["Apple Pay", "Google Pay", "NFC"],
    title: "Global payment card",
    body:
      "Spend fiat and\u00a0crypto with the ThisBank payment card, with contactless payments, NFC technology, Apple Pay, and\u00a0Google Pay",
  },
  {
    className: "benefit-card--right",
    tags: ["Mobile payments", "Transfer payments"],
    title: "Payments across channels",
    body:
      "Manage payment cards, transfer payments, mobile payments, Apple Pay, Google Pay, and\u00a0smart contracts from one platform",
  },
  {
    className: "benefit-card--wide-bottom",
    tags: ["Funds and\u00a0investments", "Real estate"],
    title: "Asset management in one place",
    body:
      "Access funds and\u00a0investments, real estate, commodities, and\u00a0valuations through the ThisBank asset management layer",
  },
  {
    className: "benefit-card--small-bottom",
    tags: ["Wallet", "Exchange"],
    title: "Crypto & Credit",
    body:
      "Use crypto exchange, crypto credit, crypto wallet, and\u00a0regular credit as part of\u00a0the wider ThisBank financial ecosystem",
  },
];

const BenefitCard = ({ card, settings, cardNumber }) => (
  <article
    className={`benefit-card liquid-glass ${card.className}`}
    style={{
      "--benefits-card-width": `${settings?.benefitsCardsWidth ?? settings?.[`benefitsCard${cardNumber}Width`] ?? 100}%`,
      "--benefits-card-height": `${settings?.benefitsCardsHeight ?? settings?.[`benefitsCard${cardNumber}Height`] ?? 100}%`,
    }}
  >
    <div className="benefit-card__chips" aria-label={`${card.title} capabilities`}>
      {card.tags.map((tag) => (
        <span className="benefit-card__chip" key={tag}>{tag}</span>
      ))}
    </div>
    <div className="benefit-card__copy">
      <h3>{card.title}</h3>
      <p>{card.body}</p>
    </div>
  </article>
);

const BenefitsImages = ({ images }) => {
  return (
    <div className="benefits-card-images" aria-hidden="true">
      {images.map((src, index) => (
        <img
          className="benefits-card-image"
          src={src}
          alt=""
          key={`${src.slice(0, 48)}-${index}`}
          style={{
            "--benefits-image-stack-x": `${index * 28}px`,
            "--benefits-image-stack-y": `${index * 10}px`,
            "--benefits-image-stack-rotate": `${index * 3}deg`,
          }}
        />
      ))}
    </div>
  );
};

const BenefitsSection = ({ settings }) => {
  return (
    <section className="next-content-block" aria-label="Platform benefits preview">
      <article className="benefits-left liquid-glass">
        <div className="benefits-copy">
          <span>All financial layers.</span>
          <span>One platform</span>
        </div>
        <BenefitsImages images={settings.benefitsImages ?? []} />
      </article>
      <div className="benefits-grid">
        <BenefitCard card={benefitCards[0]} cardNumber={1} settings={settings} />
        <div className="benefits-card-row benefits-card-row--middle">
          <BenefitCard card={benefitCards[1]} cardNumber={2} settings={settings} />
          <BenefitCard card={benefitCards[2]} cardNumber={3} settings={settings} />
        </div>
        <div className="benefits-card-row benefits-card-row--bottom">
          <BenefitCard card={benefitCards[3]} cardNumber={4} settings={settings} />
          <BenefitCard card={benefitCards[4]} cardNumber={5} settings={settings} />
        </div>
      </div>
    </section>
  );
};

const thirdCards = [
  {
    title: "Global users",
    buttonLabel: "Request early access",
    body: "For people who live, work, travel, and\u00a0manage money across countries, currencies, cards, and\u00a0digital assets",
    items: [
      "Current accounts",
      "Bill management",
      "Payment cards",
      "Apple Pay",
      "Google Pay",
      "Crypto wallet",
      "Funds and\u00a0investments",
    ],
  },
  {
    title: "Small businesses",
    buttonLabel: "Request early access",
    body: "For teams that need one place to manage business accounts, company payments, cards, invoicing, and\u00a0financial operations",
    items: [
      "Corporate accounts",
      "Electronic invoicing",
      "Transfer payments",
      "Payment cards",
      "Bill management",
      "Smart contracts",
    ],
  },
  {
    title: "Early investors",
    buttonLabel: "Investor access",
    body: "For investors interested in ThisBank\u2019s growth story, Series A opportunity, share price development, and global financial ecosystem",
    items: [
      "Series A opportunity",
      "Share price development",
      "Global product vision",
      "Payment ecosystem",
      "Asset management layer",
      "Strategic partnerships",
    ],
  },
  {
    title: "Flexible modules",
    body: "Add more cards when the section needs extra product layers or supporting content.",
  },
  {
    title: "Responsive rhythm",
    body: "Gaps, heights, and\u00a0widths stay proportional as the page width changes.",
  },
  {
    title: "Glass system",
    body: "Cards inherit the same matte glass controls used across the current site.",
  },
  {
    title: "Content slots",
    body: "Use these cards for integrations, metrics, benefits, workflows, or financial products.",
  },
  {
    title: "Layout sandbox",
    body: "A quick place to test composition before filling the cards with final content.",
  },
];

const getThirdCardCount = (settings) =>
  Math.min(8, Math.max(3, Math.round(settings.thirdCardCount ?? 3)));

const getThirdCardRowNumbers = (settings, targetCardNumber) => {
  const count = getThirdCardCount(settings);
  const rows = [];
  let currentRow = [];
  let currentWidth = 0;

  for (let cardNumber = 1; cardNumber <= count; cardNumber += 1) {
    const width = settings[`thirdCard${cardNumber}Width`] ?? defaultSettings[`thirdCard${cardNumber}Width`] ?? 33.33;

    if (currentRow.length > 0 && currentWidth + width > 100.01) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }

    currentRow.push(cardNumber);
    currentWidth += width;
  }

  if (currentRow.length > 0) rows.push(currentRow);

  return rows.find((row) => row.includes(targetCardNumber)) ?? [targetCardNumber];
};

const ThirdCardsSection = ({ settings, onRequestAccess }) => {
  const count = getThirdCardCount(settings);

  return (
    <section className="third-content-block" aria-label="Additional platform cards">
      <div className="third-block-copy">
        <div className="third-block-headline" aria-label="ThisBank is built for">
          <span>ThisBank is built for</span>
        </div>
        <p
          className="third-block-subtitle"
          style={{
            "--third-subtitle-width": `${settings.thirdSubtitleWidth ?? 760}px`,
            width: `${settings.thirdSubtitleWidth ?? 760}px`,
            maxWidth: "100%",
          }}
        >
          ThisBank connects personal banking, business finance, and&nbsp;early investment opportunities in one financial ecosystem designed for a world without borders
        </p>
      </div>
      <div className="third-cards-grid">
        {thirdCards.slice(0, count).map((card, index) => {
          const cardNumber = index + 1;
          const buttonLabel = card.buttonLabel ?? "Start a Project";

          return (
            <article
              className="third-card liquid-glass"
              key={card.title}
              style={{
                "--third-card-basis": `${settings[`thirdCard${cardNumber}Width`] ?? 33.33}%`,
                "--third-card-min-height": `${settings[`thirdCard${cardNumber}Height`] ?? 320}px`,
              }}
            >
              <div className="third-card__copy">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                {card.items?.length ? (
                  <ul className="third-card__list">
                    {card.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="third-card__button-row">
                <CnippetButton className="third-card__project-button" onClick={onRequestAccess}>{buttonLabel}</CnippetButton>
                <CnippetButton className="third-card__project-icon" aria-label={buttonLabel} size="icon-lg" onClick={onRequestAccess}>
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                    <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </CnippetButton>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export function GlowingInput({
  placeholder = "Enter your email",
  onSubmit,
  settings = {},
}) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const typingTimer = useRef(null);

  const canSubmit = value.trim().length > 0 && submitStatus !== "sending";
  const popupStyle = {
    "--popup-veil-color": settings.popupVeilColor ?? "#000000",
    "--popup-veil-opacity": settings.popupVeilOpacity ?? 0.68,
    "--popup-veil-blur": `${settings.popupVeilBlur ?? 0}px`,
    "--popup-width": `${settings.popupWidth ?? 860}px`,
    "--popup-height": `${settings.popupHeight ?? 640}px`,
    "--popup-x": `${settings.popupOffsetX ?? 0}px`,
    "--popup-y": `${settings.popupOffsetY ?? 0}px`,
    "--popup-padding-x": `${settings.popupPaddingX ?? 72}px`,
    "--popup-padding-y": `${settings.popupPaddingY ?? 80}px`,
    "--popup-background": settings.popupBackground ?? "#a9a9a9",
    "--popup-radius": `${settings.popupRadius ?? 72}px`,
    "--popup-text-y": `${settings.popupTextOffsetY ?? 0}px`,
    "--popup-title-size": `${settings.popupTitleSize ?? 72}px`,
    "--popup-title-line-height": settings.popupTitleLineHeight ?? 1.05,
    "--popup-title-weight": settings.popupTitleWeight ?? 400,
    "--popup-title-color": settings.popupTitleColor ?? "#111111",
    "--popup-subtitle-gap": `${settings.popupSubtitleGap ?? 44}px`,
    "--popup-subtitle-size": `${settings.popupSubtitleSize ?? 34}px`,
    "--popup-subtitle-line-height": settings.popupSubtitleLineHeight ?? 1.38,
    "--popup-subtitle-weight": settings.popupSubtitleWeight ?? 400,
    "--popup-subtitle-color": settings.popupSubtitleColor ?? "#111111",
    "--popup-button-inset-x": `${settings.popupButtonInsetX ?? 64}px`,
    "--popup-button-y": `${settings.popupButtonY ?? 420}px`,
    "--popup-button-color": settings.popupButtonColor ?? "#ddff9c",
    "--third-button-height": `${settings.thirdButtonHeight ?? 66}px`,
    "--third-button-padding-x": `${settings.thirdButtonPaddingX ?? 38}px`,
    "--third-button-padding-y": `${settings.thirdButtonPaddingY ?? 0}px`,
    "--third-button-radius": `${settings.thirdButtonRadius ?? 999}px`,
    "--third-button-gap": `${settings.thirdButtonGap ?? -1}px`,
    "--third-button-border-width": `${settings.thirdButtonBorderWidth ?? 1}px`,
    "--third-button-text-color": settings.thirdButtonTextColor ?? "#071009",
    "--third-button-text-size": `${settings.thirdButtonTextSize ?? 20}px`,
    "--third-button-text-weight": settings.thirdButtonTextWeight ?? 400,
    "--third-button-text-transform": (settings.thirdButtonTextUppercase ?? 0) > 0 ? "uppercase" : "none",
    "--third-button-text-tracking": `${settings.thirdButtonTextTracking ?? 0}px`,
    "--third-button-icon-scale": settings.thirdButtonIconScale ?? 0.94,
    "--third-button-arrow-size": `${settings.thirdButtonArrowSize ?? 22}px`,
    "--third-button-arrow-stroke": settings.thirdButtonArrowStroke ?? 2,
    "--third-button-arrow-offset-x": `${settings.thirdButtonArrowOffsetX ?? 0}px`,
    "--third-button-arrow-offset-y": `${settings.thirdButtonArrowOffsetY ?? 0}px`,
    "--third-button-hover-scale": settings.thirdButtonHoverScale ?? 1,
    "--third-button-hover-button-scale": settings.thirdButtonHoverButtonScale ?? 1.06,
    "--third-button-pressed-scale": settings.thirdButtonPressedScale ?? 0.98,
    "--third-button-transition": `${settings.thirdButtonTransitionMs ?? 180}ms`,
  };
  useEffect(() => {
    if (!isPopupOpen || typeof document === "undefined") return;

    const { body, documentElement } = document;
    const scrollY = window.scrollY || documentElement.scrollTop || 0;
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const previousHtmlOverflow = documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    documentElement.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.left = previousBodyStyles.left;
      body.style.right = previousBodyStyles.right;
      body.style.width = previousBodyStyles.width;
      body.style.overflow = previousBodyStyles.overflow;
      body.style.paddingRight = previousBodyStyles.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isPopupOpen]);

  const popupLayer = isPopupOpen
    ? createPortal(
        <div className="waitlist-popup-layer" role="presentation" style={popupStyle}>
          <div
            className="waitlist-popup-veil"
            aria-hidden="true"
          />
          <motion.div
            className="waitlist-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-popup-title"
            aria-describedby="waitlist-popup-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="waitlist-popup__copy">
              <h3 id="waitlist-popup-title">You&rsquo;re on the list</h3>
              <p id="waitlist-popup-subtitle">
                Thanks for your interest in ThisBank. We&rsquo;ll contact you with early access details or relevant investment information
              </p>
            </div>
            <div className="waitlist-popup__button-row">
              <CnippetButton className="waitlist-popup__button" onClick={() => setIsPopupOpen(false)}>
                Got it
              </CnippetButton>
              <CnippetButton className="waitlist-popup__button-icon" aria-label="Got it" size="icon-lg" onClick={() => setIsPopupOpen(false)}>
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </CnippetButton>
            </div>
          </motion.div>
        </div>,
        document.body,
      )
    : null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const submittedValue = value.trim();
    const payload = new FormData();

    payload.append("message", submittedValue);
    payload.append("_subject", "New early access request");
    payload.append("_template", "table");
    payload.append("_captcha", "false");

    setSubmitStatus("sending");

    try {
      const response = await fetch(EARLY_ACCESS_EMAIL_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });

      if (!response.ok) throw new Error("Unable to send message.");

      onSubmit?.(submittedValue);
      setValue("");
      setSubmitStatus("sent");
      setIsPopupOpen(true);
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    }
  };

  // cleanup any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen grid place-items-center bg-black text-white">
      <div className="fourth-glowing-input-root relative">
        {/* LEFT light trail */}
        <motion.div
          aria-hidden
          className="absolute -left-80 top-1/2 -translate-y-1/2 w-80 h-16 blur-2xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(251,146,60,0.70), rgba(251,146,60,0.18), rgba(0,0,0,0))",
          }}
          animate={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />

        {/* RIGHT light trail */}
        <motion.div
          aria-hidden
          className="absolute -right-80 top-1/2 -translate-y-1/2 w-80 h-16 blur-2xl"
          style={{
            background:
              "linear-gradient(270deg, rgba(251,146,60,0.70), rgba(251,146,60,0.18), rgba(0,0,0,0))",
          }}
          animate={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.05 }}
        />

        <BorderGlow
          className="hero-border-glow-button fourth-input-border-glow"
          edgeSensitivity={settings.borderButtonEdgeSensitivity ?? 30}
          glowColor={getBorderGlowHsl(settings)}
          backgroundColor={settings.borderButtonBackground ?? "#120F17"}
          borderRadius={999}
          borderWidth={settings.fourthInputBorderWidth ?? 1}
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
          {/* PILL / PROMPT BAR */}
          <motion.div
            className="group relative flex items-center w-[760px] max-w-[92vw] px-5 py-3 md:px-6 md:py-4 rounded-full bg-gradient-to-r from-slate-950 to-slate-900 shadow-[0_0_100px_-25px_rgba(251,146,60,0.65)] transition-shadow"
            initial={{ boxShadow: "0 0 80px -30px rgba(251,146,60,0.55)" }}
            animate={{
              boxShadow: "0 0 0 rgba(251,146,60,0)",
            }}
          >
            {/* left icon chip */}
            <motion.div
              className="mr-3 grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10"
              animate={{
                scale: isFocused ? 1.05 : 1,
                filter: isFocused ? "drop-shadow(0 0 10px rgba(251,146,60,0.7))" : "none",
              }}
            >
              <Mail className="h-5 w-5 text-amber-300" />
            </motion.div>

            {/* Accessible label for screen readers */}
            <label htmlFor="ai-prompt" className="sr-only">
              Prompt
            </label>

            {/* INPUT (you can type here) */}
            <input
              id="ai-prompt"
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (submitStatus !== "idle") setSubmitStatus("idle");
                setIsTyping(true);
                if (typingTimer.current) window.clearTimeout(typingTimer.current);
                typingTimer.current = window.setTimeout(() => setIsTyping(false), 700);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder={
                submitStatus === "sent"
                  ? "Sent successfully"
                  : submitStatus === "error"
                    ? "Could not send, try again"
                    : placeholder
              }
              className="flex-1 bg-transparent placeholder-slate-300/70 text-slate-100 outline-none text-lg md:text-xl caret-amber-300/90"
              autoComplete="off"
              spellCheck={false}
            />

            {/* action button */}
            <motion.button
              type="button"
              aria-label={submitStatus === "sending" ? "Sending" : "Send"}
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="fourth-input-submit relative cursor-pointer grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-black shadow-lg ring-4 ring-amber-400/20 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: canSubmit ? 1.06 : 1 }}
              whileTap={{ scale: canSubmit ? 0.96 : 1 }}
              animate={{
                boxShadow: "0 0 0 rgba(251,146,60,0)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              {/* The arrow matches the icon button style in block 3. */}
              <motion.span
                className="grid"
              >
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </motion.span>
              {/* bright rim */}
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/30" />
            </motion.button>

            {/* end hot-spots (bright cores) */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-amber-400/90 blur-xl"
              animate={{ opacity: 0 }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-amber-400/90 blur-xl"
              animate={{ opacity: 0 }}
            />
          </motion.div>
        </BorderGlow>
      </div>
      {popupLayer}
    </div>
  );
}

const FourthInputSection = ({ settings }) => (
  <section className="fourth-content-block" id="early-access" aria-label="Prompt input preview">
    <div className="fourth-block-copy">
      <h2 className="fourth-block-headline" aria-label="Early access">
        <span>Early access</span>
      </h2>
      <p className="fourth-block-subtitle">
        Join the early access list for personal banking, business services, and&nbsp;investment opportunities
      </p>
    </div>
    <div className="fourth-input-wrap">
      <GlowingInput settings={settings} />
    </div>
  </section>
);

const FifthImages = ({ images }) => {
  const imageSources = images.length > 0 ? images : [fifthBlockCardImage];

  return (
    <div className="fifth-card-images" aria-hidden="true">
      {imageSources.map((src, index) => (
        <img
          className="fifth-card-image"
          src={src}
          alt=""
          key={`${src.slice(0, 48)}-${index}`}
          style={{
            "--fifth-image-stack-x": `${index * 24}px`,
            "--fifth-image-stack-y": `${index * 10}px`,
            "--fifth-image-stack-rotate": `${index * 2}deg`,
          }}
        />
      ))}
    </div>
  );
};

const FifthContentSection = ({ settings }) => (
  <section className="fifth-content-block" id="see-thisbank" aria-label="Fifth content preview">
    <div className="fifth-block-group">
      <div className="fifth-block-copy">
        <h2 className="fifth-block-headline" aria-label="See ThisBank in motion">
          <span>See ThisBank</span>
          <span>In motion</span>
        </h2>
        <p className="fifth-block-subtitle">
          A short walkthrough of&nbsp;one platform for banking, payments, cards, assets, crypto, and&nbsp;credit
        </p>
      </div>
      <article className="fifth-card liquid-glass">
        <FifthImages images={settings.fifthImages ?? []} />
      </article>
    </div>
  </section>
);

const footerLinks = [
  ["Facebook", "https://www.facebook.com/thisbank.co.uk/"],
  ["LinkedIn", "https://www.linkedin.com/company/thisbank/?originalSubdomain=uk"],
  ["ThisBank", "https://thisbank.co.uk/"],
];

const FooterSection = () => (
  <footer className="site-footer liquid-glass" aria-label="ThisBank footer">
    <div className="site-footer__inner">
      <strong className="site-footer__brand">ThisBank</strong>
      <div className="site-footer__text-group">
        <div className="site-footer__brand-copy">
          <p className="site-footer__description">Borderless banking for people, companies,<br />and early investors</p>
          <p className="site-footer__copyright">&copy; 2026 ThisBank Ltd, All rights reserved</p>
        </div>
        <address className="site-footer__contacts">
          <span>+358 (0) 36 6000 900</span>
          <span>+33 6 80 26 09 10</span>
          <span>john@thisbank.com</span>
        </address>
        <nav className="site-footer__links" aria-label="Social links">
          {footerLinks.map(([label, href]) => (
            <a href={href} key={label} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </nav>
        <div className="site-footer__global" aria-label="Global reach">
          <strong>Global reach:</strong>
          <span>Europe</span>
          <span>Americas</span>
          <span>Africa</span>
          <span>Asia</span>
          <span>GCC</span>
        </div>
      </div>
    </div>
  </footer>
);

const getFontStack = (font) => {
  const fonts = {
    bodoni: '"Bodoni Moda", "Bodoni 72", Didot, Georgia, serif',
    titan: '"Titan One", "Arial Black", Impact, sans-serif',
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    serif: 'Georgia, "Times New Roman", Times, serif',
    display: '"Bodoni 72", Didot, Georgia, serif',
    mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  };

  return fonts[font] ?? fonts.serif;
};

const getFourthHeadlineFontStack = (font) => {
  if (font === "sans") {
    return 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  }

  return '"Playfair Display", "Bodoni Moda", "Bodoni 72", Didot, Georgia, serif';
};

const ShaderControls = ({
  settings,
  presets,
  onChange,
  onReset,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  onCollapse,
}) => {
  const [activeTab, setActiveTab] = useState("scene");
  const renderRangeControls = (items) =>
    items.map((control) => (
      <RangeControl
        control={control}
        key={control.key}
        value={settings[control.key]}
        onChange={onChange}
      />
    ));

  const handleBenefitImagesUpload = async (event) => {
    const files = Array.from(event.currentTarget.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length === 0) return;

    const readFile = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const uploadedImages = await Promise.all(files.map(readFile));
    Object.entries(neutralBenefitsImageSettings).forEach(([key, value]) => {
      onChange(key, value);
    });
    onChange("benefitsImages", [
      ...(Array.isArray(settings.benefitsImages) ? settings.benefitsImages : []),
      ...uploadedImages,
    ]);
    event.currentTarget.value = "";
  };

  const handleFifthImagesUpload = async (event) => {
    const files = Array.from(event.currentTarget.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length === 0) return;

    const readFile = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const uploadedImages = await Promise.all(files.map(readFile));
    onChange("fifthImages", [
      ...(Array.isArray(settings.fifthImages) ? settings.fifthImages : []),
      ...uploadedImages,
    ]);
    event.currentTarget.value = "";
  };

  return (
    <aside className="shader-panel">
      <div className="shader-panel__header">
        <h2>Shader</h2>
        <div className="shader-panel__header-actions">
          <button type="button" onClick={onReset}>
            Reset
          </button>
          <button
            className="shader-panel__collapse"
            type="button"
            onClick={onCollapse}
            aria-label="Collapse shader controls"
            title="Collapse shader controls"
          >
            v
          </button>
        </div>
      </div>

      <div className="shader-tabs" role="tablist" aria-label="Shader settings sections">
        {[
          ["scene", "Figure"],
          ["text", "Hero"],
          ["second", "Block 2"],
          ["third", "Block 3"],
          ["fourth", "Block 4"],
          ["fifth", "Block 5"],
          ["footer", "Footer"],
          ["button", "Button"],
          ["glass", "Glass"],
          ["background", "Background"],
          ["presets", "Presets"],
        ].map(([id, label]) => (
          <button
            className={activeTab === id ? "shader-tab shader-tab--active" : "shader-tab"}
            type="button"
            key={id}
            onClick={() => setActiveTab(id)}
            role="tab"
            aria-selected={activeTab === id}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "scene" && (
        <div className="shader-panel__section">
          <ControlGroup title="Shape and scale">
            <label className="shader-control">
              <span>Shape</span>
              <select
                value={settings.shapeType}
                onChange={(event) => onChange("shapeType", event.currentTarget.value)}
              >
                <option value="knot">Torus knot</option>
                <option value="torus">Torus</option>
                <option value="sphere">Sphere</option>
                <option value="heart">Heart</option>
                <option value="spiral">Spiral</option>
                <option value="wave">Wave grid</option>
              </select>
            </label>
            {renderRangeControls(pickControls(sceneControls, ["shapeScale", "shapeTwist", "tubeRadius", "cameraZ", "shapeOffsetY"]))}
          </ControlGroup>
          <ControlGroup title="Particles and color">
            {renderRangeControls(pickControls(sceneControls, ["particleCount", "pointSize", "opacity", "dotCore", "dotSoftness"]))}
            <div className="shader-panel__grid">
              <ColorControl label="Dot start" value={settings.dotStart} onChange={(value) => onChange("dotStart", value)} />
              <ColorControl label="Dot middle" value={settings.dotMiddle} onChange={(value) => onChange("dotMiddle", value)} />
              <ColorControl label="Dot end" value={settings.dotEnd} onChange={(value) => onChange("dotEnd", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Motion and cursor" defaultOpen={false}>
            {renderRangeControls(pickControls(sceneControls, ["rotationSpeed", "wobble", "depthPulse", "interactionRadius", "interactionForce", "returnForce", "damping"]))}
          </ControlGroup>
          <ControlGroup title="Depth blur" defaultOpen={false}>
            {renderRangeControls(pickControls(sceneControls, ["nearDotBlur", "nearBlurStart", "nearBlurEnd"]))}
          </ControlGroup>
        </div>
      )}

      {activeTab === "text" && (
        <div className="shader-panel__section">
          <ControlGroup title="Hero layout">
            {renderRangeControls(heroLayoutControls)}
          </ControlGroup>
          <ControlGroup title="Title">
            <label className="shader-control">
              <span>Title font</span>
              <select
                value={settings.titleFont}
                onChange={(event) => onChange("titleFont", event.currentTarget.value)}
              >
                <option value="bodoni">Bodoni Moda</option>
                <option value="serif">Serif</option>
                <option value="titan">Titan One</option>
                <option value="display">Display serif</option>
                <option value="sans">Sans</option>
                <option value="mono">Mono</option>
              </select>
            </label>
            {renderRangeControls(titleTextControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Title first line" value={settings.titleColor} onChange={(value) => onChange("titleColor", value)} />
              <ColorControl label="Title second line" value={settings.titleSecondColor} onChange={(value) => onChange("titleSecondColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Subtitle">
            {renderRangeControls(subtitleTextControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Subtitle color" value={settings.subtitleColor} onChange={(value) => onChange("subtitleColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Header position" defaultOpen={false}>
            {renderRangeControls(headerLayoutControls)}
          </ControlGroup>
          <ControlGroup title="Logo" defaultOpen={false}>
            {renderRangeControls(logoTextControls)}
            {renderRangeControls(logoMarkControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Logo color" value={settings.brandColor} onChange={(value) => onChange("brandColor", value)} />
              <ColorControl label="Mark dot" value={settings.brandMarkDotColor ?? "#ffffff"} onChange={(value) => onChange("brandMarkDotColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Log in" defaultOpen={false}>
            {renderRangeControls(loginTextControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Log in color" value={settings.loginColor} onChange={(value) => onChange("loginColor", value)} />
            </div>
          </ControlGroup>
        </div>
      )}

      {activeTab === "second" && (
        <div className="shader-panel__section">
          <ControlGroup title="Block layout">
            {renderRangeControls(benefitsBlockControls)}
          </ControlGroup>
          <ControlGroup title="Headline">
            {renderRangeControls(pickControls(benefitsTextControls, ["benefitsHeadlineInsetX", "benefitsHeadlineInsetY", "benefitsHeadlineWidth", "benefitsTextSize", "benefitsTextLineHeight"]))}
            <div className="shader-panel__grid">
              <ColorControl label="First line" value={settings.benefitsTextColor} onChange={(value) => onChange("benefitsTextColor", value)} />
              <ColorControl label="Second line" value={settings.benefitsTextSecondColor} onChange={(value) => onChange("benefitsTextSecondColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Card layout" defaultOpen={false}>
            {renderRangeControls(pickControls(benefitsTextControls, ["benefitsLeadWidth", "benefitsLeadHeight", "benefitsTopCardHeight", "benefitsMiddleRowHeight", "benefitsMiddleLeftWidth", "benefitsBottomLeftWidth", "benefitsMainGap", "benefitsCardGap"]))}
            {renderRangeControls(benefitsCardSizeControls)}
          </ControlGroup>
          <ControlGroup title="Card text and chips" defaultOpen={false}>
            {renderRangeControls(pickControls(benefitsTextControls, ["benefitsSmallTextInsetX", "benefitsCardTitleWidth", "benefitsCardSubtitleWidth", "benefitsSmallTitleSize", "benefitsSmallBodySize", "benefitsSmallTitleWeight", "benefitsSmallBodyWeight", "benefitsCardPadding", "benefitsChipHeight", "benefitsChipPaddingX", "benefitsChipPaddingY", "benefitsChipTextSize", "benefitsChipBorderWidth", "benefitsChipGap", "benefitsChipsOffsetY"]))}
            <div className="shader-panel__grid">
              <ColorControl label="Card title" value={settings.benefitsCardTitleColor ?? "#ffffff"} onChange={(value) => onChange("benefitsCardTitleColor", value)} />
              <ColorControl label="Card subtitle" value={settings.benefitsCardSubtitleColor ?? "#ffffff"} onChange={(value) => onChange("benefitsCardSubtitleColor", value)} />
              <ColorControl label="Chip text" value={settings.benefitsChipTextColor ?? "#ffffff"} onChange={(value) => onChange("benefitsChipTextColor", value)} />
              <ColorControl label="Chip border" value={settings.benefitsChipBorderColor ?? "#ffffff"} onChange={(value) => onChange("benefitsChipBorderColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Image upload">
            <label className="shader-file-control">
              <span>Upload images</span>
              <input type="file" accept="image/*" multiple onChange={handleBenefitImagesUpload} />
            </label>
            <div className="shader-image-list">
              {(settings.benefitsImages ?? []).map((image, index) => (
                <div className="shader-image-item" key={`${image.slice(0, 36)}-${index}`}>
                  <img src={image} alt="" aria-hidden="true" />
                  <span>Image {index + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(
                        "benefitsImages",
                        (settings.benefitsImages ?? []).filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </ControlGroup>
          <ControlGroup title="Image position">
            {renderRangeControls(pickControls(benefitsImageControls, ["benefitsImageVisible", "benefitsImageWidth", "benefitsImageScale", "benefitsImageOffsetX", "benefitsImageOffsetY", "benefitsImageRotate"]))}
          </ControlGroup>
          <ControlGroup title="Image appearance" defaultOpen={false}>
            {renderRangeControls(pickControls(benefitsImageControls, ["benefitsImageOpacity", "benefitsImageBlur", "benefitsImageLightness", "benefitsImageBrightness", "benefitsImageContrast", "benefitsImageSaturation", "benefitsImageSharpness", "benefitsImageDropShadow"]))}
          </ControlGroup>
        </div>
      )}

      {activeTab === "third" && (
        <div className="shader-panel__section">
          <ControlGroup title="Block layout">
            {renderRangeControls(thirdLayoutControls)}
          </ControlGroup>
          <ControlGroup title="Headline">
            {renderRangeControls(pickControls(thirdHeadlineControls, ["thirdHeadlineInsetX", "thirdTextCentered", "thirdHeadlineGap", "thirdHeadlineLineGap", "thirdHeadlineSize", "thirdHeadlineLineHeight"]))}
            <div className="shader-panel__grid">
              <ColorControl label="First line" value={settings.thirdHeadlineFirstColor ?? "#31e257"} onChange={(value) => onChange("thirdHeadlineFirstColor", value)} />
              <ColorControl label="Second line" value={settings.thirdHeadlineSecondColor ?? "#ffffff"} onChange={(value) => onChange("thirdHeadlineSecondColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Headline line details" defaultOpen={false}>
            {renderRangeControls(pickControls(thirdHeadlineControls, ["thirdHeadlineFirstSize", "thirdHeadlineFirstLineHeight", "thirdHeadlineFirstWeight", "thirdHeadlineFirstTracking", "thirdHeadlineSecondSize", "thirdHeadlineSecondLineHeight", "thirdHeadlineSecondWeight", "thirdHeadlineSecondTracking"]))}
          </ControlGroup>
          <ControlGroup title="Subtitle">
            {renderRangeControls(thirdSubtitleControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Subtitle" value={settings.thirdSubtitleColor ?? "#ffffff"} onChange={(value) => onChange("thirdSubtitleColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Card text" defaultOpen={false}>
            {renderRangeControls(thirdCardTextControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Card title" value={settings.thirdCardTitleColor ?? "#ffffff"} onChange={(value) => onChange("thirdCardTitleColor", value)} />
              <ColorControl label="Card body" value={settings.thirdCardBodyColor ?? "#ffffff"} onChange={(value) => onChange("thirdCardBodyColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Card list" defaultOpen={false}>
            {renderRangeControls(thirdListControls)}
            <div className="shader-panel__grid">
              <ColorControl label="List text" value={settings.thirdListTextColor ?? "#ffffff"} onChange={(value) => onChange("thirdListTextColor", value)} />
              <ColorControl label="List check" value={settings.thirdListCheckColor ?? "#ffffff"} onChange={(value) => onChange("thirdListCheckColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Card button">
            {renderRangeControls(thirdButtonLayoutControls)}
            {renderRangeControls(thirdButtonTextControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Button fill" value={settings.thirdButtonFillColor ?? "#ddff9c"} onChange={(value) => onChange("thirdButtonFillColor", value)} />
              <ColorControl label="Button border" value={settings.thirdButtonBorderColor ?? "#ddff9c"} onChange={(value) => onChange("thirdButtonBorderColor", value)} />
              <ColorControl label="Button text" value={settings.thirdButtonTextColor ?? "#071009"} onChange={(value) => onChange("thirdButtonTextColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Button arrow and states" defaultOpen={false}>
            {renderRangeControls(thirdButtonIconControls)}
            {renderRangeControls(thirdButtonStateControls)}
          </ControlGroup>
          <ControlGroup title="Individual card sizes" defaultOpen={false}>
            {renderRangeControls(getThirdCardControls(getThirdCardCount(settings)))}
          </ControlGroup>
        </div>
      )}

      {activeTab === "fourth" && (
        <div className="shader-panel__section">
          <ControlGroup title="Block layout">
            {renderRangeControls(fourthBlockControls)}
          </ControlGroup>
          <ControlGroup title="Headline">
            <label className="shader-control">
              <span>Headline font</span>
              <select
                value={settings.fourthHeadlineFont ?? "serif"}
                onChange={(event) => onChange("fourthHeadlineFont", event.currentTarget.value)}
              >
                <option value="serif">Serif</option>
                <option value="sans">Inter</option>
              </select>
            </label>
            {renderRangeControls(pickControls(fourthTextControls, ["fourthHeadlineGap", "fourthHeadlineSize", "fourthHeadlineLineHeight", "fourthHeadlineFirstWeight", "fourthHeadlineSecondWeight", "fourthHeadlineTracking", "fourthHeadlineToSubtitleGap"]))}
            <div className="shader-panel__grid">
              <ColorControl label="First line" value={settings.fourthHeadlineFirstColor ?? "#31e257"} onChange={(value) => onChange("fourthHeadlineFirstColor", value)} />
              <ColorControl label="Second line" value={settings.fourthHeadlineSecondColor ?? "#31e257"} onChange={(value) => onChange("fourthHeadlineSecondColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Subtitle">
            {renderRangeControls(pickControls(fourthTextControls, ["fourthSubtitleGap", "fourthSubtitleWidth", "fourthSubtitleSize", "fourthSubtitleLineHeight", "fourthSubtitleWeight"]))}
            <div className="shader-panel__grid">
              <ColorControl label="Subtitle" value={settings.fourthSubtitleColor ?? "#ffffff"} onChange={(value) => onChange("fourthSubtitleColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Input layout">
            {renderRangeControls(fourthInputLayoutControls)}
          </ControlGroup>
          <ControlGroup title="Input parts" defaultOpen={false}>
            {renderRangeControls(fourthInputPartsControls)}
          </ControlGroup>
          <ControlGroup title="Input surface and glow" defaultOpen={false}>
            {renderRangeControls(fourthInputBorderControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Background" value={settings.borderButtonBackground ?? "#120F17"} onChange={(value) => onChange("borderButtonBackground", value)} />
              <ColorControl label="Gradient 1" value={settings.borderButtonColorOne ?? "#c084fc"} onChange={(value) => onChange("borderButtonColorOne", value)} />
              <ColorControl label="Gradient 2" value={settings.borderButtonColorTwo ?? "#f472b6"} onChange={(value) => onChange("borderButtonColorTwo", value)} />
              <ColorControl label="Gradient 3" value={settings.borderButtonColorThree ?? "#38bdf8"} onChange={(value) => onChange("borderButtonColorThree", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Input colors">
            <div className="shader-panel__grid">
              <ColorControl label="Text" value={settings.fourthInputTextColor ?? "#f1f5f9"} onChange={(value) => onChange("fourthInputTextColor", value)} />
              <ColorControl label="Placeholder" value={settings.fourthInputPlaceholderColor ?? "#cbd5e1"} onChange={(value) => onChange("fourthInputPlaceholderColor", value)} />
              <ColorControl label="Accent" value={settings.fourthInputAccentColor ?? "#fb923c"} onChange={(value) => onChange("fourthInputAccentColor", value)} />
              <ColorControl label="Icon" value={settings.fourthInputIconColor ?? "#fcd34d"} onChange={(value) => onChange("fourthInputIconColor", value)} />
              <ColorControl label="Button start" value={settings.fourthInputButtonStart ?? "#fbbf24"} onChange={(value) => onChange("fourthInputButtonStart", value)} />
              <ColorControl label="Button end" value={settings.fourthInputButtonEnd ?? "#fb7185"} onChange={(value) => onChange("fourthInputButtonEnd", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Popup veil" defaultOpen={false}>
            {renderRangeControls(popupVeilControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Veil color" value={settings.popupVeilColor ?? "#000000"} onChange={(value) => onChange("popupVeilColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Popup layout">
            {renderRangeControls(popupLayoutControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Popup color" value={settings.popupBackground ?? "#a9a9a9"} onChange={(value) => onChange("popupBackground", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Popup text" defaultOpen={false}>
            {renderRangeControls(popupTextControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Title" value={settings.popupTitleColor ?? "#111111"} onChange={(value) => onChange("popupTitleColor", value)} />
              <ColorControl label="Subtitle" value={settings.popupSubtitleColor ?? "#111111"} onChange={(value) => onChange("popupSubtitleColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Popup button" defaultOpen={false}>
            {renderRangeControls(popupButtonControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Button color" value={settings.popupButtonColor ?? "#ddff9c"} onChange={(value) => onChange("popupButtonColor", value)} />
            </div>
          </ControlGroup>
        </div>
      )}

      {activeTab === "fifth" && (
        <div className="shader-panel__section">
          <ControlGroup title="Block layout">
            {renderRangeControls(fifthBlockControls)}
          </ControlGroup>
          <ControlGroup title="Headline">
            {renderRangeControls(fifthHeadlineControls)}
            <div className="shader-panel__grid">
              <ColorControl label="First line" value={settings.fifthHeadlineFirstColor ?? "#ffffff"} onChange={(value) => onChange("fifthHeadlineFirstColor", value)} />
              <ColorControl label="Second line" value={settings.fifthHeadlineSecondColor ?? "#ffffff"} onChange={(value) => onChange("fifthHeadlineSecondColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Subtitle">
            {renderRangeControls(fifthSubtitleControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Subtitle" value={settings.fifthSubtitleColor ?? "#ffffff"} onChange={(value) => onChange("fifthSubtitleColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Card">
            {renderRangeControls(fifthCardControls)}
          </ControlGroup>
          <ControlGroup title="Image upload">
            <label className="shader-file-control">
              <span>Upload images</span>
              <input type="file" accept="image/*" multiple onChange={handleFifthImagesUpload} />
            </label>
            <div className="shader-image-list">
              {(settings.fifthImages ?? []).map((image, index) => (
                <div className="shader-image-item" key={`${image.slice(0, 36)}-${index}`}>
                  <img src={image} alt="" aria-hidden="true" />
                  <span>Image {index + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(
                        "fifthImages",
                        (settings.fifthImages ?? []).filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </ControlGroup>
          <ControlGroup title="Image position">
            {renderRangeControls(pickControls(fifthImageControls, ["fifthImageVisible", "fifthImageWidth", "fifthImageScale", "fifthImageOffsetX", "fifthImageOffsetY", "fifthImageRotate"]))}
          </ControlGroup>
          <ControlGroup title="Image appearance" defaultOpen={false}>
            {renderRangeControls(pickControls(fifthImageControls, ["fifthImageOpacity", "fifthImageBlur", "fifthImageBrightness", "fifthImageContrast", "fifthImageSaturation", "fifthImageDropShadow"]))}
          </ControlGroup>
        </div>
      )}

      {activeTab === "footer" && (
        <div className="shader-panel__section">
          <ControlGroup title="Footer layout">
            {renderRangeControls(footerLayoutControls)}
          </ControlGroup>
          <ControlGroup title="Text">
            {renderRangeControls(footerTextControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Text" value={settings.footerTextColor ?? "#dedede"} onChange={(value) => onChange("footerTextColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Links">
            {renderRangeControls(footerLinkControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Link" value={settings.footerLinkColor ?? "#dedede"} onChange={(value) => onChange("footerLinkColor", value)} />
              <ColorControl label="Hover" value={settings.footerLinkHoverColor ?? "#16e33f"} onChange={(value) => onChange("footerLinkHoverColor", value)} />
              <ColorControl label="Press" value={settings.footerLinkPressedColor ?? "#ffffff"} onChange={(value) => onChange("footerLinkPressedColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Footer background">
            {renderRangeControls(footerGlassControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Surface color" value={settings.footerGlassSurfaceColor ?? "#ffffff"} onChange={(value) => onChange("footerGlassSurfaceColor", value)} />
              <ColorControl label="Border color" value={settings.footerGlassBorderColor ?? "#ffffff"} onChange={(value) => onChange("footerGlassBorderColor", value)} />
              <ColorControl label="Gloss color" value={settings.footerGlassGlossinessColor ?? "#ffffff"} onChange={(value) => onChange("footerGlassGlossinessColor", value)} />
            </div>
          </ControlGroup>
        </div>
      )}

      {activeTab === "button" && (
        <div className="shader-panel__section">
          <ControlGroup title="Layout">
            {renderRangeControls(buttonLayoutControls)}
          </ControlGroup>
          <ControlGroup title="Text">
            {renderRangeControls(buttonTextControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Text" value={settings.borderButtonTextColor ?? "#ffffff"} onChange={(value) => onChange("borderButtonTextColor", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Surface">
            {renderRangeControls(buttonSurfaceControls)}
            <div className="shader-panel__grid">
              <ColorControl label="Background" value={settings.borderButtonBackground ?? "#120F17"} onChange={(value) => onChange("borderButtonBackground", value)} />
              <ColorControl label="Gradient 1" value={settings.borderButtonColorOne ?? "#c084fc"} onChange={(value) => onChange("borderButtonColorOne", value)} />
              <ColorControl label="Gradient 2" value={settings.borderButtonColorTwo ?? "#f472b6"} onChange={(value) => onChange("borderButtonColorTwo", value)} />
              <ColorControl label="Gradient 3" value={settings.borderButtonColorThree ?? "#38bdf8"} onChange={(value) => onChange("borderButtonColorThree", value)} />
            </div>
          </ControlGroup>
          <ControlGroup title="Glow and animation" defaultOpen={false}>
            {renderRangeControls(buttonMotionControls)}
          </ControlGroup>
        </div>
      )}

      {activeTab === "glass" && (
        <div className="shader-panel__section">
          <ControlGroup title="Shared glass">
            <div className="shader-panel__grid">
              <ColorControl label="Surface color" value={settings.glassSurfaceColor ?? "#ffffff"} onChange={(value) => onChange("glassSurfaceColor", value)} />
              <ColorControl label="Border color" value={settings.glassBorderColor ?? "#ffffff"} onChange={(value) => onChange("glassBorderColor", value)} />
              <ColorControl label="Gloss color" value={settings.glassGlossinessColor ?? "#ffffff"} onChange={(value) => onChange("glassGlossinessColor", value)} />
            </div>
            {renderRangeControls(glassGlobalControls)}
          </ControlGroup>
        </div>
      )}

      {activeTab === "background" && (
        <div className="shader-panel__section">
          <ControlGroup title="Background fill">
            <label className="shader-control">
              <span>Background</span>
              <select
                value={settings.bgType}
                onChange={(event) => onChange("bgType", event.currentTarget.value)}
              >
                <option value="gradient">Gradient</option>
                <option value="solid">Solid</option>
              </select>
            </label>
            {renderRangeControls(pickControls(backgroundControls, ["bgAngle", "bgOpacity"]))}
            {settings.bgType === "solid" ? (
              <ColorControl label="Solid color" value={settings.bgSolid} onChange={(value) => onChange("bgSolid", value)} />
            ) : (
              <div className="shader-panel__grid">
                <ColorControl label="Bg start" value={settings.bgStart} onChange={(value) => onChange("bgStart", value)} />
                <ColorControl label="Bg middle" value={settings.bgMiddle} onChange={(value) => onChange("bgMiddle", value)} />
                <ColorControl label="Bg end" value={settings.bgEnd} onChange={(value) => onChange("bgEnd", value)} />
              </div>
            )}
          </ControlGroup>
          <ControlGroup title="Figure veil">
            {renderRangeControls(pickControls(backgroundControls, ["figureOverlayOpacity"]))}
            <div className="shader-panel__grid">
              <ColorControl label="Veil color" value={settings.figureOverlayColor} onChange={(value) => onChange("figureOverlayColor", value)} />
            </div>
          </ControlGroup>
        </div>
      )}

      {activeTab === "presets" && (
        <div className="shader-panel__section">
          <button className="shader-panel__save" type="button" onClick={onSavePreset}>
            Save preset
          </button>
          <div className="shader-presets">
            {presets.map((preset) => (
              <div className="shader-preset" key={preset.id}>
                <button type="button" onClick={() => onLoadPreset(preset)}>
                  {preset.name}
                </button>
                <button type="button" onClick={() => onDeletePreset(preset.id)}>
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

const ControlGroup = ({ title, children, defaultOpen = true }) => (
  <details className="shader-control-group" open={defaultOpen}>
    <summary className="shader-control-group__title">{title}</summary>
    <div className="shader-control-group__body">{children}</div>
  </details>
);

const RangeControl = ({ control, value, onChange }) => (
  <label className="shader-control">
    <span>
      {control.label}
      <output>{value}</output>
    </span>
    <div className="shader-control__inputs">
      <input
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(event) =>
          onChange(control.key, Number(event.currentTarget.value))
        }
      />
      <input
        type="number"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(event) =>
          onChange(control.key, Number(event.currentTarget.value))
        }
      />
    </div>
  </label>
);

const ColorControl = ({ label, value, onChange }) => (
  <label className="shader-color">
    <span>{label}</span>
    <input
      type="color"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  </label>
);

const getShapePoint = (index, count, settings, target) => {
  const t = index / Math.max(count - 1, 1);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const scale = settings.shapeScale;
  const tube = settings.tubeRadius;
  const twist = settings.shapeTwist;

  if (settings.shapeType === "sphere") {
    const y = 1 - 2 * t;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = index * golden + twist * y * Math.PI;
    target.set(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
    return target.multiplyScalar(1.9 * scale);
  }

  if (settings.shapeType === "torus") {
    const majorAngle = t * Math.PI * 2 * 120;
    const minorAngle = index * golden + majorAngle * twist;
    const majorRadius = 1.35 * scale;
    const minorRadius = tube * scale;
    target.set(
      (majorRadius + minorRadius * Math.cos(minorAngle)) * Math.cos(majorAngle),
      minorRadius * Math.sin(minorAngle),
      (majorRadius + minorRadius * Math.cos(minorAngle)) * Math.sin(majorAngle),
    );
    return target;
  }

  if (settings.shapeType === "heart") {
    const a = t * Math.PI * 2;
    const shell = (index % 97) / 97;
    const r = (0.35 + shell * 0.65) * scale * 0.12;
    const x = 16 * Math.sin(a) ** 3;
    const y =
      13 * Math.cos(a) -
      5 * Math.cos(2 * a) -
      2 * Math.cos(3 * a) -
      Math.cos(4 * a);
    const z = Math.sin(index * golden + twist * a) * (tube * 1.4);
    target.set(x * r, y * r - 0.25, z * scale);
    return target;
  }

  if (settings.shapeType === "spiral") {
    const turns = 8 + twist * 2;
    const a = t * Math.PI * 2 * turns;
    const radius = (0.35 + t * 1.45) * scale;
    const cross = (index % 131) / 131;
    const ring = (cross - 0.5) * tube;
    target.set(
      Math.cos(a) * (radius + ring),
      (t - 0.5) * 3 * scale,
      Math.sin(a) * (radius + ring),
    );
    return target;
  }

  if (settings.shapeType === "wave") {
    const side = Math.sqrt(count);
    const gx = (index % side) / side;
    const gy = Math.floor(index / side) / side;
    const x = (gx - 0.5) * 4.2 * scale;
    const z = (gy - 0.5) * 3.2 * scale;
    const y =
      Math.sin((gx * 8 + twist * 2) * Math.PI) *
      Math.cos((gy * 6 - twist) * Math.PI) *
      tube *
      scale;
    target.set(x, y, z);
    return target;
  }

  const geometry = getShapePoint.knotGeometry;
  const vertexIndex = index % geometry.attributes.position.count;
  target.set(
    geometry.attributes.position.getX(vertexIndex) * scale,
    geometry.attributes.position.getY(vertexIndex) * scale,
    geometry.attributes.position.getZ(vertexIndex) * scale,
  );

  if (twist !== 0) {
    const angle = target.y * twist;
    const x = target.x * Math.cos(angle) - target.z * Math.sin(angle);
    const z = target.x * Math.sin(angle) + target.z * Math.cos(angle);
    target.x = x;
    target.z = z;
  }

  return target;
};

const WovenCanvas = ({ settings }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }

    let frameId = 0;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = settings.cameraZ;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return undefined;
    }
    const getViewportSize = () => ({
      width: Math.max(mount.clientWidth, 1),
      height: Math.max(mount.clientHeight, 1),
    });
    const viewportSize = getViewportSize();
    camera.aspect = viewportSize.width / viewportSize.height;
    camera.updateProjectionMatrix();
    renderer.setSize(viewportSize.width, viewportSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 0);
    mount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const mouseWorld = new THREE.Vector3(0, 0, 0);
    const mouseLocal = new THREE.Vector3(0, 0, 0);
    const clock = new THREE.Clock();
    let pointerActive = false;

    const particleCount = Math.round(settings.particleCount);
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const torusKnot = new THREE.TorusKnotGeometry(
      1.5,
      settings.tubeRadius,
      240,
      36,
    );
    getShapePoint.knotGeometry = torusKnot;
    const purpleStart = new THREE.Color(settings.dotStart);
    const purpleMid = new THREE.Color(settings.dotMiddle);
    const purpleEnd = new THREE.Color(settings.dotEnd);
    const shapePoint = new THREE.Vector3();

    for (let i = 0; i < particleCount; i += 1) {
      getShapePoint(i, particleCount, settings, shapePoint);
      const x = shapePoint.x;
      const y = shapePoint.y;
      const z = shapePoint.z;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const color = new THREE.Color();
      const gradientPosition = THREE.MathUtils.clamp((y + 2) / 4, 0, 1);
      if (gradientPosition < 0.5) {
        color.lerpColors(purpleStart, purpleMid, gradientPosition * 2);
      } else {
        color.lerpColors(purpleMid, purpleEnd, (gradientPosition - 0.5) * 2);
      }
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const getFovScale = () => {
      const drawingBufferSize = renderer.getDrawingBufferSize(new THREE.Vector2());
      return (
        drawingBufferSize.height /
        (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2))
      );
    };

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: settings.opacity },
        uPointSize: { value: settings.pointSize },
        uFovScale: { value: getFovScale() },
        uDotCore: { value: settings.dotCore },
        uDotSoftness: { value: settings.dotSoftness },
        uNearDotBlur: { value: settings.nearDotBlur },
        uNearBlurStart: { value: settings.nearBlurStart },
        uNearBlurEnd: { value: Math.max(settings.nearBlurEnd, settings.nearBlurStart + 0.1) },
      },
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;
        varying float vNearBlur;
        uniform float uPointSize;
        uniform float uFovScale;
        uniform float uNearBlurStart;
        uniform float uNearBlurEnd;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float pointSize = uPointSize * (uFovScale / -mvPosition.z);
          vNearBlur = smoothstep(uNearBlurStart, uNearBlurEnd, pointSize);
          gl_PointSize = pointSize;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vNearBlur;
        uniform float uOpacity;
        uniform float uDotCore;
        uniform float uDotSoftness;
        uniform float uNearDotBlur;

        void main() {
          float distanceFromCenter = distance(gl_PointCoord, vec2(0.5));
          float nearSoftness = uNearDotBlur * vNearBlur;
          float core = max(0.04, uDotCore - nearSoftness);
          float edge = min(core + uDotSoftness + nearSoftness, 0.5);
          float alpha = 1.0 - smoothstep(core, edge, distanceFromCenter);

          if (alpha < 0.02) {
            discard;
          }

          gl_FragColor = vec4(vColor, alpha * uOpacity);
        }
      `,
      blending: THREE.NormalBlending,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const updatePointer = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        pointerActive = false;
        return;
      }

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      const visibleHeight =
        2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      const visibleWidth = visibleHeight * camera.aspect;

      mouseWorld.set(
        (mouse.x * visibleWidth) / 2,
        (mouse.y * visibleHeight) / 2,
        0,
      );
      pointerActive = true;
    };

    const handlePointerMove = (event) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };

    const handlePointerLeave = () => {
      pointerActive = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const wobble = settings.wobble;
      const depthPulse = Math.sin(elapsedTime * 1.4) * settings.depthPulse;

      points.rotation.y = elapsedTime * settings.rotationSpeed;
      points.rotation.x = Math.sin(elapsedTime * 0.55) * wobble;
      points.rotation.z = Math.cos(elapsedTime * 0.42) * wobble;
      points.position.y = settings.shapeOffsetY;
      points.position.z = depthPulse;
      points.updateMatrixWorld();
      mouseLocal.copy(mouseWorld);
      points.worldToLocal(mouseLocal);

      for (let i = 0; i < particleCount; i += 1) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        let vx = velocities[ix];
        let vy = velocities[iy];
        let vz = velocities[iz];

        if (pointerActive && settings.interactionForce > 0) {
          const dx = positions[ix] - mouseLocal.x;
          const dy = positions[iy] - mouseLocal.y;
          const dz = positions[iz] - mouseLocal.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const radius = settings.interactionRadius;

          if (dist > 0.0001 && dist < radius) {
            const force = ((radius - dist) / radius) * settings.interactionForce;
            vx += (dx / dist) * force;
            vy += (dy / dist) * force;
            vz += (dz / dist) * force;
          }
        }

        vx += (originalPositions[ix] - positions[ix]) * settings.returnForce;
        vy += (originalPositions[iy] - positions[iy]) * settings.returnForce;
        vz += (originalPositions[iz] - positions[iz]) * settings.returnForce;

        vx *= settings.damping;
        vy *= settings.damping;
        vz *= settings.damping;

        positions[ix] += vx;
        positions[iy] += vy;
        positions[iz] += vz;

        velocities[ix] = vx;
        velocities[iy] = vy;
        velocities[iz] = vz;
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const nextViewportSize = getViewportSize();
      camera.aspect = nextViewportSize.width / nextViewportSize.height;
      camera.updateProjectionMatrix();
      renderer.setSize(nextViewportSize.width, nextViewportSize.height);
      material.uniforms.uFovScale.value = getFovScale();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      torusKnot.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [settings]);

  return <div ref={mountRef} className="woven-light-canvas" />;
};
