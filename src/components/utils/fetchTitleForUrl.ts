export default function fetchTitleForUrl(
  url: string,
  handleResult: (title: string) => void,
) {
  if (!url.startsWith("http")) return; // ignore non-urls

  // let React update the input first
  setTimeout(async () => {
    url = url.trim();
    let title: string | null = null;

    try {
      // YouTube link -> use oEmbed
      if (/youtube\.com|youtu\.be/.test(url)) {
        const res = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(
            url,
          )}&format=json`,
        );
        if (res.ok) {
          const data = await res.json();
          title = data.title + " ~ " + data.author_name;
        }
      }

      // TODO: Add more
    } catch (err) {
      console.error("Failed to fetch title", err);
    }

    if (title) {
      handleResult(title);
    }
  }, 0);
}
