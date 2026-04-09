#!/usr/bin/env python3

import json
import shutil
from pathlib import Path


HOME = Path.home()
TARGET_PLUGIN_DIR = HOME / "plugins" / "buddy"
TARGET_MARKETPLACE = HOME / ".agents" / "plugins" / "marketplace.json"


def remove_plugin_dir():
    if TARGET_PLUGIN_DIR.exists():
        shutil.rmtree(TARGET_PLUGIN_DIR)


def remove_marketplace_entry():
    if not TARGET_MARKETPLACE.exists():
        return

    try:
        with TARGET_MARKETPLACE.open("r", encoding="utf-8") as fh:
            data = json.load(fh)
    except Exception:
        return

    plugins = data.get("plugins", [])
    data["plugins"] = [plugin for plugin in plugins if plugin.get("name") != "buddy"]

    with TARGET_MARKETPLACE.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


def main():
    remove_plugin_dir()
    remove_marketplace_entry()
    print("Buddy removed.")
    print(f"- Plugin: {TARGET_PLUGIN_DIR}")
    print(f"- Marketplace entry removed from: {TARGET_MARKETPLACE}")


if __name__ == "__main__":
    main()
