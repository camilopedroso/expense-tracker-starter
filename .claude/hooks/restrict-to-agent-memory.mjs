// PreToolUse hook for subagents: blocks Write/Edit/NotebookEdit outside
// .claude/agent-memory/<agent-name>/. Usage: node restrict-to-agent-memory.mjs <agent-name>
// Fails closed: any error (bad input, missing path) blocks the call with exit code 2.
import path from "node:path";

function block(reason) {
  process.stderr.write(`Bloqueado: ${reason}\n`);
  process.exit(2);
}

try {
  const agentName = process.argv[2];
  if (!agentName) block("o hook precisa do nome do agente como argumento.");

  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  const input = JSON.parse(raw);

  const filePath = input.tool_input?.file_path ?? input.tool_input?.notebook_path;
  if (!filePath) block(`${input.tool_name} sem caminho de arquivo.`);

  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd;
  const memoryDir = path.resolve(projectDir, ".claude", "agent-memory", agentName);
  const target = path.resolve(input.cwd || projectDir, filePath);

  const normalize = (p) => (process.platform === "win32" ? p.toLowerCase() : p);
  const relative = path.relative(normalize(memoryDir), normalize(target));
  const insideMemory = relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);

  if (!insideMemory) {
    block(`o agente ${agentName} só pode escrever em ${memoryDir}. Tentativa em: ${target}`);
  }
  process.exit(0);
} catch (err) {
  block(`erro ao validar o caminho (${err.message}).`);
}
