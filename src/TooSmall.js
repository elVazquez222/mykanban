import React from 'react'

export default function TooSmall() {
  return (
    <div style={{display: "grid", textAlign: "center", placeContent: "center", padding: "2em", width: "70%", marginLeft: "15%"}}>
      <div style={{}}>
        <h3>Auflösung zu klein</h3>
        <p style={{lineHeight: "1.2em"}}>Diese Webseite kann nur ab einer Auflösung von mindestens <b>1000px</b> (Breite) genutzt werden.<br />
           Bitte nutzen Sie diese App auf Tablet oder am Desktop-PC.
        </p>
      </div>
      <div>
        <h3>Small resolution detected</h3>
        <p style={{lineHeight: "1.2em"}}>Unfortunately this app cannot be displayed on resolutions below <b>1000px</b> in width.<br />
           Please use a Tablet or a Desktop PC to enjoy this App
        </p>
      </div>
    </div>
  )
}