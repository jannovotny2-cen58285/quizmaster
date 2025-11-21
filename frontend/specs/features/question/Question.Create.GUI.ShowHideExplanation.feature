Feature: Create question GUI - Show/hide choice explanations
  Show/hide explanation answer fields when toggling "Add explanation to your answer" checkbox

  @skip
  Scenario: Default values
    When I start creating a question
    Then I see add answer explanations is unchecked
    And I see explanation text fields are not visible
    When I check "Add explanation to your answer" checkbox
    Then I see explanation fields are visible for answers
