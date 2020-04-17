import React, { useState, useEffect } from 'react';
import './App.css';
// import './Tablet.css';
import AddTaskForm from "./AddTaskForm"
import TooSmall from "./TooSmall"

import firebase from './firebase';

export default function KanBan() {

  const [tasklist, setTasklist] = useState([])
  const [relativePositionXY, setRelativePositionXY] = useState()

  const [backlogAnkerLeftPos, setBacklogAnkerLeftPos] = useState()
  const [backlogAnkerRightPos, setBacklogAnkerRightPos] = useState()
  const [inProgressAnkerLeftPos, setInProgressAnkerLeftPos] = useState()
  const [inProgressAnkerRightPos, setInProgressAnkerRightPos] = useState()
  const [statusBorder, setStatusBorder] = useState()
  
  const [isWidthBelowMinimum, setIsWidthBelowMinimum] = useState(false)
  const windowWidthMinimum = 1000

  let foundRelativeMousePositon = false
  const offsetTop = 101.4  // der Abstand des KanBanBoard-Containers zum oberen Fensterrand. Wird benötigt, um die Postionen richtig zu berechnen. Bsp event.pageY - 101.4  

  function handleClick_addTask(title, assignedTo, responsibleDepartment, dod) {
    firebase
      .firestore()
      .collection('tasks')
      .add(
        {
          title,
          posX: 100,
          posY: 100,
          assignedTo,
          responsibleDepartment,
          status: "backlog",
          dod: "dod",
          onHold: false
        }
      )
      .then(ref => {
        console.log(`Neue Karte "${ref.id}"  angelegt`)
      })
      .catch(err => {
        console.log("Fehler beim Anlegen der Karte: ", err)
      })
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

/*
Die Karte beim Beginn eines Drag-Vorgangs (ziehen) an der alten Postionion ausblenden und erst wieder einblenden,
    sobald der Vorgang abgeschlossen ist (an der neuen Psoition).
*/
  function detail_toggle(id) {
    let task = document.getElementById(id);
    if (task.style.display === "none") {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  }

  function dragging(event, id) {
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
    }, .1)
  }

  function taskClicked(event, id) {
    if (!foundRelativeMousePositon) {
      relativePosition(event, id)
    }
  }
  function relativePosition(event, taskId) {
    /*  
    Die relative Position des Mauszeigers auf der KanBan-Karte ermitteln
        ,um die richtige Position zum Ablegen der Karte berechnen zu können
    */
    let task = document.getElementById(taskId)
    let absolutePositionMauszeigerX = event.pageX
    let absolutePositionMauszeigerY = event.pageY - offsetTop // der Container beginnt 101.4px (offsetTop) unter y=0 TODO: Hier absolute durch berechnete Werte ersetzen
    let positionKarteX = task.offsetLeft
    let positionKarteY = task.offsetTop
    let relativePositionMauszeigerX = absolutePositionMauszeigerX - positionKarteX
    let relativePositionMauszeigerY = absolutePositionMauszeigerY - positionKarteY
    setRelativePositionXY({ x: relativePositionMauszeigerX, y: relativePositionMauszeigerY })
    foundRelativeMousePositon = true
  }

  function setNewPosition(event, id) {

    /*  
    Neue Postion an den "Ankern" ausrichten 
        Die Anker sind "unsichtbare" Div-Element, die durch ein flex-Lauyout
        Ihre Position relativ responsive innerhalb der jeweiligen Spalte (Backlog|inProgress)
        halten. Beim Window-Event .onresize, wie die absolute Position dieser Anker im
        State  aktualisiert (offsetLeft/px).
        Durch relatives Ausrichten der Karten (Tasks) anhand der responsiven Anker, wird
        das Design insgesamt responsive. ..hoffe ich 
    */
    event.preventDefault()
    let newPosX = event.pageX - relativePositionXY.x
    let newPosY = event.pageY - offsetTop - relativePositionXY.y
    /*
    Mehrteilige Prüfung:
      Falls die neue Position (gemessen an der oberen linken Ecke) der Karte LINKS von "InProgress" ist, 
          dann 
            prüfe, ob sie links von der linken Backlock Spalte ist. Wenn ja, setze "backlogLeft", sonst setze "backlogRight"
          sonst
            die gleiche Prüfart für die inProgress-Spalten und setze entsprechend "inProgressLeft" oder "inProgressRight"
      Beim Mappen .map() der Tasklsite wird auf den jeweiligen spalten-Namen geprüft und dementsprechen die x-Position angepasst.
      Siehe switchCase im Return-Bereich
    */
    let spalte = newPosX - statusBorder < 0 ? (newPosX - backlogAnkerLeftPos < 0 ? "backlogLeft" : "backlogRight")
                                            : (newPosX - inProgressAnkerLeftPos < 0 ? "inProgressLeft" : "inProgressRight")

    console.log("Konsole:", newPosX )
    console.log("Konsole:", inProgressAnkerLeftPos)
    console.log("Konsole:", newPosX - inProgressAnkerLeftPos)

    firebase
      .firestore()
      .collection('tasks')
      .doc(id)
      .update({
        posX: newPosX,
        posY: newPosY,
        spalte
      })
    let task = document.getElementById(id)
    setTimeout(() => {
      task.style.display = "unset"
    }, 1)
    foundRelativeMousePositon = false

    console.log(`Task ${event.target.id} wurde verschoben auf Position ${newPosX} : ${newPosY}`)

  }


/*
Verbindung zur Datenbank
  aufbauen. Dabei: Verbindung beenden(unsubscribe), sobald das Fenster geschlossen wird.
*/
  useEffect(() => {
    const unsubscribe =
      firebase
        .firestore()
        .collection('tasks')
        .onSnapshot(snap => {
          const tasksFromDB = snap.docs.map(task => ({
            id: task.id,
            ...task.data()
          }))
          setTasklist(tasksFromDB)
        })
    return () => unsubscribe()
  }, [])


  /*  
  Positionen der ANKER Elemente initial (onMount) setzen.
      Ankerelement dienen als Orientierung in welchem Bereich (Spalte) eine Karte abgelegt wurde.
      Sie verhalten sich responsive.
      Um die Karten anzuordnen, wird bei jedem resize-Event die absolute Position der Anker neu ermittelt.
      So können die Karten, deren Positionen ebenfalls als absolute Werte gespeicher werden, immer
      relativ zu den Ankern ausgerichtet werden, wodurch ihre Positionierung ebenfalls responsive wird.
      Denke ich.. 
      Um die Anker sichtbar zu machen, in der App.css die .anker(...) Elemente finden und die border-
      Angaben wieder einkommentieren. 'statusBorder' ist die Grenze zwischen Backlog und InProgress.
  */
  useEffect(() => {

    const ankerBacklogLeft = document.getElementById('ankerBacklogLeft')
    const ankerBacklogRight = document.getElementById('ankerBacklogRight')
    const ankerInProgressLeft = document.getElementById('ankerInProgressLeft')
    const ankerInProgressRight = document.getElementById('ankerInProgressRight')
    const statusBorder = document.getElementById('inProgress')

    setBacklogAnkerLeftPos(ankerBacklogLeft.offsetLeft)
    setBacklogAnkerRightPos(ankerBacklogRight.offsetLeft)
    setInProgressAnkerLeftPos(ankerInProgressLeft.offsetLeft * 4)
    setInProgressAnkerRightPos(ankerInProgressRight.offsetLeft * 2.5)
    setStatusBorder(statusBorder.offsetLeft)


    window.addEventListener('resize', () => {
      setBacklogAnkerLeftPos(ankerBacklogLeft.offsetLeft)
      setBacklogAnkerRightPos(ankerBacklogRight.offsetLeft)
      setInProgressAnkerLeftPos(ankerInProgressLeft.offsetLeft)
      setInProgressAnkerRightPos(ankerInProgressRight.offsetLeft)
      setStatusBorder(statusBorder.offsetLeft)
      window.location.reload()
    })
  }, [])
  /*
  Minimal Bildschirm-Auflösung prüfen.
    Falls die aktuelle Auflösung zu gering ist, um das KanBanNoard darzustellen, die Variable
    isSolution isSolutionBelowLimit auf true setzen.
  */
  useEffect(() => {
    setIsWidthBelowMinimum(window.innerWidth < windowWidthMinimum)
    window.addEventListener('resize', () => {
      setIsWidthBelowMinimum(window.innerWidth < windowWidthMinimum)
    })
  }, [])
  
  // console.log(backlogAnkerLeftPos)

  return (
    isWidthBelowMinimum ? <TooSmall /> :

    <div id="container">

      <AddTaskForm handleClick_addTask={handleClick_addTask} />
      <h1 id="kbTitle"></h1>
      <div id="container_allStatus">
        <div className="status" id="backlog">
          <h3>Backlog</h3>
          <div id="addTask-btn" onClick={() => click_cta_btn()}><strong>+</strong> </div>
          <div className="ankerContainer" id="ankerContainerBacklog">
            <div className="ankerBacklog left" id="ankerBacklogLeft"></div>
            <div className="ankerBacklog right" id="ankerBacklogRight"></div>
          </div>
        </div>
        <div className="status" id="inProgress">
          <h3>In Progress</h3>
          <div className="ankerContainer" id="ankerContainerInProgress">
            <div className="ankerInProgress left" id="ankerInProgressLeft"></div>
            <div className="ankerInProgress right" id="ankerInProgressRight"></div>
          </div>
        </div>

        {/* <div className="slideInTrigger" ></div>
        <div className="status slideInContent unshown" id="done">Done
          <h3 className="slideInContent">Done</h3>
        </div> */}
      </div>

      {
        tasklist.map(task => {
          let leftPos = 0
          let consoleLogText = ""
          switch (task.spalte) {
            case "backlogLeft":
              leftPos = backlogAnkerLeftPos - 150
              consoleLogText = "backlogAnkerLeftPos"
              break;
            case "backlogRight":
              leftPos = backlogAnkerRightPos - 75
              consoleLogText = "backlogAnkerRightPos"
              break;
            case "inProgressLeft":
              leftPos = inProgressAnkerLeftPos -150
              consoleLogText = "inProgressAnkerLeftPos"
              break;
            case "inProgressRight":
              leftPos = inProgressAnkerRightPos - 75
              consoleLogText = "inProgressAnkerRightPos"
              break;
          }
          // console.log("SwitchCase: " +consoleLogText)
          return (
            <div
              id={task.id}
              key={task.id}
              className={`task ${task.responsibleDepartment}`}
              draggable="true"
              onDrag={event => dragging(event, task.id)}
              onDragEnd={event => { setNewPosition(event, task.id) }}
              onMouseDown={event => taskClicked(event, task.id)}
              style={{ left: leftPos, top: task.posY }}
            >
              <div className="task-header">
                <div className="task-topline">
                  <span className="task-Title">{`${task.title}`}</span>
                  {/* <span className="task-Id">{`${ task.id }`}</span> */}
                </div>

                <div className="task-Developer">
                  <img className="developer-picture" alt="Avatar" src="data:image/jpeg;base64,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" />
                  <span className="developer-name">{task.assignedTo}</span>
                  <span className="details-expand-btn" onClick={() => detail_toggle(`details_${task.id}`)} onDrag={event => dragging(event, task.id)}>i</span>
                </div>
              </div>
              <div className={`task-Details`} id={`details_${task.id}`}>
                Definition of Done:
                  <ul>
                  {
                    task.dod
                  }
                </ul>
              </div>
            </div>
          )

        })
      }

    </div>
    // {/* </div> */}
  )
}

