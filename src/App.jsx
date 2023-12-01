import axios from 'axios';
import React, { useEffect, useState } from 'react'
import TableComponent from './components/TableComponent';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Input } from 'reactstrap';
import Swal from 'sweetalert2';
import { AppContext } from './context/AppContext';

function App() {
  const [apiData, setApiData] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get("https://localhost:7038/api/Issue")
      .then(resp => setApiData(resp.data))
  }, []);


  const handleCreate = () => {
    axios.post("https://localhost:7038/api/Issue",
      {
        title: title.length > 0 && title,
        description: description.length > 0 && description,
        priority: 1,
        issueType: 1,
      }
    )
      .then(resp => {
        if (resp.status === 201) {
          Swal.fire({
            title: "Success!",
            icon: "success"
          });
          setApiData([...apiData, resp.data])
          setTitle('')
          setDescription('')
        }
      })
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        axios.delete(`https://localhost:7038/api/Issue/${id}`)
        setApiData(prevState => prevState.filter(item => item.id !== id))
      }
    });



  }

  return (
    <AppContext.Provider value={
      {
        apiData,
        setApiData,
        handleDelete
      }
    }>
      <Container>
        <div className='mt-3'>
          <div>
            <label htmlFor="">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="">Description</label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button onClick={handleCreate}>Click</button>
          <br /> <br />

          <TableComponent />
        </div>
      </Container>
    </AppContext.Provider>

  )
}

export default App