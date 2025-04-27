// ==UserScript==
// @name         Replace ARS with $
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace "ARS" with "$" in currency amounts on the page.
// @author       Your Name
// @match        *://roobet.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace "₫" with "$" in text nodes
    function replaceCurrencySymbol(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const replacedContent = node.nodeValue.replace(/ARS\s*/g, "$"); // change to (/\bARS\s*/g, "$") for ars
            if (node.nodeValue !== replacedContent) {
                node.nodeValue = replacedContent;
            }
        }
    }

    // Function to traverse the DOM and replace currency symbols
    function traverseDOM(element) {
        element.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                traverseDOM(child);
            } else {
                replaceCurrencySymbol(child);
            }
        });
    }

    // Function to handle dynamic content updates with MutationObserver
    function handleMutations(mutationsList) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        traverseDOM(node); // Apply to newly added elements
                    } else {
                        replaceCurrencySymbol(node);
                    }
                });
            } else if (mutation.type === 'characterData') {
                replaceCurrencySymbol(mutation.target);
            }
        });
    }

    // Initialize MutationObserver to handle dynamic content
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // Initial pass to replace currency symbols in existing elements
    traverseDOM(document.body);

})();