import { useEffect, useState } from 'react'

const Question = ({ question, setErrorMessage }) => {
  const [imgSrc, setImgSrc] = useState(null)

  const getQuestionImg = async (breed) => {
    const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
    if (res.ok) {
      const data = await res.json()
      setImgSrc(data.message)
    } else {
      setErrorMessage('Something went wrong!')
    }
  }

  useEffect(() => {
    const fetchImg = async () => {
      await getQuestionImg(question)
    }
    fetchImg()
  }, [question])

  if (imgSrc === null) {
    return null
  }

  return (
    <div className='imgContainer'>
      <img src={imgSrc} />
    </div>
  )
}

export default Question
