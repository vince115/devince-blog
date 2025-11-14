// src/components/blog/PostActions.tsx
"use client";

import { useState } from "react";
import { MessageCircle, Heart, Bookmark } from "lucide-react";

export default function PostActions({
    initialLikes = 35,
    initialComments = 3,
}: {
    initialLikes?: number;
    initialComments?: number;
}) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [saved, setSaved] = useState(false);

    const toggleLike = () => {
        setLiked(!liked);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
    };

    const toggleSave = () => setSaved(!saved);

    // ✅ 新增：滾動到留言區
    const handleScrollToComments = () => {
        const commentsEl = document.getElementById("comments");
        if (commentsEl) {
            commentsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="pt-6 text-gray-500 dark:text-gray-400">
            {/* 按鈕列 */}
            <div className="flex items-center justify-between">
                {/* 左側：拍手 + 留言 */}
                <div className="flex space-x-6">
                    {/* 拍手 */}
                    <button
                        onClick={toggleLike}
                        className={`group flex items-center space-x-1 transition ${
                            liked ? "text-rose-500" : "hover:text-rose-500"
                        }`}
                    >
                        <Heart
                            className={`w-6 h-6 transition-transform duration-200 ${
                                liked
                                    ? "fill-current scale-110"
                                    : "group-hover:scale-110"
                            }`}
                        />
                    </button>

                    {/* 留言 */}
                    <button
                        onClick={handleScrollToComments}
                        className="group flex items-center space-x-1 hover:text-blue-500 transition"
                    >
                        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                </div>

                {/* 右側：收藏 */}
                <button
                    onClick={toggleSave}
                    className={`group flex items-center transition ${
                        saved ? "text-amber-500" : "hover:text-amber-500"
                    }`}
                >
                    <Bookmark
                        className={`w-6 h-6 transition-transform duration-200 ${
                            saved
                                ? "fill-current scale-110"
                                : "group-hover:scale-110"
                        }`}
                    />
                </button>

                 {/* 上方統計 */}
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {likes} 個喜歡 
                    {/* {likes} 個喜歡 · {initialComments} 則留言 */}
            </div>
        </div>
    );
}
