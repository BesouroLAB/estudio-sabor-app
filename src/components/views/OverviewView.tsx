"use client";

import { DashboardHub } from "@/components/views/DashboardHub";
import { useRouter } from "next/navigation";

interface OverviewProps {
  userName?: string;
  creditsRemaining: number;
}

export function OverviewView({ userName, creditsRemaining }: OverviewProps) {
  const router = useRouter();

  return (
    <DashboardHub 
      onStartKit={() => router.push("/estudio/criar")}
      onOpenStore={() => router.push("/estudio/loja-de-creditos")}
      creditsRemaining={creditsRemaining}
      userName={userName}
    />
  );
}
