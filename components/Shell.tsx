"use client";

import { ReactNode } from "react";
import SmoothScroll from "./SmoothScroll";
import RouteCurtain from "./RouteCurtain";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingDock from "./FloatingDock";
import { ClickSpark } from "./reactbits";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <ClickSpark sparkColor="#7c5cff" sparkSize={9} sparkRadius={18} sparkCount={8} duration={500}>
      <SmoothScroll>
        <RouteCurtain />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingDock />
      </SmoothScroll>
    </ClickSpark>
  );
}
