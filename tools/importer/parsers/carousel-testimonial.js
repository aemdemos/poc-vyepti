/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-testimonial.
 * Base: carousel. Source: https://www.vyepti.com/
 * Generated: 2026-03-31
 *
 * Source structure: Slick slider with .slick-slide items (includes cloned duplicates).
 * Each slide has patient photo (.vyepti-patient-image) and text content
 * (quote, patient name, disclaimer, CTA link).
 *
 * Target: Carousel block with 2 columns per row (Col 1: image, Col 2: text content).
 */
export default function parse(element, { document }) {
  // Select only real slides (not cloned duplicates)
  const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned)');

  const cells = [];

  slides.forEach((slide) => {
    // Col 1: Patient photo
    const patientImage = slide.querySelector('img.vyepti-patient-image');
    const patientPicture = patientImage ? patientImage.closest('picture') || patientImage : null;

    // Col 2: Text content from .rteComponent
    const rteComponent = slide.querySelector('.rteComponent');
    const textWrapper = document.createElement('div');

    if (rteComponent) {
      // Quote text - extract from h2 > .patient-quotes > .dtc-teal-text
      const quoteH2 = rteComponent.querySelector('h2');
      if (quoteH2) {
        const quoteText = quoteH2.querySelector('.dtc-teal-text');
        if (quoteText) {
          const h2 = document.createElement('h2');
          h2.textContent = quoteText.textContent.trim();
          textWrapper.append(h2);
        }
      }

      // Patient name - from .patient-info
      const patientInfo = rteComponent.querySelector('.patient-info');
      if (patientInfo) {
        const namePara = document.createElement('p');
        namePara.innerHTML = patientInfo.innerHTML;
        textWrapper.append(namePara);
      }

      // Disclaimer - from .individual-result
      const disclaimer = rteComponent.querySelector('.individual-result');
      if (disclaimer) {
        textWrapper.append(disclaimer);
      }

      // CTA link - from .watch-story-icon
      const ctaLink = rteComponent.querySelector('a.watch-story-icon');
      if (ctaLink) {
        const arrowSpan = ctaLink.querySelector('.arrow-icon');
        if (arrowSpan) arrowSpan.remove();
        const ctaPara = document.createElement('p');
        ctaPara.append(ctaLink);
        textWrapper.append(ctaPara);
      }
    }

    if (patientPicture || textWrapper.children.length > 0) {
      cells.push([patientPicture || '', textWrapper]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-testimonial', cells });
  element.replaceWith(block);
}
