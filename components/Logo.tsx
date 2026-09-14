"use client";

import { useReducedMotion } from "motion/react";
import { useId } from "react";

export function LogoMark({
  size = 28,
  className = "",
  animated = true,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const grad = `bm-${id}`;
  const reduce = useReducedMotion();
  const flow = animated && !reduce;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={grad}
          x1="7"
          y1="7"
          x2="42"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#A879FF" />
          <stop offset="0.48" stopColor="#6C5CFF" />
          <stop offset="1" stopColor="#22D3EE" />
          {flow && (
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="8s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>
      <path
        d="M7 10.15c0-1.64.87-3.16 2.29-3.98l8.31-4.8A2.93 2.93 0 0 1 22 3.91v8.22c0 1.64-.87 3.16-2.29 3.98l-8.31 4.8A2.93 2.93 0 0 1 7 18.37v-8.22Z"
        fill={`url(#${grad})`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 26.05c0-3.38 3.66-5.49 6.59-3.8L21 26.53v-4.61c0-3.52 3.82-5.72 6.87-3.96l10.24 5.91c5.19 3 5.19 10.49 0 13.49L25.8 44.47C17.44 49.3 7 43.26 7 33.61v-7.56Zm13.46 4.42v9.26l8.02-4.63a2.35 2.35 0 0 0 0-4.07l-8.02-4.63v4.07Z"
        fill={`url(#${grad})`}
      />
    </svg>
  );
}

export default function Logo({
  markSize = 28,
  className = "",
  wordmark = true,
  animated = true,
}: {
  markSize?: number;
  className?: string;
  wordmark?: boolean;
  animated?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markSize} animated={animated} />
      {wordmark && (
        <span className="text-[17px] font-semibold tracking-tight lowercase">
          beystech
        </span>
      )}
    </span>
  );
}
