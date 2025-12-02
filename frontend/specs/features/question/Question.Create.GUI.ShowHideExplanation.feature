Feature: Create question GUI - Show/hide choice explanations
  Show/hide explanation answer fields when toggling "Add explanation to your answer" checkbox

  Scenario: Explanation fields are hidden by default
    Given I start creating a question
    And I see show explanation checkbox is unchecked
    And I see explanation fields are not visible
    When I check "Show explanation" checkbox
    Then I see show explanation checkbox is checked
    And I see explanation fields are visible
