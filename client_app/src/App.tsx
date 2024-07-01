import { useState } from 'react'
import './App.css'


function App() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const [displayQuestions,setDisplayQuestion] = useState<Array<string>>([])
  const [displayAnswers,setDisplayAnswers] = useState<Array<string>>([])

  const AddConversations = (question:string) => {
    setDisplayQuestion([...displayQuestions,question])
    setDisplayAnswers([...displayAnswers,question])

  }

  // const handleInputChange = (event:Event) => {
  //   setQuestion(event.target.value);
  // };

  // const handleEnterKey = (event,question) => {
  //   if (event.key === 'Enter') {
  //     AddConversations(question)
  //   }
  // };

  return (
    <div>
      {displayQuestions.map((displayQuestion) => {
        return (
          <p>{displayQuestion}</p>
        )
      } )}



      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <button onClick={() => AddConversations(question)}>質問</button>
      {/* <button onClick={() => testFunc("test_data")}>質問</button> */}
    </div>
  )
}

export default App
