import { withPluginApi } from "discourse/lib/plugin-api";
import buildLazyVideo from "../lib/lazy-video-builder";
import buildIFrame from "../lib/iframe-builder";

function decorateLazyContainer(api, cooked) {
  const lazyContainers = cooked.querySelectorAll(".lazy-video-container");

  if (lazyContainers.length) {
    const siteSettings = api.container.lookup("site-settings:main");

    for (let container of lazyContainers) {
      const providerName = container.dataset.providerName;

      if (siteSettings[`lazy_${providerName}_enabled`]) {
        buildLazyVideo(container, {
          loadEmbed() {
            buildIFrame(container);
            const postId = cooked.closest("article").dataset.postId;
            if (postId) {
              api.preventCloak(parseInt(postId, 10));
            }
          },
        });
      }
    }
  }
}

function initLazyEmbed(api) {
  api.decorateCookedElement(
    (cooked) => {
      if (cooked.classList.contains("d-editor-preview")) {
        return;
      }
      decorateLazyContainer(api, cooked);
    },
    { id: "discourse-lazy-videos" }
  );
}

export default {
  name: "discourse-lazy-videos",

  initialize() {
    withPluginApi("1.5.0", initLazyEmbed);
  },
};
