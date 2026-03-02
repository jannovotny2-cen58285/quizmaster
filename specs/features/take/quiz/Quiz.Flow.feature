Feature: Take a quiz

  Background:
    Given a quiz "Quiz" with questions
      | question                    | answers                                            |
      | Which animal has long nose? | Elephant (*), Anteater (*), Swordfish (*), Bulldog |
      | What is capital of France?  | Marseille, Lyon, Paris (*), Toulouse               |

  Scenario: Quiz question is not answered and the next button is clicked
    When I start quiz "Quiz"
    And I click the next button
    Then I see question "What is capital of France?"
    And I see bookmark to previous question "Which animal has long nose?"
    And I see bookmark link "Which animal has long nose?"

  Scenario: User proceed to last question
    When I start quiz "Quiz"
    And I answer "Elephant"
    Then I see question "What is capital of France?"
    Then I should not see the evaluate button
    When I answer "Lyon"
    Then I should see the evaluate button
    Then I should not see the next button

  Scenario: User navigate to evaluation page
    When I start quiz "Quiz"
    And I answer "Elephant"
    Then I see question "What is capital of France?"
    Then I should not see the evaluate button
    When I answer "Lyon"
    Then I click the evaluate button

  Scenario: User reloads page on answered question
    When I start quiz "Quiz"
    And I answer "Elephant"
    * I check answer "Lyon,Paris"
    * I uncheck answer "Lyon"
    * I refresh the page
    Then no answer is selected

  Scenario: Back button is not visible on the quiz page
    When I start quiz "Quiz"
    Then I should not see the back button

  Scenario: Back button is visible
    When I start quiz "Quiz"
    And I answer "Elephant"
    Then I should see the back button

  Scenario: Back button is clicked
    When I start quiz "Quiz"
    And I answer "Elephant"
    Then I see question "What is capital of France?"
    And I click the back button
    Then I see question "Which animal has long nose?"

  Scenario: Last question is not answered and there are any skipped questions
    When I start quiz "Quiz"
    And I click the next button
    Then I see question "What is capital of France?"
    Then I should not see the evaluate button
    Then I should see the next button

  Scenario: Last question is answered and there are any skipped questions
    When I start quiz "Quiz"
    And I click the next button
    Then I see question "What is capital of France?"
    When I answer "Paris"
    Then I should not see the evaluate button
    Then I should see the next button

  Scenario: Last question is answered and show skipped question
    When I start quiz "Quiz"
    And I click the next button
    Then I see question "What is capital of France?"
    When I answer "Paris"
    Then I should not see the evaluate button
    Then I should see the next button
    When I click the next button
    Then I see question "Which animal has long nose?"

  Scenario: Last question is skipped and there are any skipped questions
    When I start quiz "Quiz"
    And I click the next button
    Then I see question "What is capital of France?"
    Then I should see the next button
    When I click the next button
    Then I see question "Which animal has long nose?"

  Scenario: Do not show skipped question which was submitted
    When I start quiz "Quiz"
    And I click the next button
    Then I see question "What is capital of France?"
    When I answer "Paris"
    Then I should not see the evaluate button
    Then I should see the next button
    When I click the next button
    Then I see question "Which animal has long nose?"
    When I answer "Elephant"
    Then I should see the evaluate button

  Scenario: Remembered answer after back button
    When I start quiz "Quiz"
    And I answer "Elephant"
    Then I see question "What is capital of France?"
    When I click the back button
    Then I see answer "Elephant" checked

  Scenario: Remembered multiple choices after back button
    When I start quiz "Quiz"
    Then I see question "Which animal has long nose?"
    When I answer "Elephant, Anteater"
    Then I see question "What is capital of France?"
    When I click the back button
    Then I see answer "Elephant" checked
    Then I see answer "Anteater" checked

  Scenario: Submit button is visible as active when answer is checked
    When I start quiz "Quiz"
    Then I see question "Which animal has long nose?"
    When I check answer "Elephant"
    Then I see the submit button as active

  Scenario: Submit button is visible as inactive when no answer is checked
    When I start quiz "Quiz"
    Then I see question "Which animal has long nose?"
    Then I see the submit button as inactive
    When I check answer "Elephant"
    Then I see the submit button as active
    When I uncheck answer "Elephant"
    Then I see the submit button as inactive

  Scenario: When I click next button answer is submitted
    When I start quiz "Quiz"
    Then I see question "Which animal has long nose?"
    When I check answer "Elephant"
    And I click the next button
    Then I see question "What is capital of France?"
    When I click the back button
    Then I see answer "Elephant" checked

  @skip
  Scenario: When I click back button answer is submitted
    Given a quiz "Three Questions" with questions
      | question                       | answers                                            |
      | Which animal has long nose?    | Elephant (*), Anteater (*), Swordfish (*), Bulldog |
      | What is capital of France?     | Marseille, Lyon, Paris (*), Toulouse               |
      | What is capital of Madagascar? | Antananarivo (*), Nairobi, Cairo, Dakar            |
    When I start quiz "Three Questions"
    Then I see question "Which animal has long nose?"
    And I click the next button
    Then I see question "What is capital of France?"
    And I check answer "Paris"
    When I click the next button
    Then I see question "What is capital of Madagascar?"
    When I click the back button
    Then I see answer "Paris" checked
