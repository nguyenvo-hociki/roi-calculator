"use client"

import { Tooltip } from "./ui/tooltip-card"
import { useState } from "react"
import { CalcResult } from "../../lib/calculator"
import PaybackChart from "./PaybackChart" // Import the chart component

export default function ROICalculator() {
  //input
  const [quantity, setQuantity] = useState("1")
  const [priceInDaytime, setPriceInDaytime] = useState(0.4)
  const [priceAtNighttime, setPriceAtNighttime] = useState(0.1)
  const [chargingDaysPerYear, setChargingDaysPerYear] = useState("150")
  const [zip, setZip] = useState("75001")

  //result
  const [result, setResult] = useState<CalcResult | null>(null)
  
  //input label
  const labelClassName = "block text-sm font-semibold text-foreground mb-2"
  const inputClassName =
  "w-full px-4 py-3 border-2 border-secondary rounded-lg focus:outline-none focus:border-primary bg-secondary/20 transition-all font-medium text-foreground"
  const resultCardClassName =
  "bg-white border-l-4 border-primary rounded-lg p-4"
  const resultLabelClassName =
    "text-xs lg:text-sm text-foreground font-medium mb-1"
  const resultText = "text-lg lg:text-xl font-bold text-primary"

  // call API
  async function calculate() {
    const res = await fetch("/api/calc", {
      //call back-end route
      method: "POST", //sending POST request
      headers: { "Content-Type": "application/json" }, //the request's content is JSON
      body: JSON.stringify({
        zip,
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
            Type your electricty usage
          </h3>
           <p className="text-base text-foreground opacity-80 mt-0.5 mb-3">
            Battery Size: 279 kWh
          </p>
          {/* Detail of usage */}
          <div className="space-y-6 mb-8">
            <div>
              <label className={labelClassName}>
                Your Zip Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName}>
                Quantity
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "")
                  if (digits === "" || Number(digits) >= 1) {
                    setQuantity(digits)
                  }
                }}
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName}>
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
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName}>
                Peak Price ($/kWh)
              </label>
              <input
                type="number"
                step="0.01"
                value={priceInDaytime}
                onChange={(e) => setPriceInDaytime(Number(e.target.value))}
                className={inputClassName}
              />
            </div>
            <div>
              <label className={labelClassName}>
                Off Peak Price ($/kWh)
              </label>
              <input
                type="number"
                step="0.01"
                value={priceAtNighttime}
                onChange={(e) => setPriceAtNighttime(Number(e.target.value))}
                className={inputClassName}
              />
            </div>
          </div>
          
          {/* On click */}
          <button
            onClick={calculate}
            className="w-full bg-primary text-foreground font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg">
            Calculate ROI
          </button>
        </div>

        {/* Results Section */}
        {result && (
        <div className="w-full xl:w-2/3 bg-white rounded-lg shadow-lg p-8 border border-secondary">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Results</h2>
          </div>

          <p className="text-base text-foreground opacity-100 mb-6">
            Your State: {result.state || "unknown"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Tooltip
              direction="down"
              content={
                <div className="max-w-xs space-y-1">
                  <p className="font-semibold">System Cost</p>
                  <p>One-time total upfront battery system cost per quantity before incentives.</p>
                </div>
              }
              containerClassName="z-50"
            >
              <div className={resultCardClassName}>
                <p className={resultLabelClassName}>System Cost</p>
                <p className={resultText}>${result.systemCost.toLocaleString()}</p>
              </div>
            </Tooltip>

            <Tooltip
              content={
                <div className="max-w-xs space-y-1">
                  <p className="font-semibold">Incentives</p>
                  <p>Estimated one-time tax incentives and benefits per quantity that reduce upfront cost.</p>
                </div>
              }
              containerClassName="z-50"
            >
              <div className={resultCardClassName}>
                <p className={resultLabelClassName}>Incentives</p>
                <p className={resultText}>${result.incentives.toLocaleString()}</p>
              </div>
            </Tooltip>

            <Tooltip
              content={
                <div className="max-w-xs space-y-1">
                  <p className="font-semibold">Annual Costs</p>
                  <p>Estimated yearly operating and maintenance expenses.</p>
                </div>
              }
              containerClassName="z-50"
            >
              <div className={resultCardClassName}>
                <p className={resultLabelClassName}>Annual Costs</p>
                <p className={resultText}>${result.annualOpex.toLocaleString()}</p>
              </div>
            </Tooltip>

            <Tooltip
              content={
                <div className="max-w-xs space-y-1">
                  <p className="font-semibold">Net Annual Cashflow</p>
                  <p>Energy arbitrage savings from daily peak/off-peak price plus estimated grid services revenue, minus annual operating costs.</p>
                </div>
              }
              containerClassName="z-50"
            >
              <div className={resultCardClassName}>
                <p className={resultLabelClassName}>Net Annual Cashflow</p>
                <p className={resultText}>${result.netAnnualCashflow.toLocaleString()}</p>
              </div>
            </Tooltip>
          </div>

          <Tooltip
            content={
              <div className="max-w-xs space-y-1">
                <p className="font-semibold">Payback Period</p>
                <p>(System Cost - Incentives) ÷ Net Annual Cashflow.</p>
              </div>
            }
            containerClassName="z-50 w-full"
          >
            <div className="bg-secondary/10 border-2 border-primary rounded-xl p-6 text-center cursor-default">
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
          </Tooltip>
          
          <div className="mt-8">
            <PaybackChart result={result} />
          </div>
        </div>
        )}
      </div>
    </div>
  )
}