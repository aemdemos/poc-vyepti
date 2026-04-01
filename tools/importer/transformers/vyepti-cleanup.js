/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: vyepti cleanup. Selectors from captured DOM of https://www.vyepti.com/
 * Removes non-authorable content: cookie banner, header, footer, modals, navigation strips.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent banner (found: #cookie-information-template-wrapper, #coiConsentBanner)
    WebImporter.DOMUtils.remove(element, [
      '#cookie-information-template-wrapper',
      '#coiConsentBanner',
      '.coi-consent-banner',
    ]);

    // Prescription status modal overlays (found: .prescriptionStatusModel)
    WebImporter.DOMUtils.remove(element, [
      '.prescriptionStatusModel',
      '.modal-backdrop',
    ]);

    // External link interstitial modal (found: .interstitialmodal, #external-link-modal)
    WebImporter.DOMUtils.remove(element, [
      '.interstitialmodal',
      '#external-link-modal',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header and navigation (found: header.header-section, .info-teal-strip-section.header-strip)
    WebImporter.DOMUtils.remove(element, [
      'header.header-section',
      '.info-teal-strip-section.header-strip',
      '.info-teal-strip-section-desktop',
    ]);

    // Footer (found: footer#footer, .footer.iparsys)
    WebImporter.DOMUtils.remove(element, [
      'footer#footer',
      '.footer.iparsys',
    ]);

    // Safe element removal
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
    });
  }
}
