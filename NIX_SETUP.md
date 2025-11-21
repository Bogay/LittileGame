# Nix Development Environment

This project includes Nix configuration files for a reproducible development environment.

## What's Included

The Nix environment provides:
- **Node.js 20** - Required for Wrangler CLI
- **Wrangler CLI** - Cloudflare Pages local development server

## Prerequisites

Install Nix on your system:
- **Linux/macOS**: Follow instructions at https://nixos.org/download.html
- **Windows**: Use WSL2 and install Nix in the Linux environment

## Quick Start

### With Nix Flakes (Recommended)

Nix Flakes provide a modern, reproducible way to manage Nix environments.

1. **Enable Flakes** (if not already enabled):
   ```bash
   mkdir -p ~/.config/nix
   echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
   ```

2. **Enter the development environment**:
   ```bash
   cd /path/to/LittileGame
   nix develop
   ```

3. **Verify the environment**:
   ```bash
   node --version    # Should show Node.js 20.x
   wrangler --version
   ```

### With Traditional Nix

If you prefer not to use Flakes:

```bash
cd /path/to/LittileGame
nix-shell
```

### With direnv (Automatic Environment Loading)

For the best experience, use [direnv](https://direnv.net/) to automatically load the environment when you enter the directory:

1. **Install direnv**:
   ```bash
   # On NixOS
   nix-env -iA nixpkgs.direnv
   
   # On macOS
   brew install direnv
   
   # On other Linux
   # See https://direnv.net/docs/installation.html
   ```

2. **Hook direnv into your shell**:
   ```bash
   # For bash, add to ~/.bashrc:
   eval "$(direnv hook bash)"
   
   # For zsh, add to ~/.zshrc:
   eval "$(direnv hook zsh)"
   
   # For fish, add to ~/.config/fish/config.fish:
   direnv hook fish | source
   ```

3. **Allow the .envrc file**:
   ```bash
   cd /path/to/LittileGame
   direnv allow
   ```

Now the environment will automatically activate when you `cd` into the directory and deactivate when you leave!

## Usage

Once in the Nix environment:

1. **Set up your API key**:
   ```bash
   cp .dev.vars.example .dev.vars
   # Edit .dev.vars and add your Google Cloud Vision API key
   ```

2. **Start the local development server**:
   ```bash
   wrangler pages dev .
   ```

3. **Open your browser** to http://localhost:8788

## File Overview

- **`flake.nix`** - Nix Flakes configuration (modern approach)
- **`shell.nix`** - Traditional Nix shell configuration (fallback)
- **`.envrc`** - direnv configuration for automatic environment loading

## Troubleshooting

### "experimental-features" error

If you get an error about experimental features:
```bash
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

### Wrangler not found

Make sure you're inside the Nix shell:
```bash
nix develop  # or nix-shell
```

### Node.js version mismatch

The Nix environment should provide Node.js 20. If you're seeing a different version, make sure you're in the Nix shell and not using a globally installed Node.js.

## Benefits of Using Nix

1. **Reproducible**: Everyone gets the exact same development environment
2. **Isolated**: Doesn't interfere with your system's Node.js or other tools
3. **Declarative**: Environment is defined in code, not manual setup steps
4. **Cross-platform**: Works the same on Linux, macOS, and WSL2
5. **Automatic**: With direnv, environment activates automatically

## Updating the Environment

To update the Node.js or Wrangler version:

1. Edit `flake.nix` (or `shell.nix`)
2. Change the package version or pin
3. Run `nix flake update` (for flakes) or rebuild the shell

## More Information

- Nix Package Manager: https://nixos.org/
- Nix Flakes: https://nixos.wiki/wiki/Flakes
- direnv: https://direnv.net/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
