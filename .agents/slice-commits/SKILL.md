---
name: slice-commits
description: >-
  Split a finished working tree into small readable commits, on the open
  branch or a new constitution-named branch, then push. Use when the user
  is done changing files and asks to slice, split, or ship the commits,
  or invokes this skill.
disable-model-invocation: true
---

# Slice commits

The user finished a pile of edits. Do not commit them as one blob. Split them into commits a human can read, put them on one branch, and push.

## Rules

Branch name: `<type>/<issue>-<short-desc>`

- Types: `feat`, `fix`, `hotfix`, `docs`, `refactor`, `chore`
- `<issue>` is the GitHub issue number. Omit it, and the slash before the description, when no issue exists: `feat/add-oauth-refresh`
- `<short-desc>` is kebab-case. The whole name is under 50 characters
- Infer the type from the work. One session is one branch. Every commit type matches that branch type. Use scope to tell commits apart

Commit message: `<type>(<scope>): <description>`

- Scope optional
- Imperative, lowercase, no trailing period
- Breaking change: add `BREAKING CHANGE:` in the footer
- The message says why. It is not a file list

Each commit is one change a person can understand in one reading. Each commit changes fewer than 10 files. A 10-file commit is too big. Split it.

Do not create a pull request.

## Steps

1. Inspect the uncommitted work before writing anything.
2. Decide the branch.
3. Plan the commits, oldest first.
4. Create them.
5. Push once.
6. Report the branch and the commit subjects.

### 1. Inspect

Run `but status`.

- If it prints a GitButler workspace, stay on the GitButler path below. Never run `git add`, `git commit`, `git push`, `git checkout`, or `git switch`.
- If it fails because this is not a GitButler project, use the git path below.

Also run `but diff` on the GitButler path, or `git status` and `git diff` on the git path. Read the diff. Do not commit from filenames alone.

Leave secrets uncommitted (`.env`, credentials, keys) and name them in the report.

If there is nothing to commit, stop.

### 2. Branch

**GitButler.** A branch is open when `but status` shows an applied branch above the uncommitted area. `zz` and the common base are not a branch. A hint to run `but branch new` means no branch is open.

- One open branch: commit onto it with `-b <that-branch>`. Do not create another.
- No open branch: `-b` the new name. The first `but commit -b` creates it.
- More than one applied stack: stop and ask which stack. Do not guess.

**Git.** A branch is open when the current branch is not `main` or `master`.

- Open: commit onto it.
- Not open: `git switch -c <name>` from the current default branch.

### 3. Plan

Group the diff into commits before the first commit:

- One purpose per commit
- Fewer than 10 files
- Oldest commit first, so the history reads in order
- A lockfile travels with the dependency change that caused it
- Do not slice one edit into a broken middle state just to hit the file cap. If one change is 10 or more files, split it into ordered steps that still read in sequence

Omitting file ids on `but commit` commits everything. That is the failure this skill exists to stop.

### 4. Create

**GitButler.** Take file and hunk ids from `but diff`. Copy them exactly. A hunk id is `<file-id>:<hunk-id>`. Pass ids as separate arguments. Chain the commits in one shell call, oldest first. Every call includes `-b <branch>` and `-m`:

```bash
but commit -b <branch> -m "<type>(<scope>): <description>" <id> <id> \
&& but commit -b <branch> -m "<type>(<scope>): <description>" <id>
```

The first commit is the oldest. Later commits stack on top. Re-read `but diff` only if an id stops resolving.

**Git.** Stage only that commit's files, then commit. Repeat oldest first. Do not `git add -A` unless that commit is the entire remaining diff and it is already under 10 files.

```bash
git add -- <file> <file>
git commit -m "$(cat <<'EOF'
<type>(<scope>): <description>

EOF
)"
```

### 5. Push

- GitButler: `but push <branch>` once
- Git: `git push -u origin HEAD`

### 6. Report

- Branch name
- Commit subjects, oldest first
- Anything left uncommitted, and why
