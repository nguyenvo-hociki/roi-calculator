import { getStateFromZip } from "./zipToState"


export type CalcInput = {
  zip: string
  batterySize: number
  quantity: number
  priceInDaytime: number
  priceAtNighttime: number
  chargingDaysPerYear: number
}

export type CalcResult = {
  state: string | null
  systemCost: number
  incentives: number
  annualOpex: number
  netAnnualCashflow: number
  paybackYears: number | string
}

const DOD = 0.9
const RTE = 0.9
const BATTERY_POWER = 50

const SYSTEM_COST = 90250
const ANNUAL_OPEX = 8000

const INCENTIVES = 46028
const GRID_SERVICES = 5000

export function calculateROI(input: CalcInput): CalcResult {
  const state = getStateFromZip(input.zip) ?? "Unknown"
  const totalBatterySize = input.batterySize * input.quantity
  const usableEnergy = input.batterySize * DOD * RTE

  const dailySavings =
    usableEnergy * (input.priceInDaytime - input.priceAtNighttime)

  const arbitrage = dailySavings * input.chargingDaysPerYear

  const totalSystemCost = SYSTEM_COST * input.quantity
  const totalAnnualOpex = ANNUAL_OPEX * input.quantity
  const totalIncentives = INCENTIVES * input.quantity
  const totalGridServices = GRID_SERVICES * input.quantity

  const annualRevenue = arbitrage + totalGridServices
  const netAnnualCashflow = annualRevenue - totalAnnualOpex
  
  const paybackYears =
    netAnnualCashflow <= 0
      ? "Never"
      : (totalSystemCost - totalIncentives) / netAnnualCashflow


  return {
    state,
    systemCost: totalSystemCost,
    annualOpex: totalAnnualOpex,
    incentives: totalIncentives,
    netAnnualCashflow,
    paybackYears,
  }
}