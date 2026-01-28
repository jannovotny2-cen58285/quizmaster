Feature: Show stats

  Background:
    Given questions
      | bookmark | question                            | answers                                   | explanation |
      | Sky      | What is the standard colour of sky? | Red, Blue (*), Green, Black               | Rayleigh    |
      | France   | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse      |             |

    Given quizes
      | bookmark | title  | description   | questions     | mode  | pass score | time limit |
      | -1       | Quiz A | Description A | Sky,France    | exam  | 85         | 120        |

  Scenario: Show empty stats page for quiz
    - Shows empty stats page for brand new created quiz.

    Given a quiz "Quiz" with questions
      | question              | answers         |
      | Jaký nábytek má Ikea? | Stůl (*), Auto  |
      | Jaké nádobí má Ikea?  | Talíř (*), Kolo |
    When I click the stats button for quiz "Quiz"
    And I see stats page for quiz "Quiz"

  Scenario: Show stats page for successfully answered quiz
    Given a quiz "Stats Quiz" with questions
      | question              | answers         |
      | Jaký nábytek má Ikea? | Stůl (*), Auto  |
      | Jaké nádobí má Ikea?  | Talíř (*), Kolo |
    And I take quiz "Stats Quiz" with answers
      | question              | answers |
      | Jaký nábytek má Ikea? | Stůl    |
      | Jaké nádobí má Ikea?  | Talíř   |
    When I click the stats button for quiz "Stats Quiz"
    Then I see stats page for quiz "Stats Quiz"
    And I see stats table
      | Duration | Score |
      |          |   100 |

  Scenario: Show stats page for unsuccessfully answered quiz
    Given a quiz "Stats Quiz" with questions
      | question              | answers         |
      | Jaký nábytek má Ikea? | Stůl (*), Auto  |
      | Jaké nádobí má Ikea?  | Talíř (*), Kolo |
    And I take quiz "Stats Quiz" with answers
      | question              | answers |
      | Jaký nábytek má Ikea? | Auto    |
      | Jaké nádobí má Ikea?  | Kolo    |
    When I click the stats button for quiz "Stats Quiz"
    Then I see stats page for quiz "Stats Quiz"
    And I see stats table
      | Duration | Score |
      |          |     0 |

  Scenario: Duration is calculated correctly
    Given  a quiz "Stats Quiz" with questions
      | question              | answers         |
      | Jaký nábytek má Ikea? | Stůl (*), Auto  |
      | Jaké nádobí má Ikea?  | Talíř (*), Kolo |
    When I take quiz "Stats Quiz" with answers in 10 seconds
      | question              | answers |
      | Jaký nábytek má Ikea? | Stůl    |
      | Jaké nádobí má Ikea?  | Kolo    |
    And I click the stats button for quiz "Stats Quiz"
    Then I see stats page for quiz "Stats Quiz"
    And I see stats table
      | Duration      |    |
      | 10 seconds    |    |
