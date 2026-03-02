Feature: Edit Quiz in Workspace

  Background:
    Given workspace "Edit Quiz" with questions
      | question  | answers  |
      | 2 + 2 = ? | 4 (*), 5 |
      | 3 * 3 = ? | 9 (*), 6 |
      | 4 / 2 = ? | 2 (*), 3 |
    And a quiz "Math Quiz" with all questions

  Scenario: Edit quiz title and description
    When I navigate to edit quiz "Math Quiz"
    * I enter quiz name "Advanced Math"
    * I enter quiz description "Challenging mathematics questions"
    * I submit the quiz
    Then I see the quiz "Advanced Math" in the workspace
    * I take quiz "Advanced Math"
    * I see quiz description "Challenging mathematics questions"
