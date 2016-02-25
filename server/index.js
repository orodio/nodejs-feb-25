import express     from "express"
import morgan      from "morgan"
import bodyParser  from "body-parser"
import compression from "compression"
import dispatch    from "./dispatcher"
import $$$         from "./__lib__/redis"

const PORT = process.env.PORT || 3000

const app = express()
// app.use(morgan("combined"))
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())
app.use(compression())

app.use("/", express.static(`${ __dirname }/static`))





app.post("/api/v1/actions", (req, res) => {
  let payload = req.body

  dispatch(payload).then(({ status, a }) => {
    res.status(status).send(a)
  })
})






app.get("/api/v1/counters", (req, res) => {
  $$$.smembers("COUNTERS", (err, d) => res.send(d))
})

app.get("/api/v1/counters/:uuid", (req, res) => {
  $$$.get(`COUNTER|${ req.params.uuid }`, (err, d) => res.send(JSON.parse(d)))
})

app.get("/api/v1/counters/:uuid/count", (req, res) => {
  $$$.get(`COUNTER|${ req.params.uuid }|COUNT`, (err, count) => res.send({ count }))
})

app.get("/api/v1/events", (req, res) => {
  $$$.lrange(`EVENTS|ALL`, 0, -1, (err, d) => res.send(d.map(dd => JSON.parse(dd))))
})

app.listen(PORT, () => console.log(`LISTENING ON PORT: ${ PORT }`))

