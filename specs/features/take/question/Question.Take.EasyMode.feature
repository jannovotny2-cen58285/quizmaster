Feature: Take a question in EasyMode
  Easy Mode reveals the number of correct answers for a multiple choice question,
  helping the quiz taker narrow down their selection.
  - Multiple choice + Easy Mode ON: displays count of correct answers
  - Multiple choice + Easy Mode OFF: no count displayed
  - Single choice: Easy Mode is not applicable (always one correct answer)

  Scenario: Multiple choice question - Easy Mode ON - correct answers is 3
    Given a question "Which of these countries are in Europe?"
    * with answers:
      | Italy   | * |
      | France  | * |
      | Morocco |   |
      | Spain   | * |
      | Canada  |   |
    * marked as easy mode
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I see that the question has 3 correct answers

  Scenario: Multiple choice question - Easy Mode ON - correct answers is 2
    Given a question "Which of these countries are in Europe?"
    * with answers:
      | Italy   | * |
      | France  | * |
      | Morocco |   |
      | Spain   |   |
      | Canada  |   |
    * marked as easy mode
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I see that the question has 2 correct answers

  Scenario: Multiple choice question - Easy Mode OFF - no correct answers
    Given a question "Which of these countries are in Europe?"
    * with answers:
      | Italy   | * |
      | France  | * |
      | Morocco |   |
      | Spain   |   |
      | Canada  |   |
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I do not see correct answers count

  Scenario: Single choice question - Easy Mode N/A - no correct answers
    Given a question "Which of these countries is not in Europe?"
    * with answers:
      | Italy   |   |
      | France  |   |
      | Morocco | * |
      | Spain   |   |
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I do not see correct answers count
