Feature: Quiz exam and learn mode

  Background:
    Given a quiz "Exam Quiz" in exam mode with questions
      | question              | answers            |
      | Jaký nábytek má Ikea? | Stůl (*), Auto     |
      | Jaké nádobí má Ikea?  | Talíř (*), Kolo    |
    And a quiz "Learn Quiz" in learn mode with questions
      | question              | answers            |
      | Jaký nábytek má Ikea? | Stůl (*), Auto     |
      | Jaké nádobí má Ikea?  | Talíř (*), Kolo    |

  Scenario: Exam mode
    - Submitting an answer proceeds directly to the next question

    When I start quiz "Exam Quiz"
    And I see question "Jaký nábytek má Ikea?"
    When I answer "Stůl"
    Then I see question "Jaké nádobí má Ikea?"

  Scenario: Learn mode
    - Shows feedback after each question, manual proceed required

    When I start quiz "Learn Quiz"
    And I see question "Jaký nábytek má Ikea?"
    When I answer "Stůl"
    Then I see feedback "Correct!"
    When I proceed to the next question
    Then I see question "Jaké nádobí má Ikea?"

  Scenario: Learn mode - Retake question
    - User can retake a question and see updated feedback

    When I start quiz "Learn Quiz"
    And I see question "Jaký nábytek má Ikea?"
    When I answer "Stůl"
    Then I see feedback "Correct!"
    When I answer "Auto"
    Then I see feedback "Incorrect!"

  Scenario: Browser navigation during quiz
    - Browser back and forward buttons work during quiz

    When I start quiz "Learn Quiz"
    And I see question "Jaký nábytek má Ikea?"
    When I answer "Stůl"
    Then I see feedback "Correct!"
    When I proceed to the next question
    Then I see question "Jaké nádobí má Ikea?"
    When I use the browser back button
    Then I see question "Jaký nábytek má Ikea?"
    When I use the browser forward button
    Then I see question "Jaké nádobí má Ikea?"
