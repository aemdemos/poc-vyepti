/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPharmaParser from './parsers/hero-pharma.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import columnsCtaParser from './parsers/columns-cta.js';

// TRANSFORMER IMPORTS
import vyeptiCleanupTransformer from './transformers/vyepti-cleanup.js';
import vyeptiSectionsTransformer from './transformers/vyepti-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-pharma': heroPharmaParser,
  'cards-feature': cardsFeatureParser,
  'carousel-testimonial': carouselTestimonialParser,
  'columns-cta': columnsCtaParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Vyepti homepage - pharmaceutical product landing page for eptinezumab (VYEPTI) migraine prevention treatment',
  urls: [
    'https://www.vyepti.com/'
  ],
  blocks: [
    {
      name: 'hero-pharma',
      instances: ['.teaser.homeBanner']
    },
    {
      name: 'cards-feature',
      instances: ['.home-parsys']
    },
    {
      name: 'carousel-testimonial',
      instances: ['.quotescardcarousel']
    },
    {
      name: 'columns-cta',
      instances: ['.columncontainer:has(.bgcardparsys)']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.teaser.homeBanner',
      style: null,
      blocks: ['hero-pharma'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Help Info Strip',
      selector: '.vyepti-homepage-call-cta',
      style: 'accent',
      blocks: [],
      defaultContent: ['.vyepti-homepage-call-cta']
    },
    {
      id: 'section-3',
      name: 'Feature Cards',
      selector: '.home-parsys',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Patient Quote Carousel',
      selector: '.quotescardcarousel',
      style: null,
      blocks: ['carousel-testimonial'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'CTA Cards',
      selector: '.columncontainer:has(.bgcardparsys)',
      style: null,
      blocks: ['columns-cta'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Safety Information',
      selector: '.isi',
      style: null,
      blocks: [],
      defaultContent: ['.isi']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  vyeptiCleanupTransformer,
  vyeptiSectionsTransformer,
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page using template selectors
 * @param {Document} document - The DOM document
 * @param {Object} template - PAGE_TEMPLATE object
 * @returns {Array} Block instances found
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using template selectors
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
