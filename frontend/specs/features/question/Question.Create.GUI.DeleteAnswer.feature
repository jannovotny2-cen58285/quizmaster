Feature: Create question GUI - delete answer

  Scenario: Delete second answer out of three
    When I start creating a question
    * I enter answers
      | AA | * |
      | BB |   |
      | CC |   |
    * I delete answer 2
    * I see the answers fields
      | AA | * |
      | CC |   |
