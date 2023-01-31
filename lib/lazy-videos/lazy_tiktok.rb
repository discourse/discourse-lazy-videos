# frozen_string_literal: true

require "onebox"

class Onebox::Engine::TiktokOnebox
  include Onebox::Engine
  alias_method :default_onebox_to_html, :to_html

  def to_html
    if SiteSetting.lazy_videos_enabled && SiteSetting.lazy_tiktok_enabled &&
         oembed_data.embed_product_id
      thumbnail_url = oembed_data.thumbnail_url
      escaped_title = ERB::Util.html_escape(oembed_data.title)
      video_height = oembed_data.thumbnail_height < 1024 ? 998 : oembed_data.thumbnail_height
      height = (323.0 / 576) * video_height

      <<~HTML
        <div class="tiktok-onebox lazy-video-container"
          data-video-id="#{oembed_data.embed_product_id}"
          data-video-title="#{escaped_title}"
          data-provider-name="tiktok"
          data-height=#{height}
          style="height: #{height + 7}px">
          <a href="#{url}" target="_blank">
            <img class="tiktok-thumbnail"
              src="#{thumbnail_url}"
              title="#{escaped_title}"
              style="height: #{height + 7}px">
          </a>
        </div>
      HTML
    else
      default_onebox_to_html
    end
  end
end
