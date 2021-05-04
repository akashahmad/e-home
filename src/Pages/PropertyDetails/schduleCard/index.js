import { useState } from "react";
import moment from "moment";
import Carousel from "react-multi-carousel";
import { urlReturn } from "../../../helpers";
import { emailPath, emailFrom, emailTo } from "../../../apiPaths";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { Formik } from "formik";
const Index = ({ modalDates, myProperty, setShowDateModal }) => {
  const replaceValue = (text, name, value) => {
    const lastName = name;
    const sol = text.replace(name, value);
    return sol.indexOf(name) !== -1 ? replaceValue(sol, lastName, value) : sol;
  };
  const [selectedDate, setSelectedDate] = useState(modalDates && modalDates[0]);
  const [loading, setLoading] = useState(false);
  const [formInitial, setFormInitial] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    selectedTime: "9:00 am",
  });
console.log(selectedDate,"check selcted date")
  const responsiveDates = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const times = [
    "9:00 am",
    "9:30 am",
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
    "12:00 pm",
    "12:30 pm",
    "1:00 pm",
    "1:30 pm",
    "2:00 pm",
    "2:30 pm",
    "3:00 pm",
    "3:30 pm",
    "4:00 pm",
    "4:30 pm",
    "5:00 pm",
    "5:30 pm",
    "6:00 pm",
    "6:30 pm",
    "7:00 pm",
  ];
  const submitHandler = (values) => {
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
    <p>I'm reaching out to you for tour with a Buyer's Agent for <a href="[[link]]" target="_blank">this</a> particular property</p>
    <br/>
    <p><b>Here are details.</b></p>
    <ul>
    <li>My Full-name is: [[name]]</li>
    <li>My email is: [[phone]]</li>
    <li>My email is: [[email]]</li>
    <li>Date: [[date]]</li>
    <li>Time:[[time]]</li>
    </ul>
    </body>
    </html>
    `;

    setLoading(true);
    message = replaceValue(
      message,
      "[[name]]",
      values.firstName + " " + values.lastName
    );
    message = replaceValue(message, "[[email]]", values.email);
    message = replaceValue(message, "[[phone]]", values.phone);
    message = replaceValue(message, "[[date]]", selectedDate);
    message = replaceValue(message, "[[time]]", values.selectedTime);
    message = replaceValue(message, "[[link]]", urlReturn(myProperty));
    let data = {
      FromAddress: emailFrom,
      ToAddresses: emailTo,
      Subject: "Tour with a eHome Advisor",
      Message: message,
    };
    axios
      .post(emailPath, data)
      .then((res) => {
        NotificationManager.success(
          "Email has been processed",
          "Tour with eHome Advisor"
        );
        setLoading(false);
      })
      .catch((err) => {
        NotificationManager.error(
          "Something went wrong.Please try again",
          "Tour with eHome Advisor"
        );
        setLoading(false);
      });
    if (setShowDateModal) {
      setShowDateModal(false);
    }
  };
  return (
    <div className="ivyodi" id="schedule">
      <div className="col-10 mx-auto px-2 py-2 card">
        <p
          className="bpPStC scheduleCardHeading"
          style={{ fontSize: "18px", textAlign: "center" }}
        >
          <strong>Tour with eHome Advisor</strong>
        </p>
        <div className="gwtwTs">
          We will connect you with our eHome Advisor who can give you a
          professional and personalized tour of this home or with video chat.
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={formInitial}
          validate={(values) => {
            const errors = {};

            if (!values.firstName) {
              errors.firstName = "Required";
            }
            if (!values.lastName) {
              errors.lastName = "Required";
            }
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            if (!values.phone) {
              errors.phone = "Required";
            }
            return errors;
          }}
          onSubmit={submitHandler}
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
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mt-4"
                placeholder="First Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                name="firstName"
              />
              {errors.firstName && touched.firstName && (
                <p className="mb-0" style={{ fontSize: "8px", color: "red" }}>
                  {errors.firstName}
                </p>
              )}
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Last Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
                name="lastName"
              />
              {errors.lastName && touched.lastName && (
                <p className="mb-0" style={{ fontSize: "8px", color: "red" }}>
                  {errors.lastName}
                </p>
              )}
              <input
                type="email"
                className="form-control mt-2"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                name="email"
              />
              {errors.email && touched.email && (
                <p className="mb-0" style={{ fontSize: "8px", color: "red" }}>
                  {errors.email}
                </p>
              )}
              <input
                type="tel"
                className="form-control mt-2"
                placeholder="Phone"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
                name="phone"
              />
              {errors.phone && touched.phone && (
                <p className="mb-0" style={{ fontSize: "8px", color: "red" }}>
                  {errors.phone}
                </p>
              )}
              <h5 className="dTAnOx py-4">Select a date</h5>
              <div className="col-10 mx-auto position-relative">
                {modalDates && (
                  <Carousel responsive={responsiveDates}>
                    {modalDates.map((date, index) => {
                      return (
                        <div className="mx-1" key={index}>
                          <div
                            className={
                              selectedDate === date
                                ? " dateCardActive"
                                : "dateCardInActive"
                            }
                            onClick={() => setSelectedDate(date)}
                          >
                            <p className="day mb-0">
                              {moment(date).format("ddd")}
                            </p>
                            <p className="mb-0">
                              {moment(date).format("MMM")}&nbsp;
                              {moment(date).format("D")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                )}
              </div>
              <select
                className="mt-4"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.selectedTime}
                name="selectedTime"
              >
                {times &&
                  times.map((time, index) => {
                    return (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    );
                  })}
              </select>
              {errors.selectedTime && touched.selectedTime && (
                <p className="mb-0" style={{ fontSize: "8px", color: "red" }}>
                  {errors.selectedTime}
                </p>
              )}
              <button
                type="submit"
                id="selectDatebutton"
                className="offerMakeButton my-4"
                style={{ backgroundColor: "#336699" }}
              >
                {loading ? "Requesting..." : "Request this time"}
              </button>
            </form>
          )}
        </Formik>
        <div
          className="w-100 d-flex align-items-center mb-4"
          style={{ color: "#336699" }}
        >
          By submitting this request you agree to out terms and conditions.
        </div>
      </div>
    </div>
  );
};
export default Index;
