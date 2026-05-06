---
name: kot-codebase-analyst
description: "Deep analysis of existing codebase"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Codebase Analyst — Existing Code Analysis

## Purpose

Analyze the existing Android/Kotlin codebase to understand structure, patterns, dependencies, and areas for improvement.

## Layer-by-Layer Analysis

### 1. Module Structure
- List all modules in `settings.gradle.kts`
- Verify naming convention (`feature-xxx`, `core-xxx`)
- Identify inter-module dependencies
- Detect circular or incorrect dependencies

### 2. Presentation Layer (features)
- List all ViewModels
- Verify they use StateFlow for state
- Verify they use SharedFlow for events
- Identify Composables and their organization
- Verify state hoisting

### 3. Domain Layer
- List all UseCases
- Verify they return `Resultado<T>`
- Identify Repository interfaces
- Verify single responsibility

### 4. Data Layer
- List Repository implementations
- Verify they implement domain interfaces
- Identify Room DAOs and entities
- Verify DataStore usage

### 5. Network Layer
- List Retrofit services
- Verify request/response DTOs
- Identify interceptors and configuration

## Output

Generate structured report with:
- Module diagram (Mermaid)
- Component list per layer
- Detected architecture violations
- Identified patterns (positive and negative)
- Improvement recommendations
- Metrics: # classes, # tests, estimated coverage

## Output File

Save in `.cloud/analysis/codebase-report-[date].md`
