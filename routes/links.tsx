import { define } from "../utils.ts";

export default define.page(function LinksRedirect() {
  return new Response("", {
    status: 302,
    headers: { Location: "/dashboard" },
  });
});
