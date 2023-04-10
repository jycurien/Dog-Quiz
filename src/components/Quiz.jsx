import { useState, useEffect } from 'react'
import shuffleArray from '../utils/shuffleArray'
import Button from './Button'

const Quiz = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [breeds, setBreeds] = useState([])
  const [questions, setQuestions] = useState([])

  const QUIZ_LENGTH = 5

  const buidQuestionsList = () => {
    const breedsArray = shuffleArray(breeds).slice(0, QUIZ_LENGTH)
    setQuestions(breedsArray)
    console.log(breedsArray)
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
  }, [])

  if (errorMessage) {
    return (
      <main>
        <div className='error'>{errorMessage}</div>
      </main>
    )
  }

  return (
    <main>
      <Button onClick={buidQuestionsList}>Start Quiz</Button>
    </main>
  )
}

export default Quiz
