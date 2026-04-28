#!/usr/bin/env bash
# launch-from-mac.sh
# Run this on the Mac. It launches the DSC dev server on the agent box
# (10.246.103.143), opens an SSH tunnel from your Mac to the box, and
# opens the workbench in your default browser.
#
# Usage:    ./launch-from-mac.sh
# Stop:     Ctrl-C (kills tunnel + remote dev server together)
#
# Prereqs on the Mac:
#   - Stevens VPN / Tailscale up so 10.246.103.143 is reachable
#   - SSH key for agent@10.246.103.143 in ~/.ssh/ (passwordless login)
#
# Prereqs on the agent box (.143) — script checks them, prints fix if missing:
#   - Node 20+ and pnpm installed
#   - DSC repo at ~/dsc/web (clone of projects/DeFi-Stats-Center/web)
#   - `pnpm install` already run there (script will run it if not)

set -euo pipefail

AGENT_HOST="${AGENT_HOST:-agent@10.246.103.143}"
REMOTE_DIR="${REMOTE_DIR:-/home/agent/dsc/web}"
LOCAL_PORT="${LOCAL_PORT:-5173}"
REMOTE_PORT="${REMOTE_PORT:-5173}"
ROUTE="${ROUTE:-/workbench}"

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
ok()   { printf '\033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[33m!\033[0m %s\n' "$*"; }
die()  { printf '\033[31m✗\033[0m %s\n' "$*" >&2; exit 1; }

bold "→ Checking SSH to ${AGENT_HOST}"
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 "${AGENT_HOST}" 'true' 2>/dev/null; then
  die "Cannot SSH to ${AGENT_HOST}. Check Tailscale/VPN is up and that your Mac's pubkey is in the agent box's authorized_keys."
fi
ok "SSH OK"

bold "→ Checking remote toolchain"
remote_check=$(ssh "${AGENT_HOST}" 'set -e
  command -v node    >/dev/null && echo "node=$(node --version)"   || echo "node=MISSING"
  command -v pnpm    >/dev/null && echo "pnpm=$(pnpm --version)"   || echo "pnpm=MISSING"
  test -d '"${REMOTE_DIR}"'/src && echo "src=OK"                   || echo "src=MISSING"
  test -d '"${REMOTE_DIR}"'/node_modules && echo "nm=OK"           || echo "nm=MISSING"
')
echo "${remote_check}"

if grep -q "node=MISSING\|pnpm=MISSING" <<<"${remote_check}"; then
  cat >&2 <<EOF

Missing toolchain on ${AGENT_HOST}. Install once:

  ssh ${AGENT_HOST} '
    # Node 20.x via NodeSource
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo npm install -g pnpm
  '

EOF
  die "Toolchain not ready."
fi

if grep -q "src=MISSING" <<<"${remote_check}"; then
  cat >&2 <<EOF

Code missing at ${REMOTE_DIR} on ${AGENT_HOST}. Get it there first.

Option A — clone from GitHub (vault is at WillInvest/vault, private):

  ssh ${AGENT_HOST} '
    mkdir -p ~/dsc
    git clone https://github.com/WillInvest/vault.git ~/dsc/vault
    ln -sfn ~/dsc/vault/projects/DeFi-Stats-Center/web ~/dsc/web
  '

Option B — rsync from a local checkout (run from the box that holds the vault):

  rsync -av --delete \\
    --exclude node_modules --exclude dist \\
    /path/to/vault/projects/DeFi-Stats-Center/web/ \\
    ${AGENT_HOST}:${REMOTE_DIR}/

EOF
  die "${REMOTE_DIR} not found on remote."
fi

if grep -q "nm=MISSING" <<<"${remote_check}"; then
  bold "→ Installing remote deps (first run)"
  ssh "${AGENT_HOST}" "cd ${REMOTE_DIR} && pnpm install"
  ok "Remote deps installed"
fi

bold "→ Releasing local port ${LOCAL_PORT} if held"
if lsof -ti tcp:"${LOCAL_PORT}" >/dev/null 2>&1; then
  warn "Local port ${LOCAL_PORT} is in use — killing the holder"
  lsof -ti tcp:"${LOCAL_PORT}" | xargs kill -9 || true
fi

bold "→ Opening browser to http://localhost:${LOCAL_PORT}${ROUTE} in 4s"
( sleep 4 && open "http://localhost:${LOCAL_PORT}${ROUTE}" ) &

bold "→ Starting Vite on ${AGENT_HOST}:${REMOTE_PORT}, tunneled to localhost:${LOCAL_PORT}"
echo "   Press Ctrl-C to stop both the tunnel and the remote dev server."
echo

# -t allocates a TTY so Ctrl-C reaches Vite cleanly.
# ExitOnForwardFailure aborts if the local port can't be bound.
# ServerAliveInterval keeps the tunnel from idling out on flaky links.
exec ssh -t \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -L "${LOCAL_PORT}:localhost:${REMOTE_PORT}" \
  "${AGENT_HOST}" \
  "cd ${REMOTE_DIR} && exec pnpm dev --port ${REMOTE_PORT} --strictPort"
