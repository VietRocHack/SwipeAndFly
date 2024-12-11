import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomeScreen from './pages/HomeScreen/HomeScreen'
// import PlanScreen from './pages/PlanScreen/PlanScreen'
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import Footer from "./components/Footer/Footer";
import GetStartedScreen from "./pages/GetStartedScreen/GetStartedScreen";
import FormScreen from "./pages/FormScreen/FormScreen";
import YourTripScreen from "./pages/YourTripScreen/YourTripScreen";
import Header from "./components/Header/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* <Route path="/" element={<HomeScreen />} /> */}
        <Route path="/" element={<GetStartedScreen />} />
        {/* <Route path="/plan" element={<PlanScreen />} /> */}
        {/* <Route path="/plan" element={<PlanScreen />} /> */}
        <Route path="/your-trip/:uuid" element={<YourTripScreen />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsOfService />} />
        <Route path="/create-trip" element={<FormScreen />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
