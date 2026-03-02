Feature: Edit question Show/hide explanation
  When editing a question, the explanation checkbox reflects whether the
  question has existing explanations.
  - Explanations present: checkbox is checked and fields are visible by default
  - No explanations: checkbox is unchecked and fields are hidden
  - Toggling the checkbox shows or hides the explanation fields

  Scenario: Explanation fields are visible by default
    Given a question "What is the capital of Cambodia?"
    * with answers:
      | Brno   |   | No Brno |
      | Prague | * | Yes     |
      | Berlin |   | Germany |
    * saved and bookmarked as "Cambodia"
    When I start editing question "Cambodia"
    Then I see show explanation checkbox is checked
    And I see explanation fields are visible

  Scenario: Explanation fields are hidden when toggling "Show explanation" checkbox
    Given a question "What is the capital of Cambodia?"
    * with answers:
      | Brno   |   | No Brno |
      | Prague | * | Yes     |
      | Berlin |   | Germany |
    * saved and bookmarked as "Cambodia"
    When I start editing question "Cambodia"
    And I uncheck "Show explanation" checkbox
    Then I see show explanation checkbox is unchecked
    And I see explanation fields are not visible

  Scenario: Explanation fields are hidden when explanations are empty
    Given a question "What is the capital of Cambodia?"
    * with answers:
      | Brno   |   | |
      | Prague | * | |
      | Berlin |   | |
    * saved and bookmarked as "Cambodia"
    When I start editing question "Cambodia"
    Then I see show explanation checkbox is unchecked
    And I see explanation fields are not visible

