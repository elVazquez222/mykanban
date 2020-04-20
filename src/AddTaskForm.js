import React, { useState, useEffect } from "react"
import "./AddTaskForm.css"

export default function AddTaskForm(props) {
  const [dodList, setDodList] = useState([])
  const [devGroupOption, setDevGroupOption] = useState("group_dev")
  const [users, setUsers] = useState([])
  const [userPics, setUserPics] = useState([])

  function addDod(event, dod) {
    setDodList(prev => {
      return [...prev, dod]
    })
    event.target.value = ""
  }

  function addBtnClick() {
    let title = document.getElementById("form_task_title").value
    let assignedTo = document.getElementById("selectBearbeiter").value
    props.handleClick_addTask(title, assignedTo, devGroupOption, dodList, userPics[0])
    clearFormData()
  }
  function closeFormClick() {
    clearFormData()
    document.getElementById("addTaskForm").style.display = "none"
    document.getElementById("container_allStatus").style.opacity = 1
  }
  function clearFormData() {
    setDodList([])
    setDevGroupOption("group_dev")
    document.getElementById("selectBearbeiter").value = ""
    document.getElementById("form_task_title").value = ""
  }

  /*
  Irgendwelche zufälligen Userprofile von randomuser.me/api holen
    , die dann in das SELECT Feld gemapt werden users.map()
  */
  useEffect(() => {
    for (let i = 5; i >= 0; i--) {
      fetch("https://randomuser.me/api/")
        .then(res => res.json())
        .then(res => {
          let fullName = res.results[0].name.title + " " + res.results[0].name.first + " " + res.results[0].name.last
          let picture = res.results[0].picture.thumbnail
          setUsers(prev => {
            return [...prev, fullName]
          })
          setUserPics(prev => {
            return [...prev, picture]
          })
        })
    }
  }, [])
  return (
    <div className="addTaskForm" id="addTaskForm">
      <h1>Neue Karte erzeugen</h1>

      <div className={`form_task ${devGroupOption}`} >

        <div className="form_col_left">
          <div className="form_dev abteilung" onClick={() => setDevGroupOption("group_dev")} >Dev</div>
          <div className="form_kollab abteilung" onClick={() => setDevGroupOption("group_kollab")} >Kollab</div>
          <div className="form_sharepoint abteilung" onClick={() => setDevGroupOption("group_sharepoint")} >Sharepoint</div>
        </div>
        <div className="form_task-header">
          <span className="form_task-Title">
            <input type="text" id="form_task_title" name="task_title" placeholder="Titel der Karte" />
          </span>
          <div className="form_task-Developer">
            <select className="selectBearbeiter" id="selectBearbeiter">

              {
                users.map(name => {
                  return (
                  <option>
                    {name}
                  </option>
                  )
                })
              }
            </select>
          </div>
        </div>


        <div className="form_task-Details" style={{ display: "block" }}
        //  id={`details_${task.id}`}
        >
          <span className="form_d-o-d-title">
            Definition of Done:
          </span>
          <span className="form_d-o-d-list">
            <input type="text" id="form_task_dod" name="task_dod" onKeyDown={event => event.which === 13 && addDod(event, event.target.value)} placeholder="Akzeptanzkriterium" />
          </span>
          <ul>
            {
              dodList.map((dod, index) => {
                return (
                  <li key={index}  >
                    {dod}
                  </li>
                )
              })
            }
          </ul>

        </div>
      </div>
      <div className="form_cta_btn" onClick={() => addBtnClick()} >hinzufügen</div>
      <span className="close_btn" onClick={() => closeFormClick()} >abbrechen</span>
    </div>
  )

}