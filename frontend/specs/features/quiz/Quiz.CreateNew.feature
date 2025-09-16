Feature: Create Quiz from Question list

  Background:
    Given I saved the question list "Y"
    * I add an existing question "Planet" to the list
    Then I wait for 1000 ms
    * I add an existing question "Australia" to the list
    Then I wait for 1000 ms

  Scenario: Empty quiz creation
    #Given I open question list "Y"

    When I start creating a quiz
    # Then I see question list

