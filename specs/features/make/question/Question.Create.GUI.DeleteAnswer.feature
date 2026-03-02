Feature: Create question GUI - delete answer
  Answer fields can be removed from the question form. Deleting an answer
  in the middle re-orders the remaining answers to fill the gap.

  Scenario: Delete second answer out of three
    When I start creating a question
    * I check show explanations checkbox
    * I enter answers
      | AA | * |
      | BB |   |
      | CC |   |
    Then I delete answer 2
    * I see the answers fields
      | AA | * |
      | CC |   |
