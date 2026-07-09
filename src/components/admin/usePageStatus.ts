"use client";

import { useEffect, useState } from "react";
import {
  statusOf,
  withStatusDefaults,
  type PageStatus,
  type PageStatusMap,
} from "@/lib/pageStatus";

/**
 * Load a single page's publish status and persist changes immediately
 * (merging into the full status map so other pages aren't clobbered).
 */
export function usePageStatus(href: string) {
  const [map, setMap] = useState<PageStatusMap>({});

  useEffect(() => {
    fetch("/api/page-status")
      .then((r) => r.json())
      .then((d) => setMap(withStatusDefaults(d)))
      .catch(() => {});
  }, []);

  const status = statusOf(map, href);

  const change = (next: PageStatus) => {
    const nextMap = { ...map, [href]: next };
    setMap(nextMap);
    fetch("/api/page-status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextMap),
    }).catch(() => {});
  };

  return { status, change };
}
