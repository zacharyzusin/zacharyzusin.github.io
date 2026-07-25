"use client";

import dynamic from "next/dynamic";

// Three.js is a ~740KB dependency used only by the globe — code-split it
// out of the initial bundle so it loads lazily instead of on every visit.
const EarthGlobe = dynamic(() => import("./EarthGlobe"), { ssr: false });

export default EarthGlobe;
