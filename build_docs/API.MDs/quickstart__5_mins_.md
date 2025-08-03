Quickstart (5 mins)
===================

/\*! tailwindcss v4.1.6 | MIT License | https://tailwindcss.com \*/ @layer properties; @layer theme, base, components, utilities; @layer utilities { .readme-tailwind .border { border-style: var(--tw-border-style); border-width: 1px; } } @property --tw-border-style { syntax: "\*"; inherits: false; initial-value: solid; } @layer properties { @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) { .readme-tailwind \*, .readme-tailwind ::before, .readme-tailwind ::after, .readme-tailwind ::backdrop { --tw-border-style: solid; } } }

Welcome! This guide will walk you through accessing your API key and making your first API call in under five minutes. Let's get started!

Step 1: Generate your API Key

[](#step-1-generate-your-api-key)
------------------------------------------------------------------

To access SecurityScorecard's APIs and integrations, you'll need an API token. Please note that API access is not available for Free accounts; refer to the [plans](https://securityscorecard.com/pricing-packages/) for more information.

Here's how to generate your API key:

1.  Sign into the platform and navigate to **My Settings**.
    
    ![](https://files.readme.io/8fa3043783bc7e1e638e102718384e1ef7f54fa58f1daf1d1bc6c85b4f09eda7-image.png)
2.  Select the **API** tab from the left settings pane.
    
3.  Click **Generate New API Token**.
    
    ![](https://files.readme.io/3cdc1c690781d0317696bbb58174e96045fc553de5edf8af71a8166b78447e17-image.png)
4.  A confirmation prompt will appear. Click **Confirm** to generate the token.
    
5.  Copy the generated token immediately and store it in a secure location.
    

> **Note**: If you lose your key you can Generate A New Token on this same page. API Keys do not expire on their own. One can create a new token any time, but doing so invalidates a previously created token.

  

Step 2: Make your first API Request using our API Reference

[](#step-2-make-your-first-api-request-using-our-api-reference)
------------------------------------------------------------------------------------------------------------------------------

With your API key copied, you can now make your first API request directly within our documentation.

Start by browsing our [API Reference](/reference) to find an endpoint you wish to call.

1.  On the endpoint's page, locate the **Credentials** section. In the _Header_ field within the Credentials section, type `Token` followed by your API key. For example: `Token 1234567890`.
2.  Fill in any required parameters for the endpoint.
3.  Click the "Try It!" button.

![](https://files.readme.io/c021c5e46c1ef59e0f46ac79226a730b5abf5ac9cfd7873c7f737fe67b3c4020-image.png)  

You will see the API call being made, and the response will appear in the Response section, typically located in the bottom right.

Step 3: Make API calls in your preferred coding environment

[](#step-3-make-api-calls-in-your-preferred-coding-environment)
------------------------------------------------------------------------------------------------------------------------------

After successfully making an API call in the **API Reference**, you can easily transfer this to your own coding environment.

1.  On the same API Reference page where you tested the call, look for the **Language** selection, usually in the top right of the request/response panel. Select your preferred programming language from the menu.
2.  The code snippet in the **Request** section will automatically update to reflect the endpoint, your entered parameters, and authentication details for the selected language.  
    Copy this code snippet and paste it into your local development environment or project.
3.  Remember to install or import any necessary libraries required to make API calls in your chosen language before running the code.

![](https://files.readme.io/1678a28fbdd4bdc9fa4183afbd9332a0439395506b4cb9798008b2aa497a5b4f-image.png)  

Congratulations! You've successfully retrieved your API key, tested your first API call in ReadMe, and integrated the code into your development environment.

Updated about 2 months ago

* * *

Did this page help you?

Yes

No

Updated about 2 months ago

* * *

Did this page help you?

Yes

No