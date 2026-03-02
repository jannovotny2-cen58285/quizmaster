Feature: Home Page Links
  The home page provides navigation links to the main entry points
  of the application: creating a new question and creating a new workspace.

  Scenario: Validate home page has correct navigation links
    Given I am on the home page
    Then I can create a new question
    And I can create a new workspace
