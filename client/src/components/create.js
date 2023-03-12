import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

// create an empty record
export default function Create() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  
  const [file, setFile] = useState (); // save file info.

  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    // first upload the Image file, so that can be used for the record creation.

    //handleFileUpload ();
      const url = 'http://localhost:5000/upload';
      const formData = new FormData();
      formData.append('readfile', file);
      formData.append('fileName', file.name);
      const config = { 
        headers: {'content-type': 'multipart/form-data',},
      };
      console.log (" filename => ", file.name);
      // Without axios file do not update. Browser does not pass data  
      await axios.post(url, formData, config).then((response) => {
        let data = response.data; 
        console.log("edit.js file loaded to server ??? " , data);
      });

    console.log ("submit create called, file upload over");
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };

    await fetch("http://localhost:5000/record/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
    .catch(error => {
      window.alert(error);
      return;
    });

    // clean the fields
    setForm({ name: "", position: "", level: "" });
    navigate("/");
  }

  function handleChange (e)
  {
        console.log (e);
        setFile(e.target.files[0] );
  }

   const handleFileUpload = () => 
    {
      console.log (" ==> file for upload ", file);   
      //if (!file) return;
      const url = 'http://localhost:5000/upload';
      const formData = new FormData();
      formData.append('readfile', file);
      formData.append('fileName', file.name);
      const config = { 
        headers: {'content-type': 'multipart/form-data',},
      };
      console.log (" filename => ", file.name);
      // Without axios file do not update. Browser does not pass data  
       axios.post(url, formData, config).then((response) => {
        let data = response.data; 
        console.log("edit.js file loaded to server ??? " , data);
      });  
    }

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <h3>Create New Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position</label>
          <input
            type="text"
            className="form-control"
            id="position"
            value={form.position}
            onChange={(e) => updateForm({ position: e.target.value })}
          />
        </div>
        <div className="form-group">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="positionOptions"
              id="positionIntern"
              value="Intern"
              checked={form.level === "Intern"}
              onChange={(e) => updateForm({ level: e.target.value })}
            />
            <label htmlFor="positionIntern" className="form-check-label">Intern</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="positionOptions"
              id="positionJunior"
              value="Junior"
              checked={form.level === "Junior"}
              onChange={(e) => updateForm({ level: e.target.value })}
            />
            <label htmlFor="positionJunior" className="form-check-label">Junior</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="positionOptions"
              id="positionSenior"
              value="Senior"
              checked={form.level === "Senior"}
              onChange={(e) => updateForm({ level: e.target.value })}
            />
            <label htmlFor="positionSenior" className="form-check-label">Senior</label>
          </div>
        </div>

        <div className="form-group">
        <label htmlFor="imageFile">ImageFile:</label>
        <input
            type="file"
            className="form-control"
            onChange={handleChange} // first file
        />
        <div>FILE INFO {file && file.name} </div>
        </div>
        <br/>
  
        <div className="form-group">
          <input
            type="submit"
            value="Create person"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}