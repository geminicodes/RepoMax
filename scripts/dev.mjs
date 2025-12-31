import { spawn } from "node:child_process";
 
function run(label, args) {
  const child = spawn("npm", args, { stdio: ["inherit", "pipe", "pipe"], shell: false });
  const prefix = `[${label}] `;
  child.stdout.on("data", (d) => process.stdout.write(prefix + String(d)));
  child.stderr.on("data", (d) => process.stderr.write(prefix + String(d)));
  child.on("exit", (code, signal) => { process.exitCode = signal ? 1 : (code ?? 1); });
  return child;
}
 
const server = run("server", ["run", "dev", "-w", "server"]);
const client = run("client", ["run", "dev", "-w", "client"]);
 
function shutdown() { server.kill("SIGINT"); client.kill("SIGINT"); }
process.on("SIGINT", () => { shutdown(); process.exit(130); });
process.on("SIGTERM", () => { shutdown(); process.exit(143); });
