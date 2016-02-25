import React        from "react"
import Dom          from "react-dom"
import Counters     from "./Counters"
import { post }     from "bc-http"
import { generate } from "bc-uuid"

Dom.render(
  <div>
    <Counters/>
  </div>,
  document.getElementById("LOL")
)

window.$$$ = {
  new_counter (name) {
    post(`/api/v1/actions`, {
      type: "COUNTER_ADD",
      counter_uuid: generate(),
      name,
    })
  }
}
