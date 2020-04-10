import React, { useState, useEffect } from 'react';
import './App.css';
import './Tablet.css';
import AddTaskForm from "./AddTaskForm"

import firebase from 'firebase';

/* FIREBASE zum Speicher und in Echtzeit ändern der Objekte */
const firebaseConfig = {
  apiKey: "AIzaSyDvFcrd-owxZVH9B0PL-VOV6Nj3dfBoaXY",
  authDomain: "mykanban-ca309.firebaseapp.com",
  databaseURL: "https://mykanban-ca309.firebaseio.com",
  projectId: "mykanban-ca309",
  storageBucket: "mykanban-ca309.appspot.com",
  messagingSenderId: "591706272817",
  appId: "1:591706272817:web:3abb4bea6a283b8d3bd110"
};


export default function KanBan() {

  let dodBeispielListe = (<ul><li>Super cooles Design</li><li>Krasse Funktionen mit guter Performance</li><li>Es kann zwischen Darkmode und normalem Design gewechselt werden</li></ul>)

  let defaultTasklist = [
    { id: 0, title: "Sachen programmieren", posX: 10, posY: 50, developer: "Herr Entwickler Typ", devGroup: "group_dev", dod: dodBeispielListe },
    { id: 1, title: "Irgendwas mit SINA", posX: 650, posY: 120, developer: "Herr Kollab Typ", devGroup: "group_kollab", dod: dodBeispielListe },
    { id: 2, title: "Ich hab nix", posX: 10, posY: 120, developer: "Anderer Kollab Typ", devGroup: "group_kollab", dod: dodBeispielListe },
    { id: 3, title: "Inhaltstypen verhauen", posX: 650, posY: 190, developer: "Dr. Sharepoint", devGroup: "group_sharepoint", dod: dodBeispielListe },
    { id: 5, title: "Irgendwas mit SINA", posX: 1300, posY: 120, developer: "Herr Kollab Typ", devGroup: "group_kollab", dod: dodBeispielListe },
    { id: 6, title: "Ich hab nix", posX: 1300, posY: 190, developer: "Anderer Kollab Typ", devGroup: "group_kollab", dod: dodBeispielListe },
    { id: 4, title: "Sachen programmieren", posX: 650, posY: 50, developer: "Herr Entwickler Typ", devGroup: "group_dev", dod: dodBeispielListe },
    { id: 7, title: "Inhaltstypen verhauen", posX: 1300, posY: 50, developer: "Dr. Sharepoint", devGroup: "group_sharepoint", dod: dodBeispielListe },
  ]

  let startTaskCount = defaultTasklist.length
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerWidthChange, setContainerWidthChange] = useState(0)
  const [tasklist, setTasklist] = useState(defaultTasklist)
  const [taskCount, setTaskCount] = useState(startTaskCount)
  const [relativePositionXY, setRelativePositionXY] = useState()
  let foundRelativeMousePositon = false
  const offsetTop = 101.4  // der Abstand des KanBanBoard-Containers zum oberen Fensterrand. Wird benötigt, um die Postionen richtig zu berechnen. Bsp event.pageY - 101.4  

  let progressLeftBorder = 0
  let doneLeftBorder = 0

  function handleClick_addTask(title, developer, devGroup, dod) {
    let newCount = taskCount + 1
    let newTasklist = [...tasklist, { id: taskCount.toString(), title: title, posX: 10, posY: 50, developer: developer, devGroup: devGroup, dod: dod }]

    setTasklist(newTasklist)
    setTaskCount(newCount)
    console.log("Task N° " + taskCount + " erstellt.")
    // progressLeftBorder = document.getElementById('inProgress').offsetLeft
    // doneLeftBorder = document.getElementById('done').offsetLeft
  }
  function click_cta_btn() {
    document.getElementById("addTaskForm").style.display = "flex"
    document.getElementById("container_allStatus").style.opacity = 0.25

  }

  // function handleMovement(event) {
  //   console.log("Task " + event.target.id + " wurde verschoben auf Position " + event.pageX)
  //   let statusAfterMovement = event.pageX - progressLeftBorder > 0 ? (event.pageX - doneLeftBorder > 0 ? " done" : " in Progress") : " Backlog "
  //   console.log(statusAfterMovement)
  //   // console.log(event.target.id)
  //   switch (statusAfterMovement) {
  //     case " in Progress":
  //       event.target.classList.add("progress")
  //       event.target.classList.remove("done")
  //       break;
  //     case " done":
  //       event.target.classList.add("done")
  //       event.target.classList.remove("progress")
  //       break;
  //     case " Backlog":
  //       event.target.classList.remove("done")
  //       event.target.classList.remove("progress")
  //       break;
  //     default:
  //       event.target.classList.remove("done")
  //       event.target.classList.remove("progress")
  //   }
  //   // statusAfterMovement != " Backlog" ? (statusAfterMovement === " inProgress" ? event.target.classList.add("progress") : event.target.classList.add("done") )  : (event.target.classList.remove("progress", "done"))
  // }

  function detail_toggle(id) {
    let task = document.getElementById(id);
    if (task.style.display === "none") {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  }

  // erkennen, ob der User vermutlich draggen will, um die Karte gezielt unter dem Mauszeiger auszurichten. 
  // (sonst "landet" die Karte nicht da, wo man es erwartet)
  // function willDrag(event, id) {
  //   event.preventDefault()
  //   let newPosX = event.pageX
  //   let newPosY = event.pageY - offsetTop
  //     let newTasklist =
  //       tasklist.map(task => {
  //         if (task.id === id) {
  //           return { id: id, posX: newPosX, posY: newPosY }
  //         } else {
  //           return task
  //         }
  //     setTasklist(newTasklist)
  //   }, 700)
  // }
  function dragging(event, id) {
    // e.preventDefault()
    let newPosX = event.pageX
    let newPosY = event.pageY - offsetTop
    let newTasklist = tasklist.map(task => {
      if (task.id === id) {
        return { id: id, title: task.title, posX: newPosX, posY: newPosY, developer: task.developer, devGroup: task.devGroup, dod: task.dod }
      } else {
        return task
      }
    })
    setTasklist(newTasklist)
    let task = document.getElementById(id)
    setTimeout(() => {
      task.style.display = "none"
    }, 1)
  }

  function taskClicked(event, id) {
    if (!foundRelativeMousePositon) {
      relativePosition(event, id)
    }
  }
  function relativePosition(event, taskId) {
    // die relative Position des Mauszeigers auf der KanBan-Karte ermitteln
    // ,um die richtige Position zum Ablegen der Karte berechnen zu können
    let task = document.getElementById(taskId)
    let absolutePositionMauszeigerX = event.pageX
    let absolutePositionMauszeigerY = event.pageY - offsetTop // der Container beginnt 101.4px (offsetTop) unter y=0 TODO: Hier absolute durch berechnete Werte ersetzen
    let positionKarteX = task.offsetLeft
    let positionKarteY = task.offsetTop
    let relativePositionMauszeigerX = absolutePositionMauszeigerX - positionKarteX
    let relativePositionMauszeigerY = absolutePositionMauszeigerY - positionKarteY
    // console.log(relativePositionMauszeigerX)
    // console.log(relativePositionMauszeigerY) 
    setRelativePositionXY({ x: relativePositionMauszeigerX, y: relativePositionMauszeigerY })
    // console.log(relativePositionXY)
    foundRelativeMousePositon = true
  }

  function setNewPosition(event, id) {
    event.preventDefault()
    // console.log(relativePositionXY.x)
    let newPosX = event.pageX - relativePositionXY.x
    let newPosY = event.pageY - offsetTop - relativePositionXY.y
    let newTasklist =
      tasklist.map(task => {
        if (task.id === id) {
          return { id: id, title: task.title, posX: newPosX, posY: newPosY, developer: task.developer, devGroup: task.devGroup, dod: task.dod }
        } else {
          return task
        }
      })
    console.log(`Task ${event.target.id} wurde verschoben auf Position ${newPosX} : ${newPosY}`)
    setTasklist(newTasklist)
    let task = document.getElementById(id)
    setTimeout(() => {
      task.style.display = "unset"
    }, 1)

    foundRelativeMousePositon = false
  }



  window.addEventListener("resize", () => {
    console.log(containerWidth)
    let newWidth = document.getElementById('container').offsetWidth
    let difference = newWidth - containerWidth
    let newPosX = defaultTasklist[0].posX + difference
    console.log("NPX_ " + difference)

    defaultTasklist[0].posX = (document.getElementById('backlog').offsetWidth - defaultTasklist[0].posX)

    console.log("diff: " + difference)
    setContainerWidth(newWidth)
  })

  function setNewTask(db) {

  }

  useEffect(() => {
    // Firebase initialisieren
    firebase.initializeApp(firebaseConfig);
  }, [])


  // useEffect(() => {
  //   progressLeftBorder = document.getElementById('inProgress').offsetLeft
  //   doneLeftBorder = document.getElementById('done').offsetLeft
  // }, [])
  // console.log({containerSize})

  return (

    <div id="container">

      <AddTaskForm handleClick_addTask={handleClick_addTask} />
      <h1 id="kbTitle"></h1>
      <div id="container_allStatus">
        <div className="status" id="backlog">
          <h3>Backlog</h3>
          <div id="addTask-btn" onClick={() => click_cta_btn()}><strong>+</strong> </div></div>
        <div className="status" id="inProgress">
          <h3>In Progress</h3>
        </div>
        <div className="slideInTrigger" ></div>
        <div className="status slideInContent unshown" id="done">
          <h3 className="slideInContent">Done</h3>
        </div>
      </div>

      {
        tasklist.map(task => {
          return (
            <div
              id={task.id}
              key={task.id}
              className={`task ${task.devGroup}`}
              draggable="true"
              onDrag={event => dragging(event, task.id)}
              onDragEnd={event => { setNewPosition(event, task.id) }}
              onMouseDown={event => taskClicked(event, task.id)}
              style={{ left: task.posX, top: task.posY }}
            >
              <div className="task-header">
                <div className="task-topline">
                  <span className="task-Title">{`${task.title}`}</span>
                  <span className="task-Id">{`${task.id}`}</span>
                </div>

                <div className="task-Developer">
                  <img className="developer-picture" alt="Avatar" src="data:image/jpeg;base64,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" />
                  <span className="developer-name">{task.developer}</span>
                  <span className="details-expand-btn" onClick={() => detail_toggle(`details_${task.id}`)} onDrag={event => dragging(event, task.id)}>i</span>
                </div>
              </div>
              <div className={`task-Details`} id={`details_${task.id}`}>
                <span className="d-o-d-title">
                  Definition of Done:
                      </span>
                <span className="d-o-d-list">
                  {task.dod}
                </span>
              </div>
            </div>
          )

        })
      }

    </div>
    // {/* </div> */}
  )
}

