import React from 'react'

export default function TooSmall() {
  return (
    <div style={{display: "grid", textAlign: "center", placeContent: "center", padding: "2em", width: "70%", margin: "0 auto"}}>
      <div style={{}}>
        <h3>Firefox nicht unterstützt</h3>
        <p style={{lineHeight: "1.2em"}}>Leider unterstüt Firefox eine wichtige Funktion des KanBan Boards nicht. Bitte haben Sie Verständnis. Wir freuen uns auf Ihren Besuch dieser Seite mit einem anderen Browser, bis ein Workaroung umgesetzt wurde.
        </p>
        <p> Als Entwickler finden Sie weitere Informationen unter: <br /><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=505521" > Bugreport </a> </p>
      </div>
      <div>
        <h3>Firefox not supported</h3>
        <p style={{lineHeight: "1.2em"}}>Unfortunately Firefox does not support parts of this Website. Please re-visit with another browser until we built a workaroung<br />
        </p>
        <p> If you are interested, further Information can be found hre: <br /><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=505521" > Bugreport </a>  </p>
      </div>
      <div>
      <cite>"Note though that it doesn't specify what the properties should be set to, just that they should be set and we currently set them to 0."</cite>
      </div>
    </div>
  )
}