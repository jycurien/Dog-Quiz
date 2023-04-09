import { useState, useEffect } from 'react'
import shuffleArray from '../utils/shuffleArray'
import Button from './Button'
import Choices from './Choices'
import Results from './Results'

const Quiz = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [breeds, setBreeds] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answers, setAnswers] = useState([])
  const [displayResults, setDisplayResults] = useState(false)

  const QUIZ_LENGTH = 5

  const buidQuestionsList = async () => {
    setDisplayResults(false)
    setAnswers([])
    setCurrentQuestion(null)
    const breedsArray = shuffleArray(breeds).slice(0, QUIZ_LENGTH)
    setQuestions(breedsArray)
    const imgSrc = await getQuestionImg(breedsArray[0])
    const question = { index: 0, image: imgSrc, breed: breedsArray[0] }
    setCurrentQuestion(question)
  }

  const getQuestionImg = async (breed) => {
    const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
    if (res.ok) {
      const data = await res.json()
      return data.message
    }
    setErrorMessage('Something went wrong!')
  }

  const displayNextQuestion = async () => {
    const nextIndex = currentQuestion.index + 1
    if (nextIndex < questions.length) {
      const imgSrc = await getQuestionImg(questions[nextIndex])
      const question = {
        index: nextIndex,
        image: imgSrc,
        breed: questions[nextIndex],
      }
      setCurrentQuestion(question)
    }
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

  const saveAnswer = (e) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion.index] = e.target.value
    setAnswers(newAnswers)
  }

  if (errorMessage) {
    return (
      <main>
        <div className='error'>{errorMessage}</div>
      </main>
    )
  }

  return (
    <main>
      {displayResults ? (
        <>
          <Results questions={questions} answers={answers} />
          <Button handleClick={buidQuestionsList}>Start New Quiz</Button>
        </>
      ) : currentQuestion !== null ? (
        <>
          <div className='imgContainer'>
            <img src={currentQuestion.image} />
          </div>
          <Choices
            breeds={breeds}
            question={currentQuestion}
            onChange={saveAnswer}
          />
          <Button
            handleClick={
              currentQuestion.index < questions.length - 1
                ? displayNextQuestion
                : () => setDisplayResults(true)
            }
            disabled={answers[currentQuestion.index] === undefined}
          >
            {currentQuestion.index < questions.length - 1
              ? 'Next Question'
              : 'See Results'}
          </Button>
        </>
      ) : (
        <Button handleClick={buidQuestionsList}>Start Quiz</Button>
      )}
    </main>
  )
}

export default Quiz
