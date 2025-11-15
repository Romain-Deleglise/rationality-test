#!/bin/bash

echo "═══════════════════════════════════════════════════════════════════════════════════════"
echo "🧪 SUITE DE TESTS COMPLÈTE - Vérification Finale"
echo "═══════════════════════════════════════════════════════════════════════════════════════"
echo ""

echo "📋 TEST 1/4: Comprehensive Check (validation technique de base)"
echo "────────────────────────────────────────────────────────────────────────────────────────"
node comprehensive-check.js 2>&1 | tail -8
echo ""

echo "📋 TEST 2/4: Ultra-Rigorous Check (audit exhaustif)"
echo "────────────────────────────────────────────────────────────────────────────────────────"
node ultra-rigorous-check.js 2>&1 | tail -10
echo ""

echo "📋 TEST 3/4: Likert Scoring (tests unitaires)"
echo "────────────────────────────────────────────────────────────────────────────────────────"
node test-likert-scoring.js 2>&1 | tail -10
echo ""

echo "📋 TEST 4/4: Quality & UX Checks"
echo "────────────────────────────────────────────────────────────────────────────────────────"
node additional-quality-checks.js 2>&1 | tail -12
echo ""

echo "═══════════════════════════════════════════════════════════════════════════════════════"
echo ""
echo "✅ TOUS LES TESTS SONT TERMINÉS"
echo ""
