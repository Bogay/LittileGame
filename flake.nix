{
  description = "Five Elements Writing Battle - Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js for Wrangler CLI
            nodejs_20
            
            # Wrangler CLI for Cloudflare Pages local development
            nodePackages.wrangler
          ];

          shellHook = ''
            echo "🎮 Five Elements Writing Battle - Development Environment"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "Available tools:"
            echo "  - Node.js $(node --version)"
            echo "  - npm $(npm --version)"
            echo "  - wrangler $(wrangler --version 2>/dev/null || echo 'CLI')"
            echo ""
            echo "Quick start:"
            echo "  1. Copy .dev.vars.example to .dev.vars"
            echo "  2. Add your Google Cloud Vision API key to .dev.vars"
            echo "  3. Run: wrangler pages dev ."
            echo "  4. Open http://localhost:8788"
            echo ""
            echo "For more information, see README.md and DEPLOYMENT.md"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
          '';
        };
      }
    );
}
