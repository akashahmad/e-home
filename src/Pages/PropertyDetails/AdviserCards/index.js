import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/LogoeHome.png";
import "./index.css";
import axios from "axios";
import { Formik } from "formik";
import { emailPath, emailFrom, emailTo } from "../../../apiPaths";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { urlReturn } from "../../../helpers";

const AdviserCards = ({ agentData, lenderData, myProperty }) => {
  const replaceValue = (text, name, value) => {
    const lastName = name;
    const sol = text.replace(name, value);
    return sol.indexOf(name) !== -1 ? replaceValue(sol, lastName, value) : sol;
  };
  const [agentInital, setAgentInital] = useState({
    name: "",
    email: "",
    phone: "",
    usMilitary: false,
    approvedByLender: false,
  });
  const [lenderInital, setLenderInitail] = useState({
    name: "",
    email: "",
    phone: "",
    usMilitary: false,
    approvedByLender: false,
  });
  const [agentLoading, setAgentLoading] = useState(false);
  const [lenderLoading, setLenderLoading] = useState(false);

  const agentSubmitHandler = (values) => {
    let message;
    let data;
    setAgentLoading(true);
    if (agentData) {
      message = `
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
      <p>I'm reaching out to you for  <a href="[[link]]" target="_blank">this</a> particular property</p>
      <br/>
      <p><b>Here are my details.</b></p>
      <ul>
      <li>My Full-name is: [[name]]</li>
      <li>My email is: [[email]]</li>
      <li>My phone number is: [[number]]</li>
      <li>Did you serve in the U.S. Military:[[military]]</li>
      <li>Do you want to get pre-approved by a lender:[[lender]]</li>
      </ul>
      <br/>
      <p><b>Here are advisor's details.</b></p>
      <ul>
      <li>Name: [[agentName]]</li>
      <li>Email: [[agentEmail]]</li>
      </ul>
      </body>
      </html>
      `;
      message = replaceValue(message, "[[agentName]]", agentData.agentName);
      message = replaceValue(message, "[[agentEmail]]", agentData.agentEmail);
    } else {
      message = `
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
      <p>I'm reaching out to you for  <a href="[[link]]" target="_blank">this</a> particular property</p>
      <br/>
      <p><b>Here are my details.</b></p>
      <ul>
      <li>My Full-name is: [[name]]</li>
      <li>My email is: [[email]]</li>
      <li>My phone number is: [[number]]</li>
      <li>Did you serve in the U.S. Military:[[military]]</li>
      <li>Do you want to get pre-approved by a lender:[[lender]]</li>
      </ul>
      </body>
      </html>
      `;
    }

    message = replaceValue(message, "[[name]]", values.name);
    message = replaceValue(message, "[[email]]", values.email);
    message = replaceValue(message, "[[number]]", values.phone);
    message = replaceValue(message, "[[link]]", urlReturn(myProperty));
    message = replaceValue(
      message,
      "[[military]]",
      values.usMilitary ? "Yes" : "No"
    );
    message = replaceValue(
      message,
      "[[lender]]",
      values.approvedByLender ? "Yes" : "No"
    );
    data = {
      FromAddress: emailFrom,
      ToAddresses: emailTo,
      Subject: agentData ? "Contact advisor" : "Contact ehome advisor",
      Message: message,
    };
    axios
      .post(emailPath, data)
      .then((res) => {
        NotificationManager.success(
          "Email has been processed",
          "Contact Advisor"
        );
        setAgentLoading(false);
      })
      .catch((err) => {
        NotificationManager.error(
          "Something went wrong.Please try again",
          "Contact Advisor"
        );
        setAgentLoading(false);
      });
    setAgentInital({
      name: "",
      email: "",
      phone: "",
      usMilitary: false,
      approvedByLender: false,
    });
  };

  const lenderSubmitHandler = (values) => {
    let message;
    let data;
    setLenderLoading(true);
    if (lenderData) {
      message = `
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
      <p>I'm reaching out to you for  <a href="[[link]]" target="_blank">this</a> particular property</p>
      <br/>
      <p><b>Here are my details.</b></p>
      <ul>
      <li>My Full-name is: [[name]]</li>
      <li>My email is: [[email]]</li>
      <li>My phone number is: [[number]]</li>
      <li>Did you serve in the U.S. Military:[[military]]</li>
      <li>Do you want to get pre-approved by a lender:[[lender]]</li>
      </ul>
      <br/>
      <p><b>Here are lenders's details.</b></p>
      <ul>
      <li>Name: [[agentName]]</li>
      <li>Email: [[agentEmail]]</li>
      </ul>
      </body>
      </html>
      `;
      message = replaceValue(message, "[[agentName]]", lenderData.lenderName);
      message = replaceValue(message, "[[agentEmail]]", lenderData.lenderEmail);
    } else {
      message = `
      <html>
      <style>
      #eHomeEmailBody p, #eHomeEmailBody ul li{
        color:black!important;
      }
      </style>
      <body id="eHomeEmailBody">
      <p><b>Hi,</b></p>
      <p> I hope this email finds you in good health.</p>
      <p>I'm reaching out to you for  <a href="[[link]]" target="_blank">this</a> particular property</p>
      <br/>
      <p><b>Here are my details.</b></p>
      <ul>
      <li>My Full-name is: [[name]]</li>
      <li>My email is: [[email]]</li>
      <li>My phone number is: [[number]]</li>
      <li>Did you serve in the U.S. Military:[[military]]</li>
      <li>Do you want to get pre-approved by a lender:[[lender]]</li>
      </ul>
      </body>
      </html>
      `;
    }

    message = replaceValue(message, "[[name]]", values.name);
    message = replaceValue(message, "[[email]]", values.email);
    message = replaceValue(message, "[[number]]", values.phone);
    message = replaceValue(message, "[[link]]", urlReturn(myProperty));
    message = replaceValue(
      message,
      "[[military]]",
      values.usMilitary ? "Yes" : "No"
    );
    message = replaceValue(
      message,
      "[[lender]]",
      values.approvedByLender ? "Yes" : "No"
    );
    data = {
      FromAddress: emailFrom,
      ToAddresses: emailTo,
      Subject: lenderData ? "Contact lender" : "Contact ehome lender",
      Message: message,
    };
    axios
      .post(emailPath, data)
      .then((res) => {
        NotificationManager.success(
          "Email has been processed",
          "Contact Lender"
        );
        setLenderLoading(false);
      })
      .catch((err) => {
        NotificationManager.error(
          "Something went wrong.Please try again",
          "Contact Lender"
        );
        setLenderLoading(false);
      });
    setLenderInitail({
      name: "",
      email: "",
      phone: "",
      usMilitary: false,
      approvedByLender: false,
    });
  };
  return (
    <div className="col-12  px-0">
      {/* Card for agent */}
      <div className="profile_section_container mt-4 mb-4 col-10 mx-auto pl-0 align-items-center">
        <div className="col-12 px-2 py-2 card">
          <div
            className={`d-flex icon_title_container align-items-center px-2 ${
              agentData ? " " : "pb-4"
            }`}
          >
            <div>
              <img src="https://i.ibb.co/wSm9QHw/e-homeoffer-color-logo-new-copy-3-3x.png" />
            </div>
            <div className="px-4">
              <h2 className="m-0">
                Contact {!agentData && <span>ehome </span>} advisor
              </h2>
            </div>
          </div>
          {agentData && (
            <div className="py-3 px-0 d-flex profile_image_container align-items-center">
              <div>
                <img
                  className="card-img-top"
                  src={agentData.agentImage && agentData.agentImage}
                  alt="Card"
                />
              </div>
              <div className="pt-3 pl-3">
                <h3 className="m-0 py-1">
                  {agentData.agentName && agentData.agentName}
                </h3>
                {/* <h4 className='m-0'>Branch Manager</h4> */}
                <h5 className="m-0">
                  {agentData.agentAddress && agentData.agentAddress}
                </h5>
                <a href={agentData.agentTwitter && agentData.agentTwitter}>
                  Visit My Site
                </a>
              </div>
            </div>
          )}
          {agentData && (
            <ul className="d-flex px-3 justify-content-between tabsList pb-3">
              <li>Email</li>
              <li>Call Now</li>
              <li>Request Showing</li>
            </ul>
          )}
          <Formik
            enableReinitialize={true}
            initialValues={agentInital}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.name) {
                errors.name = "Required";
              }
              if (!values.phone) {
                errors.phone = "Required";
              }
              return errors;
            }}
            onSubmit={agentSubmitHandler}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form className="px-3" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Full Name"
                    name="name"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  {errors.name && touched.name && (
                    <p
                      className="mb-0"
                      style={{ fontSize: "8px", color: "red" }}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <p
                      className="mb-0"
                      style={{ fontSize: "8px", color: "red" }}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Phone Number"
                    name="phone"
                    type="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                  />
                  {errors.phone && touched.phone && (
                    <p
                      className="mb-0"
                      style={{ fontSize: "8px", color: "red" }}
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="form-check py-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                    name="usMilitary"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.usMilitary}
                  />
                  <label className="form-check-label" for="exampleCheck1">
                    I have served in the U.S. Military.
                  </label>
                </div>
                <div className="form-check py-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                    name="approvedByLender"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.approvedByLender}
                  />
                  <label className="form-check-label" for="exampleCheck1">
                    Get pre-approved by a lender.
                  </label>
                </div>
                <div className="d-flex justify-content-center py-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-5"
                    style={{ fontSize: "12px" }}
                  >
                    {agentLoading ? (
                      "Submitting"
                    ) : (
                      <span> Email Advisor {agentData && <span>Realtor</span>}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
      {/* card for lender */}
      <div className="profile_section_container mt-4 mb-4 col-10 mx-auto  align-items-center pl-0 ">
        <div className="col-12 px-2 py-2 card">
          <div
            className={`d-flex icon_title_container align-items-center px-2 ${
              lenderData ? " " : "pb-4"
            }`}
          >
            <div>
              <img src="https://i.ibb.co/wSm9QHw/e-homeoffer-color-logo-new-copy-3-3x.png" />
            </div>
            <div className="px-4">
              <h2 className="m-0">
                Contact {!lenderData && <span>ehome </span>} lender
              </h2>
            </div>
          </div>
          {lenderData && (
            <div className="py-3 px-0 d-flex profile_image_container align-items-center">
              <div>
                <img
                  className="card-img-top"
                  src={lenderData.lenderImage && lenderData.lenderImage}
                  alt="Card"
                />
              </div>
              <div className="pt-3 pl-3">
                <h3 className="m-0 py-1">
                  {lenderData.lenderName && lenderData.lenderName}
                </h3>
                {/* <h4 className='m-0'>Branch Manager</h4> */}
                <h5 className="m-0 ">
                  {lenderData.lenderAddress && lenderData.lenderAddress}
                </h5>
                <a href={lenderData.lenderTwitter && lenderData.lenderTwitter}>
                  Visit My Site
                </a>
              </div>
            </div>
          )}
          {lenderData && (
            <ul className="d-flex px-3 justify-content-between tabsList pb-3">
              <li>Email</li>
              <li>Call Now</li>
              <li>Request Showing</li>
            </ul>
          )}

          <Formik
            enableReinitialize={true}
            initialValues={lenderInital}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.name) {
                errors.name = "Required";
              }
              if (!values.phone) {
                errors.phone = "Required";
              }
              return errors;
            }}
            onSubmit={lenderSubmitHandler}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form className="px-3" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Full Name"
                    name="name"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  {errors.name && touched.name && (
                    <p
                      className="mb-0"
                      style={{ fontSize: "8px", color: "red" }}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <p
                      className="mb-0"
                      style={{ fontSize: "8px", color: "red" }}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Phone Number"
                    name="phone"
                    type="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                  />
                  {errors.phone && touched.phone && (
                    <p
                      className="mb-0"
                      style={{ fontSize: "8px", color: "red" }}
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="form-check py-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                    name="usMilitary"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.usMilitary}
                  />
                  <label className="form-check-label" for="exampleCheck1">
                    I have served in the U.S. Military.
                  </label>
                </div>
                <div className="form-check py-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                    name="approvedByLender"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.approvedByLender}
                  />
                  <label className="form-check-label" for="exampleCheck1">
                    Get pre-approved by a lender.
                  </label>
                </div>
                <div className="d-flex justify-content-center py-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-5"
                    style={{ fontSize: "12px" }}
                  >
                    {lenderLoading ? (
                      "Submitting"
                    ) : (
                      <span>Get Prequalified Today {agentData && <span>Realtor</span>}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AdviserCards;
