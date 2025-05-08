Feature: Testing 123

    Scenario: Adding <num1> and <num2> makes <total>
        Given I Have a number <num1>
        When I add the number <num2>
        Then I get a total of <total>
    Examples:
    |num1|num2|total|
    |5   |5   |10   |
    |3   |5   |8    |
    |6   |2   |8    |