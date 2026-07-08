import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export default function ViewCounter() {
    const [views, setViews] = useState<number | null>(null);

    useEffect(() => {
        const fetchViews = () => {
            fetch("https://page-views-api.ratneshc.com/api/v1/views?site=prepvector.vercel.app&path=/")
                .then((res) => res.json())
                .then((data) => {
                    if (data && typeof data.views === "number") {
                        setViews(data.views);
                    }
                })
                .catch((err) => console.error("Failed to fetch views:", err));
        };

        fetchViews();
        const intervalId = setInterval(fetchViews, 30000); // Poll every 30 seconds

        return () => clearInterval(intervalId);
    }, []);

    if (views === null) return null;

    return (
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800 backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5" />
            <span>{views.toLocaleString()} views</span>
        </div>
    );
}
