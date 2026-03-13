import { NextRequest, NextResponse } from "next/server"
import { calculateROI, CalcInput, CalcResult } from "../../../lib/calculator"

export async function POST(req: NextRequest) {
  try {
    // 1. Read JSON from frontend
    const input: CalcInput = await req.json()

    // 2. Call calculator
    const result: CalcResult = calculateROI(input)

    // 3. Return JSON
    return NextResponse.json(result)
  
  
  } catch (error) {
    return NextResponse.json({
      state: "",
      systemCost: 0,
      incentives: 0,
      annualOpex: 0,
      netAnnualCashflow: 0,
      paybackYears: Infinity
    });
  }
}