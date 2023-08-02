const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
  console.log('get all notes')
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    response.status(400).json({
      error: 'content missing'
    })
    return
  }

  const maxId = notes.length > 0
    ? Math.max(...notes.map(note => note.id))
    : 0
  
  const note = {
    content: body.content,
    important: body.important || false,
    id: maxId + 1,
  }

  notes = notes.concat(note)
  response.json(note)
})

app.put('/api/notes/:id', (req, res) => {
  const body = req.body
  const newNote = {
    content: body.content,
    important: body.important,
    id: body.id,
  }
  notes = notes.map(note => note.id === newNote.id ? newNote : note)
  res.json(newNote)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})