Feature: Take a quiz in EasyMode

  Background:
    Given questions
      | bookmark   | question                                | answers                                           | easy mode |
      | EuropeHard | Which of these countries are in Europe? | Italy (*), France (*), Morocco, Spain (*), Canada | false     |
      | EuropeEasy | Which of these countries are in Europe? | Italy (*), France (*), Morocco, Spain (*), Canada | true      |
      | Capital    | What is the capital of France?          | Paris (*), Lyon, Marseille                        | false     |
    And quizes
      | bookmark            | questions                       | easy mode |
      | QuizWithEasyModeOff | EuropeHard, EuropeEasy, Capital | false     |
      | QuizWithEasyModeOn  | EuropeHard, EuropeEasy, Capital | true      |

  @skip
  Scenario: Quiz Easy Mode OFF - question Easy Mode mixed
    When I start quiz "QuizWithEasyModeOff"
    Then I do not see correct answers count
    When I proceed to the next question
    Then I see that the question has 3 correct answers
    When I proceed to the next question
    Then I do not see correct answers count

  @skip
  Scenario: Quiz Easy Mode ON - overrides question Easy Mode mixed
    When I start quiz "QuizWithEasyModeOn"
    Then I see that the question has 3 correct answers
    When I proceed to the next question
    Then I see that the question has 3 correct answers
    When I proceed to the next question
    Then I do not see correct answers count
