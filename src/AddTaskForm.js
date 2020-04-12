import React, { useState } from "react"
import "./AddTaskForm.css"

export default function AddTaskForm(props) {
  const [dodList, setDodList] = useState([])
  const [devGroupOption, setDevGroupOption] = useState("group_dev")

  function addDod(event, dod) {
    setDodList(prev => {
      return [...prev, dod]
    })
    event.target.value = ""
  }

  function addBtnClick(){
    let title = document.getElementById("form_task_title").value
    let developer = document.getElementById("selectBearbeiter").value
    let dodlist = (<ul>{dodList.map((dod, index) => {
      return (
        <li key={index}>
          {dod}
        </li>
      )
    })}</ul>)
    props.handleClick_addTask(title, developer, devGroupOption, dodlist)
    clearFormData()
  }
  function closeFormClick(){
    clearFormData()
    document.getElementById("addTaskForm").style.display = "none"
    document.getElementById("container_allStatus").style.opacity = 1
  }
  function clearFormData(){
    setDodList([])
    setDevGroupOption("group_dev")
    document.getElementById("selectBearbeiter").value = ""
    document.getElementById("form_task_title").value = ""
  }

  return (
    <div className="addTaskForm" id="addTaskForm">
      <h1>Neue Karte erzeugen</h1>

      <div className={`form_task ${devGroupOption}`} >
        
        <div className="form_col_left">
          <div className="form_dev abteilung" onClick={()=>setDevGroupOption("group_dev")} >Dev</div>
          <div className="form_kollab abteilung" onClick={()=>setDevGroupOption("group_kollab")} >Kollab</div>
          <div className="form_sharepoint abteilung" onClick={()=>setDevGroupOption("group_sharepoint")} >Sharepoint</div>
        </div>

        <div className="form_task-header">

          <span className="form_task-Title">
            <input type="text" id="form_task_title" name="task_title" placeholder="Titel der Karte" />
          </span>

          <div className="form_task-Developer">

            <div className="form_task-Developer_default ">
              <img className="form_developer-picture" alt="Avatar" src="data:image/jpeg;base64,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" />
              
            </div>

            <select id="selectBearbeiter">
              <option id="bearbeiterDefault" >
                nicht festgelegt
              </option>
              <option>
                Hfw Neun Richter
              </option>
              <option>
                Hfw D-Punkt Klee 
              </option>
              <option>
                Hptm Frey Geist
              </option>
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
      <div className="form_cta_btn" onClick={()=>addBtnClick()} >hinzufügen</div>
      <span className="close_btn" onClick={()=>closeFormClick()} >abbrechen</span>
    </div>
  )

}