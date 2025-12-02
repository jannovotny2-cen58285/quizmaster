@skip
Feature: Delete answer GUI

  Scenario: Delete second answer out of three
    When I start creating a question
    Then I add an additional answer
    * I see 3 trash icon buttons enabled
    * I enter answers
      | AA | * |
      | BB |   |
      | CC |   |
    * I delete answer 2
    * I do not see answer 'BB'
    * I see the answers fields
      | AA | * |
      | CC |   |
    * I see 2 trash icon buttons disabled
