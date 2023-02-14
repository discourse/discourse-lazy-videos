import { withPluginApi } from "discourse/lib/plugin-api";
import getLazyAttributes from "../lib/data-extractor";
import { hbs } from "ember-cli-htmlbars";

function initLazyEmbed(api) {
  api.decorateCookedElement(
    (cooked, helper) => {
      const lazyContainers = cooked.querySelectorAll(".lazy-video-container");

      if (cooked.classList.contains("d-editor-preview")) {
        return;
      }

      if (lazyContainers.length === 0) {
        return;
      }

      for (const container of lazyContainers) {
        const callback = () => {
          const postId = cooked.closest("article")?.dataset?.postId;
          if (postId) {
            api.preventCloak(parseInt(postId, 10));
          }
        };

        const videoAttributes = getLazyAttributes(container);
        const lazyVideo = helper.renderGlimmer(
          "p.lazy-video-wrapper",
          hbs`<LazyVideo @videoAttributes={{@data.param}} @callback={{@data.callback}}/>`,
          { param: videoAttributes, callback }
        );

        container.replaceWith(lazyVideo);
      }
    },
    { onlyStream: true, id: "discourse-lazy-videos" }
  );
}

export default {
  name: "discourse-lazy-videos",

  initialize() {
    withPluginApi("1.6.0", initLazyEmbed);
  },
};
