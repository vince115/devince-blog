// src/components/stats/useVisitorStats.ts
"use client";

import { useEffect, useMemo, useState } from "react";

export type VisitorStats = {
    visitors: number;
    online: number;
};

type Options = {
    heartbeatInterval?: number;
};

function getOrCreateSessionId() {
    const key = "devince.sid";
    let sid = localStorage.getItem(key);
    if (!sid) {
        sid = crypto.randomUUID();
        localStorage.setItem(key, sid);
    }
    return sid;
}

export function useVisitorStats(options: Options = {}) {
    const { heartbeatInterval = 15_000 } = options;

    const [stats, setStats] = useState<VisitorStats>({
        visitors: 0,
        online: 0,
    });

    const sid = useMemo(() => {
        if (typeof window === "undefined") return "";
        return getOrCreateSessionId();
    }, []);

    useEffect(() => {
        if (!sid) return;

        let stopped = false;

        async function ping() {
            try {
                const res = await fetch(`/api/stats?sid=${encodeURIComponent(sid)}`, {
                    method: "POST",
                    cache: "no-store",
                });
                if (!res.ok) return;
                const data = (await res.json()) as VisitorStats;
                if (!stopped) setStats(data);
            } catch {
                // ignore
            }
        }

        ping();
        const timer = setInterval(ping, heartbeatInterval);

        return () => {
            stopped = true;
            clearInterval(timer);
        };
    }, [sid, heartbeatInterval]);

    return stats;
}
