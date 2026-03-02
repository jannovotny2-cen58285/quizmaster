Feature: Create question GUI
  The question creation form has sensible defaults: empty question text,
  two empty answer fields, single choice mode, and no explanations.
  After successful submission, the user receives both a take-question URL
  (for sharing with quiz takers) and an edit-question URL (with UUID editId).

  Background:
    When I start creating a question
    And I check show explanations checkbox

  Scenario: Default values
    Then I see empty question field
    * I see multiple choice is unchecked
    * I see 2 empty answer fields, incorrect, with empty explanations fields, unable to delete
    * I see empty question explanation field

  Scenario: Question take and question edit URLs
    Successfully created question has two URLs:
    - question take URL the quiz maker can share with quiz takers
    - private edit URL (with UUID editId) for future edits

    Given
    * I enter question "2 + 2 = ?"
    * I enter answers
      | 4 | * |
      | 5 |   |

    When I submit the question
    Then I see question edit page
    And I see question-take URL and question-edit URL
