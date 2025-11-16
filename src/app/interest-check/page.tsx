"use client";

import InterestCheckChatbot from "../components/InterestCheckChatbot";
import InterestSidebar from "../components/InterestSidebar";

export default function InterestCheckPage() {
  return (
    <div className="flex flex-1 w-full min-h-screen">
      {/* Fixed sidebar for this page */}
      <InterestSidebar />

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <InterestCheckChatbot />
      </main>
    </div>
  );
}
