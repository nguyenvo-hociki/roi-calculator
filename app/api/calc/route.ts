import { NextRequest, NextResponse } from "next/server"
import { calculateROI, CalcInput, CalcResult } from "../../../lib/calculator"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const input: CalcInput = {
      zip: String(body.zip ?? "").replace(/\D/g, "").slice(0, 5),
      quantity: Number(body.quantity),
      priceInDaytime: Number(body.priceInDaytime),
      priceAtNighttime: Number(body.priceAtNighttime),
      chargingDaysPerYear: Number(body.chargingDaysPerYear),
    }

    if (
      input.zip.length !== 5 ||
      !Number.isFinite(input.quantity) ||
      input.quantity < 1 ||
      !Number.isFinite(input.priceInDaytime) ||
      input.priceInDaytime < 0 ||
      !Number.isFinite(input.priceAtNighttime) ||
      input.priceAtNighttime < 0 ||
      !Number.isFinite(input.chargingDaysPerYear) ||
      input.chargingDaysPerYear < 1 ||
      input.chargingDaysPerYear > 366
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const result: CalcResult = calculateROI(input)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}