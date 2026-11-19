// Removes the "My GGS" customer account from the visitor site (owner request): no menu tab, no header
// account button, and the old /my-ggs, /sign-in and /sign-up addresses go back to Home.
// Usage: node patch-my-ggs.mjs <ggs-visit app dir>
import fs from "node:fs";
import path from "node:path";
const src = path.join(process.argv[2], "src");
const edit = (file, pairs) => {
  const p = path.join(src, file);
  let s = fs.readFileSync(p, "utf8");
  for (const [from, to] of pairs) {
    if (!s.includes(from)) throw new Error(`patch-my-ggs: ${file}: not found: ${from.slice(0, 70)}`);
    s = s.split(from).join(to);
  }
  fs.writeFileSync(p, s);
};
const tab = `            { href: '/my-ggs', label: 'My GGS', icon: UserRound },\n`;
edit("App.tsx", [
  [tab, ""],
  [
    `          <Link\n            className="clearer-header-icon-button"\n            href="/my-ggs"\n            aria-label="Akun saya"\n            title="Akun saya"\n            data-testid="link-header-account"\n          ><UserRound size={19} strokeWidth={1.8} /></Link>\n`,
    "",
  ],
  [
    `  if (location.startsWith('/sign-in')) return <AccountAuthPage mode="in" />;\n  if (location.startsWith('/sign-up')) return <AccountAuthPage mode="up" />;`,
    `  if (location.startsWith('/sign-in') || location.startsWith('/sign-up')) return <GgsBackHome />;`,
  ],
  [`        <Route path="/my-ggs">\n          <MyGgsPage {...common} />\n        </Route>`, `        <Route path="/my-ggs">\n          <GgsBackHome />\n        </Route>`],
]);
fs.appendFileSync(
  path.join(src, "App.tsx"),
  `\nfunction GgsBackHome() {\n  const [, setLocation] = useLocation();\n  useEffect(() => { setLocation('/', { replace: true }); }, [setLocation]);\n  return null;\n}\n`,
);
edit("EmployeeWorkspace.tsx", [[`  { href: '/my-ggs', label: 'My GGS', icon: UserRound },\n`, ""]]);
// Three tabs left in the bottom bar.
edit("homepage.css", [
  [
    `    width: min(100%, 420px);\n    grid-template-columns: repeat(4, minmax(0, 1fr));`,
    `    width: min(100%, 420px);\n    grid-template-columns: repeat(3, minmax(0, 1fr));`,
  ],
]);
console.log("GGS My GGS menu removed");
