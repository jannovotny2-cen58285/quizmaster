Feature: Evaluate quiz score

  Scenario Outline: Quiz score
    Given workspace "Score" with questions
      | bookmark | question  | answers  |
      | Q1       | 1 + 1 = ? | 2 (*), 3 |
      | Q2       | 2 + 2 = ? | 4 (*), 5 |
      | Q3       | 3 + 3 = ? | 6 (*), 7 |
      | Q4       | 4 + 4 = ? | 8 (*), 9 |
    And a quiz "Score Quiz" with all questions
      | pass score | 75 |
    When I start the quiz
    * I answer <correct> questions correctly
    * I answer <incorrect> questions incorrectly
    * I proceed to the score page
    Then I see the result <correct> correct out of 4, <percentage>%, <result>, required passScore 75%

    Examples:
      | correct | incorrect | percentage | result |
      | 4       | 0         | 100        | passed |
      | 3       | 1         | 75         | passed |
      | 2       | 2         | 50         | failed |
      | 0       | 4         | 0          | failed |

  @skip
  Scenario: Quiz score in learning mode
    - In learning mode, quiz taker can retake questions
    - Score page shows two separate results:
      - score for the first answers of each question, and,
      - score for the corrected answers.

    Given workspace "Learn Score" with questions
      | bookmark | question  | answers  |
      | Q1       | 1 + 1 = ? | 2 (*), 3 |
      | Q2       | 2 + 2 = ? | 4 (*), 5 |
    And a quiz "Learn Quiz" with all questions
      | mode       | learn |
      | pass score | 100   |
    When I start the quiz
    * I answer correctly
    * I proceed to the next question
    * I answer incorrectly
    * I answer correctly
    * I proceed to the score page
    Then I see the result 2 correct out of 2, 100%, passed, required passScore 100%
    Then I see the original result 1, 50%, failed

  Scenario Outline: Show question on score page
    Given workspace "Score Display" with questions
      | bookmark | question                            | answers                              | explanation |
      | Sky      | What is the standard colour of sky? | Red, Blue (*), Green, Black          | Rayleigh    |
      | France   | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse |             |
    And a quiz "Display Quiz" with all questions
      | pass score | 85 |
    Given I start quiz "Display Quiz"
    When I answer "Blue"
    * I answer "Marseille"
    * I evaluate the quiz
    Then I see the question "<question>"

    Examples:
      | question                            |
      | What is the standard colour of sky? |
      | What is capital of France?          |

  Scenario: Show options of question on score page
    Given workspace "Score Options" with questions
      | bookmark | question                            | answers                              | explanation |
      | Sky      | What is the standard colour of sky? | Red, Blue (*), Green, Black          | Rayleigh    |
      | France   | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse |             |
    And a quiz "Options Quiz" with all questions
      | pass score | 85 |
    Given I start quiz "Options Quiz"
    When I answer "Blue"
    * I answer "Marseille"
    * I evaluate the quiz
    Then I see all options for question "Sky"

  Scenario: Show question explanation of question on score page
    Given workspace "Score Explanation" with questions
      | bookmark | question                            | answers                              | explanation |
      | Sky      | What is the standard colour of sky? | Red, Blue (*), Green, Black          | Rayleigh    |
      | France   | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse |             |
    And a quiz "Explanation Quiz" with all questions
      | pass score | 85 |
    Given I start quiz "Explanation Quiz"
    When I answer "Blue"
    * I answer "Marseille"
    * I evaluate the quiz
    Then I see question explanation "Rayleigh" for question "Sky"

  Scenario: Show user select
    Given workspace "Score Select" with questions
      | bookmark | question                            | answers                              | explanation |
      | Sky      | What is the standard colour of sky? | Red, Blue (*), Green, Black          | Rayleigh    |
      | France   | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse |             |
    And a quiz "Select Quiz" with all questions
      | pass score | 85 |
    Given I start quiz "Select Quiz"
    When I answer "Blue"
    * I answer "Marseille"
    * I evaluate the quiz
    Then I see user select "Blue" for question "Sky"
