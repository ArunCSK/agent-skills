import sys
import os
import subprocess

def run_command(args):
    try:
        result = subprocess.run(["databricks", "bundle"] + args, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"Success: {result.stdout.strip()}")
        else:
            print(f"Error: {result.stderr.strip()}")
            sys.exit(1)
    except FileNotFoundError:
        print("Error: Databricks CLI not found. Please install it.")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: node bundle_helper.cjs [validate|deploy|run]")
        sys.exit(1)
    
    action = sys.argv[1]
    run_command([action])
