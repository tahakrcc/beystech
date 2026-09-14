/**
 * ReactBits (MIT) bileşenlerinin tipli yeniden dışa aktarımı.
 * Kaynak .jsx dosyaları tiplenmemiş olduğundan, esnek prop tipiyle sarmalıyoruz.
 */
import type { ComponentType } from "react";

import AuroraRaw from "./Aurora";
import StarBorderRaw from "./StarBorder";
import ClickSparkRaw from "./ClickSpark";
import MagnetRaw from "./Magnet";
import RotatingTextRaw from "./RotatingText";
import ShinyTextRaw from "./ShinyText";
import BlurTextRaw from "./BlurText";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = ComponentType<any>;

export const Aurora = AuroraRaw as AnyProps;
export const StarBorder = StarBorderRaw as AnyProps;
export const ClickSpark = ClickSparkRaw as AnyProps;
export const Magnet = MagnetRaw as AnyProps;
export const RotatingText = RotatingTextRaw as AnyProps;
export const ShinyText = ShinyTextRaw as AnyProps;
export const BlurText = BlurTextRaw as AnyProps;
