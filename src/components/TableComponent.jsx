import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Table } from 'reactstrap'
import Swal from 'sweetalert2';
import { AppContext } from '../context/AppContext';

function TableComponent() {
    const [editedItemId, setEditedItemId] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const {apiData, setApiData, handleDelete} = useContext(AppContext);

    const handleEdit = (id) => {
        if (editedItemId === id) {
            console.log(id)
            axios.put(`https://localhost:7038/api/Issue/${id}`, {
                id: id,
                title: newTitle,
                description: newDescription,
            })
                .then(resp => {
                    Swal.fire({
                        title: "Successfully updated!",
                        icon: "success"
                      });
                    // console.log(apiData.find(item => item.id === id));
                    
                    setApiData(prev => {
                        const editedData = prev.find(item => item.id === id)
                        editedData.title = newTitle;
                        editedData.description = newDescription;

                        return prev;
                    })
                    setEditedItemId(null);
                })
                .catch(error => {
                    console.error("Error updating item:", error);
                });
        }

        setEditedItemId(id)
        setNewTitle(apiData.find(item => item.id === id).title)
        setNewDescription(apiData.find(item => item.id === id).description)
    }

    return (
        <Table
        >
            <thead>
                <tr>
                    <th>
                        ID
                    </th>
                    <th>    
                        Title
                    </th>
                    <th>
                        Description
                    </th>
                    <th>
                        Priority
                    </th>
                    <th>
                        Issue Type
                    </th>
                    <th>
                        Created
                    </th>
                    <th>
                        Completed
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    apiData.map(item => (
                        <tr key={item.id}>
                            <th>{item.id}</th>
                            {
                                editedItemId === item.id ?
                                    <td>
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                        />
                                    </td>
                                    :
                                    <td>{item.title}</td>
                            }
                            {
                                editedItemId === item.id ?
                                    <td>
                                        <input
                                            type="text"
                                            value={newDescription}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                        />
                                    </td>
                                    :
                                    <td>{item.description}</td>
                            }

                            <td>{item.priority}</td>
                            <td>{item.issueType}</td>
                            <td>{item.created}</td>
                            <td>{item.completed}</td>
                            <td className='d-flex'>
                                <button
                                    className='btn btn-sm btn-danger'
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className={`btn ${editedItemId === item.id ? 'btn-success' : "btn-warning"}`}
                                    onClick={() => handleEdit(item.id)}
                                >
                                    {editedItemId === item.id ? "Update" : "Edit"}
                                </button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    )
}

export default TableComponent