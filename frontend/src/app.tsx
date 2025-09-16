import { HomePage } from 'pages/home'
import { QuestionTakePage } from 'pages/question-take'
import { QuizPage } from 'pages/quiz-take/quiz'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { QuizWelcomePage } from 'pages/quiz-take/quiz-welcome/quiz-welcome-page'

import { CreateQuestionListContainer } from 'pages/create-question-list/create-question-list-container'
import { CreateQuestionContainer } from 'pages/create-question/create-question-container'
import { EditQuestionContainer } from 'pages/create-question/edit-question-container'
import { QuestionListContainer } from 'pages/question-list/question-list-container'
import { QuizCreatePage } from 'pages/quiz-create/quiz-create'

export const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/question/new" element={<CreateQuestionContainer />} />
            <Route path="/q-list/new" element={<CreateQuestionListContainer />} />
            <Route path="/q-list/:id" element={<QuestionListContainer />} />
            <Route path="/quiz/:id" element={<QuizWelcomePage />} />
            <Route path="/quiz/:id/questions" element={<QuizPage />} />
            <Route path="/quiz-create/new/:listguid" element={<QuizCreatePage />} />
            <Route path="/question/:id/edit" element={<EditQuestionContainer />} />
            <Route path="/question/:id" element={<QuestionTakePage />} />
            <Route path="/" element={<HomePage />} />
        </Routes>
    </BrowserRouter>
)
