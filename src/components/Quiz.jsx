import { useState, useEffect } from 'react'
import shuffleArray from '../utils/shuffleArray'
import Button from './Button'
import Question from './Question'
import Choices from './Choices'
import Results from './Results'

const Quiz = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [breeds, setBreeds] = useState([])
  const [questions, setQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(null)
  const [answers, setAnswers] = useState([])
  const [displayResults, setDisplayResults] = useState(false)

  const QUIZ_LENGTH = 5

  const buidQuestionsList = () => {
    setDisplayResults(false)
    setAnswers([])
    setQuestionIndex(null)
    const breedsArray = shuffleArray(breeds).slice(0, QUIZ_LENGTH)
    setQuestions(breedsArray)
    setQuestionIndex(0)
  }

  const displayNextQuestion = async () => {
    const nextIndex = questionIndex + 1
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex)
    }
  }

  const question = questionIndex !== null ? questions[questionIndex] : null

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
    }
    fetchBreeds()
  }, [])

  const handleSelectChoice = (selectedChoice) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = selectedChoice
    setAnswers(newAnswers)
  }

  if (errorMessage) {
    return (
      <main>
        <div className='error'>{errorMessage}</div>
      </main>
    )
  }

  if (displayResults) {
    return (
      <main>
        <Results questions={questions} answers={answers} />
        <Button onClick={buidQuestionsList}>Start New Quiz</Button>
      </main>
    )
  }

  return (
    <main>
      {questionIndex !== null ? (
        <>
          <Question question={question} setErrorMessage={setErrorMessage} />
          <Choices
            breeds={breeds}
            question={question}
            onSelectChoice={handleSelectChoice}
          />
          <Button
            onClick={
              questionIndex < questions.length - 1
                ? displayNextQuestion
                : () => setDisplayResults(true)
            }
            disabled={answers[questionIndex] === undefined}
          >
            {questionIndex < questions.length - 1
              ? 'Next Question'
              : 'See Results'}
          </Button>
        </>
      ) : (
        <Button onClick={buidQuestionsList}>Start Quiz</Button>
      )}
    </main>
  )
}

export default Quiz
