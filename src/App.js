import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  Box,
  Button,
  Card,
  Container,
  Columns,
  Heading
} from "react-bulma-components/full"

const App = props => {
  const [location, setLocation] = useState("")
  const [image, setImage] = useState("")
  const [locations, setLocations] = useState([])
  const [message, setMessage] = useState("")
  const [images, setImages] = useState([])

  useEffect(() => {
    getLocations()
  }, [])

  async function getLocations() {
    const returnedData = await axios.get(process.env.REACT_APP_API)
    if (returnedData.status === "error") return
    if (returnedData) {
      const { locations } = returnedData.data
      setLocations(locations)
    }
  }

  function handleChange(e) {
    setLocation(e.target.value)
  }

  const selectImage = url => {
    setImage(url)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage("")
    if (!location) {
      setMessage("Please enter a location")
      return
    }

    setImages([])
    const returnedData = await axios.post(`${process.env.REACT_APP_API}images`, { location })
    setImages(returnedData.data.images)
  }

  const addLocation = async () => {
    const returnedData = await axios.post(process.env.REACT_APP_API, {
      location,
      image
    })

    let newLocation = {}
    newLocation.location_id = returnedData.data.location_id
    newLocation.location = location
    newLocation.image = image

    let allLocations = locations
    allLocations.push(newLocation)

    setImages([])
    setLocation("")
    setImage("")
    setLocations(allLocations)
  }

  const handleDelete = e => {
    axios.delete(process.env.REACT_APP_API + e.location_id)
    let allLocations = locations
    for (let i = 0; i < allLocations.length; i++) {
      if (allLocations[i].location_id === e.location_id) {
        allLocations.splice(i, 1)
      }
    }

    setLocations([])
    setTimeout(() => {
      setLocations(allLocations)
    }, 0)
  }

  return (
    <Container>
      <div style={{ height: "20px" }}>
        Welcome to staq places
      </div>

    </Container>
  )
}

export default App
