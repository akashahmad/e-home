import React, { useState, useEffect } from 'react';

const MonthlyCost = ({ myProperty }) => {
  const [estimatedMonthlyCost, setEstimatedMonthlyCost] = useState(null);

  // for tabs
  const [showPrincipal, setShowPrincipal] = useState(false);
  const [showMortage, setShowMortage] = useState(false);
  const [showTax, setShowtax] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);

  // for tabs values
  const [interestvalues, setInterestValues] = useState(null);
  const [homeInsurance, setHomeInsurance] = useState(null);
  const [taxRate, setTaxRate] = useState(null);

  useEffect(() => {
    // Now calculating propertytax
    let yearTaxRate = parseInt(myProperty?.listPrice) * 0.0248;
    let monthTaxRate = yearTaxRate / 12;
    setTaxRate({
      percentage: 2.48,
      yearTaxRate,
      monthTaxRate,
    });
    // Now calulating home insurance
    let perYearInsurance = parseInt(myProperty?.listPrice) * 0.0042;
    let perMonthInsurance = perYearInsurance / 12;
    setHomeInsurance({
      perYearInsurance,
      perMonthInsurance,
    });

    let _copy = {
      homePrice: myProperty?.listPrice,
      downPayment: 0,
      downPaymentPercentAge: 20,
      loanProgram: 'Fixed30Year',
      interestRate: 2.875,
    };
    _copy.downPayment = parseInt(myProperty?.listPrice) * 0.2;
    let remainingCost =
      parseInt(myProperty?.listPrice) - parseInt(myProperty?.listPrice) * 0.2;
    let interestPerYear = remainingCost * 0.02875;
    let principleInterest = interestPerYear * 17.23;
    let principleInterestPerMonth = (remainingCost + principleInterest) / 360;
    _copy.principleInterestPerMonth = principleInterestPerMonth;
    let estimatedMonthlyCost =
      (remainingCost +
        principleInterest +
        perYearInsurance * 30 +
        yearTaxRate * 30) /
      360;
    _copy.estimatedMonthlyCost = estimatedMonthlyCost;
    setInterestValues(_copy);
  }, [myProperty]);

  return (
    <div className="dHtGQa" id="cost">
      <h5 className="dTAnOx dZuCmF">Monthly cost</h5>
      <div className="ePSpFA">
        <span className="foiYRz">Estimated monthly cost</span>
        <h5 className="dTAnOx">
          ${interestvalues?.estimatedMonthlyCost?.toFixed(2)}
        </h5>
      </div>
      <div className="fgVRFP">
        <div className="bnePEP">
          <div className="iMXoIt">
            <div
              className="cwZLoX"
              onClick={() => setShowPrincipal(!showPrincipal)}
            >
              <div className="gqqTSu">
                <div className="jLwdhz">
                  <span className="iuVuVk">Principal&amp; interest</span>
                  <span className="cNBYuL">
                    ${interestvalues?.principleInterestPerMonth?.toFixed(2)}
                    /mo
                  </span>
                </div>
                {/* switch icon */}
                <div className="dropdownIcon">
                  {showPrincipal ? (
                    <i class="fa fa-angle-up"></i>
                  ) : (
                    <i class="fa fa-angle-down"></i>
                  )}
                </div>
                {/* switch icon */}
              </div>
            </div>
          </div>
          {showPrincipal && (
            <div className="calculatorDetailDiv">
              {/* Home Price */}
              <div className="mb-4">
                <label>Home price</label>
                <div className="position-relative inputWithLogo leftInput">
                  <input
                    type="number"
                    className="w-100 "
                    min="10000"
                    defaultValue={interestvalues?.homePrice}
                  />
                  <span>$</span>
                </div>
              </div>
              {/* Home Price */}
              {/* Down Payment */}
              <div className="mb-4 d-flex align-items-center">
                <div className="col-7 pl-0">
                  <label>Down Payment</label>
                  <div className="position-relative leftInput">
                    <input
                      type="number"
                      className="w-100 leftInput"
                      defaultValue={interestvalues?.downPayment}
                    />
                    <span>$</span>
                  </div>
                </div>
                <div className="col-5 pl-0 pr-0">
                  <label className="opac-0">Percentage</label>
                  <div className="position-relative rightInput">
                    <input
                      type="number"
                      className="w-100 leftInput"
                      defaultValue={interestvalues?.downPaymentPercentAge}
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>
              {/* Down Payment */}
              {/* Loan Program */}
              <div className="mb-4 d-flex align-items-center">
                <div className="col-7 pl-0">
                  <label>Loan program</label>
                  <div>
                    <select value={interestvalues?.loanProgram}>
                      <option value="Fixed30Year">30-year fixed</option>
                      <option value="Fixed15Year">15-year fixed</option>
                      <option value="ARM5">5/1 ARM</option>
                    </select>
                  </div>
                </div>
                <div className="col-5 pl-0 pr-0">
                  <label>Interest rate</label>
                  <div className="position-relative rightInput">
                    <input
                      type="number"
                      className="w-100 leftInput"
                      defaultValue={interestvalues?.interestRate}
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>
              {/* Loan Program */}
            </div>
          )}
        </div>
        <div className="bnePEP">
          <div className="sc-pscky iMXoIt">
            <div
              className="sc-pjHjD cwZLoX"
              onClick={() => setShowMortage(!showMortage)}
            >
              <div className="gqqTSu">
                <div className="jLwdhz">
                  <span className="iuVuVk">Mortgage nsurance</span>
                  <span className="cNBYuL">$0/mo</span>
                </div>
                {/* switch icon */}
                <div className="dropdownIcon">
                  {showMortage ? (
                    <i class="fa fa-angle-up"></i>
                  ) : (
                    <i class="fa fa-angle-down"></i>
                  )}
                </div>
                {/* switch icon */}
              </div>
            </div>
            {showMortage && (
              <div className="calculatorDetailDiv">
                <div className="d-flex align-items-center">
                  <input type="checkbox" />
                  <label className="mb-0 ml-2">
                    Include mortgage insurance
                  </label>
                </div>
                <span className="minorDetail">
                  Mortgage insurance is usually required for down payments below
                  20%.
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="bnePEP">
          <div className="sc-pscky iMXoIt">
            <div
              className="sc-pjHjD cwZLoX"
              onClick={() => setShowtax(!showTax)}
            >
              <div className="gqqTSu">
                <div className="jLwdhz">
                  <span className="iuVuVk">Property taxes</span>
                  <span className="cNBYuL">
                    ${taxRate?.monthTaxRate?.toFixed(2)}/mo
                  </span>
                </div>
                {/* switch icon */}
                <div className="dropdownIcon">
                  {showTax ? (
                    <i class="fa fa-angle-up"></i>
                  ) : (
                    <i class="fa fa-angle-down"></i>
                  )}
                </div>
                {/* switch icon */}
              </div>
            </div>
            {showTax && (
              <div className="calculatorDetailDiv">
                <span className="minorDetail">
                  This estimate is based on the home value and an estimated
                  local tax rate. Actual rate may vary.
                </span>
                <div className="d-flex align-items-end mt-4">
                  <div className="col-3">
                    <label>Home price</label>
                    <p>{myProperty?.listPrice}</p>
                  </div>
                  <div className="col-5">
                    <label>Tax rate</label>
                    <div className="position-relative rightInput">
                      <input
                        type="number"
                        className="w-100 leftInput"
                        defaultValue={taxRate?.percentage}
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <p className="mb-0">
                      = ${taxRate?.yearTaxRate?.toFixed(2)} /year
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bnePEP">
          <div className="sc-pscky iMXoIt">
            <div className="sc-pjHjD cwZLoX">
              <div
                className="gqqTSu"
                onClick={() => setShowInsurance(!showInsurance)}
              >
                <div className="jLwdhz">
                  <span className="iuVuVk">Home insurance</span>
                  <span className="cNBYuL">
                    ${homeInsurance?.perMonthInsurance?.toFixed(2)}/mo
                  </span>
                </div>
                {/* switch icon */}
                <div className="dropdownIcon">
                  {showInsurance ? (
                    <i class="fa fa-angle-up"></i>
                  ) : (
                    <i class="fa fa-angle-down"></i>
                  )}
                </div>
                {/* switch icon */}
              </div>
              {showInsurance && (
                <div className="calculatorDetailDiv">
                  <div>
                    <div className="position-relative rightInput">
                      <input
                        type="number"
                        defaultValue={homeInsurance?.perYearInsurance?.toFixed(
                          2
                        )}
                        className="w-100 leftInput"
                        style={{ paddingLeft: '30px' }}
                      />
                      <span>/ year</span>
                      <span style={{ left: '10px', right: 'unset' }}>$</span>
                    </div>
                    <span className="minorDetail">
                      Some properties require monthly HOA dues to cover common
                      amenities or services.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="kbPcQZ">
        <span className="eUizBk">
          All calculations are estimates and provided for informational purposes
          only. Actual amounts may vary.
        </span>
      </div>
    </div>
  );
};

export default MonthlyCost;
