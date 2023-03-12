import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from 'axios';


export default function Edit() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
    records: [],
  });  // for text data entry

  const [file, setFile] = useState(); // holder for file 

  const params = useParams();
  const navigate = useNavigate();
  console.log ("edit.js before useEffect ")

  // prepare the page with said record, fetch the data we need
  // useEffects are useful React for featching the data that we need later on.
  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`http://localhost:5000/record/${params.id.toString()}`);

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      //console.log (" edit.js record useEffect fetchData () ", record);
      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(record);
    }

    //console.log ('edit.js before call fetchData');
    fetchData();

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    
    e.preventDefault();
    // here upload the file
    console.log ("submit called 0 ", file);
    if (file) {
        const url = 'http://localhost:5000/upload';
        const formData = new FormData();
        formData.append('readfile', file);
        formData.append('fileName', file.name); 
        const config = { 
          headers: {'content-type': 'multipart/form-data',},
        };
        console.log (" filename => ", file.name);
        // Without axios file do not update. Browser does not pass data  
        await axios.post(url, formData, config).then( (response) => {
          let data = response.data; 
          console.log("edit.js file loaded to server ??? " , data);
        });
    }

    const editedPerson = {
      name: form.name,
      position: form.position,
      level: form.level,
    };


    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5000/update/${params.id}`, {
      method: "POST",
      body: JSON.stringify(editedPerson),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    console.log ("submit called.. over ");
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
     
      if (!file) return;

      //event.preventDefault()
      const url = 'http://localhost:5000/upload';
      const formData = new FormData();
      formData.append('readfile', file);
      formData.append('fileName', file.name);
      const config = { 
        headers: {'content-type': 'multipart/form-data',},
      };
      console.log (" filename => ", file.name);
      // Without axios file do not update. Browser does not pass data  
      axios.post(url, formData, config).then( async (response) => {
        let data = await response.data; 
        console.log("edit.js file loaded to server ??? " , data);
      });
      
    }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <h3>Update Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position: </label>
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

        <br />
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
            value="Update Record"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}