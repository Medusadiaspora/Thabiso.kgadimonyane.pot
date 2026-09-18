"use client";

import { useEffect, useState } from "react";

export default function VisitorCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_VIEWS_API!)
      .then((res) => res.json())
      .then((data) => setViews(data.views))
      .catch((err) => console.error("Error fetching views:", err));
  }, []);

  return (
    <span className="font-mono text-sm text-neutral-400">
      {views !== null ? `${views} views` : "..."}
    </span>
  );
}
