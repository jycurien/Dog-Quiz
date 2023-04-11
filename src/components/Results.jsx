const Results = ({ questions, answers }) => {
  const score = questions.reduce(
    (acc, question, index) => (question === answers[index] ? acc + 1 : acc),
    0
  )

  return (
    <div>
      <div className='result'>
        <h2>
          Your score: {score}/{questions.length}
        </h2>
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
}

export default Results
