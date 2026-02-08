import { define } from "../utils.ts";

export default define.page(function ProfileRedirect() {
  return new Response("", {
    status: 302,
    headers: { Location: "/settings" },
  });
});
