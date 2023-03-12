// Main Start Point of React JS program. 
// 
import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
import UploadFile from "./components/fileupload";

// Application start, its defining the navigation
const App = () => {
  return (
    <div>
      <Navbar />
      <div style={{ margin: 20 }}>
      <Routes>
        <Route exact path="/" element={<RecordList />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/upload" element={<UploadFile />} />
      </Routes>
      </div>
    </div>
  );
};

export default App;



/* small simple upload 
import './App.css';
import React, {useState} from 'react';
import axios from 'axios';

function App() {

  const [file, setFile] = useState()

  function handleChange(event) {
    setFile(event.target.files[0])
  }
  
  function handleSubmit(event) {
    event.preventDefault()
    const url = 'http://localhost:5000/upload';
    const formData = new FormData();
    formData.append('readfile', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    console.log (" data=> ", file, file.name);
    // Without axios file do not update. Browser does not pass data  
    axios.post(url, formData, config).then((response) => {
      console.log(response.data);
    });

    // DO NOT USE IT. DOES NOT DO ANY THING, axios is needed
    // fetch ("http://localhost:5000/upload", {
    //     method: 'POST',
    //     body: formData,
    //     headers: 
    //         {
    //         'content-type':'multipart/form-data',
    //         },
    //   });


  }

  return (
    <div className="App">
        <form onSubmit={handleSubmit}>
          <h1>React File Upload</h1>
          <input type="file" onChange={handleChange}/>
          <button type="submit">Upload</button>
        </form>
    </div>
  );
}

export default App;
*/

