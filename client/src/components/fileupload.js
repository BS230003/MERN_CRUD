
import React, { useEffect, useState } from "react";
import axios from 'axios';

export default function UploadFile (event) {
    const [file, setFile] = useState(); // holder for file

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
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      console.log (" data=> ", file, file.name);
      // Without axios file do not update. Browser does not pass data  
      axios.post(url, formData, config).then( async (response) => {
        let data = await response.data; 
        console.log("file loaded to server ??? " , data);
      });
  
    }
    
    function handleChange (e)
    {
        console.log (e);
        setFile(e.target.files[0] );
    }

    return (
    <form onSubmit={handleFileUpload}>
        <div>
        <label htmlFor="imageFile">ImageFile:</label>
        <input
            type="file"
            className="form-control"
            onChange={handleChange} // first file
        />
        <div>FILE INFO {file && file.name} </div>
        <button 
            type="submit"
            className="btn btn-primary">Upload File</button>
        </div>
    </form>
    );
}

