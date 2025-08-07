Core Resources
==============

Resources exposed in our API and how to navigate them

/\*! tailwindcss v4.1.6 | MIT License | https://tailwindcss.com \*/ @layer theme, base, components, utilities; @layer utilities; ![](https://files.readme.io/e2d5e4a-API_resources.png)  

Below is a quick overview to using some of these resources, more detailed instructions are provided as links to the respective sections in our API Reference, where you can find every resource and operation available.

Portfolios

[](#portfolios)
-----------------------------

This is the starting point.

Portfolios let you organize scorecards and you can create and manipulate them using our API.  
We only calculate scorecards that were added to a portfolio so you must add a scorecard to a portfolio before accessing scorecard data.

For more details see [portfolios](/reference/portfolios) API reference.

Scorecards

[](#scorecards)
-----------------------------

We keep scorecards for every company with a digital footprint, you can find statistics about our scorecard catalog in our [Trust Portal](https://trust.securityscorecard.com?utm_campaign=devhub)

Some customers can also create and publish custom scorecards for subsidiaries or other subsets of a regular scorecard.

You can [add scorecards to a portfolio](/reference/put_portfolios-portfolio-id-companies-domain), access [basic company information and scorecard summary](/reference/get_companies-scorecard-identifier), [factor scores and issue counts](/reference/get_companies-scorecard-identifier-factors) or even list [active issue findings](/reference/active-findings) for each [issue type](/reference/get_metadata-issue-types).

To generate a scorecard for a new company scorecard simply add a new scorecard to a portfolio using any domain associated to that company.

For any date range within the last 12 months you can also obtain score history ([overall](/reference/get_companies-scorecard-identifier-history-score), [per factor](/reference/get_companies-scorecard-identifier-history-factors-score), [industry](/reference/get_industries-industry-history-score), [industry per factor](/reference/get_industries-industry-history-factors)) and [event log](/reference/event-log). Events in a scorecard event log explain score changes and work as a news feed of scorecard updates like new issues, issues getting resolved, and reported breaches.

Reports

[](#reports)
-----------------------

You can request some of the portfolio and scorecard reports available in our platform, list recently generated reports and download the generated file (eg. csv, pdf) when they complete.

For details see [reports](/reference/reports) API reference.

Alerts

[](#alerts)
---------------------

Setup alerts to get notifications on different scorecard changes, and then [list recent notifications](/reference/get_users-by-username-username-notifications-recent).

For details see [alerts](/reference/alerts) API reference.

Improving scores

[](#improving-scores)
-----------------------------------------

You can also automate additional actions to improve the security posture of your company or the companies in your ecosystem:

*   [Get a score plan](/reference/get_companies-domain-score-plans-by-target-score) for any scorecard by specifying a target score
*   [Refute issues](/reference/post_companies-domain-issues-type-feedback)
*   [Invite companies](/reference/post_invitations) improve their score. All invited companies gain a free account to access their own scorecard and improve their security posture.

Can I do ... with SecurityScorecard API?

[](#can-i-do--with-securityscorecard-api)
-------------------------------------------------------------------------------------

While we keep a level of feature parity with the [SecurityScorecard web application](https://platform.securityscorecard.io) some functionality might not be available yet for programatic usage.

If there's anything missing you're trying to use in your integration, we are eager to hear about it! Please contact us at [support@securityscorecard.io](mailto:support@securityscorecard.io).

Updated about 2 months ago

* * *

What’s Next

Check some code samples using these resources

*   [Code Samples](/docs/code-samples-index)

Did this page help you?

Yes

No

Updated about 2 months ago

* * *

What’s Next

Check some code samples using these resources

*   [Code Samples](/docs/code-samples-index)

Did this page help you?

Yes

No