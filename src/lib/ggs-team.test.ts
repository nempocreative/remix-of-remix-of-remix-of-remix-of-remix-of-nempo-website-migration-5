import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { TEAM_GROUPS, teamWaText } from "../../scripts/ggs-hair-studio/team-data";
import { focusedTeamIndex, loopTeamPosition } from "../../scripts/ggs-hair-studio/team-autoplay";
import { whatsappFor } from "../../scripts/ggs-hair-studio/ggs-whatsapp";

const group = (id: "pria" | "wanita") => TEAM_GROUPS.find((g) => g.id === id)!;
const roles = (id: "pria" | "wanita") => group(id).members.map((m) => m.role);

describe("GGS teams", () => {
  it("men's team is five members with the owner's names and roles, each with a real portrait and the web build copy", () => {
    const members = group("pria").members;
    expect(members.map((member) => member.name)).toEqual(["Sandi", "Ahong", "Arab", "Risman", "Deni"]);
    expect(roles("pria")).toEqual(["Barberman", "Head Barberman", "SPV Barberman", "Barberman", "Terapis"]);
    expect(members.map((member) => member.image)).toEqual([1, 2, 3, 4, 5].map((index) => `/team/tim-barber-${index}.jpg`));
    expect(members.every((member) => existsSync(`public/ggs-hair-studio${member.image}`))).toBe(true);
  });

  it("women's team is seven members with the owner's names and roles, each with her own portrait and the web build copy", () => {
    const members = group("wanita").members;
    expect(members.map((member) => member.name)).toEqual(["Anggi", "Syifa", "Siti", "Isma", "Viving", "Bela", "Rosa"]);
    expect(roles("wanita")).toEqual(["Terapis", "Hairstylist", "Terapis", "Nailist", "Hair Stylist", "Head Admin", "Admin"]);
    expect(members.map((member) => member.image)).toEqual([1, 2, 3, 4, 5, 6, 7].map((index) => `/team/tim-beauty-${index}.jpg`));
    expect(members.every((member) => existsSync(`public/ggs-hair-studio${member.image}`))).toBe(true);
  });

  it("men's team books on the barber WhatsApp, women's team on GGS Beauty", () => {
    expect(whatsappFor({ audience: "pria" })).toBe("6281333359200");
    expect(whatsappFor({ audience: "wanita" })).toBe("6282342777723");
    expect(teamWaText(group("pria"), group("pria").members[0]!)).toContain("Halo GGS Barber Studio");
    expect(teamWaText(group("wanita"), group("wanita").members[0]!)).toContain("Halo GGS Beauty");
  });

  it("continues forward into an identical set instead of scrolling backward", () => {
    expect(loopTeamPosition(929, 930)).toBe(929);
    expect(loopTeamPosition(931, 930)).toBe(1);
    expect(loopTeamPosition(1865, 930)).toBe(5);
    expect(loopTeamPosition(12, 0)).toBe(0);
  });

  it("features one center card, alternating through all seven team members", () => {
    expect(focusedTeamIndex(0, 150, 450, 7)).toBe(1);
    expect(focusedTeamIndex(150, 150, 450, 7)).toBe(2);
    expect(focusedTeamIndex(750, 150, 450, 7)).toBe(6);
    expect(focusedTeamIndex(900, 150, 450, 7)).toBe(0);
  });
});
