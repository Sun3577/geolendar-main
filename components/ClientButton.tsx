"use client";

import { useRouter } from "next/navigation";

export default function ClientButton() {
  const router = useRouter();

  const handleAuthClick = () => {
    router.push("/api/auth");
  };

  return (
    <div>
      <button onClick={handleAuthClick}>Authenticate with Google</button>
    </div>
  );
}
