Feature: Create question form
  The question creation form starts with sensible defaults: empty question text,
  two empty answer fields, single choice mode, and no explanations visible.
  Answers can be added and removed. The explanation checkbox controls whether
  explanation fields are shown. After successful submission, the user receives
  a take-question URL and an edit-question URL.

  Scenario: Default values
    Given I start creating a question
    * I enable explanations
    Then I see empty question text
    * the question is single choice
    * I see 2 default empty answers
    * I see empty question explanation

  Scenario: Question take and question edit URLs
    Successfully created question has two URLs:
    - question take URL the quiz maker can share with quiz takers
    - private edit URL (with UUID editId) for future edits

    Given I start creating a question
    * I enter question "2 + 2 = ?"
    * I enter answers
      | 4 | * |
      | 5 |   |

    When I submit the question
    Then I see question edit page
    And I see question-take URL and question-edit URL

  Scenario: Delete second answer out of three
    Given I start creating a question
    * I enter answers
      | AA | * |
      | BB |   |
      | CC |   |
    Then I delete answer 2
    * I see the answers fields
      | AA | * |
      | CC |   |

  Scenario: Explanation fields are hidden by default
    When I start creating a question
    Then I see explanations are disabled
    And I do not see explanation fields

  Scenario: Explanation fields are visible when enabling explanations
    When I start creating a question
    And I enable explanations
    Then I see explanations are enabled
    And I see explanation fields

  Scenario: Test backButton
    Given workspace "Testworkspace"
    And page "Question Creation"
    When I start creating a new question
    And I see the question creation page
    And I go back to the workspace "Testworkspace"
    Then I see the workspace "Testworkspace"
