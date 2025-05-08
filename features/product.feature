@Product
Feature: Product

    @Retrive-product @web
    Scenario: User can see product list
        Given I am on the product page
        When I view the product list
        Then I should see a list of products displayed

    @AddToCart @web
    Scenario: User add product to cart
        Given I am on the product page
        When I view the product list
        And I Clicked the add to cart button
        Then The number of items in my basket has increased

    @AddToCart @web
    Scenario: User add product more than 1
    Given I am on the product page
        When I view the product list
        And I Clicked the add to cart button
        And I Clicked the other add to cart button
        Then The number of items in my basket has increased

    @RemoveItemOnCart @web
    Scenario: User add product and then remove the item
    Given I am on the product page
        When I view the product list
        And I Clicked the add to cart button
        And I Clicked the remove button
        Then The number of items in my basket has decreased