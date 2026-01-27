@skip
Feature: Take a numerical question

  Scenario Outline: Numerical question feedback

	Given numerical question "Regions" with correct answer "14"
    When I take question "Regions"
	Then I see a number input
    When I enter  "<answer>"
    Then I see feedback "<feedback>"

    Examples:
      | answer   | feedback   |
      | 58       | Incorrect! |
      | 14       | Correct!   |
