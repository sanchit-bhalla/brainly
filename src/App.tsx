import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";

function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}

export default App;
