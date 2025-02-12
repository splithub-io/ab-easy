(function () {
    "use strict";
  
    /**************** Check for Configuration ****************/
    // If no config is defined, do not execute any AB test logic.
    if (!window.abTestConfig || !Array.isArray(window.abTestConfig)) {
      console.warn("AB Test configuration not found. Skipping AB Test execution.");
      return;
    }
  
    /**************** Helper Functions ****************/
  
    // Set a cookie (for storing test results when using cookie storage)
    function setCookie(name, value, days) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
  
    // Get a cookie value by name
    function getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
  
    // Send an event to Google Analytics (supports both ga and gtag)
    function sendGAEvent(category, action, label) {
      if (window.ga && typeof window.ga === "function") {
        // Classic analytics
        ga("send", "event", category, action, label);
      } else if (window.gtag && typeof window.gtag === "function") {
        // gtag.js
        gtag("event", action, {
          event_category: category,
          event_label: label,
        });
      } else {
        console.log("GA Event:", category, action, label);
      }
    }
  
    /**************** AB Test Variant Assignment ****************/
  
    // Retrieve or assign a variant for a given test.
    function getTestVariant(test) {
      var storageKey = "abTest_" + test.id;
      var storedVariant = null;
  
      // Retrieve previously saved variant.
      if (test.storage === "cookie") {
        storedVariant = getCookie(storageKey);
      } else {
        storedVariant = localStorage.getItem(storageKey);
      }
  
      // If a variant has already been assigned, return its configuration.
      if (storedVariant) {
        var existing = test.variants.find(function (v) {
          return v.name === storedVariant;
        });
        if (existing) return existing;
      }
  
      // Otherwise, randomly choose a variant.
      var randomIndex = Math.floor(Math.random() * test.variants.length);
      var variant = test.variants[randomIndex];
  
      // Save the assigned variant.
      if (test.storage === "cookie") {
        setCookie(storageKey, variant.name, test.cookieExpiration || 7);
      } else {
        localStorage.setItem(storageKey, variant.name);
      }
  
      return variant;
    }
  
    /**************** Process Each AB Test ****************/
  
    // Global object to store results for tests of type "edits"
    window.abTestResults = window.abTestResults || {};
  
    function processTest(test) {
      // Only process tests marked as "active".
      if (test.status !== "active") return;
  
      // If a specific path is provided, only run this test on that path.
      if (test.path && window.location.pathname !== test.path) {
        return;
      }
  
      // Retrieve (or assign) the user's variant.
      var variant = getTestVariant(test);
  
      // Optionally send a GA event if enabled in the config.
      if (test.sendEvent) {
        // Use the provided event name or fallback to the test id.
        var eventName = test.gaEventName || test.id;
        sendGAEvent("ABTest", eventName, variant.name);
      }
  
      // Act based on the test type.
      if (test.type === "redirect") {
        // For redirect tests, the variant's "value" is the target URL.
        var targetUrl = variant.value;
        // Convert relative URLs to absolute URLs.
        if (!/^https?:\/\//i.test(targetUrl)) {
          targetUrl = window.location.origin + targetUrl;
        }
        // Redirect only if not already on the target URL.
        if (window.location.href !== targetUrl) {
          window.location.href = targetUrl;
        }
      } else if (test.type === "edits") {
        // For "edits" tests, save the variant result so that your custom code can adjust the page.
        window.abTestResults[test.id] = variant;
  
        // Optionally, dispatch a custom event that your scripts can listen for.
        var event = new CustomEvent("abTestEditsTriggered", {
          detail: { testId: test.id, variant: variant },
        });
        window.dispatchEvent(event);
      }
      // Additional test types can be handled here.
    }
  
    /**************** Initialize AB Tests ****************/
  
    // Process all tests when the DOM is ready.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        window.abTestConfig.forEach(function (test) {
          processTest(test);
        });
      });
    } else {
      window.abTestConfig.forEach(function (test) {
        processTest(test);
      });
    }
  })();
  