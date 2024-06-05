import React, { useEffect, useState } from "react";
import "./adminDashboard.scss";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSnackbar } from "notistack";

const CreateQuestion = ({ qus, setQus, questionIsEdit, setQuestionIsEdit }) => {
  const [question, setQuestion] = useState({
    Question: "",
    dataType: "",
    extraValue: [],
  });
  var navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    console.log(qus);
  }, [qus]);

  useEffect(() => {
    if (questionIsEdit === true) {
      let payload = {
        Question: qus.Question,
        dataType: qus.dataType,
        extraValue: qus.extraValue,
        UserID: qus.UserID,
      };
      setQuestion(payload);
    }
  }, [questionIsEdit]);

  const handleEditQuestion = async () => {
    const token = localStorage.getItem("auth");
    try {
      if (token) {
        const headers = {
          authToken: token,
        };
        const resp = await axios.put(
          `/survey/update/question/${qus._id}`,
          question,
          {
            headers,
          }
        );
        if (resp.data.status === true) {
          enqueueSnackbar("Successfully Edit!", {
            variant: "success",
          });
          navigate("/admin/questionList");
          setQuestion(null);
          setQus(null);
          setQuestionIsEdit(false);
        } else {
          enqueueSnackbar("Opps! something went wrong", {
            variant: "error",
          });
        }
      }
    } catch (e) {
      enqueueSnackbar("Opps! something went wrong", {
        variant: "error",
      });
    }
  };

  const handleCreateQuestion = async () => {
    const token = localStorage.getItem("auth");
    const userId = localStorage.getItem("userId");
    let payload = {
      Question: question.Question,
      dataType: question.dataType,
      extraValue: question.extraValue,
      UserID: userId,
    };
    if (token) {
      const headers = {
        authToken: token,
      };
      const resp = await axios.post(
        `/survey/create/question`,
        payload,
        {
          headers,
        }
      );
      if (resp.data.status === true) {
        enqueueSnackbar("Successfully Created!", {
          variant: "success",
        });
        navigate("/admin/questionList");
        setQuestion(null);
        setQus(null);
        setQuestionIsEdit(false);
      } else {
        enqueueSnackbar("Opps! something went wrong", {
          variant: "error",
        });
      }
    }
  };

  const extraValueFiled = (value, index) => {
    return (
      <Grid
        key={index}
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <TextField
          id="outlined-basic"
          label="text"
          variant="outlined"
          fullWidth
          required
          value={question.extraValue[index]}
          onChange={(e) => {
            let items = { ...question };
            items.extraValue[index] = e.target.value;
            setQuestion(items);
          }}
        />
        <IconButton
          onClick={() => {
            let items = { ...question };
            items.extraValue.splice(index, 1);
            setQuestion(items);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
    );
  };
  return (
    <div
      style={{
        height: "calc(100vh - 80px)",
        backgroundColor: "#f5f5f5",
        overflow: "scroll",
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <div className="home">
          <div className="heading">Create Question</div>
          <div className="home_paper">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="outlined-basic"
                  label="Question"
                  variant="outlined"
                  fullWidth
                  required
                  autoComplete="off"
                  value={question.Question}
                  onChange={(e) => {
                    setQuestion({ ...question, Question: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl variant="outlined" fullWidth required>
                  <InputLabel>DataType</InputLabel>
                  <Select
                    label="DataType"
                    value={question.dataType}
                    onChange={(e) => {
                      setQuestion({ ...question, dataType: e.target.value });
                    }}
                  >
                    <MenuItem value={"checkbox"}>Checkbox</MenuItem>
                    <MenuItem value={"select"}>Select</MenuItem>
                    <MenuItem value={"text"}>Text</MenuItem>
                    <MenuItem value={"radio"}>Radio</MenuItem>
                    <MenuItem value={"phoneinput"}>Phoneinput</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {question.dataType !== "text" &&
              question.dataType !== "" &&
              question.dataType !== "phoneinput" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      let value = { ...question };
                      value.extraValue.push("");
                      setQuestion(value);
                    }}
                  >
                    ADD ExtraValue
                  </Button>
                </div>
              )}
            <div
              style={{
                overflowY: "scroll",
                padding: "20px",
              }}
            >
              <Grid container spacing={2}>
                {question.extraValue?.map((value, index) =>
                  extraValueFiled(value, index)
                )}
              </Grid>
            </div>
            <div className="action_button">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate("/admin/questionList");
                  setQuestion(null);
                  setQus(null);
                  setQuestionIsEdit(false);
                }}
              >
                Cancle
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (questionIsEdit === true) {
                    handleEditQuestion();
                  } else {
                    handleCreateQuestion();
                  }
                }}
              >
                {questionIsEdit === true ? "edit" : "add"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateQuestion;
