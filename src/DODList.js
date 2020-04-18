import React from 'react'
import "./DODList.css"

export default function DODList(props){
  const dod = props.dod

  return(
  <div className="dodChecklist">
    {dod.map(dod => {
      return(
      <div className="dodChecklist__Entry">
        {/* <input type="checkbox" key={dod} name={dod} value={dod} />
        <labe for={dod}>{dod}</labe> */}
        <p>{dod}</p>
      </div>
      )
    })}
    </div>
  )

}