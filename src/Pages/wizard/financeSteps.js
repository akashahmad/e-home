import "./index.css";
import WizardCard from "./wizardCard";
import { useState } from "react";
// step 2 images
import YesImage from "../../assets/wizardImages/yes@3x.png";
import NoImage from "../../assets/wizardImages/no-stopping@3x.png";
// step 3 images
import TimeImage from "../../assets/wizardImages/fast@3x.png";
import PoorImage from "../../assets/wizardImages/bankruptcy@3x.png";
import YellowLike from "../../assets/wizardImages/like@3x.png";
import BlueLike from "../../assets/wizardImages/like-copy@3x.png";
import GreenLike from "../../assets/wizardImages/like-copy-2@3x.png";
// step 4 images
import SaverImage from "../../assets/wizardImages/bankruptcy@3x.png";
import LoanImage from "../../assets/wizardImages/loan@3x.png";
import { useHistory } from "react-router-dom";
import { emailPath, emailFrom, emailTo } from "../../apiPaths";
import axios from "axios";
import { urlReturn } from "../../helpers";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
const Index = ({
  step,
  setStep,
  name,
  lastName,
  phone,
  email,
  type,
  property,
}) => {
  const replaceValue = (text, name, value) => {
    const lastName = name;
    const sol = text.replace(name, value);
    return sol.indexOf(name) !== -1 ? replaceValue(sol, lastName, value) : sol;
  };
  const [isVisited, setIsVisited] = useState("Yes");
  const [cashOffer, setCashOffer] = useState(null);
  const [provide, setProvide] = useState("$1.000");
  const [fico, setFico] = useState("580");
  const [alreadySecured, setAlreadySecrured] = useState("Yes");
  const [contingent, setContagent] = useState("Yes");
  const [downPayment, setDownPayment] = useState("None");
  // --------
  const [eHomeFunding, setEhomeFunding] = useState(false);
  const [insepection, setInspection] = useState(false);
  const [represent, setRepresent] = useState(false);
  const [agreement, setAgreemnt] = useState(false);
  const [loading, setLoading] = useState(false);
  let history = useHistory();

  const nextStepHandler = () => {
    if (step === 9) {
      setLoading(true);
      let message = `
      <html>
      <head>
      <style>
      #eHomeEmailBody p, #eHomeEmailBody ul li{
        color:black!important;
      }
      </style>
      </head>
      <body id="eHomeEmailBody">
      <p><b>Hi,</b></p>
      <p> I hope this email finds you in good health.</p>
      <p>I want to make an instant offer for <a href="[[link]]" target="_blank">this</a> particular property</p>
      <br/>
      <p><b>Here are details.</b></p>
      <ul>
      <li>My Full-name is: [[name]]</li>
      <li>My email is: [[email]]</li>
      <li>Phone: [[phone]]</li>
      <li>Offer Type:Requiring Financing</li>
      <li>Have you toured the property:[[isVisited]]</li>
      <li>Estimate your FICO credit score:[[fico]]</li>
      <li>Will your offer be contingent upon your current property selling:[[contingent]]</li>
      <li>Do you already secured financing to make an offer on this house:[[alreadySecured]]</li>
      <li>What is the amount of down payment you will apply towards your financing:[[downPayment]]</li>
      <li>What is your all cash offer:[[cashOffer]]</li>
      <li>How much earnest money will you provide as part of this offer?:[[provide]]</li>
      </ul>
      </body>
      </html>
      `;
      message = replaceValue(message, "[[link]]", urlReturn(property));
      message = replaceValue(message, "[[name]]", name + " " + lastName);
      message = replaceValue(message, "[[email]]", email);
      message = replaceValue(message, "[[phone]]", phone);
      message = replaceValue(message, "[[isVisited]]", isVisited);
      message = replaceValue(message, "[[fico]]", fico);
      message = replaceValue(message, "[[contingent]]", contingent);
      message = replaceValue(message, "[[alreadySecured]]", alreadySecured);
      message = replaceValue(message, "[[downPayment]]", downPayment);
      message = replaceValue(message, "[[cashOffer]]", cashOffer);
      message = replaceValue(message, "[[provide]]", provide);

      let data = {
        FromAddress: emailFrom,
        ToAddresses: [emailTo],
        Subject: "Instant offer for property",
        Message: message,
      };
      axios
        .post(emailPath, data)
        .then((res) => {
          NotificationManager.success(
            "Email has been processed",
            "Offer submission"
          );
          setLoading(false);
          history.push("/");
        })
        .catch((err) => {
          NotificationManager.error(
            "Something went wrong.Please try again",
            "Offer submission"
          );
          setLoading(false);
        });

      return;
      return;
    }
    setStep(step + 1);
  };

  return (
    <div>
      {/* step 2 starts */}
      {step === 2 && (
        <div className="container steps_container px-0 py-5">
          <div className="col-12 px-0 d-flex justify-content-between">
            <div className="col-12 col-lg-6 col-xl-6 px-0">
              <div className="col-12 px-0 progress_container">
                <div className="progress px-0 col-5"></div>
              </div>
              <div className="title_container pt-5">
                <h1>Make An Offer</h1>
              </div>
              <div className="title_container py-3">
                <p className="text-secondary font-weight-bold">
                  Have you toured the property?
                </p>
              </div>
              <div className="d-flex justify-content-around py-3">
                <div className="w_22p">
                  <div
                    onClick={() => setIsVisited("Yes")}
                    className={`px-5 py-3 d-flex justify-content-center left_side_box_contaier ${
                      isVisited === "Yes" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={YesImage} />
                  </div>
                  <p className="text-center m-0 py-2 text-secondary">Yes</p>
                </div>
                <div className="w_22p">
                  <div
                    onClick={() => setIsVisited("No")}
                    className={`px-5 py-3 d-flex justify-content-center left_side_box_contaier ${
                      isVisited === "No" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={NoImage} />
                  </div>
                  <p className="text-center m-0 py-2 text-secondary">No</p>
                </div>
              </div>
              <div className="d-flex justify-content-end py-5">
                <button
                  type="submit"
                  className="btn btn-primary px-4 mx-3"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  disabled={!isVisited}
                  type="submit"
                  className="btn btn-primary px-4"
                  onClick={() => nextStepHandler()}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="col-12 right_side col-lg-4 col-xl-5 px-0">
              <WizardCard />
            </div>
          </div>
        </div>
      )}
      {/* step two ends */}
      {/* step 3 starts */}
      {step === 3 && (
        <div class="container steps_container px-0 py-5">
          <div class="col-12 px-0 d-flex justify-content-between">
            <div class="col-12 col-lg-6 col-xl-6 px-0">
              <div class="col-12 px-0 progress_container">
                <div class="progress px-0 col-6"></div>
              </div>
              <div class="title_container pt-5">
                <h1>Make An Offer</h1>
              </div>
              <div class="title_container py-3">
                <p class="text-secondary font-weight-bold">
                  Estimate your FICO credit score?
                </p>
              </div>
              <div class="d-flex justify-content-around py-3">
                <div class="w_22p">
                  <div
                    onClick={() => setFico("580")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      fico === "580" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={PoorImage} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">
                    {"Poor < 580 "}
                  </p>
                </div>
                <div class="w_22p">
                  <div
                    onClick={() => setFico("580-620")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      fico === "580-620" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={YellowLike} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">
                    Fair 580-620
                  </p>
                </div>
                <div class="w_22p">
                  <div
                    onClick={() => setFico("620-700")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      fico === "620-700" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={BlueLike} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">
                    Good 620-700
                  </p>
                </div>
                <div class="w_22p">
                  <div
                    onClick={() => setFico("700+")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      fico === "700+" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={GreenLike} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">
                    Excellent 700 +
                  </p>
                </div>
              </div>
              <div class="d-flex justify-content-end py-5">
                <button
                  type="submit"
                  class="btn btn-primary px-4 mx-3"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button
                  //   disabled={!days}
                  class="btn btn-primary px-4"
                  onClick={() => nextStepHandler()}
                >
                  Next
                </button>
              </div>
            </div>
            <div class="col-12 right_side col-lg-4 col-xl-4 px-0">
              <WizardCard />
            </div>
          </div>
        </div>
      )}
      {/* step 3 ends */}
      {/* step 4 starts */}
      {step === 4 && (
        <div className="container steps_container px-0 py-5">
          <div className="col-12 px-0 d-flex justify-content-between">
            <div className="col-12 col-lg-6 col-xl-6 px-0">
              <div className="col-12 px-0 progress_container">
                <div className="progress px-0 col-7"></div>
              </div>
              <div className="title_container pt-5">
                <h1>Make An Offer</h1>
              </div>
              <div className="title_container py-3">
                <p className="text-secondary font-weight-bold">
                  Will your offer be contingent upon your current property
                  selling?
                </p>
              </div>
              <div className="d-flex justify-content-around py-3">
                <div className="w_22p">
                  <div
                    onClick={() => setContagent("Yes")}
                    className={`px-5 py-3 d-flex justify-content-center left_side_box_contaier ${
                      contingent === "Yes" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={YesImage} />
                  </div>
                  <p className="text-center m-0 py-2 text-secondary">Yes</p>
                </div>
                <div className="w_22p">
                  <div
                    onClick={() => setContagent("No")}
                    className={`px-5 py-3 d-flex justify-content-center left_side_box_contaier ${
                      contingent === "No" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={NoImage} />
                  </div>
                  <p className="text-center m-0 py-2 text-secondary">No</p>
                </div>
              </div>
              <div className="d-flex justify-content-end py-5">
                <button
                  type="submit"
                  className="btn btn-primary px-4 mx-3"
                  onClick={() => setStep(3)}
                >
                  Back
                </button>
                <button
                  //   disabled={!isVisited}
                  type="submit"
                  className="btn btn-primary px-4"
                  onClick={() => nextStepHandler()}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="col-12 right_side col-lg-4 col-xl-5 px-0">
              <WizardCard />
            </div>
          </div>
        </div>
      )}
      {/* step 4 ends */}

      {/* Step 5 starts */}
      {step === 5 && (
        <div className="container steps_container px-0 py-5">
          <div className="col-12 px-0 d-flex justify-content-between">
            <div className="col-12 col-lg-6 col-xl-6 px-0">
              <div className="col-12 px-0 progress_container">
                <div className="progress px-0 col-7"></div>
              </div>
              <div className="title_container pt-5">
                <h1>Make An Offer</h1>
              </div>
              <div className="title_container py-3">
                <p className="text-secondary font-weight-bold">
                  Do you already secured financing to make an offer on this
                  house?
                </p>
              </div>
              <div className="d-flex justify-content-around py-3">
                <div className="w_22p">
                  <div
                    onClick={() => setAlreadySecrured("Yes")}
                    className={`px-5 py-3 d-flex justify-content-center left_side_box_contaier ${
                      alreadySecured === "Yes" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={YesImage} />
                  </div>
                  <p className="text-center m-0 py-2 text-secondary">Yes</p>
                </div>
                <div className="w_22p">
                  <div
                    onClick={() => setAlreadySecrured("No")}
                    className={`px-5 py-3 d-flex justify-content-center left_side_box_contaier ${
                      alreadySecured === "No" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={NoImage} />
                  </div>
                  <p className="text-center m-0 py-2 text-secondary">No</p>
                </div>
              </div>
              <div className="d-flex justify-content-end py-5">
                <button
                  type="submit"
                  className="btn btn-primary px-4 mx-3"
                  onClick={() => setStep(4)}
                >
                  Back
                </button>
                <button
                  //   disabled={!isVisited}
                  type="submit"
                  className="btn btn-primary px-4"
                  onClick={() => nextStepHandler()}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="col-12 right_side col-lg-4 col-xl-5 px-0">
              <WizardCard />
            </div>
          </div>
        </div>
      )}
      {/* Step 5 ends */}
      {/* step 6 stars */}
      {step === 6 && (
        <div className="container steps_container px-0 py-5">
          <div className="col-12 px-0 d-flex justify-content-between">
            <div className="col-12 col-lg-6 col-xl-6 px-0">
              <div className="col-12 px-0 progress_container">
                <div className="progress px-0 col-10"></div>
              </div>
              <div className="title_container pt-5">
                <h1>Make An Offer</h1>
              </div>
              <div className="title_container py-3">
                <p className="text-secondary font-weight-bold">
                  What is the amount of down payment you will apply towards your
                  financing?
                </p>
              </div>

              <div class="d-flex justify-content-around py-3">
                <div class="w_22p">
                  <div
                    onClick={() => setDownPayment("None")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      downPayment === "None" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={TimeImage} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">none%</p>
                </div>
                <div class="w_22p">
                  <div
                    onClick={() => setDownPayment("5%")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      downPayment === "5%" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={TimeImage} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">5%</p>
                </div>
                <div class="w_22p">
                  <div
                    onClick={() => setDownPayment("10%")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      downPayment === "10%" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={TimeImage} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">10%</p>
                </div>
                <div class="w_22p">
                  <div
                    onClick={() => setDownPayment("20% or more")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      downPayment === "20% or more" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={TimeImage} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">20% or more</p>
                </div>
              </div>

              <div className="d-flex justify-content-end py-5">
                <button
                  type="submit"
                  className="btn btn-primary px-4 mx-3"
                  onClick={() => setStep(5)}
                >
                  Back
                </button>
                <button
                  //   disabled={!inspect}
                  type="submit"
                  className="btn btn-primary px-4"
                  onClick={() => nextStepHandler()}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="col-12 right_side col-lg-4 col-xl-5 px-0">
              <WizardCard />
            </div>
          </div>
        </div>
      )}
      {/* step 6 ends */}
      {/* step 7 starts */}
      {step === 7 && (
        <div className="container steps_container px-0 py-5">
          <div className="col-12 px-0 d-flex justify-content-between">
            <div className="col-12 col-lg-6 col-xl-6 px-0">
              <div className="col-12 px-0 progress_container">
                <div className="progress px-0 col-9"></div>
              </div>
              <div className="title_container pt-5">
                <h1>Make An Offer</h1>
              </div>
              <div class="title_container py-3 d-flex justify-content-between">
                <div class="col-5 px-0">
                  <p class="text-secondary font-weight-bold">
                    What is your all cash offer?
                  </p>
                </div>
                <div class="col-7 px-0">
                  <input
                    class="w-100 px-3"
                    placeholder="$"
                    defaultValue={cashOffer}
                    onChange={(e) => setCashOffer(e.target.value)}
                  />
                </div>
              </div>
              <div class="title_container">
                <div class="px-0">
                  <p class="text-secondary font-weight-bold">
                    How much earnest money will you provide as part of this
                    offer?
                  </p>
                </div>
              </div>
              <div class="d-flex justify-content-around py-3">
                <div class="w_22p">
                  <div
                    onClick={() => setProvide("$1.000")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      provide === "$1.000" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={SaverImage} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">$1.000</p>
                </div>
                <div class="w_22p">
                  <div
                    onClick={() => setProvide("$5,000")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      provide === "$5,000" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={LoanImage} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">$5,000</p>
                </div>
                <div class="w_22p">
                  <div
                    onClick={() => setProvide("1% of offer")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      provide === "1% of offer" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={LoanImage} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">1% of offer</p>
                </div>
                <div class="w_22p">
                  <div
                    onClick={() => setProvide("5% of offer +")}
                    class={`px-4 py-3 d-flex justify-content-center left_side_box_contaier ${
                      provide === "5% of offer +" ? "activeDiv" : ""
                    }`}
                  >
                    <img src={LoanImage} />
                  </div>
                  <p class="text-center m-0 py-2 text-secondary">
                    5% of offer +
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-end py-5">
                <button
                  type="submit"
                  className="btn btn-primary px-4 mx-3"
                  onClick={() => setStep(6)}
                >
                  Back
                </button>
                <button
                  disabled={!cashOffer}
                  type="submit"
                  className="btn btn-primary px-4"
                  onClick={() => nextStepHandler()}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="col-12 right_side col-lg-4 col-xl-5 px-0">
              <WizardCard />
            </div>
          </div>
        </div>
      )}
      {step === 8 && (
        <div className="container steps_container px-0 py-5">
          <div className="col-12 px-0 d-flex justify-content-between">
            <div className="col-12 col-lg-6 col-xl-6 px-0">
              <div className="col-12 px-0 progress_container">
                <div className="progress px-0 col-10"></div>
              </div>
              <div className="title_container pt-5">
                <h1>Make An Offer</h1>
              </div>
              <div className="form-check py-2">
                <input
                  type="checkbox"
                  class="form-check-input"
                  defaultValue={eHomeFunding}
                  onChange={(e) => setEhomeFunding(e.target.checked)}
                />
                <label
                  className="form-check-label font-weight-bold text-muted"
                  for="Check1"
                >
                  By checking this box you agree to have our ehomefunding
                  mortgage advisors review your offer and reach out to you
                  directly. eHomefunding has very competitive financing
                  programs.
                  <span className="text_blue">
                    Agree to terms & conditions.
                  </span>
                </label>
              </div>
              <div class="form-check py-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  defaultValue={insepection}
                  onChange={(e) => setInspection(e.target.checked)}
                />
                <label
                  className="form-check-label font-weight-bold text-muted"
                  for="Check1"
                >
                  By checking this box you understand that a lender may require
                  a home inspection and appraisal as part of your purchasing
                  this property.
                  <span className="text_blue">
                    Agree to terms & conditions.
                  </span>
                </label>
              </div>
              <b className="mt-8" style={{ textDecoration: "underline" }}>
                Please check the required fields
              </b>
              <div className="d-flex justify-content-end py-5">
                <button
                  type="submit"
                  className="btn btn-primary px-4 mx-3"
                  onClick={() => setStep(7)}
                >
                  Back
                </button>
                <button
                  disabled={!eHomeFunding || !insepection}
                  type="submit"
                  className="btn btn-primary px-4"
                  onClick={() => nextStepHandler()}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="col-12 right_side col-lg-4 col-xl-5 px-0">
              <WizardCard />
            </div>
          </div>
        </div>
      )}
      {/* step 7 ends */}
      {step === 9 && (
        <div className="container steps_container px-0 py-5">
          <div className="col-12 px-0 d-flex justify-content-between">
            <div className="col-12 col-lg-6 col-xl-6 px-0">
              <div className="col-12 px-0 progress_container">
                <div className="progress px-0 col-12"></div>
              </div>
              <div className="title_container pt-5">
                <h1>Make An Offer</h1>
              </div>
              <div className="form-check py-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  defaultValue={represent}
                  onChange={(e) => setRepresent(e.target.checked)}
                />
                <label
                  className="form-check-label font-weight-bold text-muted"
                  for="Check1"
                >
                  By checking this box you agree to utilize our eHomeoffer
                  advisor as your buyer real estate agent to represent you in
                  this offer.
                  <span className="text_blue">
                    Agree to terms & conditions.
                  </span>
                </label>
              </div>
              <div className="form-check py-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  defaultValue={agreement}
                  onChange={(e) => setAgreemnt(e.target.checked)}
                />
                <label
                  className="form-check-label font-weight-bold text-muted"
                  for="Check1"
                >
                  By checking this box you agree that your offer is a legally
                  binding agreement, and it is your unequivocal intent to
                  acquire the property based on the terms you presented.
                </label>
              </div>
              <b className="mt-8" style={{ textDecoration: "underline" }}>
                Please check the required fields
              </b>
              <div className="d-flex justify-content-end py-5">
                <button
                  type="submit"
                  className="btn btn-primary px-4 mx-3"
                  onClick={() => setStep(8)}
                >
                  Back
                </button>
                <button
                  disabled={!represent || !agreement}
                  type="submit"
                  className="btn btn-primary px-4"
                  onClick={() => nextStepHandler()}
                >
                  {
                    loading ? "Submitting" : "  Submit"
                  }
                
                </button>
              </div>
            </div>

            <div className="col-12 right_side col-lg-4 col-xl-5 px-0">
              <WizardCard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Index;
