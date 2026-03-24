Feature: Image URL validation when creating a question
  Quiz makers should receive validation feedback when entering an invalid image URL
  - Valid URLs (http://, https://) should be accepted and preview should display
  - Invalid URLs (malformed, wrong protocol, XSS) should show validation error
  - Empty image URL is optional and should not show error

  Scenario Outline: Invalid image URL shows validation error
    Given I start creating a question
    When I enter an invalid image URL "<image-url>"
    Then I see error messages
      | invalid-image-url |
    And I do not see image preview

    Examples:
      | image-url                    |
      | not-a-url                    |
      | ftp://example.com/image.jpg  |
      | javascript:alert('xss')      |

  Scenario Outline: Valid image URL is accepted
    Given I start creating a question
    When I enter image URL "<image-url>"
    Then I see no error messages
    And I see image preview

    Examples:
      | image-url                        |
      | https://example.com/image.jpg    |
      | http://placekitten.com/300/200   |

  Scenario: Empty image URL is optional
    Given I start creating a question
    Then I do not see image preview
    And I see no error messages

  Scenario: Invalid image URL shows validation while typing
    Given I start creating a question
    When I type image URL "h"
    Then I see error messages
      | invalid-image-url |
    And I do not see image preview

  Scenario: URL validation error clears when typed correctly
    Given I start creating a question
    When I type image URL "h"
    Then I see error messages
      | invalid-image-url |
    When I clear image URL and type "https://example.com/image.jpg"
    Then I see no error messages
    And I see image preview

  Scenario: URL validation error clears when corrected
    Given I start creating a question
    When I enter an invalid image URL "not-a-url"
    Then I see error messages
      | invalid-image-url |
    When I clear image URL and enter "https://example.com/image.jpg"
    Then I see no error messages
    And I see image preview
