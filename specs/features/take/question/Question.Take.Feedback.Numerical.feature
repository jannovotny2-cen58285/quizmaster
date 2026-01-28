Feature: Take a numerical question

  Background:
    Given numerical question "Regions" with correct answer "14"

  Scenario Outline: Numerical question feedback
    When I take question "Regions"
    Then I see a number input
    When I enter "<answer>"
    # Then I see feedback "<feedback>"

    Examples:
      | answer | feedback   |
      | 48     | Incorrect! |
      | 14     | Correct!   |
