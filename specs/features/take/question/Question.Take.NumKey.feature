Feature: Answer question using numeric keys
  Quiz takers can answer single choice questions by pressing numeric keys (1-9)
  on the keys, matching the answer's position in the list.
  Impossible to answer 10th option.

  Scenario Outline: Single choice question - numeric key selects an answer
    Given a question "Which country is in Europe?"
    And with answers:
      | Italy   | * |
      | Mexico  |   |
      | Morocco |   |
      | USA     |   |
      | Canada  |   |
      | Iran    |   |
      | China   |   |
      | Japan   |   |
      | Israel  |   |
      | Kuwait  |   |
    And saved and bookmarked as "Europe"

    When I take question "Europe"
    And I press the key <key>
    Then I see feedback "<feedback>"

    Examples:
      | key | feedback   |
      | 1   | Correct!   |
      | 2   | Incorrect! |
      | 5   | Incorrect! |
      | 9   | Incorrect! |
