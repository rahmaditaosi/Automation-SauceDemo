@Login
Feature: Login

    @regresstion @web
    Scenario: User can login with valid cradential
        Given I am on the login page
        When I login with valid credential
        Then I am logged in
    
    @negative-case @web
    Scenario: Login failed using wrong password
        Given I am on the login page
        When I login with invalid credential
        Then I am not logged in