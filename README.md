# Infra Cluster Members · GDGoC BUK

The shared practice repo for the **GDGoC BUK Infrastructure Cluster**. Every member adds a profile card here using the same Git workflow real teams use: **fork → branch → commit → pull request → review → merge**.

When your PR is merged, your card appears on the **Members Wall**:
👉 **https://usmanmasud.github.io/infra-cluster-members/**

This is the Week 3 lab *"Git & GitHub Collaboration"* on [InfraTrack](https://usmanmasud.github.io/gdgoc-infrastrucure/#/module/w3).

---

## Your task

1. Add your profile card through a pull request.
2. Review at least one teammate's pull request.

### Before you start
- A GitHub account
- Git installed (`git --version` should print a version)
- Your SSH key added to GitHub (Week 3, lab 1), or use HTTPS

### Step 1: Fork
Click **Fork** (top right of this page), then **Create fork**. You now have your own copy at `github.com/<your-username>/infra-cluster-members`.

### Step 2: Clone your fork
```bash
git clone git@github.com:<your-username>/infra-cluster-members.git
cd infra-cluster-members
```

### Step 3: Create a branch
```bash
git switch -c add-<your-name>
# e.g. git switch -c add-aisha-bello
```

### Step 4: Create your card
Copy the template and name the file after yourself, in lowercase, with hyphens:
```bash
cp members/_template.md members/aisha-bello.md
```
Open it in VS Code and fill it in. See [`members/usman-masud-aliyu.md`](members/usman-masud-aliyu.md) for an example.

### Step 5: Check your card (optional but recommended)
If you have Node.js installed:
```bash
node scripts/check-cards.mjs
```
GitHub runs the same check on your pull request.

### Step 6: Commit and push
```bash
git add members/aisha-bello.md
git commit -m "Add Aisha Bello's profile card"
git push -u origin add-aisha-bello
```

### Step 7: Open a pull request
On your fork on GitHub, click **Compare & pull request**. Make sure it goes:
**base repository: `usmanmasud/infra-cluster-members`, base: `main`** ← **your fork, `add-<your-name>`**.

Fill in the checklist in the PR description and click **Create pull request**.

### Step 8: Review a teammate's PR
Open the [Pull requests](https://github.com/usmanmasud/infra-cluster-members/pulls) tab and pick someone else's PR:
- Open **Files changed** and read their card.
- Leave at least one comment (a suggestion, a question or a kind word).
- Click **Review changes** → **Comment** or **Approve** → **Submit review**.

A cluster lead merges PRs that pass the check and have at least one review.

### Step 9: Done
Once it's merged, your card shows up on the Members Wall within a minute or two. Tick the lab in InfraTrack. ✅

---

## Rules
- **Only add or edit your own card**: one file in `members/`, nothing else.
- File name: lowercase letters, numbers and hyphens, ending in `.md` (e.g. `aisha-bello.md`).
- Keep it friendly and professional. **Don't put phone numbers, emails or reg numbers in your card**, because this repo is public.

## Something went wrong?
| Problem | Fix |
|---|---|
| `Permission denied (publickey)` | Your SSH key isn't on GitHub. Redo Week 3 lab 1, or clone with the HTTPS URL. |
| The PR check is red ❌ | Open **Details** on the failed check. It tells you which field is wrong. Fix it, commit and push again; the PR updates by itself. |
| "This branch is out-of-date" | Run `git pull upstream main` (add the upstream first: `git remote add upstream https://github.com/usmanmasud/infra-cluster-members.git`), then push. |
| I committed to `main` by mistake | Run `git switch -c add-<your-name>`, push that branch and open the PR from it. |

Questions? Ask in the cluster WhatsApp group or bring them to Lab Night.
