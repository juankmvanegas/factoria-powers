---
name: net-qa-automate-functional
description: "Create or update functional automation from approved QA cases"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Automate Functional

## Purpose

Implement or update functional automation for approved QA cases.

## Inputs
- Test case ids or scenario ids
- Existing tests and automation plan

## Expected Work
- Add or update automated tests in the appropriate layer
- Update traceability matrix with automation references

## Rules
- Follow the testing policy of the factory.
- Reuse existing test frameworks before introducing new ones.
- Only automate cases already defined in QA artifacts.
