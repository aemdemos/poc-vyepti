var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-pharma.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".cmp-teaser__image img, .cmp-teaser__image picture");
    const subheading = element.querySelector(".cmp-teaser__description h3");
    const heading = element.querySelector(".cmp-teaser__description h1");
    const description = element.querySelector(".cmp-teaser__description p");
    const ctaLink = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentWrapper = document.createElement("div");
    if (heading) contentWrapper.append(heading);
    if (subheading) contentWrapper.append(subheading);
    if (description) contentWrapper.append(description);
    if (ctaLink) {
      const arrowImg = ctaLink.querySelector("img");
      if (arrowImg) arrowImg.remove();
      contentWrapper.append(ctaLink);
    }
    if (contentWrapper.children.length > 0) {
      cells.push([contentWrapper]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-pharma", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document }) {
    const cardItems = element.querySelectorAll(".boxed-parsys");
    const cells = [];
    cardItems.forEach((card) => {
      const image = card.querySelector(".img-wrapper img, .img-wrapper picture");
      const heading = card.querySelector(".description-after h2");
      const description = card.querySelector(".description-after p");
      const ctaLink = card.querySelector(".boxed-link a");
      const textWrapper = document.createElement("div");
      if (heading) textWrapper.append(heading);
      if (description) textWrapper.append(description);
      if (ctaLink) {
        const arrowSpan = ctaLink.querySelector(".arrow-icon");
        if (arrowSpan) arrowSpan.remove();
        textWrapper.append(ctaLink);
      }
      if (image || textWrapper.children.length > 0) {
        cells.push([image || "", textWrapper]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-testimonial.js
  function parse3(element, { document }) {
    const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned)");
    const cells = [];
    slides.forEach((slide) => {
      const patientImage = slide.querySelector("img.vyepti-patient-image");
      const patientPicture = patientImage ? patientImage.closest("picture") || patientImage : null;
      const rteComponent = slide.querySelector(".rteComponent");
      const textWrapper = document.createElement("div");
      if (rteComponent) {
        const quoteH2 = rteComponent.querySelector("h2");
        if (quoteH2) {
          const quoteText = quoteH2.querySelector(".dtc-teal-text");
          if (quoteText) {
            const h2 = document.createElement("h2");
            h2.textContent = quoteText.textContent.trim();
            textWrapper.append(h2);
          }
        }
        const patientInfo = rteComponent.querySelector(".patient-info");
        if (patientInfo) {
          const namePara = document.createElement("p");
          namePara.innerHTML = patientInfo.innerHTML;
          textWrapper.append(namePara);
        }
        const disclaimer = rteComponent.querySelector(".individual-result");
        if (disclaimer) {
          textWrapper.append(disclaimer);
        }
        const ctaLink = rteComponent.querySelector("a.watch-story-icon");
        if (ctaLink) {
          const arrowSpan = ctaLink.querySelector(".arrow-icon");
          if (arrowSpan) arrowSpan.remove();
          const ctaPara = document.createElement("p");
          ctaPara.append(ctaLink);
          textWrapper.append(ctaPara);
        }
      }
      if (patientPicture || textWrapper.children.length > 0) {
        cells.push([patientPicture || "", textWrapper]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse4(element, { document }) {
    const columns = element.querySelectorAll(".bgcardparsys");
    const row = [];
    columns.forEach((col) => {
      const cellWrapper = document.createElement("div");
      const eyebrow = col.querySelector(".description-after h4");
      if (eyebrow) {
        cellWrapper.append(eyebrow);
      }
      const heading = col.querySelector(".description-after h2");
      if (heading) {
        cellWrapper.append(heading);
      }
      const description = col.querySelector(".description-after p");
      if (description) {
        cellWrapper.append(description);
      }
      const ctaLink = col.querySelector(".boxed-link a");
      if (ctaLink) {
        const arrowImg = ctaLink.querySelector("img");
        if (arrowImg) arrowImg.remove();
        const ctaPara = document.createElement("p");
        ctaPara.append(ctaLink);
        cellWrapper.append(ctaPara);
      }
      if (cellWrapper.children.length > 0) {
        row.push(cellWrapper);
      }
    });
    const cells = [];
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/vyepti-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#cookie-information-template-wrapper",
        "#coiConsentBanner",
        ".coi-consent-banner"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".prescriptionStatusModel",
        ".modal-backdrop"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".interstitialmodal",
        "#external-link-modal"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.header-section",
        ".info-teal-strip-section.header-strip",
        ".info-teal-strip-section-desktop"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer#footer",
        ".footer.iparsys"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/transformers/vyepti-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    var _a;
    if (hookName === TransformHook2.afterTransform) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = (_a = payload == null ? void 0 : payload.template) == null ? void 0 : _a.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== sections[0].id) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-pharma": parse,
    "cards-feature": parse2,
    "carousel-testimonial": parse3,
    "columns-cta": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Vyepti homepage - pharmaceutical product landing page for eptinezumab (VYEPTI) migraine prevention treatment",
    urls: [
      "https://www.vyepti.com/"
    ],
    blocks: [
      {
        name: "hero-pharma",
        instances: [".teaser.homeBanner"]
      },
      {
        name: "cards-feature",
        instances: [".home-parsys"]
      },
      {
        name: "carousel-testimonial",
        instances: [".quotescardcarousel"]
      },
      {
        name: "columns-cta",
        instances: [".columncontainer:has(.bgcardparsys)"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: ".teaser.homeBanner",
        style: null,
        blocks: ["hero-pharma"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Help Info Strip",
        selector: ".vyepti-homepage-call-cta",
        style: "accent",
        blocks: [],
        defaultContent: [".vyepti-homepage-call-cta"]
      },
      {
        id: "section-3",
        name: "Feature Cards",
        selector: ".home-parsys",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Patient Quote Carousel",
        selector: ".quotescardcarousel",
        style: null,
        blocks: ["carousel-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "CTA Cards",
        selector: ".columncontainer:has(.bgcardparsys)",
        style: null,
        blocks: ["columns-cta"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Safety Information",
        selector: ".isi",
        style: null,
        blocks: [],
        defaultContent: [".isi"]
      }
    ]
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
