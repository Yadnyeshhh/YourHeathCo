import React from "react";

export default function Dot({ done }) {
  return done ? (
    <span className="size-2 rounded-full bg-jade shrink-0" />
  ) : (
    <span className="size-2 rounded-full border border-ink/30 shrink-0" />
  );
}
