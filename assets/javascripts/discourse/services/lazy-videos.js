import buildLazyVideo from "../../lib/lazy-video-builder";
import buildIFrame from "../../lib/iframe-builder";

import Service from "@ember/service";

export default class LazyVideosService extends Service {
  decorateLazyContainers(cooked, api) {
    const lazyContainers = cooked.querySelectorAll(".lazy-video-container");

    if (lazyContainers.length) {
      for (let container of lazyContainers) {
        const providerName = container.dataset.providerName;
        if (this.siteSettings[`lazy_${providerName}_enabled`]) {
          buildLazyVideo(container, {
            loadEmbed() {
              buildIFrame(container);
              if (api) {
                const postId = cooked.closest("article").dataset.postId;
                if (postId) {
                  api.preventCloak(parseInt(postId, 10));
                }
              }
            },
          });
        }
      }
    }
  }
}
