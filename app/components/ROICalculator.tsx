"use client"

import { useState } from "react"
import { CalcResult } from "../../lib/calculator"
import PaybackChart from "./PaybackChart" // Import the chart component

export default function ROICalculator() {
  //input
  const [batterySize, setBatterySize] = useState(297)
  const [quantity, setQuantity] = useState("1")
  const [priceInDaytime, setPriceInDaytime] = useState(0.4)
  const [priceAtNighttime, setPriceAtNighttime] = useState(0.1)
  const [chargingDaysPerYear, setChargingDaysPerYear] = useState("150")
  const [zip, setZip] = useState("75001")

  //result
  const [result, setResult] = useState<CalcResult | null>(null)

  // call API
  async function calculate() {
    const res = await fetch("/api/calc", {
      //call back-end route
      method: "POST", //sending POST request
      headers: { "Content-Type": "application/json" }, //the request's content is JSON
      body: JSON.stringify({
        zip,
        batterySize,
        quantity,
        priceInDaytime,
        priceAtNighttime,
        chargingDaysPerYear,
      }),
    })

    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 text-foreground">
          Energy Storage ROI Calculator
        </h2>
        <p className="text-foreground opacity-70">
          Calculate return on investment for your battery energy storage system
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Input Section */}
        <div className="w-full xl:w-1/3 bg-white rounded-lg shadow-lg p-8 border border-secondary">
          <h3 className="text-2xl font-bold mb-6 text-foreground">
            Parameters
          </h3>
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Your Zip Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 border-2 border-secondary rounded-lg focus:outline-none focus:border-primary bg-secondary/20 transition-all font-medium text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Battery Size (kWh)
              </label>
              <select
                value={batterySize}
                onChange={(e) => setBatterySize(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-secondary rounded-lg focus:outline-none focus:border-primary bg-secondary/20 transition-all font-medium text-foreground"
              >
                <option value={297}>297</option>
                <option value={594}>594</option>
                <option value={891}>891</option>
                <option value={1188}>1188</option>
                <option value={1485}>1485</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Quantity
              </label>
              <input
                type="text"
                min="1"
                inputMode="numeric"
                value={quantity}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "")
                  if (digits === "" || Number(digits) >= 1) {
                    setQuantity(digits)
                  }
                }}
                className="w-full px-4 py-3 border-2 border-secondary rounded-lg focus:outline-none focus:border-primary bg-secondary/20 transition-all font-medium text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Charging Days Per Year
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={chargingDaysPerYear}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "")
                  if (digits === "" || (Number(digits) >= 1 && Number(digits) <= 366)) {
                  setChargingDaysPerYear(digits)
                  }
                }}
                className="w-full px-4 py-3 border-2 border-secondary rounded-lg focus:outline-none focus:border-primary bg-secondary/20 transition-all font-medium text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Peak Price ($/kWh)
              </label>
              <input
                type="number"
                step="0.01"
                value={priceInDaytime}
                onChange={(e) => setPriceInDaytime(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-secondary rounded-lg focus:outline-none focus:border-primary bg-secondary/20 transition-all font-medium text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Off Peak Price ($/kWh)
              </label>
              <input
                type="number"
                step="0.01"
                value={priceAtNighttime}
                onChange={(e) => setPriceAtNighttime(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-secondary rounded-lg focus:outline-none focus:border-primary bg-secondary/20 transition-all font-medium text-foreground"
              />
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary text-foreground font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg">
            Calculate ROI
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="w-full xl:w-2/3 bg-white rounded-lg shadow-lg p-8 border border-secondary">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Results</h2>
            <p className="text-sm text-foreground opacity-70 mb-6">
              Your State: {result.state || "unknown"}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-secondary/10 border-l-4 border-primary rounded-lg p-4">
                <p className="text-xs lg:text-sm text-foreground font-medium mb-1">
                  System Cost
                </p>
                <p className="text-lg lg:text-xl font-bold text-primary">
                  ${result.systemCost.toLocaleString()}
                </p>
              </div>

              <div className="bg-secondary/10 border-l-4 border-primary rounded-lg p-4">
                <p className="text-xs lg:text-sm text-foreground font-medium mb-1">
                  Incentives
                </p>
                <p className="text-lg lg:text-xl font-bold text-primary">
                  ${result.incentives.toLocaleString()}
                </p>
              </div>

              <div className="bg-secondary/10 border-l-4 border-primary rounded-lg p-4">
                <p className="text-xs lg:text-sm text-foreground font-medium mb-1">
                  Net Annual Cashflow
                </p>
                <p className="text-lg lg:text-xl font-bold text-primary">
                  ${result.netAnnualCashflow.toLocaleString()}
                </p>
              </div>

              <div className="bg-secondary/10 border-l-4 border-primary rounded-lg p-4">
                <p className="text-xs lg:text-sm text-foreground font-medium mb-1">
                  Annual Costs
                </p>
                <p className="text-lg lg:text-xl font-bold text-primary">
                  ${result.annualOpex.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-secondary/20 border-2 border-primary rounded-xl p-6 text-center">
              <p className="text-sm text-foreground font-semibold mb-2">
                Payback Period
              </p>
              <p className="text-5xl font-bold text-primary">
                {typeof result.paybackYears === "number"
                  ? result.paybackYears.toFixed(1)
                  : result.paybackYears}
              </p>
              <p className="text-lg text-foreground font-medium mt-1">years</p>
            </div>

            <div className="mt-8">
              <PaybackChart result={result} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
