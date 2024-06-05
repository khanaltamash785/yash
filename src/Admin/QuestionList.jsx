import { Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./adminDashboard.scss";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "white",
    backgroundColor: "#203c6c",
  },
}));

const QuestionList = ({ qus, setQus, setQuestionIsEdit, setIndex }) => {
  var navigate = useNavigate();
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (question.length <= 0) {
      getQuestion();
    }
  }, []);

  const getQuestion = async () => {
    setLoading(true);
    const token = localStorage.getItem("auth");
    if (token) {
      const headers = {
        authToken: token,
      };
      const resp = await axios.get(
        "/survey/getquestion",
        {
          headers,
        }
      );
      setQuestion(resp.data.data);
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (_id) => {
    console.log(_id);
    const token = localStorage.getItem("auth");
    if (token) {
      const headers = {
        authToken: token,
      };
      const resp = await axios.delete(
        `/survey/delete/question/${_id}`,
        {
          headers,
        }
      );
      if (resp.data.status === true) {
        enqueueSnackbar("successfully deleted!", {
          variant: "success",
        });
        getQuestion();
      } else {
        enqueueSnackbar("Opps! something went wrong", {
          variant: "error",
        });
      }
    }
  };

  return (
    <div
      style={{
        height: "calc(100vh - 80px)",
        backgroundColor: "#f5f5f5",
        overflow: "scroll",
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        style={{
          boxSizing: "border-box",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div className="home">
          <div className="heading">
            <div>Question List</div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/admin/createQuestion");
              }}
            >
              Create Question
            </Button>
          </div>
          <div className="home_paper">
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      Question_ID
                    </StyledTableCell>
                    <StyledTableCell align="center">Question</StyledTableCell>
                    <StyledTableCell align="center">Data Type</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {question?.map((row, i) => {
                    return (
                      <TableRow hover key={i}>
                        <TableCell align="center">{row._id}</TableCell>
                        <TableCell align="center">{row.Question}</TableCell>
                        <TableCell align="center">{row.dataType}</TableCell>
                        <TableCell align="center">
                          <div
                            style={{
                              display: "flex",
                              gap: "15px",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                setQus(row);
                                setQuestionIsEdit(true);
                                navigate("/admin/createQuestion");
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                handleDeleteQuestion(row._id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuestionList;
