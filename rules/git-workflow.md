# Git Workflow

## Commit Message Format

```
<type>: <description>

<optional body>
```

Types: feat, fix, refactor, docs, test, chore, perf, ci

## Commit Guidelines

- Write detailed commit messages following conventional commits format
- Use atomic commits: one logical change per commit
- Do not bundle multiple unrelated changes in a single commit
- Each commit should be independently reviewable and revertable

## Pull Request Workflow

When creating PRs:

1. Analyze full commit history (not just latest commit)
2. Use `git diff [base-branch]...HEAD` to see all changes
3. Draft comprehensive PR summary
4. Include test plan with TODOs
5. Push with `-u` flag if new branch
