from __future__ import annotations

import argparse
from pathlib import Path

from schema_bridge.manifest import repo_public_output_dir, run_migration


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Schema Bridge migration CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    migrate = sub.add_parser("migrate", help="Run full migration and write artifacts")
    migrate.add_argument(
        "--sources",
        type=Path,
        default=None,
        help="Directory containing legacy CSV exports",
    )
    migrate.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output directory for JSON artifacts (defaults to public/data/schema-bridge)",
    )

    report = sub.add_parser("report", help="Print migration manifest summary")
    report.add_argument(
        "--output",
        type=Path,
        default=repo_public_output_dir(),
        help="Directory containing manifest.json",
    )

    return parser


def print_report(output_dir: Path) -> int:
    manifest_path = output_dir / "manifest.json"
    if not manifest_path.exists():
        print(f"No manifest found at {manifest_path}")
        return 1
    print(manifest_path.read_text(encoding="utf-8"))
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "migrate":
        manifest = run_migration(args.sources, args.output)
        print(
            f"Migration complete: {manifest.rows_accepted} accepted, "
            f"{manifest.rows_review} review, {manifest.rows_rejected} rejected "
            f"({manifest.runtime_ms} ms)"
        )
        return 0

    if args.command == "report":
        return print_report(args.output)

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
