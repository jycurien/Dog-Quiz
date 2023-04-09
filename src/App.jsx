import { useState, useEffect } from 'react'
import shuffleArray from './utils/shuffleArray'

function App() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [breeds, setBreeds] = useState([])
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [choices, setChoices] = useState([])
  const [answers, setAnswers] = useState([])
  const [displayResults, setDisplayResults] = useState(false)

  const QUIZ_LENGTH = 5

  const buidQuestionsList = async () => {
    setDisplayResults(false)
    const breedsArray = shuffleArray(breeds).slice(0, QUIZ_LENGTH)
    setQuestions(breedsArray)
    const imgSrc = await getQuestionImg(breedsArray[0])
    const question = { index: 0, image: imgSrc, breed: breedsArray[0] }
    setCurrentQuestion(question)
    getChoices(question)
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
      getChoices(question)
    }
  }

  const getChoices = (question) => {
    const correctChoice = question.breed
    const tmpChoices = [
      correctChoice,
      ...shuffleArray(breeds)
        .slice(0, 4)
        .filter((breed) => breed !== correctChoice)
        .slice(0, 3),
    ]
    setChoices(shuffleArray(tmpChoices))
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

  const saveAnswer = (e) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion.index] = e.target.value
    setAnswers(newAnswers)
  }

  const score = questions.reduce((acc, question, index) => {
    if (question === answers[index]) {
      return acc + 1
    }
    return acc
  }, 0)

  const results = (
    <div>
      <div className='result'>
        <b>
          Your score: {score}/{questions.length}
        </b>
      </div>
      {questions.map((question, index) => (
        <div className='result' key={question}>
          <div>Correct answer: {question?.split('/').reverse().join(' ')}</div>
          <div>
            Your answer:{' '}
            <span className={question === answers[index] ? 'right' : 'wrong'}>
              {answers[index]?.split('/').reverse().join(' ')}
            </span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <main>
      <h1>
        <span>🐕</span> Dog Quiz 🐕
      </h1>
      {errorMessage && <div>{errorMessage}</div>}
      <div>
        {displayResults ? (
          <div>
            {results}
            <button onClick={buidQuestionsList}>Start New Quiz</button>
          </div>
        ) : currentQuestion !== null ? (
          <div>
            <div className='imgContainer'>
              <img src={currentQuestion.image} />
            </div>
            {choices.length && (
              <div>
                {choices.map((choice) => (
                  <div className='choice' key={choice}>
                    <input
                      id={choice}
                      name='choice'
                      type='radio'
                      value={choice}
                      onChange={saveAnswer}
                    />
                    <label htmlFor={choice}>
                      {choice.split('/').reverse().join(' ')}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {currentQuestion.index < questions.length - 1 ? (
              <button
                onClick={displayNextQuestion}
                disabled={answers[currentQuestion.index] === undefined}
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={() => setDisplayResults(true)}
                disabled={answers[currentQuestion.index] === undefined}
              >
                See Results
              </button>
            )}
          </div>
        ) : (
          <button onClick={buidQuestionsList}>Start Quiz</button>
        )}
      </div>
    </main>
  )
}

export default App
