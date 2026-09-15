import { buildSystemPrompt } from "@/lib/ai-chat/system-prompt";
import { siteConfig } from "@/lib/site-config";

describe("buildSystemPrompt", () => {
  const prompt = buildSystemPrompt();

  it("includes the real business name and URL from siteConfig", () => {
    expect(prompt).toContain(siteConfig.fullName);
    expect(prompt).toContain(siteConfig.url);
  });

  it("instructs the model never to invent a specific price", () => {
    expect(prompt.toLowerCase()).toContain("never invent or estimate a specific number");
  });

  it("instructs the model never to claim it can book or confirm anything itself", () => {
    expect(prompt.toLowerCase()).toContain("never claim to book, confirm, or schedule");
  });

  it("states the real M-Pesa/card payment fact accurately", () => {
    expect(prompt).toContain("M-Pesa or card");
  });

  it("states the real client portal sign-up model accurately", () => {
    expect(prompt).toContain("/client-portal/sign-up");
    expect(prompt.toLowerCase()).toContain("reviews new accounts");
  });

  it("instructs the model to identify as an AI, not imply it's a team member", () => {
    expect(prompt.toLowerCase()).toContain("ai assistant, not a member of the team");
  });

  it("instructs the model to redirect off-topic questions rather than answer them", () => {
    expect(prompt.toLowerCase()).toContain("unrelated to this business");
  });
});
