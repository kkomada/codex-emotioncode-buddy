#!/usr/bin/env python3

import json
import shutil
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PLUGIN_DIR = REPO_ROOT / "plugins" / "buddy"
HOME = Path.home()
TARGET_PLUGIN_DIR = HOME / "plugins" / "buddy"
TARGET_MARKETPLACE = HOME / ".agents" / "plugins" / "marketplace.json"


PLUGIN_ENTRY = {
    "name": "buddy",
    "source": {
        "source": "local",
        "path": "./plugins/buddy",
    },
    "policy": {
        "installation": "INSTALLED_BY_DEFAULT",
        "authentication": "ON_INSTALL",
    },
    "category": "Productivity",
}


def default_marketplace():
    return {
        "name": "local-home-plugins",
        "interface": {"displayName": "Local Home Plugins"},
        "plugins": [],
    }


def load_marketplace():
    if not TARGET_MARKETPLACE.exists():
        return default_marketplace()

    try:
        with TARGET_MARKETPLACE.open("r", encoding="utf-8") as fh:
            data = json.load(fh)
        data.setdefault("name", "local-home-plugins")
        data.setdefault("interface", {"displayName": "Local Home Plugins"})
        data.setdefault("plugins", [])
        return data
    except Exception:
        return default_marketplace()


def save_marketplace(data):
    TARGET_MARKETPLACE.parent.mkdir(parents=True, exist_ok=True)
    with TARGET_MARKETPLACE.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


def install_plugin():
    TARGET_PLUGIN_DIR.parent.mkdir(parents=True, exist_ok=True)
    if TARGET_PLUGIN_DIR.exists():
        shutil.rmtree(TARGET_PLUGIN_DIR)
    shutil.copytree(SOURCE_PLUGIN_DIR, TARGET_PLUGIN_DIR)


def upsert_plugin_entry():
    marketplace = load_marketplace()
    plugins = [
        plugin for plugin in marketplace["plugins"] if plugin.get("name") != "buddy"
    ]
    plugins.append(PLUGIN_ENTRY)
    marketplace["plugins"] = plugins
    save_marketplace(marketplace)


def main():
    install_plugin()
    upsert_plugin_entry()
    print("Buddy installed.")
    print(f"- Plugin: {TARGET_PLUGIN_DIR}")
    print(f"- Marketplace: {TARGET_MARKETPLACE}")


if __name__ == "__main__":
    main()
