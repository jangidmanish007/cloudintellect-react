# Dynamic Page Content Guide

Changes you make in **Admin → Pages → Edit** (or the dedicated **Page Content** editor at `/admin/pages/edit/:slug`) are reflected on the frontend.

## How it works

- Each public page loads its content from the API using the page **slug**.
- In **Admin → Pages**, clicking **Edit** on a row opens the **Page Content** editor for that page.
- The editor shows one section per page component (Hero, Bridging, Cloud Intellect Edge, etc.). You can update each section directly; changes are saved to the API and appear on the frontend.
- Hero sections use structured fields; other sections use a **Content (JSON)** textarea. Components read from `content.hero`, `content.bridging`, `content.cloudIntellectEdge`, etc., with fallbacks to built-in defaults.

## Hero content shape

Use a `hero` object inside the JSON. All fields are optional; any missing field falls back to the default.

| Field | Example | Used in |
|-------|---------|--------|
| `tag` | `"LIVE SESSIONS"` | Tag above the heading |
| `heading` | `"We Are"` or `"Why Choose"` | Main heading line |
| `headingAccent` | `"Cloud Intellect"` | Accent part of heading |
| `description` | `"Your description text."` | Paragraph below heading |
| `primaryButtonText` | `"Explore Programs"` | First button label |
| `primaryButtonHref` | `"#programs"` | First button link |
| `secondaryButtonText` | `"View Placements"` | Second button label |
| `secondaryButtonHref` | `"#placements"` | Second button link |
| `stats` | (About page only) | Array of `{ value, label }` for stat cards |

## Example: About page

```json
{
  "hero": {
    "tag": "SALESFORCE WORKFORCE DEVELOPMENT PARTNER",
    "heading": "We Are",
    "headingAccent": "Cloud Intellect.",
    "description": "Enabling industry-ready careers through real skills and real projects.",
    "primaryButtonText": "Explore Programs",
    "primaryButtonHref": "#programs",
    "secondaryButtonText": "View Placements",
    "secondaryButtonHref": "#placements",
    "stats": [
      { "value": "5000+", "label": "LEARNERS TRAINED" },
      { "value": "1400+", "label": "PLACED" },
      { "value": "90%", "label": "SATISFACTION" },
      { "value": "100%", "label": "COMPLIANCE" }
    ]
  }
}
```

## Example: Webinars page

```json
{
  "hero": {
    "tag": "LIVE SESSIONS",
    "heading": "Live Sessions Salesforce Technical Webinars 2026",
    "description": "Join live sessions to learn Salesforce, choose your track, and start with confidence.",
    "primaryButtonText": "Explore Programs",
    "primaryButtonHref": "#programs",
    "secondaryButtonText": "View Placements",
    "secondaryButtonHref": "#placements"
  }
}
```

## Example: Home page (hero slides)

For the home page hero carousel, use `heroSlides` as an array of slide objects:

```json
{
  "heroSlides": [
    {
      "name": "Shubham",
      "lastName": "Khanorkar",
      "designation": "Sr. Product Manager",
      "package": "18.5",
      "image": "https://example.com/image.webp",
      "logo": "metacube"
    }
  ]
}
```

## Section keys (content.*) per page

Each page has multiple sections. In the Page Content editor you get one card per section; the key is the same as in the table below. Frontend components read `content[sectionKey]`.

| Page (slug) | Section keys |
|-------------|--------------|
| **home** | heroSlides, ecosystem, courses, legacy, recognition, placements, placementNetwork, industryExperience, communityImage, whyChoose, studentSuccess, studentReviews, newsAndEvents |
| **about** | hero, bridging, cloudIntellectEdge, leadershipEdge, coreValues |
| **why-choose-us** | hero, coreAdvantages, placementAssistance, trustRecognition, impactSnapshot |
| **webinars** | hero, upcomingBatches, webinarsCover, whoShouldAttend, moreSuccessStories, makeInformedDecision |
| **salesforce-developer** | hero, sfdcTopics, sfdcCareerOpportunities |
| **salesforce-marketing-cloud** | hero, sfmcTopics, sfmcCareerOpportunities |
| **sfmc-sfdc** | hero, selectYourPath, whoCanApply, keyAdvantages, completeSupportEcosystem, becomeJobReady |
| **alumni-success** | hero, successStories, alumniProfiles, moreSuccessStories, yourJourney |

## Pages and slugs

| Page | Slug |
|------|------|
| Home | `home` |
| About | `about` |
| Why Choose Us | `why-choose-us` |
| Salesforce Developer | `salesforce-developer` |
| Salesforce Marketing Cloud | `salesforce-marketing-cloud` |
| SFMC & SFDC | `sfmc-sfdc` |
| Alumni Success | `alumni-success` |
| Webinars | `webinars` |

## Tips

1. **Valid JSON only** – No trailing commas, use double quotes for keys and strings.
2. **Refresh frontend** – After saving, refresh the public page to see changes.
3. **Partial content** – You can send only the keys you want to change; the rest use defaults.
4. **Title & meta** – The main **Title**, **Meta Title**, and **Meta Description** fields in the form are for SEO and can be used later for document title and meta tags.
