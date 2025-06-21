import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import { useAuth } from "../hooks/useAuth";
import ProgressBar from "./ProgressBar/ProgressBar";
import { BrainProvider } from "../context/BrainContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ChatProvider } from "../context/ChatContext";
import PublicBrain from "./PublicBrain";
import NotFound from "./NotFound";
import ChatPage from "./ChatPage";
import LandingPage from "./LandingPage";

function Navigation() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <ProgressBar />;
  return (
    <BrowserRouter>
      <BrainProvider>
        <NotificationProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/" element={<Layout />}>
                <Route
                  path="register"
                  element={
                    !isAuthenticated ? (
                      <Register />
                    ) : (
                      <Navigate replace to="/brain" />
                    )
                  }
                />
                <Route
                  path="login"
                  element={
                    !isAuthenticated ? (
                      <Login />
                    ) : (
                      <Navigate replace to="/brain" />
                    )
                  }
                />
                <Route
                  path="brain"
                  element={
                    isAuthenticated ? (
                      <Home />
                    ) : (
                      <Navigate replace to="/login" />
                    )
                  }
                />
              </Route>
              <Route
                path="chat"
                element={
                  !isAuthenticated ? (
                    <Navigate replace to="/login" />
                  ) : (
                    <ChatPage />
                  )
                }
              />
              <Route path="/brain/:hash" element={<PublicBrain />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ChatProvider>
        </NotificationProvider>
      </BrainProvider>
    </BrowserRouter>
  );
}

export default Navigation;
