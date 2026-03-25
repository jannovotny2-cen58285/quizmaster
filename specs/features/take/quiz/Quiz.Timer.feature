Feature: Run timer
  Quizzes with a time limit display a countdown timer. When time expires,
  a "Game over" dialog appears and the quiz is automatically evaluated
  with whatever answers have been submitted so far.

  Background:
    Given workspace "Timer" with questions
      | bookmark  | question                                 | answers              |
      | Planet    | Which planet is known as the Red Planet? | Mars (*), Venus      |
      | Australia | What's the capital city of Australia?     | Sydney, Canberra (*) |
    And a quiz "Quiz A" with questions "Planet, Australia"
      | pass score | 85   |
      | time limit | 120s |
    And a quiz "Quiz B" with questions "Planet, Australia"
      | pass score | 85  |
      | time limit | 60s |

  Scenario Outline: Display countdown timer
    Given I start quiz "<quiz>"
    Then I should see the countdown timer "<time>"

    Examples:
      | quiz   | time  |
      | Quiz A | 02:00 |
      | Quiz B | 01:00 |

  Scenario: Display result table after 1 minute
    Given I start quiz "Quiz B"
    When I will wait for "01:00"
    And I should see the text "Game over time"
    Then I see the "Game over" dialog
    And I confirm the "Game over" dialog
    Then I should see the results table

  Scenario: Display score 0 when no answers were given
    Given I start quiz "Quiz A"
    When I will wait for "02:00"
    And I should see the text "Game over time"
    Then I see the "Game over" dialog
    And I confirm the "Game over" dialog
    Then I should see the results table
    Then I see the result 0 correct out of 2, 0%, failed, required passScore 85%

  Scenario: Display score 1/2 when answered one correctly and timed out
    Given I start quiz "Quiz A"
    When I answer "Mars"
    Then I will wait for "02:00"
    And I should see the text "Game over time"
    Then I see the "Game over" dialog
    And I confirm the "Game over" dialog
    Then I should see the results table
    Then I see the result 1 correct out of 2, 50%, failed, required passScore 85%
