import React, { useState } from "react";

function App() {
  document.title = "SIP Calculator";

  const frequencies = [
    { value: 12, html: "Monthly" },
    { value: 4, html: "Quarterly" },
    { value: 2, html: "Half-Yearly" },
    { value: 1, html: "Yearly" },
  ];

  enum StepUpType {
    Percent = "Percent",
    Amount = "Amount",
  }

  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [investmentFrequency, setInvestmentFrequency] = useState(12);
  const [accumulationPhase, setAccumulationPhase] = useState(10);

  const [stepUpType, setStepUpType] = useState(StepUpType.Percent);
  const [stepUp, setStepUp] = useState({ Percent: 10, Amount: 100 });
  const [stepUpFrequency, setStepUpFrequency] = useState(1);

  const [expectedGrowth, setExpectedGrowth] = useState(12);
  const [investmentTenure, setInvestmentTenure] = useState(10);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    callback: Function
  ) {
    if (e.target.validity.valid) {
      callback(+e.target.value);
    }
    else if (e.target.validity.rangeUnderflow) {
      callback(+e.target.min);
    }
    else if (e.target.validity.stepMismatch) {
      callback(Math.trunc(+e.target.value));
    }
  }

  let investedAmount = 0;
  let estimatedGains = 0;
  let stepUpCount = 0;

  let noStepUpInvestedAmount = 0;
  let noStepUpEstimatedGains = 0;

  for (let i = 0; i < accumulationPhase * investmentFrequency; i++) {
    investedAmount += investmentAmount;
    noStepUpInvestedAmount += investmentAmount;

    if (i !== 0 && i % (investmentFrequency / stepUpFrequency) === 0) {
      stepUpCount++;
    }

    investedAmount +=
      stepUpType === StepUpType.Percent
        ? investmentAmount * ((1 + stepUp.Percent / 100) ** stepUpCount - 1)
        : stepUp.Amount * stepUpCount;

    estimatedGains +=
      (investedAmount + estimatedGains) *
      (expectedGrowth / (100 * investmentFrequency));

    noStepUpEstimatedGains +=
      (noStepUpInvestedAmount + noStepUpEstimatedGains) *
      (expectedGrowth / (100 * investmentFrequency));
  }

  for (
    let i = 0;
    i < (investmentTenure - accumulationPhase) * investmentFrequency;
    i++
  ) {
    estimatedGains +=
      (investedAmount + estimatedGains) *
      (expectedGrowth / (100 * investmentFrequency));

    noStepUpEstimatedGains +=
      (noStepUpInvestedAmount + noStepUpEstimatedGains) *
      (expectedGrowth / (100 * investmentFrequency));
  }

  return (
    <div className="App">
      <div id="input-container">
        <div className="io-block">
          <label htmlFor="investment-amount">Investment Amount</label>
          <span className="Amount">
            <input
              type="number"
              id="investment-amount"
              min={100}
              value={investmentAmount}
              onChange={(e) => handleChange(e, setInvestmentAmount)}
            />
          </span>
        </div>

        <div className="io-block">
          <label htmlFor="investment-frequency">Investment Frequency</label>
          <select
            id="investment-frequency"
            value={investmentFrequency}
            onChange={(e) => {
              setInvestmentFrequency(+e.target.value);

              if (stepUpFrequency > +e.target.value) {
                setStepUpFrequency(+e.target.value);
              }
            }}
          >
            {frequencies.map(({ value, html }) => (
              <option key={value} value={value}>
                {html}
              </option>
            ))}
          </select>
        </div>

        <div className="io-block">
          <label htmlFor="accumulation-phase">Accumulation Phase</label>
          <span className="Year">
            <input
              type="number"
              id="accumulation-phase"
              min={1}
              value={accumulationPhase}
              onChange={(e) => {
                handleChange(e, setAccumulationPhase);

                if (investmentTenure < +e.target.value) {
                  handleChange(e, setInvestmentTenure);
                }
              }}
            />
          </span>
        </div>

        <fieldset>
          <div className="io-block">
            <label htmlFor="stepup">
              Step-Up
              <select
                id="stepup-type"
                value={stepUpType}
                onChange={(e) => setStepUpType(e.target.value as StepUpType)}
              >
                <option value={StepUpType.Percent}>Percent</option>
                <option value={StepUpType.Amount}>Amount</option>
              </select>
            </label>

            <span className={stepUpType}>
              <input
                type="number"
                id="stepup"
                min={0}
                value={stepUp[stepUpType]}
                onChange={(e) =>
                  handleChange(e, (value: number) =>
                    setStepUp((prevState) => {
                      const newState = Object.assign({}, prevState);
                      newState[stepUpType] = value;
                      return newState;
                    })
                  )
                }
              />
            </span>
          </div>

          <div className="io-block">
            <label htmlFor="stepup-frequency">Step-Up Frequency</label>
            <select
              id="stepup-frequency"
              value={stepUpFrequency}
              onChange={(e) => setStepUpFrequency(+e.target.value)}
            >
              {frequencies.slice(1).map(({ value, html }) => (
                <option
                  key={value}
                  value={value}
                  disabled={investmentFrequency < value}
                >
                  {html}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <div className="io-block">
          <label htmlFor="expected-growth">Expected Growth (P.A.)</label>
          <span className="Percent">
            <input
              type="number"
              id="expected-growth"
              min={1}
              value={expectedGrowth}
              onChange={(e) => handleChange(e, setExpectedGrowth)}
            />
          </span>
        </div>

        <div className="io-block">
          <label htmlFor="investment-tenure">Investment Tenure</label>
          <span className="Year">
            <input
              type="number"
              id="investment-tenure"
              min={1}
              value={investmentTenure}
              onChange={(e) => {
                handleChange(e, setInvestmentTenure);

                if (accumulationPhase > +e.target.value) {
                  setAccumulationPhase(+e.target.value);
                }
              }}
            />
          </span>
        </div>
      </div>

      <div id="output-container">
        <div className="io-block">
          <label htmlFor="invested-amount">Invested Amount</label>
          <span className="Amount">
            <output>{Math.round(investedAmount)}</output>
          </span>
        </div>

        <div className="io-block">
          <label htmlFor="estimated-gains">Estimated Gains</label>
          <span className="Amount">
            <output>{Math.round(estimatedGains)}</output>
          </span>
        </div>

        <div className="io-block">
          <label htmlFor="maturity-amount">Maturity Amount</label>
          <span className="Amount">
            <output>{Math.round(investedAmount + estimatedGains)}</output>
          </span>
        </div>

        <fieldset>
          <legend>No Step-Up</legend>

          <div className="io-block">
            <label htmlFor="no-stepup-investment-amount">Invested Amount</label>
            <span className="Amount">
              <output>{Math.round(noStepUpInvestedAmount)}</output>
            </span>
          </div>

          <div className="io-block">
            <label htmlFor="">Estimated Gains</label>
            <span className="Amount">
              <output>{Math.round(noStepUpEstimatedGains)}</output>
            </span>
          </div>

          <div className="io-block">
            <label htmlFor="">Maturity Amount</label>
            <span className="Amount">
              <output>
                {Math.round(noStepUpInvestedAmount + noStepUpEstimatedGains)}
              </output>
            </span>
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default App;
