import React, { useEffect, useState } from "react";
import "./adminDashboard.scss";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import InfoIcon from "@mui/icons-material/Info";
import { Visibility } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: "white",
    backgroundColor: "#203c6c",
  },
}));

const AdminHome = () => {
  const [questionAns, setQuestionAns] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const groupedByUUID = Object.values(
    questionAns.reduce((acc, item) => {
      if (item.UUID) {
        if (!acc[item.UUID]) {
          acc[item.UUID] = [];
        }
        acc[item.UUID].push(item);
      }
      return acc;
    }, {})
  );

  console.log(questions, "questions");
  console.log(questionAns, "questionAns");
  useEffect(() => {
    if (questionAns.length <= 0) {
      getQuestions();
      getQuestionAns();
    }
  }, []);

  const getQuestionAns = async () => {
    setLoading(true);
    const token = localStorage.getItem("auth");
    if (token) {
      const headers = { authToken: token };
      const res = await axios.get("/answer/allanswer", {
        headers,
      });
      setQuestionAns(res.data.data);
      setLoading(false);
    }
  };

  console.log(groupedByUUID, "groupedByUUID");

  const getQuestions = async () => {
    const token = localStorage.getItem("auth");
    if (token) {
      const headers = {
        authToken: token,
      };
      const res = await axios.get("/survey/getquestion", {
        headers,
      });
      let questionMap = {};
      res.data.data.forEach((question) => {
        questionMap[question._id] = question.Question;
      });
      setQuestions(questionMap);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpenDialog = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
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
          <div className="heading">Question Answer List</div>
          <div className="home_paper">
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead sx={{ color: "white", backgroundColor: "#203c6c" }}>
                  <TableRow>
                    <StyledTableCell align="left">Name</StyledTableCell>
                    <StyledTableCell align="left">Email</StyledTableCell>
                    <StyledTableCell align="left">
                      Contact Number
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Major Requirements
                    </StyledTableCell>
                    <StyledTableCell align="left">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedByUUID
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row, index) => (
                      <TableRow hover key={index}>
                        <TableCell align="left">{row[0].Answer[0]}</TableCell>
                        <TableCell align="left">{row[1].Answer[0]}</TableCell>
                        <TableCell align="left">{row[2].Answer[0]}</TableCell>
                        <TableCell align="left">{row[3].Answer}</TableCell>
                        <TableCell align="left">
                          <IconButton
                            onClick={() => handleClickOpenDialog(row)}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={groupedByUUID.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <div>
              {selectedRow.map((item, index) => (
                <p key={index}>
                  <strong>{questions[item.Question_ID]}:</strong> {item.Answer}
                </p>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminHome;
