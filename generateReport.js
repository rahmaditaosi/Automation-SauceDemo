// generateReport.js
import reporter from 'cucumber-html-reporter';

const options = {
  theme: 'bootstrap',
  jsonFile: 'report/cucumber-report.json',
  output: 'report/cucumber-report.html',
  reportSuiteAsScenarios: true,
  launchReport: true,
};

reporter.generate(options);
