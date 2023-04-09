import { useState, useEffect } from 'react'
import shuffleArray from './utils/shuffleArray'

function App() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [breeds, setBreeds] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)

  const buidQuestionsList = async () => {
    const breedsArray = shuffleArray(breeds).slice(0, 5)
    setQuestions(breedsArray)
    const imgSrc = await getQuestionImg(breedsArray[0])
    setCurrentQuestion(imgSrc)
  }

  const getQuestionImg = async (breed) => {
    const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
    if (res.ok) {
      const data = await res.json()
      return data.message
    }
    setErrorMessage('Something went wrong!')
  }

  useEffect(() => {
    const fetchBreeds = async () => {
      const res = await fetch('https://dog.ceo/api/breeds/list/all')
      if (res.ok) {
        const data = await res.json()
        const tempBreeds = []
        for (let breed in data.message) {
          if (data.message[breed].length > 0) {
            tempBreeds.push(
              ...data.message[breed].map((subBreed) => `${breed}/${subBreed}`)
            )
          } else {
            tempBreeds.push(breed)
          }
        }
        setBreeds(tempBreeds)
      } else {
        setErrorMessage('Something went wrong!')
      }

      return res
    }
    fetchBreeds()
    return () => {}
  }, [])

  return (
    <div>
      <h1>Dog Quiz</h1>
      {errorMessage && <div>{errorMessage}</div>}
      <div>
        {currentQuestion !== null ? (
          <img src={currentQuestion} />
        ) : (
          <button onClick={buidQuestionsList}>Start Quiz</button>
        )}
      </div>
    </div>
  )
}

export default App
