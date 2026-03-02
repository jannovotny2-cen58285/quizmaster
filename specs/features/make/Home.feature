Feature: Home Page Links
  The home page provides navigation links to the main entry points
  of the application: creating a new question and creating a new workspace.

  Scenario: Validate home page has correct navigation links
    Given I am on the home page
    Then I should see a link to create a new question
    And I should see a link to create a new workspace
