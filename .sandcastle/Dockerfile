FROM node:22-bookworm

# Install system dependencies
RUN apt-get update && apt-get install -y \
  git \
  curl \
  jq \
  && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && apt-get update && apt-get install -y gh \
  && rm -rf /var/lib/apt/lists/*

# Build-args for UID/GID alignment: sandcastle docker build-image
# defaults these to the host user's UID/GID so image-built files
# and bind-mounted files share an owner without runtime chown.
ARG AGENT_UID=1000
ARG AGENT_GID=1000

# Rename the base image's "node" user to "agent" and align UID/GID.
# If the target GID already belongs to another group (e.g. dialout=20 on Debian),
# drop that group first so groupmod doesn't fail with "GID already exists".
RUN existing=$(getent group $AGENT_GID | cut -d: -f1); \
    [ -n "$existing" ] && [ "$existing" != "node" ] && groupdel "$existing" || true; \
    groupmod -g $AGENT_GID node && \
    usermod -u $AGENT_UID -g $AGENT_GID -d /home/agent -m -l agent node

# Install pnpm and the coding agent CLIs (run as root before USER agent).
# Both providers ship as global npm packages; the orchestrator's resolveAgent
# picks one at dispatch time based on SANDCASTLE_IMPL_AGENT.
RUN npm install -g pnpm @mariozechner/pi-coding-agent @anthropic-ai/claude-code

# Ensure the home dir is accessible regardless of runtime UID
RUN chmod -R a+rwX /home/agent

USER ${AGENT_UID}:${AGENT_GID}

WORKDIR /home/agent

# In worktree sandbox mode, Sandcastle bind-mounts the git worktree at /home/agent/workspace
# and overrides the working directory to /home/agent/workspace at container start.
# Structure your Dockerfile so that /home/agent/workspace can serve as the project root.
ENTRYPOINT ["sleep", "infinity"]
