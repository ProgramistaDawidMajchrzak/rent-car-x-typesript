import { useEffect } from "react";

function PagesRedirectBridge() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const p = url.searchParams.get("p");
    if (!p) return;

    const target = "#"+ p;
    url.searchParams.delete("p");
    const cleanBase = url.origin + url.pathname + (url.search ? `?${url.searchParams.toString()}` : "");
    window.history.replaceState(null, "", cleanBase);

    window.location.replace(window.location.pathname + target);
  }, []);

  return null;
}

export default PagesRedirectBridge;
