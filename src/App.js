
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Table from "./components/Table";
import FollowUpTable from "./components/FollowUpTable";
function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Main/>} />  */}
        <Route path="/" element={<Table/>} />
        <Route path="/followuptable" element={<FollowUpTable />} />
      </Routes>
    </Router>

  );
}

export default App;
