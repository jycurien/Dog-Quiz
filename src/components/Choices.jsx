import { useState, useEffect } from 'react'
import shuffleArray from '../utils/shuffleArray'

const Choices = ({ breeds, question, onChange }) => {
  const [choices, setChoices] = useState([])

  useEffect(() => {
    const correctChoice = question.breed
    const tmpChoices = [
      correctChoice,
      ...shuffleArray(breeds)
        .slice(0, 4)
        .filter((breed) => breed !== correctChoice)
        .slice(0, 3),
    ]
    setChoices(shuffleArray(tmpChoices))
  }, [question])

  return (
    <div className='choices'>
      {choices.length &&
        choices.map((choice) => (
          <div className='choice' key={choice}>
            <input
              id={choice}
              name='choice'
              type='radio'
              value={choice}
              onChange={onChange}
            />
            <label htmlFor={choice}>
              {choice.split('/').reverse().join(' ')}
            </label>
          </div>
        ))}
    </div>
  )
}

export default Choices
