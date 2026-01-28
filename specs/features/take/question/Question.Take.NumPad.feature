#@skip
Feature: Answer question using numeric keyboard

  Scenario Outline: Single choice question - numeric key selects an answer
    Given a question "Which country is in Europe?"
    And with answers:
      | Italy   | * |
      | Mexico  |   |
      | Morocco |   |
      | USA     |   |
      | Canada  |   |
    And saved and bookmarked as "Europe"

    When I take question "Europe"
    And I press the key <key>
    Then I see feedback "<feedback>"

    Examples:
      | key | feedback   |
      | 1   | Correct!   |
      | 2   | Incorrect! |
      | 3   | Incorrect! |
      | 4   | Incorrect! |
      | 5   | Incorrect! |
