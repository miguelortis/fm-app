"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const StatCounter = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 2 });
    }
  }, [inView, count, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", setDisplayValue);
    return () => unsubscribe();
  }, [rounded]);

  return (
    <div ref={ref} className="text-center">
      <motion.p className="text-4xl font-black text-slate-900">
        {displayValue}+
      </motion.p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
};
