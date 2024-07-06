import React, { useEffect, useState } from "react";
import "./todo.css";
import TodoCards from "./TodoCards";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Update from "./Update";
import axios from "axios";

const id = sessionStorage.getItem("id");
let toUpdateArray = null;

const Todo = () => {
  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
  });
  const [Array, setArray] = useState([]);
  const [updateTask, setUpdateTask] = useState(null); // Add state to hold the task to be updated

  const show = () => {
    document.getElementById("textarea").style.display = "block";
  };

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const submit = async () => {
    if (Inputs.title === "" || Inputs.body === "") {
      toast.error("Title Or Body Can't Be Empty");
    } else {
      if (id) {
        try {
          const response = await axios.post(
            `http://localhost:1000/api/v2/addTask`,
            {
              title: Inputs.title,
              body: Inputs.body,
              id: id,
            }
          );
          setInputs({ title: "", body: "" });
          toast.success("Your Task Is Added");
          fetchTasks(); // Fetch updated tasks
        } catch (error) {
          console.error(error);
          toast.error("Error adding your task. Please try again.");
        }
      } else {
        setArray([...Array, Inputs]);
        setInputs({ title: "", body: "" });
        toast.success("Your Task Is Added");
        toast.error("Your Task Is Not Saved! Please SignUp");
      }
    }
  };

  const del = async (Cardid) => {
    if (id) {
      try {
        await axios.delete(`http://localhost:1000/api/v2/deleteTask/${Cardid}`, {
          data: { id: id },
        });
        toast.success("Your Task Is Deleted");
        fetchTasks(); // Fetch updated tasks
      } catch (error) {
        console.error(error);
        toast.error("Error deleting your task. Please try again.");
      }
    } else {
      toast.error("Please SignUp First");
    }
  };

  const dis = (value) => {
    document.getElementById("todo-update").style.display = value;
  };

  const update = (value) => {
    setUpdateTask(Array[value]); // Set the task to be updated
    dis("block"); // Show the update form
  };

  const fetchTasks = async () => {
    if (id) {
      try {
        const response = await axios.get(`http://localhost:1000/api/v2/getTasks/${id}`);
        setArray(response.data.list);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching tasks. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div className="todo">
        <ToastContainer />
        <div className="todo-main container d-flex justify-content-center align-items-center my-4 flex-column">
          <div className="d-flex flex-column todo-inputs-div w-lg-50 w-100 p-1">
            <input
              type="text"
              placeholder="TITLE"
              className="my-2 p-2 todo-inputs"
              onClick={show}
              name="title"
              value={Inputs.title}
              onChange={change}
            />
            <textarea
              id="textarea"
              type="text"
              placeholder="BODY"
              name="body"
              className=" p-2 todo-inputs"
              value={Inputs.body}
              onChange={change}
            />
          </div>
          <div className="w-50 w-100 d-flex justify-content-end my-3">
            <button className="home-btn px-2 py-1" onClick={submit}>
              Add
            </button>
          </div>
        </div>
        <div className="todo-body">
          <div className="container-fluid">
            <div className="row">
              {Array &&
                Array.map((item, index) => (
                  <div className="col-lg-3 col-11 mx-lg-5 mx-3 my-2" key={index}>
                    <TodoCards
                      title={item.title}
                      body={item.body}
                      id={item._id}
                      delid={del}
                      display={dis}
                      updateId={index}
                      toBeUpdate={update}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="todo-update" id="todo-update">
        <div className="container update">
          {updateTask && <Update display={dis} update={updateTask} />}
        </div>
      </div>
    </>
  );
};

export default Todo;
