import React, { Component } from "react"
import { get, post }        from "bc-http"
import Counter              from "./Counter"

const POLL_RATE = 100

const badType = () => {
  post(`/api/v1/actions`, {
    type: "OMG_HACKZ",
    shhh: "im just looking around",
  })
}

const noCounterUuid = () => {
  post(`/api/v1/actions`, {
    type: "COUNTER_INC",
  })
}

export default class Counters extends Component {
  constructor () {
    super()
    this.state = {
      counters:[]
    }
  }

  componentWillMount () {
    get(`/api/v1/counters`).then(res => this.setState({ counters:res }))

    this.poll = setInterval(() => {
      get(`/api/v1/counters`).then(res => this.setState({ counters:res }))
    }, POLL_RATE)
  }

  componentWillUnmount () {
    clearInterval(this.poll)
  }

  render () {
    return <div className="Counters">
      { this.state.counters.map(uuid => <Counter uuid={ uuid } key={ uuid }/>) }
      <div>
        <br/><br/>
        <button onClick={ () => badType() }>Bad Type</button><br/>
        <button onClick={ () => noCounterUuid() }>Inc - no counter uuid</button>
      </div>
    </div>
  }
}
