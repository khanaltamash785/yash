import "./App.css";
import Form from "./surveyForm/Form";
import Login from "./login/Login";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import MenuBarOutlet from "./AppBar/MenuBarOutlet";
import AdminHome from "./Admin/AdminHome";
import CreateQuestion from "./Admin/CreateQuestion";
import QuestionList from "./Admin/QuestionList";
import PrivateRoutes from "./Admin/PrivateRoutes";

const theme = createTheme({
  palette: {
    primary: {
      main: "#203c6c",
    },
  },
});

function App() {
  const [qus, setQus] = useState(null);
  const [questionIsEdit, setQuestionIsEdit] = useState(false);
  const [index, setIndex] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        autoHideDuration={2000}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Form />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoutes />}>
              <Route element={<MenuBarOutlet />}>
                <Route path="/admin" element={<AdminHome />} />
                <Route
                  path="/admin/questionList"
                  element={
                    <QuestionList
                      qus={qus}
                      setQus={setQus}
                      setQuestionIsEdit={setQuestionIsEdit}
                      setIndex={setIndex}
                    />
                  }
                />
                <Route
                  path="/admin/createQuestion"
                  element={
                    <CreateQuestion
                      qus={qus}
                      setQus={setQus}
                      questionIsEdit={questionIsEdit}
                      setQuestionIsEdit={setQuestionIsEdit}
                    />
                  }
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
