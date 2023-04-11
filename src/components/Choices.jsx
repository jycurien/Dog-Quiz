import { useState, useEffect } from 'react'
import shuffleArray from '../utils/shuffleArray'

const Choices = ({ breeds, question, onSelectChoice }) => {
  const [choices, setChoices] = useState([])
  const [selectedChoice, setSelectedChoice] = useState(null)

  useEffect(() => {
    const correctChoice = question
    const tmpChoices = [
      correctChoice,
      ...shuffleArray(breeds)
        .slice(0, 4)
        .filter((breed) => breed !== correctChoice)
        .slice(0, 3),
    ]
    setChoices(shuffleArray(tmpChoices))
  }, [question])

  const handleChoiceChange = (e) => {
    const newChoice = e.target.value
    setSelectedChoice(newChoice)
    onSelectChoice(newChoice)
  }

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
              checked={selectedChoice === choice}
              onChange={handleChoiceChange}
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
