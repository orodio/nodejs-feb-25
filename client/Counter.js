import React, { Component } from "react"
import { get, post }        from "bc-http"

const POLL_RATE = 100

const inc = (uuid) => {
  post(`/api/v1/actions`, {
    type: "COUNTER_INC",
    counter_uuid: uuid,
  })
}

export default class Counter extends Component {
  constructor () {
    super()
    this.state = {
      name:null,
      count:0,
    }
  }

  componentWillMount () {
    get(`/api/v1/counters/${ this.props.uuid }`)
      .then(res => this.setState({ name: res.name }))

    get(`/api/v1/counters/${ this.props.uuid }/count`)
      .then(res => { this.setState({ count: res.count }) })

    this.poll = setInterval(() => {
      get(`/api/v1/counters/${ this.props.uuid }/count`)
        .then(res => { this.setState({ count: res.count }) })
    }, POLL_RATE)
  }

  componentWillUnmount () {
    clearInterval(this.poll)
  }

  render () {
    if (this.state.name == null) return <div>Loading { this.props.uuid }</div>
    return <button className="Counter" onClick={ () => inc( this.props.uuid ) }>{ this.state.name }: { this.state.count }</button>
  }
}
