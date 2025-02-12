# Splithub AB Testing Starter

[![Splithub Logo](https://splithub.io/assets/img/th-1/logo.png)](https://splithub.io)

**Splithub AB Testing Starter** is a free, open-source solution for quickly starting A/B testing on your website. With our simple approach, you just need to build your configuration and add a script to your site—no complicated setups required!

**Get Started:** Use our [AB Test Config Builder](https://splithub.io/builder) to generate your configuration code in seconds.

## Overview

Splithub AB Testing Starter allows you to set up A/B tests with two main test types:

- **Redirect:** Automatically send users to different URLs based on their assigned variant.
- **Edits:** Modify page elements (e.g., hide or show blocks) based on the assigned variant.

Variants are stored persistently using either cookies or localStorage, ensuring that each user sees the same variant throughout their session. Additionally, you can integrate with Google Analytics to track test performance.

## How It Works

1. **Build Your Configuration:**  
   Use our [AB Test Config Builder](http://splithub.io/builder) to define your test details—such as test ID, type, status, and variants. The builder will generate code that looks like this:

   ```html
    <script>
        window.abTestConfig = [
        {
            id: "redirectTest1",
            type: "redirect",
            path: "/",
            status: "active",
            storage: "localStorage",
            cookieExpiration: 7,
            sendEvent: true,
            gaEventName: "RedirectTest1",
            variants: [
            { name: "A", value: "/variantA" },
            { name: "B", value: "https://splithub.io/variant_b" }
            ]
        }
        ];
    </script>
    ```

    Paste the generated code into your website’s HTML. Make sure that the configuration script is placed before the main AB testing script.

    Use the Assigned Variant in Your Code:
    For tests of type "edits", the chosen variant is made available via the global object window.abTestResults and through a custom event abTestEditsTriggered. This allows you to easily modify your page based on the variant. For example:

    ```html
    <!-- Example HTML element -->
    <div id="blockToToggle">This content may be hidden or shown based on the test variant.</div>
    <!-- Example HTML element -->
     ```

    ```html
    <script>
        // Option 1: Directly access the global variable
        const testResult = window.abTestResults && window.abTestResults.editTest1;
        if (testResult) {
            if (testResult.name === "A") {
            document.getElementById("blockToToggle").classList.add("hidden");
            } else {
            document.getElementById("blockToToggle").classList.remove("hidden");
            }
        }

        // Option 2: Listen for the custom event
        window.addEventListener("abTestEditsTriggered", function(e) {
            const { testId, variant } = e.detail;
            if (testId === "editTest1") {
            if (variant.name === "A") {
                document.getElementById("blockToToggle").classList.add("hidden");
            } else {
                document.getElementById("blockToToggle").classList.remove("hidden");
            }
            }
        });
    </script>
    ```

## Getting Started

Simply use the AB Test Config Builder to generate your configuration, then add the generated code snippet into your HTML.

If you wish to customize or extend the functionality, you can clone this repository.

## Support

If you have any questions, suggestions, or need support, please visit our Splithub website or open an issue in the repository. We're here to help you get the most out of our free A/B testing solution.

## License

This project is licensed under the MIT License.

Splithub is a platform dedicated to making A/B testing simple and accessible. Enjoy testing and optimizing your website with Splithub AB Testing Starter!
