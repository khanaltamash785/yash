import React, { useEffect, useState } from "react";
import "./form.scss";
import ReactPageScroller from "react-page-scroller";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Button, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SubdirectoryArrowLeftIcon from "@mui/icons-material/SubdirectoryArrowLeft";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MobileStepper from "@mui/material/MobileStepper";
import PhoneInput from "react-phone-input-2";
import "./phoneInput.scss";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Form = () => {
  const myUUID = uuidv4();
  const [number, setNumber] = useState(0);
  const [err, setErr] = useState(false);
  const [errorId, setErrorId] = useState("");
  const [question, setQuestion] = useState([]);
  const [ans, setAns] = useState(null);
  const [blockScroll, setBlockScroll] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  console.log(surveyCompleted);
  const [loading, setLoading] = useState(false);
  const [overAllError, setOverAllError] = useState([]);
  useEffect(() => {
    if (question.length === 0) {
      getQuestion();
    }
  }, []);

  useEffect(() => {
    if (overAllError.length > 0) {
      alert("Please Fill The field above");
    }
  }, [overAllError]);

  const getQuestion = async () => {
    setLoading(true);
    axios.get("/user/get").then((resp) => {
      setQuestion(resp.data.data);
      if (resp.data.data) {
        setLoading(false);
      }
    });
  };

  const postAns = async () => {
    setLoading(true);
    let resp = await axios.post("/answer/bulkpostanswer", ans);
    if (resp.data.status === true) {
      setSurveyCompleted(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    let payMap = [];
    question &&
      question.map((value, i) => {
        if (value.dataType === "checkbox") {
          let payload = {
            UserID: value.UserID,
            UUID: myUUID,
            Question_ID: value._id,
            Answer: [],
          };
          payMap.push(payload);
        } else {
          let payload = {
            UserID: value.UserID,
            UUID: myUUID,
            Question_ID: value._id,
            Answer: "",
          };
          payMap.push(payload);
        }
      });
    setAns(payMap);
  }, [question]);

  const handleCheckError = () => {
    let data = [];
    ans.filter((value, i) => {
      if (Array.isArray(value.Answer)) {
        if (value.Answer.length === 0) {
          data.push(value.Question_ID);
        }
      } else if (value.Answer === "") {
        data.push(value.Question_ID);
      } else if (data.length === 0 && i === 0) {
        postAns();
      }
    });
    setOverAllError(data);
  };

  const handleOverAllError = (i, id) => {
    if (ans && ans[i] && ans[i].Answer && Array.isArray(ans[i].Answer)) {
      if (
        ans &&
        ans[i] &&
        ans[i].Answer.length > 0 &&
        ans[i].Question_ID === id &&
        overAllError
      ) {
        let index = overAllError.indexOf(id);
        overAllError.splice(index, 1);
      }
    } else if (
      ans &&
      ans[i] &&
      ans[i].Answer === "" &&
      ans[i].Question_ID === id &&
      overAllError
    ) {
      let index = overAllError.indexOf(id);
      overAllError.splice(index, 1);
    }
  };

  const handleCheck = (value, i) => {
    if (value.dataType === "text") {
      return (
        <TextField
          className="Textfield"
          placeholder="Type Your answer here..."
          value={ans && ans[i] && ans[i].Answer}
          onChange={(e) => {
            handleOverAllError(i, ans[i].Question_ID);
            if (ans && ans[i] && ans[i].Question_ID === value._id) {
              let items = [...ans];
              if (items && items[i]) {
                items[i].Answer = e.target.value;
                setAns(items);
              }
            }
            setErr(false);
          }}
          variant="standard"
          type={value.type}
          inputProps={{ style: { fontSize: "20px" } }}
          error={
            errorId === value._id
              ? err
              : overAllError && overAllError.includes(value._id)
              ? true
              : null
          }
          helperText={
            errorId === value._id && err
              ? ` This is required!`
              : overAllError && overAllError.includes(value._id)
              ? ` This is required!`
              : null
          }
        />
      );
    } else if (value.dataType === "radio" || value.dataType === "select") {
      return (
        <div
          className="list_check_box"
          onClick={() => {
            handleOverAllError(i, ans[i].Question_ID);
            if (value.extraValue.length > 5) {
              if (blockScroll === false) {
                setBlockScroll(true);
              }
            }
          }}
        >
          {value.extraValue?.map((data, index) => (
            <div
              className="check_box"
              key={index}
              style={{
                border:
                  ans &&
                  ans[i] &&
                  ans[i].Answer === data &&
                  "2px solid #203c6c",
              }}
              onClick={() => {
                handleOverAllError(i, ans[i].Question_ID);
                setErr(false);
                if (ans && ans[i] && ans[i].Question_ID === value._id) {
                  let items = [...ans];
                  if (items && items[i]) {
                    items[i].Answer = data;
                    setAns(items);
                  }
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "20px",
                  paddingRight: "50px",
                }}
              >
                <div
                  className="check_box_serial_number"
                  style={{
                    backgroundColor:
                      ans && ans[i] && ans[i].Answer === data && "#203c6c",
                    color: ans && ans[i] && ans[i].Answer === data && "white",
                  }}
                >
                  {index + 1}
                </div>
                <div>{data}</div>
              </div>
              {ans && ans[i] && ans[i].Answer === data && (
                <CheckIcon style={{ fontSize: 15 }} />
              )}
            </div>
          ))}
        </div>
      );
    } else if (value.dataType === "checkbox") {
      return (
        <div
          className="list_check_box"
          onClick={() => {
            handleOverAllError(i, ans[i].Question_ID);
            if (value.extraValue.length >= 5) {
              if (blockScroll === false) {
                setBlockScroll(true);
              }
            }
          }}
        >
          <div style={{ fontSize: "12px" }}>
            (Select Multiple)&nbsp;&nbsp;
            {value.extraValue.length >= 5 &&
              "Please select once then you scroll items"}
          </div>

          {value.extraValue?.map((data, index) => (
            <div
              className="check_box"
              style={{
                border:
                  ans &&
                  ans[i] &&
                  ans[i].Answer.includes(data) &&
                  "2px solid #203c6c",
              }}
              key={index}
              onClick={() => {
                setErr(false);
                if (ans && ans[i] && !ans[i].Answer.includes(data)) {
                  let items = [...ans];
                  items[i].Answer.push(data);
                  setAns(items);
                } else {
                  ans &&
                    ans[i].Answer.filter((list, ind) => {
                      if (list === data) {
                        let item = [...ans];
                        item[i].Answer.splice(ind, 1);
                        setAns(item);
                      }
                    });
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "20px",
                  paddingRight: "50px",
                }}
              >
                <div
                  className="check_box_serial_number"
                  style={{
                    backgroundColor:
                      ans &&
                      ans[i] &&
                      ans[i].Answer.includes(data) &&
                      "#203c6c",
                    color:
                      ans && ans[i] && ans[i].Answer.includes(data) && "white",
                  }}
                >
                  {index + 1}
                </div>
                <div>{data}</div>
              </div>
              {ans && ans[i] && ans[i].Answer.includes(data) && (
                <CheckIcon style={{ fontSize: 15 }} />
              )}
            </div>
          ))}
        </div>
      );
    } else if (value.dataType === "phoneinput") {
      return (
        <div
          onClick={() => {
            if (blockScroll === false) {
              setBlockScroll(true);
            }
          }}
        >
          <PhoneInput
            country={"kw"}
            specialLabel={""}
            value={ans && ans[i] && ans[i].Answer}
            onChange={(phone) => {
              handleOverAllError(i, ans[i].Question_ID);
              setBlockScroll(false);
              if (ans && ans[i] && ans[i].Question_ID === value._id) {
                let items = [...ans];
                if (items && items[i]) {
                  items[i].Answer = phone;
                  setAns(items);
                }
              }
            }}
          />
          {errorId === value._id && err ? (
            <div style={{ color: "red", fontSize: "12px", marginTop: "10px" }}>
              Phone Input is required!
            </div>
          ) : overAllError && overAllError.includes(value._id) ? (
            <div style={{ color: "red", fontSize: "12px", marginTop: "10px" }}>
              Phone Input is required!
            </div>
          ) : null}
        </div>
      );
    }
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {surveyCompleted === true ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            boxSizing: "border-box",
            fontSize: "30px",
            textAlign: "center",
            color: "#203c6c",
          }}
        >
          Thank you. We'll get in touch with you shortly.
        </div>
      ) : (
        <>
          <MobileStepper
            variant="progress"
            steps={question && question.length}
            position="top"
            activeStep={number}
            style={{ width: "200%", padding: "0px" }}
          />
          {question.length > 0 && (
            <ReactPageScroller
              customPageNumber={number}
              blockScrollDown={blockScroll}
              blockScrollUp={blockScroll}
              pageOnChange={(value) => {
                setNumber(value);
              }}
              animationTimer={400}
            >
              {question &&
                question.map((value, i) => {
                  return (
                    <div className="page" key={i}>
                      <div className="contanit_div">
                        <div className="serial_number">
                          <div
                            style={{
                              fontSize: "15px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span> {i + 1}</span>
                            <ArrowRightAltIcon style={{ fontSize: 15 }} />
                          </div>
                        </div>

                        <div className="content_body">
                          <div className="heading">{value.Question} *</div>
                          {handleCheck(value, i)}
                          {err === true &&
                          errorId === value._id &&
                          value.dataType !== "text" &&
                          value.dataType !== "phoneinput" ? (
                            <div
                              style={{
                                color: "red",
                                fontSize: "12px",
                                marginTop: "10px",
                              }}
                            >
                              Please select a field
                            </div>
                          ) : value.dataType !== "text" &&
                            value.dataType !== "phoneinput" &&
                            overAllError &&
                            overAllError.includes(value._id) ? (
                            <div
                              style={{
                                color: "red",
                                fontSize: "12px",
                                marginTop: "10px",
                              }}
                            >
                              Phone Input is required!
                            </div>
                          ) : null}
                          <div className="ok_button">
                            {question.length - 1 === number ? (
                              <Button
                                color="primary"
                                onClick={() => {
                                  setErrorId(value._id);
                                  if (Array.isArray(ans[i]?.Answer)) {
                                    if (ans[i]?.Answer.length === 0) {
                                      setErr(true);
                                      return;
                                    }
                                  } else if (ans[i]?.Answer === "") {
                                    setErr(true);
                                    return;
                                  }
                                  handleCheckError();
                                }}
                                variant="contained"
                                style={{
                                  fontWeight: "bold",
                                  backgroundColor: "#203c6c",
                                }}
                              >
                                Submit
                              </Button>
                            ) : (
                              <Button
                                color="primary"
                                onClick={() => {
                                  setErrorId(value._id);
                                  if (Array.isArray(ans[i]?.Answer)) {
                                    if (ans[i]?.Answer.length === 0) {
                                      setErr(true);
                                      return;
                                    }
                                  } else if (ans[i]?.Answer === "") {
                                    setErr(true);
                                    return;
                                  }
                                  setNumber(number + 1);
                                  if (blockScroll === true) {
                                    setBlockScroll(false);
                                  }
                                }}
                                variant="contained"
                                style={{
                                  fontWeight: "bold",
                                }}
                              >
                                ok &nbsp; <CheckIcon style={{ fontSize: 15 }} />
                              </Button>
                            )}

                            {i === 0 && (
                              <div>
                                <span style={{ fontSize: "12px" }}>press</span>
                                &nbsp;&nbsp;
                                <span
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Enter
                                  <SubdirectoryArrowLeftIcon
                                    style={{ fontSize: 12, fontWeight: "bold" }}
                                  />
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </ReactPageScroller>
          )}
        </>
      )}

      <div className="scroll_button">
        {surveyCompleted !== true && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <Button
              onClick={() => {
                if (question.length > number) {
                  setNumber(number + 1);
                }
              }}
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                minWidth: "20px",
                padding: "1px 4px 1px 4px",
              }}
            >
              <KeyboardArrowDownIcon sx={{ fontSize: 30 }} />
            </Button>
            <Button
              color="primary"
              onClick={() => {
                if (number !== 0) {
                  setNumber(number - 1);
                }
              }}
              variant="contained"
              sx={{
                fontWeight: "bold",
                minWidth: "20px",
                padding: "1px 4px 1px 4px",
              }}
            >
              <KeyboardArrowUpIcon sx={{ fontSize: 30 }} />
            </Button>
          </div>
        )}
        <div
          style={{
            backgroundColor: "#203c6c",
            borderRadius: "5px",
            color: "white",
            padding: "9px 14px 10px 9px",
          }}
        >
          Powered by <span style={{ fontWeight: "bold" }}>Hamilton</span>
        </div>
      </div>
    </div>
  );
};
export default Form;
