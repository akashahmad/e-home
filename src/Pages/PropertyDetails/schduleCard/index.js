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
const Index = ({ modalDates, myProperty, setShowDateModal }) => {
  const replaceValue = (text, name, value) => {
    const lastName = name;
    const sol = text.replace(name, value);
    return sol.indexOf(name) !== -1 ? replaceValue(sol, lastName, value) : sol;
  };
  const [selectedDate, setSelectedDate] = useState(modalDates && modalDates[0]);
  const [selectedTime, setSelectedTime] = useState("11:00 am");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
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
  const submitHandler = (e) => {
    e.preventDefault();
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
    <li>My email is: [[email]]</li>
    <li>Date: [[date]]</li>
    <li>Time:[[time]]</li>
    </ul>
    </body>
    </html>
    `;
    if (!name) {
    
      setNameError("Please enter your name");
      return;
    }
    if (!email) {
      setEmailError("Please enter your email");
      return;
    }
    setLoading(true);
    message = replaceValue(message, "[[name]]", name);
    message = replaceValue(message, "[[email]]", email);
    message = replaceValue(message, "[[date]]", selectedDate);
    message = replaceValue(message, "[[time]]", selectedTime);
    message = replaceValue(message, "[[link]]", urlReturn(myProperty));
    let data = {
      FromAddress: emailFrom,
      ToAddresses: [emailTo],
      Subject: "Tour with a Buyer's Agent",
      Message: message,
    };
    axios
      .post(emailPath, data)
      .then((res) => {
        NotificationManager.success(
          "Email has been processed",
          "Tour with agent"
        );
        setLoading(false);
      })
      .catch((err) => {
        NotificationManager.error(
          "Something went wrong.Please try again",
          "Tour with agent"
        );
        setLoading(false);
      });
    setName("");
    setSelectedTime("11:00 am");
    setSelectedDate(modalDates && modalDates[0]);
    setEmail("");
    if (setShowDateModal) {
      setShowDateModal(false);
    }
  };
  const NameHandler = (value) => {
    setName(value);
    setNameError("");
  };
  const emailHandler = (value) => {
    setEmailError("");
    setEmail(value);
  };
  console.log(selectedTime, "check time");
  return (
    <div className="ivyodi" id="schedule">
      <div className="col-10 mx-auto px-2 py-2 card">
        <p
          className="bpPStC scheduleCardHeading"
          style={{ fontSize: "18px", textAlign: "center" }}
        >
          <strong>Tour with a Buyer's Agent</strong>
        </p>
        <div className="gwtwTs">
          We'll connect you with a local agent who can give you a personalized
          tour of the home in-person or via video chat.
        </div>
        <form onSubmit={(e) => submitHandler(e)}>
          <input
            type="text"
            className="form-control mt-4"
            placeholder="Name"
            onChange={(e) => NameHandler(e.target.value)}
          />
          {nameError && (
            <p className="mb-0" style={{ fontSize: "8px", color: "red" }}>
              {nameError}
            </p>
          )}
          <input
            type="email"
            className="form-control mt-2"
            placeholder="Email"
            onChange={(e) => emailHandler(e.target.value)}
          />
          {emailError && (
            <p className="mb-0" style={{ fontSize: "8px", color: "red" }}>
              {emailError}
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
                        <p className="day mb-0">{moment(date).format("ddd")}</p>
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
            onChange={(e) => setSelectedTime(e.target.value)}
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
          <button
            type="submit"
            id="selectDatebutton"
            className="offerMakeButton my-4"
            style={{ backgroundColor: "#336699" }}
          >
            {loading ? "Requesting..." : "Request this time"}
          </button>
        </form>
        <div
          className="w-100 d-flex align-items-center mb-4 pl-4"
          style={{ color: "#336699" }}
        >
          <div
            style={{
              minWidth: "20px",
              minHeight: "20px",
              borderRadius: "20px",
              backgroundColor: "#336699",
            }}
            className="d-flex justify-content-center align-items-center mr-1"
          >
            <i
              class="fa fa-dollar-sign"
              style={{
                color: "white",
                fontSize: "10px",
              }}
            ></i>
          </div>{" "}
          Public Health Advisory
        </div>
      </div>
    </div>
  );
};
export default Index;
