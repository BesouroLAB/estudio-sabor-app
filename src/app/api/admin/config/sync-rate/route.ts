import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { syncExchangeRate } from "@/lib/services/exchange-rate";

/**
 * API Route to manually trigger USD/BRL rate sync.
 * Restricted to admins.
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const rate = await syncExchangeRate();

    return NextResponse.json({ 
      success: true, 
      rate,
      message: `Cotação atualizada: R$ ${rate}`
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
